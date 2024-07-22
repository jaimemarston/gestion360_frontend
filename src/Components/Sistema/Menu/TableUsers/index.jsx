import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React from 'react'

const TablaUsuario = ({
  dt,
  listProduct,
  selectedUsers,
  setSelectedProducts,
  globalFilter,
  header,
  nombreBodyTemplate,
  AmountOfUsersBodyTemplate,
  setSelectedDelete,
  codigoBodyTemplate,
  assign,
  selectedDelete,
}) => {

  const rolBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Rol</span>
        {rowData.rol === 'ADMIN_ROLE' ? 'Admin' : 'Usuario normal'}
      </>
    );
  };

  const codigoBodyTemplateDefault = (rowData) => {
    return (
      <>
        <span className="p-column-title">Codigo</span>
        {rowData.codigo}
      </>
    );
  };

  const nombreBodyTemplateDefault = (rowData) => {
    return (
      <>
        <span className="p-column-title">Nombre</span>
        {rowData.nombre}
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

  React.useEffect(() => {
    if (assign === true) {
      setSelectedProducts(listProduct);
    }
  }, [assign || selectedDelete && selectedDelete.lenght === 0]);
  
  const handleSelectionChange = (e) => {
    const newSelection = e.value;
    setSelectedProducts(newSelection);

    // Encuentra los ítems deseleccionados
    if (assign === true) {
      const deseleccionados = listProduct.filter(
        (item) => !newSelection.some((selected) => selected.id === item.id)
      );

      setSelectedDelete(deseleccionados);
    }
  };
  return (
    <DataTable
      ref={dt}
      value={listProduct}
      selection={selectedUsers}
      onSelectionChange={handleSelectionChange}
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
        body={codigoBodyTemplate ? codigoBodyTemplate : codigoBodyTemplateDefault}
        headerStyle={{ width: "14%", minWidth: "10rem" }}
      ></Column>
      <Column
        field="nombre"
        header="Nombre"
        sortable
        body={nombreBodyTemplate ? nombreBodyTemplate : nombreBodyTemplateDefault}
        headerStyle={{ width: "44%", minWidth: "10rem" }}
      ></Column>
      <Column
        field="email"
        header="Usuario"
        sortable
        headerStyle={{ width: "14%", minWidth: "10rem" }}
      ></Column>
      <Column
        field="rol"
        header="Rol"
        sortable
        body={rolBodyTemplate}
        headerStyle={{ width: "14%", minWidth: "10rem" }}
      ></Column>
      {statusBodyTemplate &&
        <Column
          field="inventoryStatus"
          header="Status"
          body={statusBodyTemplate}
          sortable
          headerStyle={{ width: "14%", minWidth: "10rem" }}
        ></Column>
      }
      {AmountOfUsersBodyTemplate &&
        <Column
          field="inventoryStatus"
          header="Cantidad de usuarios"
          body={AmountOfUsersBodyTemplate}
          sortable
          headerStyle={{ width: "18%", minWidth: "14rem" }}
        ></Column>
      }
    </DataTable>
  );
};

export default TablaUsuario;