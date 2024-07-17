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
  codigoBodyTemplate,
  nombreBodyTemplate,
  usuarioBodyTemplate,
  statusBodyTemplate,
  AmountOfUsersBodyTemplate,
  setSelectedGroupsUsersDelete,
  assign
}) => {
  React.useEffect(() => {
    if (assign === true) {
      setSelectedProducts(listProduct);
    }
    // Inicializa todos los ítems como seleccionados por defecto
  }, [listProduct]);

  const handleSelectionChange = (e) => {
    const newSelection = e.value;
    setSelectedProducts(newSelection);

    // Encuentra los ítems deseleccionados
    if (assign === true) {
      const deseleccionados = listProduct.filter(
        (item) => !newSelection.some((selected) => selected.id === item.id)
      );

      setSelectedGroupsUsersDelete(deseleccionados);
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