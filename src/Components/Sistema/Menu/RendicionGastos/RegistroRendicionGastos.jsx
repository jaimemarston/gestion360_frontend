import React, { useEffect, useRef, useState } from 'react';

import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'primereact/calendar';
import { Toolbar } from 'primereact/toolbar';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Row } from 'primereact/row';

import {getUser} from '../../../../utils/getUser';

import { ColumnGroup } from 'primereact/columngroup';
import { AutoComplete } from 'primereact/autocomplete';
import { fetchDelete, fetchGet, fetchPost, fetchGetproject } from '../../../../api';
import { useSelector } from 'react-redux';
import PDFRendicionGastos from './PDFRedicionGastos';
import ModalRendicionGastos from './modal/ModalRendicionGastos';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
const RegistroRendicionGastos = ({isDarkMode}) => {



  const [dataUser, setDataUser] = useState();
  const [lugares, setLugares] = useState([]);
  const { rendicionGastos } = useSelector((state) => state.rendicionGastos);
  const [edit] = useState(rendicionGastos);
  const [data, setData] = useState([]);
  const validaciones = Object.keys(data).length === 0;
  const [lugarCom, setLugarComision] = useState('');
  const [filteredLugarCom, setFilteredLugarCom] = useState(null);

  

  useEffect( () =>  {
    async function doIt(){

      const userData = await getUser();
      
      setDataUser(userData);

    
    }

    doIt();

  }, [])







  const [editProyect, setEditProyect] = useState();

 

  useEffect( () =>  {
    async function doIt(){

      if(edit?.proyecto){
      const proyecto = await fetchGet(`regProyecto/${edit.proyecto}`);
    
           
          setEditProyect(proyecto.registroProyecto)
      

      }

      if(edit){
      fetchGet(`comision/${edit?.lugarComision}`).then((res) => {
      
        setLugarComision(res.lugarComision.descripcion) 
        
         
      })

      setUuid(edit?.id);

          fetchGet(`rendGastos/${edit?.id}`).then( async ({ rendGastosProducts, total }) => {

     const promise = rendGastosProducts.productos.map(async (product) => {

      const tipo =  await fetchGet(`tipo-documento/${product.tipo}`)

/*       const ruc =  await fetchGet(`registroReferenciaAll/${product.ruc}`)

      console.log(product.ruc,'de nuevoi ruc')
   */

        const result = {...product, tipo: tipo.result?.nombre}

       
        return result;

      })

        Promise.all(promise).then((data) => {
          const productos = data.map((res) => {
            const fechaSplit = res.fecha.split('/')
            const fecha = fechaSplit[1] + '/' + fechaSplit[0] + '/' + fechaSplit[2];
            res.fecha = fecha;
            return res
          })
        rendGastosProducts.productos = productos;
     
        setDataRegistro(rendGastosProducts);
      })

     
     
      setCountRendido(total);
    });
      
      }

      if(isNaN(Number(edit?.recibido))){
        setCountRecibido(0)
      }else {
        setCountRecibido(edit?.recibido)  
      }

      
     
    }

    doIt();

  }, [edit])


  const validation = Object.keys(edit).length === 0;
  const [selectedLugar, setSelectedLugar] = useState(
    !validaciones ? lugarCom : edit?.lugarComision
  );

  const toast = useRef(null);
  const [ dataRegistro, setDataRegistro] = useState([]);
  // const [countTotal, setCountTotal] = useState(0);
  // const [total, setTotal] = useState(0);
  const [countSaldo, setCountSaldo] = useState(0);
  const [countRecibido, setCountRecibido] = useState(0);
  const [countRendido, setCountRendido] = useState(0);
  
  const [uuid, setUuid] = useState(!validaciones ? edit.id : null);
  const [boolCreate, setBoolCreate] = useState(false);
  const [view, setView] = useState(false);
  const navigate = useNavigate();
  const [editProduct, setEditProduct] = useState();
  const [countries, setCountries] = useState([]);
  const [selectedCountry1, setSelectedCountry1] = useState('');
  const [filteredCountries, setFilteredCountries] = useState(null);

  const [proyectos, setProyectos] = useState([]);
  
  const [selectedProyecto, setSelectedProyecto] = useState(
    !validaciones ? edit.proyecto : null
  );
  
  const [filteredProyecto, setFilteredProyecto] = useState(null);



  const [dataLista, setDataLista] = useState({
    nombreProyecto: null,
    nameState: false,
    numeroSolicitud: rendicionGastos ? rendicionGastos.numeroRendicion : null,
  });

  const [proyecto, setProyecto] = useState([]);

 

  const searchLugares = (event) => {
    setTimeout(() => {
      let _filteredCountries;
      if (!event.query.trim().length) {
        _filteredCountries = [...lugares];
      } else {
        _filteredCountries = lugares.filter((country) =>
          country.descripcion
            .toLowerCase()
            .startsWith(event.query.toLowerCase())
        );
      }
      setFilteredLugarCom(_filteredCountries);
    }, 250);
  };

  const listData = async() => {
    const user = await getUser()
    fetchGet(`solicitud/user/${user?.id}`).then(({ personal }) => {
      const data = personal.map((element, item) => {
        return element;
      });
      setCountries(data);
    });
    fetchGet('comisionAll').then(({ comisiones }) => {
      const data = comisiones.map((element, item) => element);
     
      setLugares(data);
    });

  };

  const listProject = () => {


    fetchGet(`regProyectoAll`).then(({ registroProyecto }) => {
      const data = registroProyecto.map((element) => {
        return element;
      });
      setProyectos(data);
    });
  };

  const handleClickRetornar = () => {
    navigate('/rendicion-gastos');
  };

  const handleClickProduct = () => {
    setEditProduct('')
    setView(!view);
  };


  useEffect( () => {

  
    
/*       async function project() {
          const project = await fetchGetproject(selectedCountry1.nombreProyecto)
          setProyecto(project)
          
         
        }*/

       const obj = {registroProyecto: selectedProyecto}
        setProyecto(obj)

        console.log(obj)
 

  }, [selectedProyecto]);


  const deleteData = (data) => {
    fetchDelete(`rendGastosProducts/${data.id}`).then(() => {
      listaSolicitudDinero();
      toast.current.show({
        severity: 'success',
        summary: 'Eliminado',
        detail: 'El producto se ha eliminado correctamente',
        life: 3000,
      });
    });
  };

  const confirm1 = (id) => {
    console.log("sss")
    confirmDialog({
      message: 'Esta seguro que desea eliminar?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => deleteData(id),
    });
  };


  const tableButtonDelete = (rowData) => {
    return (
      <div className='actions'>
        <Button
          icon='pi pi-trash'
          className='p-button-rounded p-button-danger'
          onClick={() => confirm1(rowData)}
        />
      </div>
    );
  };

  const tableButtonEdit = (rowData) => {
    return (
      <div className='actions'>
        <Button
          icon='pi pi-pencil'
          className='p-button-rounded p-button-warning'
          onClick={() => editData(rowData)}
        />
      </div>
    );
  };


  const editData = (data) => {
    setEditProduct(data);
   /* setViewProduct(!viewProduct); */

    setView(!view);
   
    
  };

  const listaSolicitudDinero = async() => {
    fetchGet(`rendGastos/${uuid}`).then( async ({ rendGastosProducts, total }) => {

     const promise = rendGastosProducts.productos.map(async (product) => {

      const tipo =  await fetchGet(`tipo-documento/${product.tipo}`)

/*       const ruc =  await fetchGet(`registroReferenciaAll/${product.ruc}`)

    console.log(ruc,'RUC')
 */
        const result = {...product, tipo: tipo.result?.nombre}

        return result;

      })

        Promise.all(promise).then((data) => {
        rendGastosProducts.productos = data;
     
        setDataRegistro(rendGastosProducts);
      })

     
      console.log(rendGastosProducts,'ijdfpodspkmfdspmlk')
      setCountRecibido(rendGastosProducts.recibido);
      setCountRendido(total);
    });
  };

  let headerGroup = (
    <ColumnGroup>
      <Row>
        <Column header='Documento' colSpan={5} />
        <Column
          header='Descripción'
          field='descripcion'
          // alignHeader='center'
          style={{ width: '150px' }}
        />
        <Column
          header='Actividad'
          field='actividad'
          // alignHeader='center'
          style={{ width: '120px' }}
        />
        <Column
          header='Importe'
          field='importe'
          style={{
            width: '110px',
          }}
          // alignHeader='center'
          // colSpan={5}
        />
      </Row>
      <Row>
        <Column
          header='Fecha'
          style={{ width: '70px' }}
          sortable
          // alignHeader='center'
          field='fecha'
        />
        <Column
          header='Tipo'
          style={{ width: '90px' }}
          sortable
          // alignHeader='center'
          field='tipo'
        />
        <Column
          header='Serie'
          style={{ width: '90px' }}
          sortable
          // alignHeader='center'
          field='serie'
        />
        <Column
          header='Numero'
          style={{ width: '90px' }}
          sortable
          // alignHeader='center'
          field='numero'
        />

        <Column
          header='RUC'
          style={{ width: '90px' }}
          sortable
          // alignHeader='center'
          field='ruc'
        />
      </Row>
    </ColumnGroup>
  );

  const searchProject = (event) => {
    setTimeout(() => {
      let _filteredCountries;
      if (!event.query.trim().length) {
        _filteredCountries = [...countries];
      } else {
        _filteredCountries = countries.filter((country) => {
          
          return country.numeroSolicitud
            .toLowerCase()
            .startsWith(event.query.toLowerCase());
        });
      }
      setFilteredCountries(_filteredCountries);
    }, 250);
  };

  const searchProyecto = (event) => {
    setTimeout(() => {
      let _filteredCountries;
      if (!event.query.trim().length) {
        _filteredCountries = [...proyectos];
      } else {
        _filteredCountries = proyectos.filter((country) => {
          return country.nombreAbreviado
            .toLowerCase()
            .startsWith(event.query.toLowerCase());
        });
      }

      setFilteredProyecto(_filteredCountries);
    }, 200);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      proyecto: '',
      nombreApellido: '',
      lugarComision: '',
      objetoComision: '',
      fechaInicio: null,
      fechaFin: null,
    },
    onSubmit: (values) => {

      console.log(data)

      /* fetchGet(`regProyectos/${}`) */


      values.nombreApellido = data.nombre;
      values.lugarComision = data.lugarComision;
      values.objetoComision = data.objetoComision;
      values.fechaInicio = data.fechaInicio;
      values.fechaFin = data.fechaFin;
      values.proyecto = data.nombreProyecto;
      values.recibido = Number(countRecibido).toFixed(2)
    
     /*  console.log(values) */
      // values.recibido = countRecibido.toString();
      
    /*   registreAdd(values); */
      console.log('edit', edit)
    if(Object.keys(edit).length === 0){
      registreAdd(values);
    } else {
      registreUpdate(values)
    }
    },
    validationSchema: Yup.object({
      // lugarComision: Yup.string().required('El lugar de comisión es requerido'),
      // objetoComision: Yup.string().required('El itinerario es requerido'),
      // fechaInicio: Yup.string().required('La fecha de inicio es requerido'),
      // fechaFin: Yup.string().required('La fecha de fin es requerido'),
    }),
  });
  const registreAdd = (values) => {
    fetchPost('rendGastos', 'POST', values).then((response) => {
      if (response.rendicionGastos) {
        setDataLista({
          numeroSolicitud: response.rendicionGastos
            ? response.rendicionGastos.numeroRendicion
            : '',
        });
        setUuid(response.rendicionGastos.id);

        setBoolCreate(true);
        toast.current.show({
          severity: 'success',
          summary: 'Creado',
          detail: 'Se ha creado correctamente',
          life: 3000,
        });
      } else {
        toast.current.show({
          severity: 'warn',
          summary: 'Hubo un error',
          detail: `${response.message}`,
          life: 3000,
        });
      }
    });
  };

  const registreUpdate = (values) => {
    fetchPost(`rendGastos/${edit?.id}`, 'PUT', values).then((response) => {
      if (response.rendicionGastos) {
        setDataLista({
          numeroSolicitud: response.rendicionGastos
            ? response.rendicionGastos.numeroRendicion
            : '',
        });
        setUuid(response.rendicionGastos.id);

        setBoolCreate(true);
        toast.current.show({
          severity: 'success',
          summary: 'Creado',
          detail: 'Se ha creado correctamente',
          life: 3000,
        });
      } else {
        toast.current.show({
          severity: 'warn',
          summary: 'Hubo un error',
          detail: `${response.message}`,
          life: 3000,
        });
      }
    });
  };


  const sumRecibido = () => {
    console.log(selectedCountry1, 'country')
    if (!validaciones && selectedCountry1?.solicitud_productos?.length > 0) {
      const suma = selectedCountry1.solicitud_productos
        .map((item) => {
          let variable = Number(item.importe);
          return variable;
        })
        .reduce((prev, curr) => prev + curr, 0);

        
      setCountRecibido(suma);
    } else {
      setCountRecibido(0);
    }
  };

  useEffect(() => {
    if (uuid) {
      listaSolicitudDinero();
    }
    listData();
    listProject();
    const suma1 = Number(countRecibido);
    const suma2 = Number(countRendido);
    const resultado = suma1 + suma2;



   setCountSaldo(resultado);
   
  }, []);


  useEffect(() => {

    console.log(countSaldo)
      
 /*    setCountSaldo(countSaldo); */
   }, [countSaldo])

  useEffect( () => {

    setData(selectedCountry1);

    console.log(selectedCountry1,'data')
    
      async function project() {
          const project = await fetchGetproject(selectedCountry1.nombreProyecto)
          setProyecto(project)
          
         
        }

        async function lugar() {
          const lugar = await fetchGet(`comision/${selectedCountry1.lugarComision}`)
          console.log('res', lugar)
          setLugarComision(lugar.lugarComision)
          
         
        }  
        project()
        lugar()
 
    sumRecibido();
  }, [selectedCountry1]);

  useEffect(() => {
    sumRecibido();
  }, [data]);

  return (
    <div className={isDarkMode ?  'dark-mode-table grid crud-demo' : 'grid crud-demo'  }>
      <Toast ref={toast} />
      <ConfirmDialog />
      <div className={isDarkMode ?  'dark-mode col-12' : 'col-12'  }>
        <div className={isDarkMode ?  'dark-mode card' : 'card'  }>
          <Toolbar className={isDarkMode ?  'dark-mode mb-4' : 'mb-4'  } right={<PDFRendicionGastos rendidoCount={countRendido} />}></Toolbar>

          <form onSubmit={formik.handleSubmit} noValidate>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h4>Rendicion Gastos</h4>
              <div>

                {/* TODO hacer funcionar el buscador */}
                <AutoComplete
                  value={selectedCountry1}
                  suggestions={filteredCountries}
                  completeMethod={searchProject}
                  field='numeroSolicitud'
                  name='numeroSolicitud'
                  onChange={(e) => {
                    setSelectedCountry1(e.value);
                  }}
                  dropdown
                  aria-label='nombreProyecto'
                  dropdownAriaLabel='Seleccionar Proyecto'
                  disabled={boolCreate}
                />
              </div>
            </div>

            <div className='p-fluid formgrid grid'>
              <div className='field col-12 col-md-6'>
                <label htmlFor='numeroSolicitud' className='block'>
                  N.de Rendicion
                </label>
{/*                 <InputText
                  name='numeroSolicitud'
                  type='text'
                  value={
                    dataLista ? dataLista.numeroSolicitud : ''
                  }
                  disabled
                /> */}
                <h5>{
                    dataLista ? dataLista.numeroSolicitud : ''
                  }
                  </h5>
              </div>

              <div className='field col-12 col-md-6'>
                <label htmlFor='proyecto' className='block'>
                  Proyecto
                </label>
                <AutoComplete
         /*          value={selectedProyecto} */

                 /*  vaue={proyecto ? proyecto?.registroProyecto?.nombreAbreviado: selectedProyecto } */
                 value={proyecto?.registroProyecto?.nombreAbreviado ? proyecto?.registroProyecto?.nombreAbreviado : editProyect?.nombreAbreviado }
                  
                  suggestions={filteredProyecto}
                  completeMethod={searchProyecto}
                  field='nombreAbreviado'
                  name='proyecto'
                  id='proyecto'
                  onChange={(e) => {
                    setSelectedProyecto(e.value);
                  }}
                  dropdown
                  aria-label='nombreAbreviado'
                  dropdownAriaLabel='Seleccionar Proyect'
                  disabled={true}
                />
              </div>
              <div className='field col-12 col-md-12'>
                <label htmlFor='nombreApellido' className='block'>
                  Nombre y apellidos
                </label>

                <InputText
                  id='nombreApellido'
                  name='nombreApellido'
                  // onBlur={formik.handleBlur}
                  // onChange={formik.handleChange}
                  style={{ marginBottom: '5px' }}
                  type='text'
                  value={
                    !validaciones
                      ? data.nombre
                      : !validation
                      ? edit.nombreApellido
                      : ''
                  }
                  disabled
                />
              </div>

              <div className='field col-12 col-md-6'>
                <label htmlFor='lugarComision' className='block'>
                  Lugar Comisión
                </label>
                <AutoComplete
                  id='lugarComision'
                  value={lugarCom ? lugarCom : selectedLugar}
                  suggestions={filteredLugarCom}
                  completeMethod={searchLugares}
                  field='descripcion'
                  name='lugarComision'
                  onChange={(e) => {
                    setSelectedLugar(e.value);
                    if (selectedLugar && !lugarCom) {
                      setSelectedLugar(e.value);
                      console.log('aqui 1')
                      dataLista.lugarComision = e.value.id;
                    }

                    if(!selectedLugar && lugarCom){
                      console.log('aqui 2')
                      setLugarComision(e.value);
                      dataLista.lugarComision = e.value.id;
                    }
                  }}
                  dropdown
                  aria-label='nombreProyecto'
                  dropdownAriaLabel='Seleccionar Lugar Comision'
                  disabled={true}
                />
{/*                 <InputText
                  name='lugarComision'
                  type='text'
                  value={
                    !validaciones
                      ? data?.lugarComision
                      : !validation
                      ? edit.lugarComision
                      : ''
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={{ marginBottom: '5px' }}
                  disabled={boolCreate}
                /> */}
                {formik.touched.lugarComision &&
                  formik.errors.lugarComision && (
                    <span style={{ color: '#e5432d' }}>
                      {formik.errors.lugarComision}
                    </span>
                  )}
              </div>
              <div className='field col-12 col-md-6'>
                <label htmlFor='objetoComision' className='block'>
                  Objeto de la Comisión
                </label>
                <InputText
                  name='objetoComision'
                  type='text'
                  value={
                    !validaciones
                    ? data?.objetoComision
                      : !validation
                      ? edit.objetoComision
                      : ''
                  }

                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={{ marginBottom: '5px' }}
                  disabled={true}
                />
                {formik.touched.objetoComision &&
                  formik.errors.objetoComision && (
                    <span style={{ color: '#e5432d' }}>
                      {formik.errors.objetoComision}
                    </span>
                  )}
              </div>
              <div className='field col-12 col-md-6'>
                <label htmlFor='fechaInicio'>Fecha inicio</label>
                <Calendar
         
                  value={
                    !validaciones
                      ? new Date(data?.fechaInicio)
                      : new Date(edit?.fechaInicio)
                  }
                  dateFormat="dd/mm/yy"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={{ marginBottom: '5px' }}
                  name='fechaInicio'
                  disabled={true}
                  showIcon
                  
                ></Calendar>
                {formik.touched.fechaInicio && formik.errors.fechaInicio && (
                  <span style={{ color: '#e5432d' }}>
                    {formik.errors.fechaInicio}
                  </span>
                )}
              </div>
              <div className='field col-12 col-md-6'>
                <label htmlFor='fechaFin'>Fecha fin</label>
                <Calendar
               
                  value={
                    !validaciones
                      ? new Date(data?.fechaFin)
                      : new Date(edit?.fechaFin)
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={{ marginBottom: '5px' }}
                  name='fechaFin'
                  showIcon
                  disabled={true}
                  dateFormat="dd/mm/yy"
                >
                  
                </Calendar>
                {formik.touched.fechaFin && formik.errors.fechaFin && (
                  <span style={{ color: '#e5432d' }}>
                    {formik.errors.fechaFin}
                  </span>
                )}
              </div>
            </div>
            <h4>Resumen de la rendición de las cuentas</h4>
            <div className='p-fluid formgrid grid'>
              <div className='field col-12 col-md-4'>
                <label htmlFor='recibido' className='block'>
                  Recibido $/
                </label>
                <InputText
                  name='recibido'
                  type='text'
                  value={Number(countRecibido).toFixed(2)}
                  style={{ marginBottom: '5px' }}
                  disabled
                />
              </div>
              <div className='field col-12 col-md-4'>
                <label htmlFor='rendido' className='block'>
                  Rendido $/
                </label>
                <InputText
                  name='rendido'
                  type='text'
                  disabled
                  value={countRendido.toFixed(2)}
                  style={{ marginBottom: '5px' }}
                />
              </div>
              <div className='field col-12 col-md-4'>
                <label htmlFor='saldo' className='block'>
                  Saldo $/
                </label>
                <InputText
                  name='saldo'
                  type='text'
                  disabled
                  value={countSaldo ? (Number(countRecibido)+ Number(countRendido)).toFixed(2) :    (Number(countRecibido)+ Number(countRendido)).toFixed(2)}
                  style={{ marginBottom: '5px' }}
                />
              </div>
            </div>
            <h4>
              RELACIÓN DETALLADA DE LOS DOCUMENTOS RENDIDOS (Detallar por
              separado cada gasto de hospedaje, alimentación, movilidad local,
              pasajes y gastos de transporte, otros)
            </h4>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginBottom: '15px',
              }}
            >
              <Button
                style={{ width: '100px', marginLeft: '20px' }}
                label='Retornar'
                onClick={handleClickRetornar}
              />
              <Button
                style={{ width: '100px', marginLeft: '20px' }}
                label='Guardar'
                type='submit'
              />
            </div>
          </form>
          {/*  */}
          <hr />
          {/*  */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              margin: '5px 0px',
            }}
          >
            <Button
              icon='pi pi-plus'
              className='p-button-success'
              style={{ width: '120px' }}
              label='Crear rendición'
              onClick={handleClickProduct}
            />
          </div>

          <DataTable
            value={dataRegistro.productos}
           /*  headerColumnGroup={headerGroup} */
            responsiveLayout='scroll'
          >
            {/* <Column field='id' header='Item'></Column> */}
            <Column field='fecha' header='Fecha'></Column>
            <Column field='serie' header='Serie'></Column>
            <Column field='numero' header='Numero'></Column>
            <Column field='tipo' header='Tipo'></Column>
            <Column field='ruc' header='Ruc'></Column>
            <Column field='descripcion' header='Descripción'></Column>
            <Column field='partidaPresupuestal' header='Actividad'></Column>
            <Column field='importe' header='Importe'></Column>
            <Column body={tableButtonEdit} style={{ width: '20px' }}></Column>
            <Column body={tableButtonDelete} style={{ width: '20px' }}></Column>
          </DataTable>
          {view && (
            <ModalRendicionGastos
              view={view}
              setView={setView}
              uuid={uuid}
              edit={editProduct}
              listaSolicitudDinero={listaSolicitudDinero}
            />
          )}
          {/* <ModalCreacionProducto
            viewProduct={viewProduct}
            setViewProduct={setViewProduct}
            uuid={uuid}
            listaSolicitudDinero={listaSolicitudDinero}
          /> */}

          <hr />
        </div>
      </div>
    </div>
  );
};

export default RegistroRendicionGastos;
