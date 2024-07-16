import { editFolder, fetchUsersGroups } from '../../../../../store/slices/fileManager/fileManagerSlice';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { fetchGet, } from '../../../../../api';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { useDispatch } from 'react-redux';
import { useToast } from '../../../../../hooks/useToast';
import classNames from 'classnames';
import FolderIcon from '@mui/icons-material/Folder';
import React, { useState, useEffect, useRef } from 'react';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import TablaUsuario from '../../TableUsers'

const EditFolder = ({ isDarkMode, folderName, groupName, folderId }) => {
  const [usersId, setUsersId] = useState([]);

  useEffect(() => {
    let empty = {
      label: folderName,
      folderId: folderId
    }

    setData(empty)
  }, [folderName, folderId])

  const [isModal, setIsModal] = useState(false);
  const [isCloseModal, setIsCloseModal] = useState(false);

  const [data, setData] = useState();
  const [submitted, setSubmitted] = useState(false);
  const dt = useRef(null);
  const [listProduct, setlistProduct] = useState([]);
  const [usersActive, setUsersActive] = useState([]);
  const [selectedUsers, setSelectedProducts] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [showGroupUser, setShowGroupUser] = useState(false);
  const [usersGroup, setGroupUsers] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);

  const { showToast, ToastComponent } = useToast()

  const dispatch = useDispatch();

  const switchFondo = (e) => {
    setValue(e);
  };

  const openModal = () => {
    setIsModal(!isModal);
  };

  const closeModal = () => {
    setIsModal(!isModal);
    setIsCloseModal(!isCloseModal);
  };

  const getGroups = () => {
    dispatch(fetchUsersGroups()).unwrap().then((result) => {
      setGroupUsers(result.data); // result es el valor que devuelve tu action creator
    }).catch((error) => {
      console.error(error);
      // Maneja el error aquí si es necesario
    });
  };

  useEffect(() => {
    getGroups()
  }, [isModal])

  const save = async () => {
    if (!data.label) {
      setSubmitted(true);
      return;
    } else {
      setSubmitted(false);
    }

    const payload = {
      ...data,
    };

    try {
      const users = selectedUsers.map((item)=> item.id)
      const groups = selectedGroups.map((item)=> item.id)
      const resultAction = await dispatch(editFolder(payload));
      if (resultAction.error) {
        showToast('error', 'Error al intentar editar la carpeta')
      } else {
        showToast('success', 'Carpeta editada con éxito');
        closeModal();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const onInputChange = (e, name) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const listarUsuarios = () => {
    fetchGet("usuario").then((data) => {
      setlistProduct(data.usuario);
    });
  };

  useEffect(() => {
    listarUsuarios();
  }, []);

  useEffect(() => {
    const active = listProduct.filter((item) => item.estado === true);
    setUsersActive(active)
  }, [listProduct])


  const leftToolbarTemplate = () => (
    <>
      <div className='my-2'>
        <Button
          className='p-button-success d-flex justify-content-center mr-2'
          onClick={openModal}
        >
          <BorderColorIcon className='me-2 mb-2' />
          Editar carpeta
        </Button>
      </div>
    </>
  );
  const editProduct = (data) => {
    setData({ ...data });
    setIsModal();
  };

  const confirmDeleteProduct = (rowData) => {
    setNewData(rowData);
    closeModal();
  };

  const codigoBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Codigo</span>
        {rowData.codigo}
      </>
    );
  };

  const idBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Codigo</span>
        {rowData.id}
      </>
    );
  };

  const nombreBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Nombre</span>
        {rowData.nombre}
      </>
    );
  };

  const nameBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Nombre</span>
        {rowData.name}
      </>
    );
  };

  const headerGroup = (
    <div className="flex justify-content-between align-items-center">
      <div className="col-3">
        <h5 className="mb-3">Lista de grupos de usuarios</h5>
      </div>
      <div className="col-9">
        <span className="block mt-2 mt-md-0 p-input-icon-left">
          <select className="form-select form-select-lg mb-3" aria-label=".form-select-lg example">
          <option value="todos">Todos</option>
          <option value="asignados">Asignados</option>
          </select>
        </span>
      </div>
    </div>
  );

  const usuarioBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Usuario</span>
        {rowData.email}
      </>
    );
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Estado</span>
        {rowData?.estado === true ? "Activo" : "Inactivo"}
      </>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="actions">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => {
            editProduct(rowData);
            openModal();
          }}
        />
      </div>
    );
  };

  const AmountOfUsersBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Cantidad de usuarios</span>
        {rowData?.usersAmount}
      </>
    );
  };

  const actionBodyTemplate2 = (rowData) => {
    return (
      <div className="actions">
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning "
          onClick={() => {
            confirmDeleteProduct(rowData);
          }}
        />
      </div>
    );
  };

  const header = (
    <div className="flex justify-content-md-between align-items-center">
      <div className="col-2">
        <h5 className="mb-3">Lista de Usuarios</h5>
      </div>
      <div className="col-10">
        <span className="block mt-2 mt-md-0 p-input-icon-left">
          <select className="form-select form-select-lg mb-3" aria-label=".form-select-lg example">
          <option value="todos">Todos</option>
          <option value="asignados">Asignados</option>
          </select>
        </span>
      </div>
    </div>
  );

  const showTableGroup = () => {
    setShowGroupUser(true)
  }

  const showTableUsers = () => {
    setShowGroupUser(false)
  }

  const Handler = ({
    isModal,
    productDialogFooter,
    openModal,
    data,
    onInputChange,
    submitted,
  }) => {
    // console.log(data);

    return (
      <Dialog
        visible={isModal}
        style={{ width: '800px', height: "600px" }}
        header={`Grupo seleccionado: ${groupName}`}
        modal
        className='p-fluid'
        footer={productDialogFooter}
        onHide={openModal}
      >
        <h5 className='fw-bold text-bold mb-5'>Carpeta seleccionada: {folderName}</h5>
        <div className='field'>
          <label htmlFor='label'>Carpeta principal</label>
          <InputText
            id='label'
            name='label'
            value={data?.label?.trim()}
            onChange={(e) => onInputChange(e, 'label')}
            required
            autoFocus
            className={classNames({
              'p-invalid': submitted && !data.label,
            })}
          />
          {submitted && !data.label && (
            <small className='p-invalid'>Nombre de la carpeta principal es requerido</small>
          )}
        </div>

        <div className="my-2 d-flex">
          <Button
            className="p-button-success d-flex justify-content-center mr-2"
            onClick={showTableUsers}
            disabled={!showGroupUser}
          >
            Tabla de usuarios
          </Button>
          <Button
            className="p-button-success d-flex justify-content-center mr-2"
            onClick={showTableGroup}
            disabled={showGroupUser}
          >
            Tabla de grupo de usuarios
          </Button>
        </div>

        {!showGroupUser && (
          <TablaUsuario
            dt={dt}
            listProduct={usersActive}
            selectedUsers={selectedUsers}
            setSelectedProducts={setSelectedProducts}
            globalFilter={globalFilter}
            header={header}
            actionBodyTemplate={actionBodyTemplate}
            actionBodyTemplate2={actionBodyTemplate2}
            codigoBodyTemplate={codigoBodyTemplate}
            nombreBodyTemplate={nombreBodyTemplate}
            usuarioBodyTemplate={usuarioBodyTemplate}
            statusBodyTemplate={statusBodyTemplate}
          />
        )}

        {showGroupUser && (
          <TablaUsuario
            dt={dt}
            listProduct={usersGroup}
            selectedUsers={selectedGroups}
            setSelectedProducts={setSelectedGroups}
            globalFilter={globalFilter}
            header={headerGroup}
            actionBodyTemplate={actionBodyTemplate}
            actionBodyTemplate2={actionBodyTemplate2}
            codigoBodyTemplate={idBodyTemplate}
            nombreBodyTemplate={nameBodyTemplate}
            usuarioBodyTemplate={usuarioBodyTemplate}
            AmountOfUsersBodyTemplate={AmountOfUsersBodyTemplate}
          />
        )}
      </Dialog>
    );
  };

  const productDialogFooter = (
    <>
      <Button
        label='Cancelar'
        icon='pi pi-times'
        className='p-button-text'
        onClick={() => {
          openModal();
        }}
      />
      <Button
        label='Guardar'
        icon='pi pi-check'
        className='p-button-text'
        onClick={() => { save() }}
      />
    </>
  );

  return (
    <div className={isDarkMode ? 'dark-mode-table grid crud-demo' : 'grid crud-demo'}>
      <div className='col-12'>
        <div >
          {ToastComponent}
          <Toolbar style={{ background: "transparent", border: "none" }} left={leftToolbarTemplate}></Toolbar>
          {isModal &&
            Handler({
              isModal,
              productDialogFooter,
              openModal,
              data,
              setData,
              onInputChange,
              submitted,
              switchFondo,
            })}
        </div>
      </div>
    </div>
  );
};

export { EditFolder };