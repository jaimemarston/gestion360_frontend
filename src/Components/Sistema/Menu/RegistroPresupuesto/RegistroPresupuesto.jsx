import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { LeftToolBarTemplate, RightToolBarTemplate } from '../../../Molecula';
import { Button } from 'primereact/button';
import ModalRegistroProsupuesto from './Modal/ModalRegistroProsupuesto';
import { FileUpload } from 'primereact/fileupload';
import { fetchGet, createFormData, fetchDelete } from '../../../../api';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
const RegistroPresupuesto = ({isDarkMode}) => {
  const navigate = useNavigate();
  const [view, setView] = useState(false);
  const [addData, setAddData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [datatableState,changeDatatableState] = useState({page: 0, rows: 10, first: 10});
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState([]);

  const listData = (filters) => {
    const {page, rows} = filters || {page: 0, rows: 10, first: 10};

    setLoading(true);
    fetchGet(`/registroPresupuesto?page=${page + 1}&pageSize=${rows}`).then(( { presupuestos, count } ) => {
      setTotalRecords(count);
    
      const data = presupuestos.map((element, item) => {
        element.index = item;
        return element;
      });
      setLoading(false);
      setAddData(data);
      
    
    });
  };

  useEffect(() => {
    listData(datatableState)
  }, [datatableState])

  useEffect( () =>  {
    async function doIt(){

      const {presupuestos} = await  fetchGet('registroPresupuesto')

      if(presupuestos){
         setAddData(presupuestos);
      }
     

    }

    doIt();

  }, [])





  const deleteData = (id) => {
    fetchDelete(`registroPresupuesto/${id}`).then(async (res) => {
      toast.current.show({
        severity: 'success',
        summary: 'Elemento eliminado.',
        detail: res.message,
        life: 3000,
      });
      listData();
    })

  }

  const openModal = () => {
    setEdit('')
    setView(!view);
  };

  const editData = (data) => {
    
   
    setView(!view);
    setEdit(data)
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




/*   const tableButtonDelete = (rowData) => {
    return (
      <div className='actions'>
        <Button
          icon='pi pi-trash'
          className='p-button-rounded p-button-danger'
           onClick={() => deleteData(rowData.id)}
        />
      </div>
    );
  };
 */

  const confirm1 = (id) => {
    console.log("sss")
    confirmDialog({
      message: 'Esta seguro que desea eliminar?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => deleteData(id),
    });
  };
  const tableButtonDelete = (rowData) => {

    return (
      <div className='actions'>
        <Button
          icon='pi pi-trash'
          className='p-button-rounded p-button-danger'
          onClick={() => {
            confirm1(rowData.id);
          }}  
        />
      </div>
    );
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
          chooseLabel='Importar Presupuesto'
          className='mr-2 inline-block'
        />
      </React.Fragment>
    );
  };


/*   const listData = (data) => {
    const newData = [];
    for (let i = 1; i < data.length - 1; i++) {
      const element = data[i];
      const items = {
        id: i,
        codigo: element[0],
        proyecto: element[1],
        equivalentes: element[2],
      };
      newData.push(items);
    }

    useEffect( () =>  {
      async function doIt(){
  
        const {presupuestos} = await  fetchGet('registroPresupuesto')
  
        if(presupuestos){
           setAddData(presupuestos);
        }
       
      
       
  
      
      }
  
      doIt();
  
    }, [])

    return newData;
  }; */

  const readExcel = ({ files }) => {
    setLoading(true)
    const [File] = files;
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    reader.onload = (e) => {
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

      const formData = new FormData();
      formData.append('file', File);
      

      new Promise(async (resolve) => {
        try {
        const res =  await createFormData("registroPresupuestoAddAll", 'POST' , formData);
        console.log(res)

          await 
          toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Presupuesto Creado',
            life: 3000,
          });

          setLoading(false)
         
          resolve(res);
          async function doIt(){
  
            const {presupuestos} = await  fetchGet('registroPresupuesto')
      
            if(presupuestos){
               setAddData(presupuestos);
            } 
          }

          doIt();
      
          return res;
        } catch (error) {

          await 
          toast.current.show({
            severity: 'warn',
            summary: 'Successful',
            detail: 'Error Codigo',
            life: 3000,
          });
          console.log(error)
          resolve([]);
        }
      });


      setAddData(listData(data));
    };

    if (rABS) reader.readAsBinaryString(File);
    else reader.readAsArrayBuffer(File);
  };
  useEffect(() => {
    listData();
  }, []);
  return (
    <div className={isDarkMode ?  'dark-mode-table grid crud-demo' : 'grid crud-demo'  } >
       <Toast ref={toast} /> 
        <ConfirmDialog />
      <div className='col-12'>
        <div className={isDarkMode ?  'dark-mode card' : 'card'  }>
          <Toolbar
            className={isDarkMode ?  'dark-mode mb-4' : 'mb-4'  }
            right={RightToolBarTemplate}
            left={LeftToolBarTemplate({
              openNew: openModal,
              nameBtn: 'Agregar Presupuesto',
            })}
          ></Toolbar>
          <DataTable value={addData}                         
                          lazy
                         
                          first={datatableState.first}
                          rows={10}  
                          totalRecords={totalRecords}
                          responsiveLayout='scroll'
                          onPage={(e) => changeDatatableState(e)}
                          loading={loading}
                            paginator>
            <Column field='id' header='Id'>
            </Column>
            <Column field='codigo' header='Código'></Column>
            <Column field='nombreAbreviado' header='Nombre Abreviado'></Column>
            <Column
              field='nombreCompleto'
              header='Nombre Completo'
            ></Column>
            <Column body={tableButtonEdit}></Column>
            <Column body={tableButtonDelete}></Column>
          </DataTable>
        </div>
      </div>
      <ModalRegistroProsupuesto  setAddData={setAddData} edit={edit}  setView={setView} view={view} />
{/*       {view && (
        <ModalRegistroProsupuesto
          setView={setView}
          view={view}
          listData={listData}
          edit={edit}
          setEdit={setEdit}
        />
      )} */}
    </div>
  );
};

export { RegistroPresupuesto };
