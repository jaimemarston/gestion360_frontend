import React, { useState, useRef, useEffect } from 'react';

import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
// import './styles.scss';
import { fetchDelete, fetchGet } from '../../../../api';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { LeftToolBarTemplate } from '../../../Molecula';
import { useDispatch } from 'react-redux';

const RegistroActividad = ({isDarkMode}) => {
  const dispatch = useDispatch();
  const [addData, setAddData] = useState([]);
  const navigate = useNavigate();
  const [totalRecords, setTotalRecords] = useState(0);
  const [datatableState,changeDatatableState] = useState({page: 0, rows: 10, first: 10});
  const toast = useRef(null);

  const listData = () => {
/*     fetchGet('regActividad').then(({ registroActividad }) => {
      const data = registroActividad.map((element, item) => {
        element.index = item + 1;
        return element;
      });
      setAddData(data);
    }); */
    const {page, rows} = datatableState || {page: 0, rows: 10, first: 10};
        
    fetchGet(`/regActividad?page=${page + 1}&pageSize=${rows}`).then(( { registroActividad, count } ) => {
      console.log(registroActividad,'registro')
      setTotalRecords(count);
      const data = registroActividad.rows.map((element, item) => {
        element.index = item + 1;
        return element;
      });
      setAddData(data);
    });
  };

  const openSolicitud = () => {
    console.log('click');
    navigate('/registro-actividad');
  };

  const editData = (data) => {
  
    navigate('/registro-actividad', { state: data });
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
    fetchDelete(`regActividad/${data}`).then((data) => {
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
            right={LeftToolBarTemplate({
              openNew: openSolicitud,
              nameBtn: 'Generar Actividad',
            })}
          ></Toolbar>

          <DataTable value={addData} 
                                    dataKey="id" 
                                    first={datatableState.first}
                                  
                                    paginator
                                    lazy
                                    rows={10} 
                                    totalRecords={totalRecords}
                                    onPage={(e) => changeDatatableState(e)}
                                   
          
          responsiveLayout='scroll'>
            <Column field='id' header='Id'></Column>
            <Column field='nombreApellido' header='Nombre'></Column>
            <Column field='fechaInicio' header='Fecha'></Column>
            <Column field='destino' header='Destino'></Column>
            <Column
              field='objetoComision'
              header='Objeto de la comisión'
            ></Column>
            <Column body={tableButtonEdit}></Column>
            <Column body={tableButtonDelete}></Column>
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default RegistroActividad;
