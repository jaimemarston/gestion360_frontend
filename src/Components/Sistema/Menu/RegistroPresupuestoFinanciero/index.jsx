import React, { useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { Toast } from 'primereact/toast';
import { LeftToolBarTemplate, RightToolBarTemplate } from '../../../Molecula';
import { Button } from 'primereact/button';
import ModalRegistroProsupuestoFinanciero from './Modal/ModalRegistroProsupuestoFinanciero';
import { FileUpload } from 'primereact/fileupload';
import { createFormData, fetchDelete, fetchGet, fetchPost } from '../../../../api';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';


const RegistroPresupuestoFinanciero = ({isDarkMode}) => {

  const [view, setView] = useState(false);
  const [addData, setAddData] = useState([]);
  const toast = useRef(null);
  const [edit, setEdit] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [datatableState,changeDatatableState] = useState({page: 0, rows: 10, first: 10});

  useEffect(() => {
    listData(datatableState)
  }, [datatableState])

  const listData = (filters) => {
    const {page, rows} = filters || {page: 0, rows: 10, first: 10};
    setLoading(true);
    fetchGet(`registroPresupuestoFinanciero?page=${page + 1}&pageSize=${rows}`).then(( { presupuestos, count } ) => {
      setTotalRecords(count);

      const data = presupuestos.map((element, item) => {
        element.index = item + 1;
        return element;
      });

      setAddData(data);
      setLoading(false);
    });
  };


  const openModal = () => {
    setEdit('')
    setView(!view);
  };

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

  const deleteData = (id) => {
    fetchDelete(`registroPresupuestoFinanciero/${id}`).then(async (res) => {
      toast.current.show({
        severity: 'success',
        summary: 'Elemento eliminado.',
        detail: res.message,
        life: 3000,
      });
      listData();
    })

  }

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
          chooseLabel='Importar Presupuesto Finaciador'
          className='mr-2 inline-block'
        />
      </React.Fragment>
    );
  };




  const readExcel = ({ files }) => {
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
        const res =  await createFormData("registroPresupuestoFinancieroAddAll", 'POST' , formData);

          await 
          toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Presupuesto financiador creado',
            life: 3000,
          });
          listData();

          resolve(res);
      
          return res;
        } catch (error) {
          console.log(error)
          resolve([]);
        }
      });

    };

    if (rABS) reader.readAsBinaryString(File);
    else reader.readAsArrayBuffer(File);
  };

  return (
    <div  className={isDarkMode ?  'dark-mode-table grid crud-demo' : 'grid crud-demo'  }>
       <Toast ref={toast} /> 
       <ConfirmDialog />
      <div className='col-12'>
        <div className={isDarkMode ?  'dark-mode card' : 'card'  }>
          <Toolbar
            className={isDarkMode ?  'dark-mode mb-4' : 'mb-4'  }
            right={RightToolBarTemplate}
            left={LeftToolBarTemplate({
              openNew: openModal,
              nameBtn: 'Agregar Presupuesto Financiador',
            })}
          ></Toolbar>
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
      <ModalRegistroProsupuestoFinanciero  setAddData={setAddData} edit={edit}  setView={setView} view={view} />
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
export { RegistroPresupuestoFinanciero };
