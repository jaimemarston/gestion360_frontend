import {
  addFolder,
  fetchGroups,
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
  const [isModal, setIsModal] = useState(false);
  const [newData, setNewData] = useState(null);
  const [isCloseModal, setIsCloseModal] = useState(false);
  const [value, setValue] = useState(empty.estado);
  const [selectedUsers, setSelectedProducts] = useState([]);

  const [data, setData] = useState(empty);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const dt = useRef(null);

  const { showToast, ToastComponent } = useToast();

  const dispatch = useDispatch();

  const switchFondo = (e) => {
    setValue(e);
  };

  const listarUsuarios = () => {
    fetchGet("usuario").then((data) => {
      setlistProduct(data.usuario);
    });
  };

  useEffect(() => {
    listarUsuarios();
  }, []);

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

  const save = async () => {
    setSubmitted(true);

    const payload = {
      ...data,
      groupId: parentFolder ? groupID : null,
      parent: parentFolder ? null : folderId,
      user_ids: parentFolder ? selectedUsers.map((item) => item.id) : null,
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
      setSubmitted(false);
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
        {rowData.codigo}
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

        {parentFolder && (
          <TablaUsuario
            dt={dt}
            listProduct={listProduct}
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

const TablaUsuario = ({
  dt,
  listProduct,
  selectedUsers,
  setSelectedProducts,
  globalFilter,
  header,
  codigoBodyTemplate,
  nombreBodyTemplate,
  usuarioBodyTemplate,
  statusBodyTemplate,
}) => {
  return (
    <DataTable
      ref={dt}
      value={listProduct}
      selection={selectedUsers}
      onSelectionChange={(e) => setSelectedProducts(e.value)}
      dataKey="id"
      paginator
      rows={10}
      rowsPerPageOptions={[5, 10, 25]}
      className="datatable-responsive"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords}"
      globalFilter={globalFilter}
      emptyMessage="No products found."
      header={header}
      responsiveLayout="scroll"
    >
      <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
      <Column
        field="codigo"
        header="Codigo"
        sortable
        body={codigoBodyTemplate}
        headerStyle={{ width: "14%", minWidth: "10rem" }}
      ></Column>
      <Column
        field="nombre"
        header="Nombre"
        sortable
        body={nombreBodyTemplate}
        headerStyle={{ width: "44%", minWidth: "10rem" }}
      ></Column>
      <Column
        field="email"
        header="Usuario"
        sortable
        body={usuarioBodyTemplate}
        headerStyle={{ width: "14%", minWidth: "10rem" }}
      ></Column>
      <Column
        field="rol"
        header="Rol"
        sortable
        headerStyle={{ width: "14%", minWidth: "10rem" }}
      ></Column>
      <Column
        field="inventoryStatus"
        header="Status"
        body={statusBodyTemplate}
        sortable
        headerStyle={{ width: "14%", minWidth: "10rem" }}
      ></Column>
    </DataTable>
  );
};
