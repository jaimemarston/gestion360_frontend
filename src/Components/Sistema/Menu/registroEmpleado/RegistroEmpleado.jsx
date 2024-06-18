import React, { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { LeftToolBarTemplate, RightToolBarTemplate } from '../../../Molecula';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { createFormData, fetchGet, fetchDelete  } from "../../../../api/api";

// import ModalRegistroProyecto from './Modal/ModalRegistroProyecto';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';

const usuario = [
  {
    id: 1,
    nombre: 'pepe',
    correo: 'corre@gmail.com',
    estado: 'activo',
  },
  {
    id: 2,
    nombre: 'pepe',
    correo: 'corre@gmail.com',
    estado: 'activo',
  },
  {
    id: 3,
    nombre: 'pepe',
    correo: 'corre@gmail.com',
    estado: 'activo',
  },
];



async function arrayToJson(array) {
  // Make a copy of the input array to avoid modifying the original
  const clonedArray = [...array]; 


/*   //fill array with repeated elements
  const repeatedElements = []; */

  // Initialize an empty array to store the structured data
  const structuredData = [];

  // Get the keys (column headers) of the input array
/*   const keys = clonedArray[0]; */

  // Get the data (rows) of the input array, excluding the second row (which contains the keys)
  const data = clonedArray.slice(2);

  const statusValidationsRules = (entry) => {
    const rules = [
      entry === 1,
      entry === "1",
      entry === "TRUE",
      entry === "True",
      entry === "true",
      entry === "Verdadero",
      entry === "verdadero",
      entry === "VERDADERO",
      entry === true
    ]

    return rules.includes(true)
  }

  // Use Promise.all to ensure that all rows are processed asynchronously
  await Promise.all(data.map(async (row) => {
    // Create an object to store the structured data for the current row
    //const obj = {};
    const obj = {
      codigo: row[0].toString().trim(),
      ndocumento: row[8].toString().trim(),
      nombre: row[5].toString().trim(),
      email: row[14].toString().trim(),
      telefono: row[13].toString().trim(),
      cargo: row[15].toString().trim(),
      role: 'Empleado',
      activo: statusValidationsRules(row[66]),
      date: new Date(row[18]),
    }

    


    const hasDuplicate = el => el["ndocumento"] === obj["ndocumento"] || el["codigo"] === obj["codigo"];

    if (!structuredData.find(hasDuplicate)) {
      structuredData.push(obj);
    }
  }));
  
  // Return the structured data array
  return structuredData;
}


const RegistroEmpleado = ({isDarkMode}) => {
  let emptyProduct = {
    id: null,
    codigo: '',
    nombre: '',
    image: null,
    description: '',
    category: null,
    price: 0,
    quantity: 0,
    rating: 0,
    inventoryStatus: 'PENDIENTE',
  };

  const [products, setProducts] = useState(null);
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect( () =>  {
    async function doIt(){

      const response =  await fetchGet('empleados')
      console.log(response.registroEmpleados)
      setProducts(response.registroEmpleados);

    
    }

    doIt();

  }, [])
 
  
  async function doIt(){

    const response =  await fetchGet('empleados')
    console.log(response.registroEmpleados)
    setProducts(response.registroEmpleados);

  
  }
  const [selectedCity1, setSelectedCity1] = useState(null);

  const toast = useRef(null);

  const dt = useRef(null);



  const readExcel = async ({ files }) => {
    toast.current.show({
      severity: 'info',
      summary: 'Success',
      detail: 'Archivo Excel Importado ',
    });


    const [file] = files;
    // console.log('files MPORTADO:', files);
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = async (e) => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array' });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      //console.log(rABS, wb);
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      //console.log('Desde Excel', data);

      /* Update state */

      //this.setState({ data: data, cols: make_cols(ws["!ref"]) });
      const parseData = async () => {
        
        const formData = new FormData();

        formData.append('file', file);
  
        setLoading(true);
          return new Promise(async (resolve, reject) => {
            try {
           

              
            const res =  await createFormData("regEmpleado", 'POST' , formData);

              await 
              toast.current.show({
                severity: 'success',
                summary: 'Successful',
                detail: 'Empleados Created',
                life: 3000,
              });
             await fetchGet('firmas')
              resolve(setLoading(false), doIt());
              return res;
            } catch (error) {
              console.log(error)
              resolve([]);
            }
          });
        
      };
      // GUARDANDO EN BD
      //parseData(data)

       const response = await parseData();
       setProducts(response.registroEmpleados); 





    };

    if (rABS) reader.readAsBinaryString(file);
    else reader.readAsArrayBuffer(file);
  };

  /* generate an array of column objects */
  // const make_cols = (refstr) => {
  //   let o = [],
  //     C = XLSX.utils.decode_range(refstr).e.c + 1;
  //   for (var i = 0; i < C; ++i)
  //     o[i] = { name: XLSX.utils.encode_col(i), key: i };
  //   return o;
  // };



//TO-DO
/*   useEffect(() => {
    const empleadoService = new EmpleadoService();
    empleadoService.getEmployees(selectedCity1?.name).then((data) => {
      setProducts(data);
    });
  }, [selectedCity1]); */

  // const formatCurrency = (value) => {
  //   return value.toLocaleString('en-US', {
  //     style: 'currency',
  //     currency: 'USD',
  //   });
  // };

/*   const openNew = () => {
    setProduct(emptyProduct);
    setSubmitted(false);
    setProductDialog(true);
  }; */

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
  };

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
  };

  const saveProduct = () => {
    setSubmitted(true);

    if (product.name.trim()) {
      let _products = [...products];
      let _product = { ...product };
      if (product.id) {
        const index = findIndexById(product.id);

        _products[index] = _product;
        toast.current.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Updated',
          life: 3000,
        });
      } else {
        _product.id = createId();
        _product.image = 'product-placeholder.svg';
        _products.push(_product);
        toast.current.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Created',
          life: 3000,
        });
      }

      setProducts(_products);
      setProductDialog(false);
      setProduct(emptyProduct);
    }
  };

  // const editProduct = (product) => {
  //   setProduct({ ...product });
  //   setProductDialog(true);
  // };

  const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteProductDialog(true);
  };

  const deleteProduct = async  () => {
    let _products = products.filter((val) => val.id !== product.id);
    setProducts(_products);
    setDeleteProductDialog(false);
    setProduct(emptyProduct);

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
      });
 */



     await fetchDelete(`empleado/${product.id}`)
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
    });





  };

  const listarDatosState = async () => {
    const response =  await fetchGet(`empleadosState/${selectedCity1?.name}`)
    setProducts(response.registroEmpleados);
  };

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < products.length; i++) {
      if (products[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const createId = () => {
    let id = '';
    let chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  };

  // const exportCSV = () => {
  //   dt.current.exportCSV();
  // };

/*   const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true);
  };
 */
  const deleteSelectedProducts = () => {
    let _products = products.filter((val) => !selectedProducts.includes(val));

    setProducts(_products);
    setDeleteProductsDialog(false);
    setSelectedProducts(null);
  };

  const onCategoryChange = (e) => {
    let _product = { ...product };
    _product['category'] = e.value;
    setProduct(_product);
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _product = { ...product };
    _product[`${name}`] = val;

    setProduct(_product);
  };

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _product = { ...product };
    _product[`${name}`] = val;

    setProduct(_product);
  };

  // const leftToolbarTemplate = () => {
  //   return (
  //     <React.Fragment>
  //       <div className='my-2'>
  //         <Button
  //           label='Nuevo'
  //           icon='pi pi-plus'
  //           className='p-button-success mr-2'
  //           onClick={openNew}
  //         />
  //         <Button
  //           label='Eliminar'
  //           icon='pi pi-trash'
  //           className='p-button-danger'
  //           onClick={confirmDeleteSelected}
  //           disabled={!selectedProducts || !selectedProducts.length}
  //         />
  //       </div>
  //     </React.Fragment>
  //   );
  // };
  

  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <FileUpload
          customUpload
          uploadHandler={readExcel}
          accept='.xlsx'
          mode='basic'
          maxFileSize={1000000}
          label='Import'
          chooseLabel='Importar Empleados'
          className='mr-2 inline-block'
        />
      </React.Fragment>
    );
  };

  const codeBodyTemplate = (rowData) => {
    return (
      <>
        <span className='p-column-title'>Codigo</span>
        {rowData.codigo}
      </>
    );
  };

  const nameBodyTemplate = (rowData) => {
    return (
      <>
        <span className='p-column-title'>Nombre</span>
        {rowData.nombre}
      </>
    );
  };

  const emailBodyTemplate = (rowData) => {
    return (
      <>
        <span className='p-column-title'>Email</span>
        {rowData.email}
      </>
    );
  };

  const telefonoBodyTemplate = (rowData) => {
    return (
      <>
        <span className='p-column-title'>Telefono</span>
        {rowData.phone}
      </>
    );
  };

  const cargoBodyTemplate = (rowData) => {
    return (
      <>
        <span className='p-column-title'>Cargo</span>
        {rowData.cargo}
      </>
    );
  };

  const statusOrderBodyTemplate = (rowData) => {
    return (
      <span
        className={`order-badge order-${rowData.activo ? 'activo' : 'cesado'}`}
      >
        {rowData.estado == true ? 'Activo' : 'Cesado'}
      </span>
    );
  };

  // const imageBodyTemplate = (rowData) => {
  //   return (
  //     <>
  //       <span className='p-column-title'>Image</span>

  //       <div className='p-multiselect-representative-option'>
  //         {/* <img alt={rowData.ndocumento} src={`assets/demo/images/employees/${rowData.ndocumento}.png`} width={50} style={{ verticalAlign: 'middle' }} /> */}
  //         <img
  //           alt={rowData.ndocumento}
  //           src={`assets/demo/images/employees/${rowData.ndocumento}.png`}
  //           onError={(e) =>
  //             (e.target.src = `assets/demo/images/employees/profile.png`)
  //           }
  //           width={50}
  //           style={{ verticalAlign: 'middle' }}
  //         />
  //       </div>
  //     </>
  //   );
  // };

  useEffect(() => {
    listarDatosState();
  }, [selectedCity1]);


  const actionBodyTemplate = (rowData) => {
    return (
      <div className='actions'>
        {/* <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} /> */}
      </div>
    );
  };

  const actionBodyTemplate2 = (rowData) => {
    return (
      <div className='actions'>
        <Button
          icon='pi pi-trash'
          className='p-button-rounded p-button-warning mt-2'
          onClick={() => confirmDeleteProduct(rowData)}
        />
      </div>
    );
  };

  const cities = [{ name: 'todos' }, { name: 'activo' }, { name: 'inactivo' }];

  const onCityChange = (e) => {
    setSelectedCity1(e.value);
  };
  console.log(globalFilter);
  const header = (
    <div  className={isDarkMode ?  'dark-mode-table  flex flex-column flex-md-row justify-content-md-between align-items-md-center' : 'flex flex-column flex-md-row justify-content-md-between align-items-md-center'  }>
      
      <h5 className='m-0'>Lista de Empleados</h5>
      <Dropdown
        id='state'
        value={selectedCity1}
        options={cities}
        onChange={onCityChange}
        optionLabel='name'
        placeholder='Seleccionar'
      />
      <span className='block mt-2 mt-md-0 p-input-icon-left'>
        <i className='pi pi-search' />
        <InputText
          type='search'
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder='Buscar...'
        />
      </span>
    </div>
  );

  const productDialogFooter = (
    <>
      <Button
        label='Cancel'
        icon='pi pi-times'
        className='p-button-text'
        onClick={hideDialog}
      />
      <Button
        label='Save'
        icon='pi pi-check'
        className='p-button-text'
        onClick={saveProduct}
      />
    </>
  );

  const deleteProductDialogFooter = (
    <>
      <Button
        label='No'
        icon='pi pi-times'
        className='p-button-text'
        onClick={hideDeleteProductDialog}
      />
      <Button
        label='Yes'
        icon='pi pi-check'
        className='p-button-text'
        onClick={deleteProduct}
      />
    </>
  );

  const deleteProductsDialogFooter = (
    <>
      <Button
        label='No'
        icon='pi pi-times'
        className='p-button-text'
        onClick={hideDeleteProductsDialog}
      />
      <Button
        label='Yes'
        icon='pi pi-check'
        className='p-button-text'
        onClick={deleteSelectedProducts}
      />
    </>
  );

  //   const representativeFilterTemplate = (options) => {
  //     return (
  //       <>
  //         <div className='mb-3 text-bold'>Agent Picker</div>
  //         <MultiSelect
  //           value={options.value}
  //           options={products}
  //           onChange={(e) => options.filterCallback(e.value)}
  //           optionLabel='name'
  //           placeholder='Any'
  //           className='p-column-filter'
  //           itemTemplate={representativesItemTemplate}
  //         />
  //       </>
  //     );
  //   };

  //   const representativesItemTemplate = (option) => {
  //     return (
  //       <div className='p-multiselect-representative-option'>
  //         <span
  //           style={{ marginLeft: '.5em', verticalAlign: 'middle' }}
  //           className='image-text'
  //         >
  //           {option.activo}
  //         </span>
  //       </div>
  //     );
  //   };

  return (
    <div className={isDarkMode ?  'dark-mode-table grid crud-demo' : 'grid crud-demo'  } >
      <div className='col-12'>
        <div className={isDarkMode ?  'dark-mode card' : 'card'  } >
          <Toast ref={toast} />
          <Toolbar
            className={isDarkMode ?  'dark-mode mb-4' : 'mb-4'  }
            // left={leftToolbarTemplate}
            right={rightToolbarTemplate}
          ></Toolbar>

          <DataTable
            ref={dt}
            value={products}
            loading={loading}
            selection={selectedProducts}
            onSelectionChange={(e) => setSelectedProducts(e.value)}
            dataKey='id'
            paginator
            rows={10}
            className='datatable-responsive'
            paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
            currentPageReportTemplate='Mostrando {first} a {last} de {totalRecords}'
            globalFilter={globalFilter}
            emptyMessage='No Data found.'
            header={header}
            responsiveLayout='scroll'
          >
            {/* <Column
              selectionMode='multiple'
              headerStyle={{ width: '3rem' }}
            ></Column> */}
            {/* <Column
              header='Image'
              body={imageBodyTemplate}
              headerStyle={{ width: '10%', minWidth: '7rem' }}
            ></Column> */}
            <Column
              field='codigo'
              header='Codigo'
              sortable
              body={codeBodyTemplate}
              headerStyle={{ width: '14%', minWidth: '10rem' }}
            ></Column>
            <Column
              field='docIdentidad'
              header='Doc. Identidad'
              sortable
              headerStyle={{ width: '14%', minWidth: '10rem' }}
            ></Column>
            <Column
              field='nombre'
              header='nombre'
              sortable
              body={nameBodyTemplate}
              filter
              filterPlaceholder='Buscar Por Nombre'
              headerStyle={{ width: '30%', minWidth: '20rem' }}
            ></Column>
            <Column
              field='email'
              header='Email'
              sortable
              body={emailBodyTemplate}
              headerStyle={{ width: '24%', minWidth: '20rem' }}
            ></Column>
            <Column
              field='phone'
              header='Telefono'
              sortable
              body={telefonoBodyTemplate}
              headerStyle={{ width: '14%', minWidth: '10rem' }}
            ></Column>
            <Column
              field='cargo'
              header='Cargo'
              sortable
              body={cargoBodyTemplate}
              headerStyle={{ width: '14%', minWidth: '10rem' }}
            ></Column>
            <Column
              field='activo'
              header='Status'
              body={statusOrderBodyTemplate}
              //   filterMenuStyle={{ width: '14rem' }}
              //   style={{ minWidth: '14rem' }}
              showFilterMatchModes={false}
              sortable
              //   filterElement={representativeFilterTemplate}
              //   filter
            ></Column>
            <Column body={actionBodyTemplate}></Column>
            <Column body={actionBodyTemplate2}></Column>
          </DataTable>

          <Dialog
            visible={productDialog}
            style={{ width: '450px' }}
            header='Product Details'
            modal
            className='p-fluid'
            footer={productDialogFooter}
            onHide={hideDialog}
          >
            {product.image && (
              <img
                src={`assets/demo/images/employees/${product.image}.png`}
                alt={product.image}
                width='150'
                className='mt-0 mx-auto mb-5 block shadow-2'
              />
            )}
            <div className='field'>
              <label htmlFor='name'>Name</label>
              <InputText
                id='name'
                value={product.name}
                onChange={(e) => onInputChange(e, 'name')}
                required
                autoFocus
                className={classNames({
                  'p-invalid': submitted && !product.name,
                })}
              />
              {submitted && !product.name && (
                <small className='p-invalid'>Name is required.</small>
              )}
            </div>
            <div className='field'>
              <label htmlFor='description'>Description</label>
              <InputTextarea
                id='description'
                value={product.description}
                onChange={(e) => onInputChange(e, 'description')}
                required
                rows={3}
                cols={20}
              />
            </div>

            <div className='field'>
              <label className='mb-3'>Category</label>
              <div className='formgrid grid'>
                <div className='field-radiobutton col-6'>
                  <RadioButton
                    inputId='category1'
                    name='category'
                    value='Accessories'
                    onChange={onCategoryChange}
                    checked={product.category === 'Accessories'}
                  />
                  <label htmlFor='category1'>Accessories</label>
                </div>
                <div className='field-radiobutton col-6'>
                  <RadioButton
                    inputId='category2'
                    name='category'
                    value='Clothing'
                    onChange={onCategoryChange}
                    checked={product.category === 'Clothing'}
                  />
                  <label htmlFor='category2'>Clothing</label>
                </div>
                <div className='field-radiobutton col-6'>
                  <RadioButton
                    inputId='category3'
                    name='category'
                    value='Electronics'
                    onChange={onCategoryChange}
                    checked={product.category === 'Electronics'}
                  />
                  <label htmlFor='category3'>Electronics</label>
                </div>
                <div className='field-radiobutton col-6'>
                  <RadioButton
                    inputId='category4'
                    name='category'
                    value='Fitness'
                    onChange={onCategoryChange}
                    checked={product.category === 'Fitness'}
                  />
                  <label htmlFor='category4'>Fitness</label>
                </div>
              </div>
            </div>

            <div className='formgrid grid'>
              <div className='field col'>
                <label htmlFor='price'>Price</label>
                <InputNumber
                  id='price'
                  value={product.price}
                  onValueChange={(e) => onInputNumberChange(e, 'price')}
                  mode='currency'
                  currency='USD'
                  locale='en-US'
                />
              </div>
              <div className='field col'>
                <label htmlFor='quantity'>Quantity</label>
                <InputNumber
                  id='quantity'
                  value={product.quantity}
                  onValueChange={(e) => onInputNumberChange(e, 'quantity')}
                  integeronly
                />
              </div>
            </div>
          </Dialog>

          <Dialog
            visible={deleteProductDialog}
            style={{ width: '450px' }}
            header='Confirm'
            modal
            footer={deleteProductDialogFooter}
            onHide={hideDeleteProductDialog}
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

          <Dialog
            visible={deleteProductsDialog}
            style={{ width: '450px' }}
            header='Confirm'
            modal
            footer={deleteProductsDialogFooter}
            onHide={hideDeleteProductsDialog}
          >
            <div className='flex align-items-center justify-content-center'>
              <i
                className='pi pi-exclamation-triangle mr-3'
                style={{ fontSize: '2rem' }}
              />
              {product && (
                <span>
                  Esta seguro que desea eliminar TODOS los registros
                  Seleccionados?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export { RegistroEmpleado };
