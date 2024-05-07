import React, { useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { LeftToolBarTemplate } from '../../../Molecula';
import { Button } from 'primereact/button';
import ModalRegistroCodigoReferencia from './Modal/ModalRegistroCodigoReferencia';
import { FileUpload } from 'primereact/fileupload';
import { createFormData, fetchDelete, fetchGet } from '../../../../api';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';


const RegistroCodigoReferencia = ({isDarkMode}) => {
  const [view, setView] = useState(false);
  const [edit, setEdit] = useState();
  const [addData, setAddData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [datatableState,changeDatatableState] = useState({page: 0, rows: 10, first: 10});
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const listData = (filters) => {
    const {page, rows} = filters || {page: 0, rows: 10, first: 10};
    setLoading(true);
    
    fetchGet(`/registroReferenciaAll?page=${page + 1}&pageSize=${rows}`).then(async  ( { codigoReferencias, count } ) => {
      setTotalRecords(count);

      const data = codigoReferencias.map( async (element, item) => {
        const tipo =  await fetchGet(`tipo-documento/${element?.codidoc}`)



        element.codidoc = tipo?.result?.nombre

        if(element.exonerar === 'true'){

          element.exonerar = 'SI'

        } else {
          element.exonerar = "NO"
        }

  
          
      

        element.index = item;
        return element;
      });


      Promise.all(data).then((data) => {
        
     console.log(data,'DATA')
        setAddData(data);
      }) 
    });
    setLoading(false);
  };

  useEffect(() => {
    listData(datatableState)
  }, [datatableState])




const editData = (data) => {

  setEdit(data)
  setView(!view);

}

  const tableButtonEdit = (rowData) => {
    return (
      <div className='actions'>
        <Button
          icon='pi pi-pencil'
          className='p-button-rounded p-button-warning'
           onClick={() => editData(rowData)}
        />
      </div>
    );
  };

  const tableButtonDelete = (rowData) => {
    return (
      <div className='actions'>
        <Button
          icon='pi pi-trash'
          className='p-button-rounded p-button-danger'
          onClick={() => confirm1(rowData.id)}
        />
      </div>
    );
  };


  const deleteData = (id) => {
    fetchDelete(`registroReferencia/${id}`).then((res) => {
      toast.current.show({
        severity: 'success',
        summary: res.message,
        life: 3000,
      });

      fetchGet(`/registroReferenciaAll`).then(( { codigoReferencias } ) => {
              const data = codigoReferencias.map((element, item) => {
                element.index = item;
                return element;
              });
        
              setAddData(data);
            
            });
    })
  }

  const confirm1 = (id) => {
    confirmDialog({
      message: 'Esta seguro que desea eliminar?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => deleteData(id),
    });
  };

  const openModal = () => {
    setEdit('')
    setView(!view);
  };

  const RightToolBarTemplate = () => {
    return (
      <React.Fragment>
        <FileUpload
          customUpload
          uploadHandler={readExcel}
          accept='.xlsx'
          mode='basic'
          maxFileSize={1000000}
          label='Import'
          chooseLabel='Importar Referencia'
          className='mr-2 inline-block'
        />
      </React.Fragment>
    );
  };

  const readExcel = ({ files }) => {
    const [file] = files;
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    reader.onload = async (e) => {
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

      try {
        setLoading(true)
        const formData = new FormData();

        formData.append('file', file);
       
        await createFormData("registroReferenciaAddAll", 'POST' , formData).then((res) =>{
           setLoading(false)
        }).catch((res) => {
          setLoading(false)
        })  

        listData();
       
        toast.current.show({
          severity: 'success',
          summary: 'Registro codigo referencia',
          life: 3000,
        });
      } catch (error) {
        setLoading(false)
        toast.current.show({
          severity: 'error',
          summary: 'Error al subir el archivo',
          life: 3000,
        });
      }
    };

    if (rABS) reader.readAsBinaryString(file);
    else reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    listData();
  }, []);

  return (
    <div className={isDarkMode ?  'dark-mode-table grid crud-demo' : 'grid crud-demo'  }>
      <Toast ref={toast} />
      <div className='col-12'>
        <div className={isDarkMode ?  'dark-mode card' : 'card'  }>
          <Toolbar
            className={isDarkMode ?  'dark-mode mb-4' : 'mb-4'  }
            left={LeftToolBarTemplate({
              openNew: openModal,
              nameBtn: 'Crear Referencia',
            })}
            right={RightToolBarTemplate}
          ></Toolbar>
                  <ConfirmDialog />
          <DataTable value={addData}
                          dataKey="id" 
                          first={datatableState.first}
                          responsiveLayout='scroll'
                          paginator
                          lazy
                          rows={10} 
                          totalRecords={totalRecords}
                          onPage={(e) => changeDatatableState(e)}
                          loading={loading}
          >
            <Column field='id' header='Id'>
              {addData.map((item, index) => {
                {
                  index + 1;
                }
              })}
            </Column>
            <Column field='codigo' header='Código'></Column>
            <Column field='nombre' header='Nombre'></Column>
            <Column field='exonerar' header='Exonerar'></Column>
            <Column field='categoria' header='Categoria'></Column>
           {/*  <Column field='codidoc' header='Codigo Doc'></Column> */}
            <Column field='ruc' header='Ruc'></Column>
            <Column field='telf' header='Telefono'></Column>
            <Column field='direc' header='Direccion'></Column>
            <Column field='apaterno' header='Apellido Paterno'></Column>
            <Column field='amaterno' header='Apellido Materno'></Column>
            <Column body={tableButtonEdit}></Column>
            <Column body={tableButtonDelete}></Column>
          </DataTable>
        </div>
      </div>
      <ModalRegistroCodigoReferencia setView={setView} setEdit={setEdit} edit={edit} setAddData={setAddData} listDatas={listData} view={view} />
    </div>
  );
};

export { RegistroCodigoReferencia };
