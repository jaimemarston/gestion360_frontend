
import React, { useState,useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { LeftToolBarTemplate } from '../../../Molecula';
import { Button } from 'primereact/button';
import { createFormData, fetchDelete } from "../../../../api/api";
import ModalRegistroDocumentos from './Modal/ModalRegistroDocumentos';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import {fetchGet} from '../../../../api/api'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

const RegistroDocumentos = ({isDarkMode}) => {
  const toast = useRef(null);
const [addData, setAddData] = useState([]);
const [totalRecords, setTotalRecords] = useState(0);
const [loading, setLoading] = useState(false);
const [datatableState,changeDatatableState] = useState({page: 0, rows: 10, first: 10});
const [edit, setEdit] = useState()
const [view, setView] = useState(false);

useEffect(() => {
listData(datatableState)
}, [datatableState])

const listData = (filters) => {
const {page, rows} = filters || {page: 0, rows: 10, first: 10};
setLoading(true);
  fetchGet(`tipo-documento?page=${page + 1}&pageSize=${rows}`).then(( { result, count } ) => {
    console.log(result)
    setTotalRecords(count);
/*     const data = result.map((element, item) => {
      element.index = item + 1;
      return element;
    }); */

    setAddData(result);
    setLoading(false);
  });
}



  const editData = (data) => {
    setEdit(data);
    setView(!view);
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


const deleteData = async(id) => {

  fetchDelete(`delete-tipo-documento/${id}`).then((res) => {

     if(res.message === 'No se puede eliminar el tipo  porque tiene rendicion de gastos  asociadas.'){
      toast.current.show({
        severity: 'warn',
        summary: 'Documento pertenece',
        detail: message,
      });

    }  else {
      toast.current.show({
        severity: 'success',
        summary: 'Successful',
        detail: 'Tipo de documento eliminado',
        life: 3000,
      });
  
    }


   /*  setAddData(res.result) */
   listData()

  }).catch((res) => {
    toast.current.show({
      severity: 'error',
      summary: 'Error',
      detail: 'Error al eliminar tipo de documento, verifique que no pertenezca a una rendicion de gastos',
      life: 3000,
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

  const tableButtonEdit = (rowData) => {
    return (
      <div className='actions'>
{         <Button
          icon='pi pi-pencil'
          className='p-button-rounded p-button-warning'
            onClick={() => editData(rowData)} 
        /> }
      </div>
    );
  };

  const openModal = () => {
    setEdit(null)
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
          chooseLabel='Importar Tipos de Documentos'
          className='mr-2 inline-block'
        />
      </React.Fragment>
    );
  };

  const readExcel = ({ files }) => {
    const [File] = files;
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    const formData = new FormData();

    formData.append('file', File);
    return new Promise(async (resolve) => { 

      try {
                     
        const res =  await createFormData("registro-tipo-documento", 'POST' , formData);

          await 
          toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Tipo de documento subido',
            life: 3000,
          });
          listData();
          resolve(res);
         
          return res;
        } catch (error) {
          console.log(error)
          resolve([]);
        }
    })

  };

  return (
    <div className={isDarkMode ?  'dark-mode-table grid crud-demo' : 'grid crud-demo'  }>
      {/* <Toast ref={toast} /> */}
      <div className='col-12'>
        <div className={isDarkMode ?  'dark-mode card' : 'card'  }>
        <Toast ref={toast} />
        <ConfirmDialog />
            <Toolbar
            className={isDarkMode ?  'dark-mode mb-4' : 'mb-4'  }
            left={LeftToolBarTemplate({
              openNew: openModal,
              nameBtn: 'Crear Documento',
            })}
            right={RightToolBarTemplate}
          ></Toolbar>
          <DataTable value={addData} 
                          responsiveLayout='scroll'
                          paginator
                          lazy
                          rows={8} 
                          first={datatableState.first}
                          totalRecords={totalRecords}
                          dataKey="id" 
                        /*   first={datatableState.first} */
                          onPage={(e) => changeDatatableState(e)}   
                          loading={loading}
          >
            <Column field='id' header='Id'>

            </Column>
            <Column field='codigo' header='Código'></Column>
            <Column field='nombre' header='Nombre'></Column>
            <Column body={tableButtonEdit}></Column>
            <Column body={tableButtonDelete}></Column>
          </DataTable>
        </div>
      </div>

      {view && (
        <ModalRegistroDocumentos
          setView={setView}
          view={view}
          listData={listData}
          edit ={edit}

        />
      )}
    
    </div>
  );

};



export {RegistroDocumentos}