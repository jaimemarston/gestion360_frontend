import {
  addFolder,
  fetchUsersGroups
} from "../../../../../store/slices/fileManager/fileManagerSlice";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { fetchGet } from "../../../../../api";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import { useDispatch } from "react-redux";
import { useToast } from "../../../../../hooks/useToast";
import classNames from "classnames";
import FolderIcon from "@mui/icons-material/Folder";
import React, { useState, useEffect, useRef } from "react";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import TablaUsuario from '../../TableUsers'

const RegisterFolder = ({
  isDarkMode,
  groupName,
  groupID,
  parentFolder,
  folderId,
}) => {
  const [usersId, setUsersId] = useState([]);
  let empty = {
    label: "",
    parent: parentFolder ? null : folderId,
    groupId: parentFolder ? groupID : null,
  };
  const [listProduct, setlistProduct] = useState([]);
  const [usersActive, setUsersActive] = useState([]);
  const [usersGroup, setGroupUsers] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const [newData, setNewData] = useState(null);
  const [isCloseModal, setIsCloseModal] = useState(false);
  const [value, setValue] = useState(empty.estado);
  const [selectedUsers, setSelectedProducts] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);

  const [data, setData] = useState(empty);
  const [submitted, setSubmitted] = useState(false);
  const [showGroupUser, setShowGroupUser] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const dt = useRef(null);

  const { showToast, ToastComponent } = useToast();

  const dispatch = useDispatch();

  const switchFondo = (e) => {
    setValue(e);
  };

  const showTableGroup = () => {
    setShowGroupUser(true)
  }

  const showTableUsers = () => {
    setShowGroupUser(false)
  }

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

  const openModal = () => {
    setIsModal(!isModal);

    if (data.length === 0) {
      setData({});
    }
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
    } else {
      setSubmitted(false);
    }

    const payload = {
      ...data,
      groupId: parentFolder ? groupID : null,
      parent: parentFolder ? null : folderId,
      user_ids: parentFolder ? selectedUsers.map((item) => item.id) : null,
      usergroups_ids: parentFolder ? selectedGroups.map((item) => item.id) : null,
    };
    try {
      const resultAction = await dispatch(addFolder(payload));
      if (resultAction.error) {
        showToast("error", "Error al intentar crear una carpeta");
      } else {
        showToast("success", "Carpeta creada con éxito");
        closeModal();
      }
    } catch (error) {
      console.log("error", error);
    } finally {
    }
  };

  const editProduct = (data) => {
    setData({ ...data });
    setIsModal();
  };

  const confirmDeleteProduct = (rowData) => {
    setNewData(rowData);
    closeModal();
  };

  const onInputChange = (e, name) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const leftToolbarTemplate = () => (
    <>
      <div className="my-2">
        <Button
          className="p-button-success d-flex justify-content-center mr-2"
          onClick={openModal}
        >
          <CreateNewFolderIcon className="me-2 mb-1" />
          Crear carpeta
        </Button>
      </div>
    </>
  );

  const codigoBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Codigo</span>
        {rowData.codigo ? rowData.codigo : rowData.id}
      </>
    );
  };

  const nombreBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Nombre</span>
        {rowData.nombre ? rowData.nombre : rowData.name}
      </>
    );
  };

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

  const AmountOfUsersBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Cantidad de usuarios</span>
        {rowData?.usersAmount}
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
        style={parentFolder ? { width: "950px", height: "660px" } : { width: "400px", height: "220px" }}
        header={`Grupo seleccionado: ${groupName}`}
        modal
        className="p-fluid"
        footer={productDialogFooter}
        onHide={openModal}
      >
        <div className="field">
          <label htmlFor="label">Nombre de la carpeta</label>
          <InputText
            id="label"
            name="label"
            value={data.label?.trim()}
            onChange={(e) => onInputChange(e, "label")}
            required
            autoFocus
            className={classNames({
              "p-invalid": submitted && !data.label,
            })}
          />
          {submitted && !data.codigo && (
            <small className="p-invalid">
              El nombre de la carpeta es requerido
            </small>
          )}
        </div>

        {parentFolder &&
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
        }

        {parentFolder && !showGroupUser && (
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

        {parentFolder && showGroupUser && (
          <TablaUsuario
            dt={dt}
            listProduct={usersGroup}
            selectedUsers={selectedGroups}
            setSelectedProducts={setSelectedGroups}
            globalFilter={globalFilter}
            header={headerGroup}
            actionBodyTemplate={actionBodyTemplate}
            actionBodyTemplate2={actionBodyTemplate2}
            codigoBodyTemplate={codigoBodyTemplate}
            nombreBodyTemplate={nombreBodyTemplate}
            usuarioBodyTemplate={usuarioBodyTemplate}
            AmountOfUsersBodyTemplate={AmountOfUsersBodyTemplate}
          />
        )}
      </Dialog>
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

  const headerGroup = (
    <div className="flex flex-column flex-md-row justify-content-md-between align-items-md-center">
      <div className="col-12">
        <h5 className="m-0">Lista de grupos de usuarios</h5>
      </div>
    </div>
  );

  const header = (
    <div className="flex flex-column flex-md-row justify-content-md-between align-items-md-center">
      <div className="col-2">
        <h5 className="m-0">Lista de Usuarios</h5>
      </div>
      <div className="col-10">
        <span className="block mt-2 mt-md-0 p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            type="search"
            onInput={(e) => setGlobalFilter(e.target.value)}
            placeholder="Buscar..."
          />
        </span>
      </div>
    </div>
  );

  const productDialogFooter = (
    <>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-text"
        onClick={() => {
          openModal();
          setData({});
        }}
      />
      <Button
        label="Guardar"
        icon="pi pi-check"
        className="p-button-text"
        onClick={() => {
          save(), setData({});
        }}
      />
    </>
  );

  return (
    <div
      className={
        isDarkMode ? "dark-mode-table grid crud-demo" : "grid crud-demo"
      }
    >
      <div className="col-12">
        <div>
          {ToastComponent}
          <Toolbar
            style={{ background: "transparent", border: "none" }}
            left={leftToolbarTemplate}
          ></Toolbar>
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
              value,
              setValue,
            })}
        </div>
      </div>
    </div>
  );
};

export { RegisterFolder };