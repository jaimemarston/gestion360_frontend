import { addFolder, fetchGroups } from '../../../../store/slices/fileManager/fileManagerSlice';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { fetchGet, } from '../../../../api';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { useDispatch } from 'react-redux';
import { useToast } from '../../../../hooks/useToast';
import classNames from 'classnames';
import FolderIcon from '@mui/icons-material/Folder';
import React, { useState, useEffect, useRef } from 'react';

const RegisterFolder = ({ isDarkMode, groupName, groupID }) => {
  const [usersId, setUsersId] = useState([]);
  let empty = {
    label1: '',
    label2: '',
    label3: '',
    usersId,
    groupId: groupID,
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

  const { showToast, ToastComponent } = useToast()

  const dispatch = useDispatch();

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
      groupId: groupID,
      usersId: selectedUsers.map((item) => item.id),
    };
    try {
      const resultAction = await dispatch(addFolder(payload));
      if (resultAction.error) {
        showToast('error', 'Error al intentar crear una carpeta')
      } else {
        showToast('success', 'Carpeta creada con éxito');
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

  useEffect(() => {
    if (selectedUsers !== null) {
      const id = selectedUsers.map((item) => item.id);
      setUsersId(id)
      empty.usersId = id;
    }
  }, [selectedUsers])


  const leftToolbarTemplate = () => (
    <>
      <div className='my-2'>
        <Button
          className='p-button-success d-flex justify-content-center mr-2'
          onClick={openModal}
        >
          <FolderIcon className='me-2' />
          Crear carpeta
        </Button>
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
        style={{ width: '950px', height: "660px" }}
        header={`Grupo seleccionado: ${groupName}`}
        modal
        className='p-fluid'
        footer={productDialogFooter}
        onHide={openModal}
      >
        <div className='field'>
          <label htmlFor='label1'>Carpeta principal</label>
          <InputText
            id='label1'
            name='label1'
            value={data?.label1?.trim()}
            onChange={(e) => onInputChange(e, 'label1')}
            required
            autoFocus
            className={classNames({
              'p-invalid': submitted && !data.label1,
            })}
          />
          {submitted && !data.codigo && (
            <small className='p-invalid'>Nombre de la carpeta principal es requerido</small>
          )}
        </div>

        <div className='field'>
          <label htmlFor='label2'>Sub carpeta</label>
          <InputText
            id='label2'
            name='label2'
            value={data?.label2?.trim()}
            onChange={(e) => onInputChange(e, 'label2')}
            required
            autoFocus
          />
        </div>

        <div className='field'>
          <label htmlFor='label3'>Ultima carpeta</label>
          <InputText
            id='label3'
            name='label3'
            type='text'
            value={data?.label3?.trim()}
            onChange={(e) => onInputChange(e, 'label3')}
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
          setData({});
        }}
      />
      <Button
        label='Guardar'
        icon='pi pi-check'
        className='p-button-text'
        onClick={()=> {save(), setData({})}}
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

