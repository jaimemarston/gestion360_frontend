import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { fetchDelete, fetchGet, fetchPut, postUser } from '../../../../api';

const RegisterFolder = ({isDarkMode}) => {
  const [usersId, setUsersId] = useState([]);
  let empty = {
    mainFolder: '',
    subFolder: '',
    lastFolder: '',
    rol:"USER_ROLE",
    usersId,
    estado: true,
  };
  const [listProduct, setlistProduct] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const [newData, setNewData] = useState(null);
  const [isCloseModal, setIsCloseModal] = useState(false);
  const [value, setValue] = useState(empty.estado);
  const [selectedProducts, setSelectedProducts] = useState(null);

  const [product, setProduct] = useState(empty);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

    const switchFondo = (e) => {
      setValue(e);
    };

    const listarUsuarios = () => {
        fetchGet('usuario').then((data) => {
          setlistProduct(data.usuario)
        })
    };

    useEffect(() => {
      listarUsuarios();
    }, []);

    const openModal = () => {
      setIsModal(!isModal);

      if (product.length === 0) {
        setProduct({});
      }
    };

    const closeModal = () => {
      setIsCloseModal(!isCloseModal);
    };

    const saveProduct = () => {
      setSubmitted(true);
      console.log(product)
/*       if (
        product?.mainFolder.trim() &&
        product?.subFolder.trim() &&
        product?.lastFolder.trim() &&
        product?.password.trim()
      ) {
        if (product.id) {
          product.estado = value;
        
        
          fetchPut(`usuario/${product.id}`,'PATCH', product)
            .then((res) => {
              toast.current.show({
                severity: 'success',
                summary: 'Successful',
                detail: 'Usuario actualizado',
                life: 3000,
              });
              listarUsuarios();
              openModal();
              setProduct(empty);
            })
            .catch((error) => {
              toast.current.show({
                severity: 'error',
                summary: 'Successful',
                detail: error.response.data.message,
                life: 3000,
              });
            }); 
        } else {
  
          if (
            product?.nombre.trim() &&
            product?.codigo.trim() &&
            product?.email.trim() &&
            product?.password.trim()
          ) {
            product.estado = value;

            postUser(product).then((data) => {
              toast.current.show({
                severity: 'error',
                summary: 'Successful',
                detail: error.response.data.message,
                life: 3000,
              });
            })
          }
        }
      } */
    };

    const editProduct = (product) => {
  
      setProduct({ ...product });
      setIsModal();
    };

    const confirmDeleteProduct = (rowData) => {
      setNewData(rowData);
      closeModal();
    };

    const onInputChange = (e, name) => {
      setProduct({ ...product, [e.target.name]: e.target.value });
    };

  useEffect(()=>{
    if(selectedProducts !== null){
      const id = selectedProducts.map((item)=> item.id);
      setUsersId(id)
      empty.usersId = id;
    }
  }, [selectedProducts])

useEffect(()=> {
  console.log(empty.usersId)
}, [empty.usersId])

  const leftToolbarTemplate = () => (
    <>
      <div className='my-2'>
        <Button
          label='Crear carpeta'
          icon='pi pi-plus'
          className='p-button-success mr-2'
          onClick={openModal}
        />
      </div>
    </>
  );

  const codigoBodyTemplate = (rowData) => {
    return (
      <>
        <span className='p-column-title'>Codigo</span>
        {rowData.codigo}
      </>
    );
  };

  const nombreBodyTemplate = (rowData) => {
    return (
      <>
        <span className='p-column-title'>Nombre</span>
        {rowData.nombre}
      </>
    );
  };

  const usuarioBodyTemplate = (rowData) => {
    return (
      <>
        <span className='p-column-title'>Usuario</span>
        {rowData.email}
      </>
    );
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <>
        <span className='p-column-title'>Estado</span>
        {rowData?.estado === true ? 'Activo' : 'Inactivo'}
      </>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className='actions'>
        <Button
          icon='pi pi-pencil'
          className='p-button-rounded p-button-success mr-2'
          onClick={() => {
            editProduct(rowData);
            openModal();
          }}
        />
      </div>
    );
  };


  const CrudUsuario = ({
    isModal,
    productDialogFooter,
    openModal,
    product,
    onInputChange,
    submitted,
  }) => {
    // console.log(product);
  
    return (
      <Dialog
        visible={isModal}
        style={{ width: '950px', height: "650px" }}
        header='Detalle del registro'
        modal
        className='p-fluid'
        footer={productDialogFooter}
        onHide={openModal}
      >
        <div className='field'>
          <label htmlFor='mainFolder'>Carpeta principal</label>
          <InputText
            id='mainFolder'
            name='mainFolder'
            value={product?.mainFolder?.trim()}
            onChange={(e) => onInputChange(e, 'mainFolder')}
            required
            autoFocus
            className={classNames({
              'p-invalid': submitted && !product.mainFolder,
            })}
          />
          {submitted && !product.codigo && (
            <small className='p-invalid'>Nombre de la carpeta principal es requerido</small>
          )}
        </div>
  
        <div className='field'>
          <label htmlFor='subFolder'>Sub carpeta</label>
          <InputText
            id='subFolder'
            name='subFolder'
            value={product?.subFolder?.trim()}
            onChange={(e) => onInputChange(e, 'subFolder')}
            required
            autoFocus
          />
        </div>
  
        <div className='field'>
          <label htmlFor='lastFolder'>Ultima carpeta</label>
          <InputText
            id='lastFolder'
            name='lastFolder'
            type='text'
            value={product?.lastFolder?.trim()}
            onChange={(e) => onInputChange(e, 'lastFolder')}
            required
            autoFocus
          />
        </div>
        <div
          className='field'
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
        </div>
  
        <TablaUsuario
              dt={dt}
              listProduct={listProduct}
              selectedProducts={selectedProducts}
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
      </Dialog>
    );
  };
  const actionBodyTemplate2 = (rowData) => {
    return (
      <div className='actions'>
        <Button
          icon='pi pi-trash'
          className='p-button-rounded p-button-warning '
          onClick={() => {
            confirmDeleteProduct(rowData);
          }}
        />
      </div>
    );
  };

  const header = (
    <div className='flex flex-column md:flex-row md:justify-content-between md:align-items-center'>
      <div className="col-2">
      <h5 className='m-0'>Lista de Usuarios</h5>
      </div>
      <div className="col-10">
      <span className='block mt-2 md:mt-0 p-input-icon-left'>
        <i className='pi pi-search' />
        <InputText
          type='search'
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder='Buscar...'
        />
      </span>
      </div>
    </div>
  );

  const productDialogFooter = (
    <>
      <Button
        label='Cancelar'
        icon='pi pi-times'
        className='p-button-text'
        onClick={() => {
          openModal();
          setProduct({});
        }}
      />
      <Button
        label='Guardar'
        icon='pi pi-check'
        className='p-button-text'
        onClick={saveProduct}
      />
    </>
  );

  return (
    <div className={isDarkMode ?  'dark-mode-table grid crud-demo' : 'grid crud-demo'  }>
      <div className='col-12'>
        <div >
          <Toast ref={toast} />
          <Toolbar style={{ background: "transparent", border: "none" }} left={leftToolbarTemplate}></Toolbar>
          {isModal &&
            CrudUsuario({
              isModal,
              productDialogFooter,
              openModal,
              product,
              setProduct,
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
  selectedProducts,
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
      selection={selectedProducts}
      onSelectionChange={(e) => setSelectedProducts(e.value)}
      dataKey='id'
      paginator
      rows={10}
      rowsPerPageOptions={[5, 10, 25]}
      className='datatable-responsive'
      paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
      currentPageReportTemplate='Mostrando {first} a {last} de {totalRecords}'
      globalFilter={globalFilter}
      emptyMessage='No products found.'
      header={header}
      responsiveLayout='scroll'
    >
      <Column selectionMode='multiple' headerStyle={{ width: '3rem' }}></Column>
      <Column
        field='codigo'
        header='Codigo'
        sortable
        body={codigoBodyTemplate}
        headerStyle={{ width: '14%', minWidth: '10rem' }}
      ></Column>
      <Column
        field='nombre'
        header='Nombre'
        sortable
        body={nombreBodyTemplate}
        headerStyle={{ width: '44%', minWidth: '10rem' }}
      ></Column>
      <Column
        field='email'
        header='Usuario'
        sortable
        body={usuarioBodyTemplate}
        headerStyle={{ width: '14%', minWidth: '10rem' }}
      ></Column>
      <Column
        field='rol'
        header='Rol'
        sortable
        headerStyle={{ width: '14%', minWidth: '10rem' }}
      ></Column>
      <Column
        field='inventoryStatus'
        header='Status'
        body={statusBodyTemplate}
        sortable
        headerStyle={{ width: '14%', minWidth: '10rem' }}
      ></Column>
    </DataTable>
  );
};

