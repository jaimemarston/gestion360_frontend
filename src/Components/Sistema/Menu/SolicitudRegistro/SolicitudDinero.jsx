import React, { useEffect, useState } from 'react';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import './styles.scss';
import { LeftToolBarTemplate } from '../../../Molecula';
import useSolicitud from '../../../../hooks/useSolicitud';
import { fetchDelete, fetchGet } from '../../../../api';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
function SolicitudDinero({isDarkMode}) {
  const [
    listaSolicitud,
    openSolicitud,
    tableButtonEdit,
    tableButtonDelete,
    buttonAdministrator,
    buttonCoordinator,
    dataRegistro,
    toast,
    setDarkMode
  ] = useSolicitud();
  const [totalRecords, setTotalRecords] = useState(0);
  const [datatableState,changeDatatableState] = useState({page: 0, rows: 10, first: 10});
  const [addData, setAddData] = useState([]);



  
  const listData = (filters) => {
    const {page, rows} = datatableState || {page: 0, rows: 10, first: 10};
   
    
    fetchGet(`/solicitud?page=${page + 1}&pageSize=${rows}`).then(( { personal, count } ) => {

   

      setTotalRecords(count);

      const data = personal.map((element, item) => {
        element.index = item;
        return element;
      });

      setAddData(data);
     
    });
  };


  const deleteData = (data) => {
    fetchDelete(`solicitud/${data}`).then(() => {
      listData();
      toast.current.show({
        severity: 'success',
        summary: 'Eliminado',
        detail: 'Se ha eliminado correctamente',
        life: 3000,
      });
    });
  };

  const confirm1 = (id) => {
    confirmDialog({
      message: 'Esta seguro que desea eliminar?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => deleteData(id),
    });
  };

  const tableButtonDeletes = (rowData) => {
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




  useEffect(() => {
    listData(datatableState)
    return () => {
      setAddData([])
    };
  }, [datatableState])


  return (
    <div className={isDarkMode ?  'dark-mode-table grid crud-demo' : 'grid crud-demo'  }    >
      <Toast ref={toast} />
      <ConfirmDialog />
      <div  className={isDarkMode ?  'dark-mode col-12' : 'col-12'  } >
        <div className={isDarkMode ?  'dark-mode card' : 'card'  } >
          <Toolbar
          className={isDarkMode ?  'dark-mode mb-4' : 'mb-4'  }
            
            right={LeftToolBarTemplate({
              openNew: openSolicitud,
              nameBtn: 'Generar solicitud',
            })}
          />

          <DataTable value={addData}
    
          
          lazy
          first={datatableState.first}
          rows={10}  
          totalRecords={totalRecords}
          responsiveLayout='scroll'
          onPage={(e) => changeDatatableState(e)}
            paginator
          
          >
            <Column  field='id' header='Item' />
            <Column field='nombre' header='Nombre' />
            <Column field='fechaInicio' header='Fecha Inicio' />
            <Column field='fechaFin' header='Fecha Fin' />
            <Column
              header='Administrador'
              style={{ width: '40px' }}
              body={buttonAdministrator}
            />
            <Column
              header='Coordinador'
              style={{ width: '40px' }}
              body={buttonCoordinator}
            />
            <Column
              header='Editar'
              style={{ width: '40px' }}
              body={tableButtonEdit}
            />
            <Column
              header='Eliminar'
              style={{ width: '30px' }}
              body={tableButtonDeletes}
            />
          </DataTable>
        </div>
      </div>
    </div>
  );
}

export { SolicitudDinero };
