import React, { useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { Toast } from 'primereact/toast';
import { LeftToolBarTemplate } from '../../../Molecula';
import { Button } from 'primereact/button';
import ModalLugarComision from './Modal/ModalLugarComision';
import { FileUpload } from 'primereact/fileupload';
import { createFormData, fetchDelete, fetchGet, fetchPost } from '../../../../api';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

const LugarComision = ({isDarkMode}) => {
  const [view, setView] = useState(false);
  // const [viewError, setViewError] = useState(false);
  const [addData, setAddData] = useState([]);
  const [edit, setEdit] = useState(null);
  const toast = useRef(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [datatableState,changeDatatableState] = useState({page: 0, rows: 10, first: 10});

  useEffect(() => {
    listData(datatableState)
  }, [datatableState])

  const listData = (filters) => {
    const {page, rows} = filters || {page: 0, rows: 10, first: 10};
    setLoading(true);
    
    fetchGet(`comision?page=${page + 1}&pageSize=${rows}`).then(( { comisiones, count } ) => {
      setTotalRecords(count);
      const data = comisiones.map((element, item) => {
        element.index = item + 1;
        return element;
      });

      setAddData(data);
      setLoading(false);
    });
  };

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

  const editData = (data) => {
    setView(!view);
    setEdit(data);
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

  const acceptFunc = (data) => {
    fetchDelete(`comision/${data}`).then((data) => {
      toast.current.show({
        severity: 'success',
        summary: 'Confirmado',
        detail: data.message,
        life: 3000,
      });
      listData();
    });
  };

  const confirm1 = (data) => {
    confirmDialog({
      message: 'Esta seguro que desea eliminar?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => acceptFunc(data),
    });
  };

  const openModal = () => {
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
          chooseLabel='Importar Comisión'
          className='mr-2 inline-block'
        />
      </React.Fragment>
    );
  };

  const readExcel = ({ files }) => {
    const [File] = files;
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    reader.onload = async (e) => {
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

      try {
        const formData = new FormData();

        formData.append('file', File);
  
        await createFormData("comisionAddAll", 'POST' , formData);  
        listData();
        toast.current.show({
          severity: 'success',
          summary: 'Registro lugar comisión',
          life: 3000,
        });
      } catch (error) {
        console.log(error)
        toast.current.show({
          severity: 'error',
          summary: 'Error al subir el archivo',
          life: 3000,
        });
      }
    };

    if (rABS) reader.readAsBinaryString(File);
    else reader.readAsArrayBuffer(File);
  };


  return (
    <div className={isDarkMode ?  'dark-mode-table grid crud-demo' : 'grid crud-demo'  }>
      <Toast ref={toast} />
      <ConfirmDialog />
      <div className='col-12'>
        <div className={isDarkMode ?  'dark-mode card' : 'card'  }>
          <Toolbar
            className={isDarkMode ?  'dark-mode mb-4' : 'mb-4'  }
            right={RightToolBarTemplate}
            left={LeftToolBarTemplate({
              openNew: openModal,
              nameBtn: 'Crear Comisión',
            })}
          ></Toolbar>
          <DataTable value={addData} 
                  responsiveLayout='scroll'
                  paginator
                  lazy
                  rows={10} 
                  totalRecords={totalRecords}
                  loading={loading}
                  dataKey="id" 
                  first={datatableState.first}
                  onPage={(e) => changeDatatableState(e)}
          >
            <Column field='id' header='Id'></Column>
            <Column field='codigo' header='Código'></Column>
            <Column field='descripcion' header='Descripción'></Column>
            <Column body={tableButtonEdit}></Column>
            <Column body={tableButtonDelete}></Column>
          </DataTable>
        </div>
      </div>
      {view && (
        <ModalLugarComision
          setView={setView}
          view={view}
          listData={listData}
          edit={edit}
          setEdit={setEdit}
        />
      )}
    </div>
  );
};

export { LugarComision };
