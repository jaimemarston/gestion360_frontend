import { editFolder, getUsersAssignToFolder, getGroupsUsersAssignToFolder, addUsersAndGroupsToTheFolder, desassignateUsersToaFolder, groupEdit } from '../../../../../store/slices/fileManager/fileManagerSlice';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { useDispatch } from 'react-redux';
import { useToast } from '../../../../../hooks/useToast';
import classNames from 'classnames';
import React, { useState, useEffect, useRef } from 'react';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import TablaUsuario from '../../TableUsers'

const EditFolder = ({ isDarkMode, folderName, groupName, selectedFolderFather, editGroup, folderId, groupId }) => {
  useEffect(() => {
    let empty = {
      label: folderName,
      folderId: folderId
    }

    setData(empty)
  }, [folderName, folderId])

  const [isModal, setIsModal] = useState(false);

  const [data, setData] = useState();
  const [submitted, setSubmitted] = useState(false);
  const dt = useRef(null);
  const [usersList, setUsersList] = useState([]);
  //usuarios asignados
  const [usersAssign, setUsersAssign] = useState([]);
  //usuarios con el status activo sin asignar
  const [usersActive, setUsersActive] = useState([]);
  //ids de usuarios por asignar
  const [selectedUsers, setSelectedUsers] = useState([]);
  //ids de usuarios por eliminar
  const [selectedUsersCheck, setSelectedUsersCheck] = useState([]);
  const [selectedUsersDelete, setSelectedUsersDelete] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [showGroupUser, setShowGroupUser] = useState(false);
  //grupo de usuarios sin asignar
  const [usersGroup, setGroupUsers] = useState([]);
  //grupo de usuarios asignados
  const [usersGroupAssign, setGroupUsersAssign] = useState([]);
  //ids de usuarios por asignar
  const [selectedGroups, setSelectedGroups] = useState([]);
  //ids de grupos de usuarios por eliminar
  const [selectedGroupsUsersDelete, setSelectedGroupsUsersDelete] = useState([]);
  const [selectedGroupsUsersCheck, setSelectedGroupsUsersCheck] = useState([]);

  const [editNameFolder, setEditNameFolder] = useState(null);

  const [filterStatusGroup, setFilterStatusGroup] = useState('sin asignar')
  const [filterStatusUsers, setFilterStatusUsers] = useState('sin asignar')

  const [dataGroup, setDataGroup] = useState({ name: groupName });
  const [submittedGroup, setSubmittedGroup] = useState(false);

  useEffect(() => {
    setDataGroup({ name: groupName })
  }, [groupName])

  const { showToast, ToastComponent } = useToast()

  const dispatch = useDispatch();

  const switchFondo = (e) => {
    setValue(e);
  };

  const openModal = () => {
    setIsModal(true);
  };

  const closeModal = () => {
    setIsModal(false);
    setData({});
    setSelectedGroupsUsersDelete([]);
    setSelectedGroups([]);
    setSelectedUsers([]);
    setSelectedUsersDelete([]);
  };

  const getGroups = () => {
    dispatch(getGroupsUsersAssignToFolder(folderId)).unwrap().then((result) => {
      setGroupUsers(result.data.parsedGroups)
      setGroupUsersAssign(result.data.parsedAlreadyIncludedUsergroups)
    }).catch((error) => {
      console.error(error);
    });
  };

  const getUsers = () => {
    dispatch(getUsersAssignToFolder(folderId)).unwrap().then((result) => {
      setUsersList(result.usuario)
      setUsersAssign(result.alreadyIncluded)
    }).catch((error) => {
      console.error(error);
    });
  };

  useEffect(() => {
    if(folderId !== null){
      getUsers();
      getGroups();
    }
  }, [isModal])

  const editLabelGroup = async () => {

    if (!dataGroup.name) {
      setSubmittedGroup(true)
      return;
    } else {
      setSubmittedGroup(false)
    }

    const payload = {
      ...dataGroup,
      id: groupId,
    };
    try {
      const resultAction = await dispatch(groupEdit(payload));
      if (resultAction.error) {
        showToast('error', 'Error al intentar editar un grupo');
      } else {
        showToast('success', 'Grupo creado con éxito');
        closeModal()
      }
    } catch {
      console.log(resultAction)
    }
  };

  const EditLabelFolder = async () => {
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
      const resultAction = await dispatch(editFolder(payload));
      if (resultAction.error) {
        showToast('error', 'Error al intentar editar la carpeta')
      } else {
        showToast('success', 'Carpeta editada con éxito');
        setEditNameFolder(true)
        closeModal();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const AssignUsersAndGroupUser = async () => {

    const payload = {
      folderId: folderId,
      user_ids: selectedUsers.map((item) => item.id),
      usergroups_ids: selectedGroups.map((item) => item.id)
    };

    try {
      const resultAction = await dispatch(addUsersAndGroupsToTheFolder(payload));
      if (resultAction.error) {
        showToast('error', 'Error al intentar asignar usuarios y/o grupos de usuarios la carpeta')
      } else {
        showToast('success', 'Usuarios y grupos de usuarios asignados con éxito');
        setEditNameFolder(true)
        closeModal();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const DisasignateUsersAndUserGroups = async () => {

    const payload = {
      folderId: folderId,
      user_ids: selectedUsersDelete.map((item) => item.id),
      usergroups_ids: selectedGroupsUsersDelete.map((item) => item.id)
    };

    try {
      const resultAction = await dispatch(desassignateUsersToaFolder(payload));
      if (resultAction.error) {
        showToast('error', 'Error al intentar desasignar usuarios o grupos de usuarios a ima carpeta')
      } else {
        showToast('success', 'Usuarios y grupos de usuarios desasignados con éxito');
        setEditNameFolder(true)
        closeModal();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (editNameFolder === null) {
      setEditNameFolder(true)
    }
  }, [editGroup])

  const onInputChange = (e, name) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  //asignar valor de el campo de nombre del grupo
  const onInputChangeGroup = (e) => {
    setDataGroup({ ...dataGroup, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const active = usersList.filter((item) => item.estado === true);
    setUsersActive(active)
  }, [usersList])


  const leftToolbarTemplate = () => (
    <div className='mt-1'>
      <button
        className='btn btn-outline-primary py-3 px-3 d-flex justify-content-center'
        onClick={openModal}
      >
        <BorderColorIcon className='me-2' />
        Editar{editGroup ? " carpeta" : " grupo"}
      </button>
    </div>
  );

  const editProduct = (data) => {
    setData({ ...data });
    setIsModal();
  };

  const confirmDeleteProduct = (rowData) => {
    setNewData(rowData);
    closeModal();
  };

  const idBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Codigo</span>
        {rowData.id}
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
          <select value={filterStatusGroup} onChange={(e) => setFilterStatusGroup(e.target.value)} className="form-select form-select-lg mb-3" aria-label=".form-select-lg example">
            <option value="sin asignar">Sin asignar</option>
            <option value="asignados">Asignados</option>
          </select>
        </span>
      </div>
    </div>
  );

  const header = (
    <div className="flex justify-content-md-between align-items-center">
      <div className="col-2">
        <h5 className="mb-3">Lista de Usuarios</h5>
      </div>
      <div className="col-10">
        <span className="block mt-2 mt-md-0 p-input-icon-left">
          <select value={filterStatusUsers} onChange={(e) => setFilterStatusUsers(e.target.value)} className="form-select form-select-lg mb-3" aria-label=".form-select-lg example">
            <option value="sin asignar">Sin asignar</option>
            <option value="asignados">Asignados</option>
          </select>
        </span>
      </div>
    </div>
  );

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="actions">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => {
            editProduct(rowData);
            closeModal();
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
    closeModal,
    data,
    onInputChange,
    onInputChangeGroup,
    submitted,
    submittedGroup
  }) => {

    return (
      <Dialog
        visible={isModal}
        style={editGroup ? { width: '800px', height: "600px" } : { width: "450px", height: "220px" }}
        header={`Grupo seleccionado: ${groupName}`}
        modal
        closeModal={closeModal}
        className='p-fluid'
        footer={productDialogFooter}
        onHide={closeModal}
      >
        {editGroup ? <>
          <h5 className='fw-bold text-bold mb-5'>Carpeta seleccionada: {folderName}</h5>
          <div className='field'>
            <label htmlFor='label'>Carpeta principal</label>
            <div className="d-flex">
              <div className={`${editNameFolder ? 'col-11' : 'col-10'} d-flex`}>
                <InputText
                  id='label'
                  name='label'
                  value={data?.label?.trim()}
                  onChange={(e) => onInputChange(e, 'label')}
                  required
                  autoFocus
                  disabled={editNameFolder}
                  className={classNames({
                    'p-invalid': submitted && !data.label,
                  })}
                />
                {submitted && !data.label && (
                  <small className='p-invalid'>Nombre de la carpeta principal es requerido</small>
                )}
              </div>
              <div className={`${editNameFolder ? 'col-1' : 'col-2'}`}>
                {editNameFolder &&
                  <Button
                    className="text-center d-flex justify-content-center"
                    onClick={() => setEditNameFolder(false)}
                  >
                    <BorderColorIcon />
                  </Button>
                }
                {!editNameFolder &&
                  <div className='d-flex'>
                    <Button
                      className="text-center me-3 d-flex justify-content-center"
                      onClick={() => setEditNameFolder(!editNameFolder)}
                    >
                      <i className='pi pi-times py-1' />
                    </Button>
                    <Button
                      className="text-center d-flex justify-content-center"
                      onClick={EditLabelFolder}
                    >
                      <i className='pi pi-check py-1' />
                    </Button>
                  </div>
                }
              </div>
            </div>
          </div>

          {selectedFolderFather &&
            <>
              <div className="my-2 d-flex">
                <button
                  className="btn btn-outline-primary py-3 w-full d-flex justify-content-center mr-2"
                  onClick={showTableUsers}
                  disabled={!showGroupUser}
                >
                  Tabla de usuarios
                </button>
                <button
                  className="btn btn-outline-primary py-3 w-full d-flex justify-content-center ml-2"
                  onClick={showTableGroup}
                  disabled={showGroupUser}
                >
                  Tabla de grupo de usuarios
                </button>
              </div>

              {!showGroupUser && (
                <TablaUsuario
                  dt={dt}
                  listProduct={filterStatusUsers === 'sin asignar' ? usersActive : usersAssign}
                  selectedUsers={filterStatusUsers === 'sin asignar' ? selectedUsers : selectedUsersCheck}
                  setSelectedProducts={filterStatusUsers === 'sin asignar' ? setSelectedUsers : setSelectedUsersCheck}
                  selectedDelete={selectedUsersDelete}
                  assign={filterStatusUsers === 'asignados' ? true : false}
                  setSelectedDelete={setSelectedUsersDelete}
                  globalFilter={globalFilter}
                  header={header}
                  actionBodyTemplate={actionBodyTemplate}
                  actionBodyTemplate2={actionBodyTemplate2}
                />
              )}

              {showGroupUser && (
                <TablaUsuario
                  dt={dt}
                  listProduct={filterStatusGroup === 'sin asignar' ? usersGroup : usersGroupAssign}
                  selectedUsers={filterStatusGroup === 'sin asignar' ? selectedGroups : selectedGroupsUsersCheck}
                  setSelectedProducts={filterStatusGroup === 'sin asignar' ? setSelectedGroups : setSelectedGroupsUsersCheck}
                  selectedDelete={selectedGroupsUsersDelete}
                  assign={filterStatusGroup === 'asignados' ? true : false}
                  setSelectedDelete={setSelectedGroupsUsersDelete}
                  globalFilter={globalFilter}
                  header={headerGroup}
                  actionBodyTemplate={actionBodyTemplate}
                  actionBodyTemplate2={actionBodyTemplate2}
                  codigoBodyTemplate={idBodyTemplate}
                  nombreBodyTemplate={nameBodyTemplate}
                  AmountOfUsersBodyTemplate={AmountOfUsersBodyTemplate}
                />
              )}
            </>
          }
        </> :
          <>
            <div className="field">
              <label htmlFor="name">Carpeta principal</label>
              <InputText
                id="name"
                name="name"
                value={dataGroup?.name?.trim()}
                onChange={(e) => onInputChangeGroup(e)}
                required
                autoFocus
                className={classNames({
                  'p-invalid': submittedGroup && !dataGroup.name,
                })}
              />
              {submittedGroup && !dataGroup.name && (
                <small className='p-invalid'>El nombre de el grupo es requerido</small>
              )}
            </div>
            <div
              className="field"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            ></div>
          </>}
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
          closeModal();
        }}
      />
      {editGroup ?
        <>
          {showGroupUser ?
            <Button
              label={`${filterStatusGroup === 'sin asignar' ? 'Asignar' : 'Desasignar'}`}
              icon='pi pi-check'
              className='p-button-text'
              disabled={filterStatusGroup === 'sin asignar' ? selectedGroups.length === 0 : selectedGroupsUsersDelete.length === 0}
              onClick={filterStatusGroup === 'sin asignar' ? AssignUsersAndGroupUser : DisasignateUsersAndUserGroups}
            />
            :
            <Button
              label={`${filterStatusUsers === 'sin asignar' ? 'Asignar' : 'Desasignar'}`}
              icon='pi pi-check'
              className='p-button-text'
              disabled={filterStatusUsers === 'sin asignar' ? selectedUsers.length === 0 : selectedUsersDelete.length === 0}
              onClick={filterStatusUsers === 'sin asignar' ? AssignUsersAndGroupUser : DisasignateUsersAndUserGroups}
            />
          }
        </>
        : 
          <Button
            label='Guardar'
            icon='pi pi-check'
            className='p-button-text'
            onClick={() => {
              editLabelGroup();
            }}
          />
          }
    </>
  );


  return (
    <div className='grid crud-demo'>
      <div className='col-12'>
        <div >
          {ToastComponent}
          <Toolbar style={{ background: "transparent", border: "none" }} left={leftToolbarTemplate}></Toolbar>
          {isModal &&
            Handler({
              isModal,
              productDialogFooter,
              openModal,
              closeModal,
              data,
              setData,
              onInputChange,
              onInputChangeGroup,
              submitted,
              submittedGroup,
              switchFondo,
            })}
        </div>
      </div>
    </div>
  );
};

export { EditFolder };