import { Button } from 'primereact/button';
import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchDelete, fetchGet } from '../api';
import {
  oneIdSolicitud,
  startEditSolicitud,
} from '../store/slices/solicitud/solicitudStile';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
const useSolicitud = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dataRegistro, setDataRegistro] = useState([]);
  const [darkMode, setDarkMode] = useState(false)

  const toast = useRef(null);

  const listaSolicitud = () => {
    fetchGet('solicitud').then(({ personal }) => {
      const data = personal.map((element, item) => {
        element.index = item + 1;
        element.fechaRegistro = element.fechaRegistro.split('T')[0];
        element.fechaInicio = element.fechaInicio.split('T')[0];
        element.fechaFin = element.fechaFin.split('T')[0];

        return element;
      });

      setDataRegistro(data);
    });
  };



  const editData = (data) => {
    dispatch(startEditSolicitud());
    dispatch(oneIdSolicitud(data));
    navigate('/RegistroSolicitudDinero');
  };

  const openSolicitud = () => {
    editData({})
    /* navigate('/RegistroSolicitudDinero'); */
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

  const deleteData = (data) => {
    fetchDelete(`solicitud/${data}`).then(() => {
      listaSolicitud();
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

  const buttonAdministrator = () => {
    return (
      <div className='actions'>
        <Button
          icon='pi pi-shield'
          className='p-button-rounded p-button-success'
        />
      </div>
    );
  };

  const buttonCoordinator = () => {
    return (
      <div className='actions'>
        <Button icon='pi pi-user' className='p-button-rounded p-button-info' />
      </div>
    );
  };
  return [
    listaSolicitud,
    openSolicitud,
    tableButtonEdit,
    tableButtonDelete,
    buttonAdministrator,
    buttonCoordinator,
    dataRegistro,
    toast,
    setDarkMode
  ];
};

export default useSolicitud;
