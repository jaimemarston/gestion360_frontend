import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { getUser } from "../../../../utils/getUser";
import { fetchGet } from '../../../../api';

// import { CustomerService } from '../service/CustomerService';




const VisorDocumento = ({isDarkMode}) => {
  let empty = {
    id: null,
    codigo: '',
    nombre: null,
    usuario: '',
    rol: '',
    estado: null,
  };
  const toast = useRef(null);

  // const [customers1, setCustomers1] = useState(null);
  // const [customers2, setCustomers2] = useState([]);
  // const [customers3, setCustomers3] = useState([]);
  const [filters1] = useState(null);
  // const [loading1, setLoading1] = useState(true);
  // const [loading2, setLoading2] = useState(true);
  const [products, setProducts] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);

  const [deleteDocumentsDialog, setDeleteDocumentsDialog] = useState(false);

  const [product, setProduct] = useState(empty);
  const [selectedDocuments, setSelectedDocuments] = useState(null);
  // const [, setGlobalFilter] = useState(null);
  const [globalFilter1] = useState(null);

  // const customerService = new CustomerService();
 /*  const empleadoService = new EmpleadoService(); */
  /* const usuario_codigo = localStorage.getItem('codigo'); */
  const usuario_ndocumento = localStorage.getItem('ndocumento');
  const [dataUser, setDataUser] = useState({});
  const dt = useRef(null);


  useEffect(() => {

    async function doIt(){

        const userData = await getUser();


        const empleado = await fetchGet(`/empleados/${userData?.dni}`)
  
      
        
        setDataUser(userData);
        setProducts(empleado.registroEmpleados)
       
  
  
      
      }
  
      doIt()
    // setLoading2(true);

    // customerService.getCustomersLarge().then((data) => {
    //   setCustomers1(getCustomers(data));
    //   setLoading1(false);
    // });
    // customerService.getCustomersLarge().then((data) => {
    //   setCustomers2(getCustomers(data));
    //   setLoading2(false);
    // });
    // customerService.getCustomersMedium().then((data) => setCustomers3(data));

/*     empleadoService
      .getEmployeeDocumentSmall(usuario_ndocumento)
      .then((data) => setProducts(data)); */
     

  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // const getCustomers = (data) => {
  //   return [...(data || [])].map((d) => {
  //     d.fechaenvio = new Date(d.fechaenvio);
  //     return d;
  //   });
  // };

  const statusOrderBodyTemplate = (rowData) => {
    // console.log(rowData);
    const data = rowData.estado === true ? '#8ff484' : '#f4d484';
    return (
      <span
        className={`order-badge `}
        style={{ backgroundColor: data, fontWeight: '500' }}
      >
        {rowData.estado === true ? 'Firmado' : 'Pendiente'}
      </span>
    );
  };

  const actionBodyTemplate = (rowData) => {
    console.log('====>', rowData.data);
    localStorage.setItem('pdfdetalle', JSON.stringify(rowData));
    return (
      <div className='actions'>
          <a
          icon='pi pi-user-edit'
          href='/viewpdf'
          target='_blank'
          onClick={() => editProduct(rowData)}
        >
          <Button icon='pi pi-user-edit' />
        </a>
       
      </div>
    );
  };

  const deleteDocuments = () => {
    let _products = products.filter((val) => val.id !== product.id);
    setProducts(_products);
    setDeleteDocumentsDialog(false);
    setProduct(empty);

/*     axios
      .delete(`${mainUrl}/empleados/${product.id}`)
      .then((res) => {
        toast.current.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'Registro de Empleado Eliminado',
          life: 3000,
        });
      })
      .catch((error) => {
        toast.current.show({
          severity: 'error',
          summary: 'Successful',
          detail: error.response.data.message,
          life: 3000,
        });
      }); */
  };

  const hideDeleteDocumentsDialog = () => {
    setDeleteDocumentsDialog(false);
  };

  const editProduct = (product) => {
    localStorage.setItem('pdfdetalle', JSON.stringify(product));

  };

  const deleteDocumentsDialogFooter = (
    <>
      <Button
        label='No'
        icon='pi pi-times'
        className='p-button-text'
        onClick={hideDeleteDocumentsDialog}
      />
      <Button
        label='Yes'
        icon='pi pi-check'
        className='p-button-text'
        onClick={deleteDocuments}
      />
    </>
  );

  const rowExpansionTemplate = (data) => {
    console.log('=> data', data);
    localStorage.setItem('visor', JSON.stringify(data));
    return (
      <div  className={isDarkMode ?  'dark-mode-table orders-subtable' : 'orders-subtable'  }>
        <h5>Detalle de Documentos para: {data.nombre}</h5>
        <DataTable
          ref={dt}
          value={data.registroDocumentos}
          selection={selectedDocuments}
          onSelectionChange={(e) => setSelectedDocuments(e.value)}
          dataKey='id'
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          className='datatable-responsive'
          paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
          currentPageReportTemplate='Mostrando {first} a {last} de {totalRecords}'
          globalFilter={globalFilter1}
          emptyMessage='No Data found.'
          // header={header}
          responsiveLayout='scroll'
        >
          <Column field='id' header='Id' sortable></Column>
          <Column field='tipodoc' header='TipoDocumento' sortable></Column>
          <Column
            field='nombredoc'
            header='Documento'
            filter
            filterPlaceholder='Buscar Fecha de Firmado'
            sortable
          ></Column>
          <Column field='fechaenvio' header='Fecha Envio' sortable></Column>
          <Column field='fechafirma' header='Fecha Firma' sortable></Column>
          <Column
            field='estado'
            header='Status'
            body={statusOrderBodyTemplate}
            sortable
          ></Column>
          <Column
            headerStyle={{ width: '2rem' }}
            body={actionBodyTemplate}
          ></Column>
        </DataTable>

        <Dialog
          visible={deleteDocumentsDialog}
          style={{ width: '450px' }}
          header='Confirm'
          modal
          footer={deleteDocumentsDialogFooter}
          onHide={hideDeleteDocumentsDialog}
        >
          <div className='flex align-items-center justify-content-center'>
            <i
              className='pi pi-exclamation-triangle mr-3'
              style={{ fontSize: '2rem' }}
            />
            {product && (
              <span>
                Esta seguro que desea eliminar el registro?{' '}
                <b>{product.name}</b>?
              </span>
            )}
          </div>
        </Dialog>
      </div>
    );
    // }
  };

/* const header = (
    <div className='table-header-container'>
      <span className='block mt-2 md:mt-0 p-input-icon-left'>
        <i className='pi pi-search' />
        <InputText
          type='search'
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder='Buscar...'
        />
      </span>
    </div>
  ); */

  return (
    <div className={isDarkMode ?  'dark-mode-table grid table-demo' : 'grid table-demo'  }>
      <div className='col-12'>
        <div className={isDarkMode ?  'dark-mode card' : 'card'  }>
          <h5>Relacion de Empleados por Documento</h5>
          <DataTable
            value={products}
            paginator
            rows={10}
            expandedRows={expandedRows}
            filters={filters1}
            filterDisplay='menu'
            onRowToggle={(e) => setExpandedRows(e.data)}
            responsiveLayout='scroll'
            rowExpansionTemplate={rowExpansionTemplate}
            dataKey='id'
          >
            <Column expander style={{ width: '3em' }} />
            <Column field='codigo' header='Codigo' sortable />
            <Column field='nombre' header='Nombre' sortable />
            <Column field='ndocumento' header='Documento' sortable />
            <Column field='email' header='Email' sortable />
            <Column field='cargo' header='Cargo' sortable />
            {/* <Column field='activo' header='Status' sortable /> */}
          </DataTable>
        </div>
      </div>
    </div>
  );
};


export {VisorDocumento};
