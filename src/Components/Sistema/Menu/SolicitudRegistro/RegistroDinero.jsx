import React, { useEffect, useRef, useState } from 'react';

import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'primereact/calendar';
import { AutoComplete } from 'primereact/autocomplete';
import { Toolbar } from 'primereact/toolbar';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { getUser } from "../../../../utils/getUser";
import { useSelector } from 'react-redux';
import ModalCreacionProducto from './modal/ModalCreacionProducto';
import { fetchDelete, fetchGet, fetchPost, fetchPut } from '../../../../api';


import PDFSolicitud from './PDFSolicitud';

function RegistroDinero({isDarkMode}) {
  const { solicitud, isEditSolicitud } = useSelector(
    (state) => state.solicitudDinero
  );
  const [edit, setEdit] = useState(solicitud);
  
  const [editProduct, setEditProduct] = useState();
  

  const validaciones = Object.keys(edit).length === 0;
  const toast = useRef(null);
  const [dataRegistro, setDataRegistro] = useState([]);
  const [totales, setTotal] = useState(0);
  const [uuid, setUuid] = useState(!validaciones ? edit.id : null);
  const [boolCreate, setBoolCreate] = useState(false);
  const [viewProduct, setViewProduct] = useState(false);
  const navigate = useNavigate();

  const [countries, setCountries] = useState([]);
  const [lugares, setLugares] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState(null);
  const [filteredLugarCom, setFilteredLugarCom] = useState(null);
  const [project, setProject] = useState({});
  const [lugarCom, setLugarComision] = useState('');
  const [selectedCountry1, setSelectedCountry1] = useState(
  
    !validaciones ? project : edit?.registroProyecto 
  );

  const [date, setDate] = useState(new Date());

  const handleDateChange = (date) => {
    setDate(date);
  };

  useEffect(() => {

  
    if(edit?.nombreProyecto) {
      fetchGet(`regProyecto/${edit?.nombreProyecto}`).then((res) => {
      
      
        setProject(res.registroProyecto)
        setSelectedCountry1(res.registroProyecto)
    
    
         
      })
    }

    if(edit?.lugarComision){
      fetchGet(`comision/${edit?.lugarComision}`).then((res) => {
      
        setLugarComision(res.lugarComision) 
        
         
      })
     
    }



    
  }, [edit])
 


  const [selectedLugar, setSelectedLugar] = useState(
  
    !validaciones ? lugarCom : edit?.lugarComision
  );

  const [dataLista, setDataLista] = useState({
    nombreProyecto: null,
    nameState: false,
    numeroSolicitud: solicitud ? solicitud.numeroSolicitud : null,
  });

  const listData = () => {
    fetchGet('regProyectoAll').then(({ registroProyecto }) => {
      const data = registroProyecto.map((element, item) => element);
      setCountries(data);
    });


    fetchGet('comisionAll').then(({ comisiones }) => {
      const data = comisiones.map((element, item) => element);
   
      setLugares(data);
    });



  };

  const handleClickRetornar = () => {
    navigate('/solicitud-dinero');
  };

  const handleClickProduct = () => {

    setEditProduct('')
    setViewProduct(!viewProduct);
  };

  const deleteData = (data) => {
    fetchDelete(`solicitudProducto/${data.id}`).then(() => {
      listaSolicitudDinero();
      toast.current.show({
        severity: 'success',
        summary: 'Eliminado',
        detail: 'El producto se ha eliminado correctamente',
        life: 3000,
      });
    });
  };

  const [dataUser, setDataUser] = useState();

  useEffect( () =>  {
    async function doIt(){

      const userData = await getUser();
      
      setDataUser(userData);

    
    }

    doIt();

  }, [])

  const tableButtonDelete = (rowData) => (
    <div className='actions'>
      <Button
        icon='pi pi-trash'
        className='p-button-rounded p-button-danger'
        onClick={() => deleteData(rowData)}
      />
    </div>
  );


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
    setViewProduct(!viewProduct);
   
    
  };

  const registreAdd = (values) => {
    fetchPost('solicitud', 'POST', values).then((response) => {
      if (response.personal) {
        setDataLista({
          numeroSolicitud: response.personal
            ? response.personal.numeroSolicitud
            : '',
        });
        setUuid(response.personal.id);
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

  const editAdd = (values) => {
    console.log(values)
    fetchPut(`solicitud/${edit.id}`, 'PUT', values).then((response) => {
   
      if (response.personal) {
        toast.current.show({
          severity: 'success',
          summary: 'Actualizado',
          detail: 'Se ha actualizado correctamente',
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

  const listaSolicitudDinero = () => {
    fetchGet(`solicitud/${uuid}`).then(({ personal, total }) => {
      setDataRegistro(personal);
      setTotal(total);
    });
  };

  const searchProject = (event) => {
    setTimeout(() => {
      let _filteredCountries;
      if (!event.query.trim().length) {
        _filteredCountries = [...countries];
      } else {
        _filteredCountries = countries.filter((country) =>
          country.nombreAbreviado
            .toLowerCase()
            .startsWith(event.query.toLowerCase())
        );
      }
      setFilteredCountries(_filteredCountries);
    }, 250);
  };


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

  const formik = useFormik({
    initialValues: {
      fechaFin: !validaciones ? new Date(edit.fechaFin)  : null,
      fechaInicio: !validaciones ? edit.fechaInicio : null,
      fechaRegistro: !validaciones ?  edit.fechaRegistro : null,
      itinerarioTransporte: !validaciones ? edit.itinerarioTransporte : '',
    
      nombre: !validaciones ? edit.nombre : '',
     
      // nombreProyecto: !validaciones ? edit.nombreProyecto : '',
      objetoComision: !validaciones ? edit.objetoComision : '',
    },
    onSubmit: (values) => {

      values.lugarComision = lugarCom.id;
      values.nombreProyecto = Number(selectedCountry1.id)

      values.registroProyectoId = Number(selectedCountry1.id) 
   
      values.user_id = dataUser?.id ;

      if (validaciones) {
        registreAdd(values);
      } else {
        editAdd(values);
      }
    },
    validationSchema: Yup.object({
      fechaFin: Yup.string().required('La fecha de fin es requerido'),
      fechaInicio: Yup.string().required('La fecha de inicio es requerido'),
      fechaRegistro: Yup.string().required('La fecha de registro es requerido'),
      itinerarioTransporte: Yup.string('Solo se ingresa letras').required(
        'El itinerario es requerido'
      ),
/*       lugarComision: Yup.string('Solo se aceptan letras').required(
        'El lugar de comisión es requerido'
      ), */
      nombre: Yup.string().required('El nombre es requerido'),
      // nombreProyecto: Yup.string().required('El nombre es requerido'),
      objetoComision: Yup.string('Solo se ingresa letras').required(
        'El objeto es requerido'
      ),
    }),
  });



  useEffect(() => {
    if (uuid) {
      listaSolicitudDinero();
    }
    listData();
  }, []);

  return (
    <div className={isDarkMode ?  'dark-mode-table grid crud-demo' : 'grid crud-demo'  }>
      <Toast ref={toast} />

      <div className={isDarkMode ?  'dark-mode col-12' : 'col-12'  }>
        <div className={isDarkMode ?  'dark-mode card' : 'card'  }>
          <Toolbar className={isDarkMode ?  'dark-mode mb-4' : 'mb-4'  } right={<PDFSolicitud />} />

          <form onSubmit={formik.handleSubmit} noValidate>
            <h4>Datos de la solicitud</h4>

            <div className='p-fluid formgrid grid'>
              <div className='field col-12 col-md-6'>
                <label htmlFor='numeroSolicitud' className='block'>
                  N. solicitud
                </label>
{/*                 <InputText
                  disabled
                  id='numeroSolicitud'
                  name='numeroSolicitud'
                  type='text'
                  value={dataLista ? dataLista.numeroSolicitud : ''}
                /> */}
                <h5>{dataLista ? dataLista.numeroSolicitud : ''}</h5>
              </div>
              <div className='field col-12 col-md-6'>
                <label htmlFor='fechaRegistro'>Fecha Registro</label>
                <Calendar
                dateFormat="dd/mm/yy"
                
                scrollableYearDropdown
                yearDropdownItemNumber={15}
                showMonthDropdown
                  disabled={boolCreate}
                  id='fechaRegistro'
                  name='fechaRegistro'
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  style={{ marginBottom: '5px' }}
                  value={formik.values.fechaRegistro  !== null ? new Date(formik.values.fechaRegistro) : null }
                  showIcon
                  
                />
                {formik.touched.fechaRegistro &&
                  formik.errors.fechaRegistro && (
                    <span style={{ color: '#e5432d' }}>
                      {formik.errors.fechaRegistro}
                    </span>
                  )}
              </div>
              <div className='field col-12 col-md-12'>
                <label htmlFor='nombre' className='block'>
                  Nombre
                </label>
                <InputText
                  disabled={boolCreate}
                  id='nombre'
                  name='nombre'
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  style={{ marginBottom: '5px' }}
                  type='text'
                  value={formik.values.nombre}
                  
                />
                {formik.touched.nombre && formik.errors.nombre && (
                  <span style={{ color: '#e5432d' }}>
                    {formik.errors.nombre}
                  </span>
                )}
              </div>
            </div>
            <h4>Información del proyecto</h4>
            <div className='p-fluid formgrid grid'>
              <div className='field col-12 col-md-6'>
                <label htmlFor='nombreProyecto' className='block'>
                  Nombre del proyecto`
                </label>
                <AutoComplete
                  id='nombreProyecto'
                  value={ selectedCountry1}
                  suggestions={filteredCountries}
                  completeMethod={searchProject}
                  field='nombreAbreviado'
                  name='nombreProyecto'
                  onChange={(e) => {
                    setSelectedCountry1(e.value);
                    if (selectedCountry1 && !project) {
                      setSelectedCountry1(e.value);
                      dataLista.nombreProyecto = e.value.id;
                    }

                    if(!selectedCountry1 && project){
                      setProject(e.value);
                      dataLista.nombreProyecto = e.value.id;
                    }
                  }}
                  dropdown
                  aria-label='nombreProyecto'
                  dropdownAriaLabel='Seleccionar Proyecto'
                  disabled={boolCreate}
                />
                {/* {formik.touched.nombreProyecto &&
                  formik.errors.nombreProyecto && (
                    <span style={{ color: '#e5432d' }}>
                      {formik.errors.nombreProyecto}
                    </span>
                  )} */}
                {/* {selectedCountry1 === undefined || selectedCountry1 === null ? (
                  <span style={{ color: 'rgb(229, 67, 45)' }}>
                    El nombre del proyecto es requerido
                  </span>
                ) : (
                  ''
                )} */}
              </div>
              <div className='field col-12 col-md-6'>
                <label htmlFor='lugarComision' className='block'>
                  Lugar comisión
                </label>
                <AutoComplete
                  id='lugarComision'
                  value={lugarCom }
                  suggestions={filteredLugarCom}
                  completeMethod={searchLugares}
                  field='descripcion'
                  name='lugarComision'
                  onChange={(e) => {
                    setLugarComision(e.value);
/*                     if (selectedLugar && !lugarCom) {
                      setLugarComision(e.value);
                     
                      dataLista.lugarComision = e.value.id; 
                    } */

/*                     if(!selectedLugar && lugarCom){
                  
                      setLugarComision(e.value);
                      dataLista.lugarComision = e.value.id;
                    } */
                  }}
                  dropdown
                  aria-label='nombreProyecto'
                  dropdownAriaLabel='Seleccionar Lugar Comision'
                  disabled={boolCreate}
                />
{/*                 <InputText
                  disabled={boolCreate}
                  name='lugarComision'
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  style={{ marginBottom: '5px' }}
                  type='text'
                  value={formik.values.lugarComision}
                />*/}
                {formik.touched.lugarComision &&
                  formik.errors.lugarComision && (
                    <span style={{ color: '#e5432d' }}>
                      {formik.errors.lugarComision}
                    </span>
                  )} 
              </div>
              <div className='field col-12 col-md-6'>
                <label htmlFor='itinerarioTransporte' className='block'>
                  Itinerario de transporte
                </label>
                <InputText
                  disabled={boolCreate}
                  name='itinerarioTransporte'
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  style={{ marginBottom: '5px' }}
                  type='text'
                  value={formik.values.itinerarioTransporte}
                />
                {formik.touched.itinerarioTransporte &&
                  formik.errors.itinerarioTransporte && (
                    <span style={{ color: '#e5432d' }}>
                      {formik.errors.itinerarioTransporte}
                    </span>
                  )}
              </div>
              <div className='field col-12 col-md-6'>
                <label htmlFor='objetoComision' className='block'>
                  Objeto de la comisión
                </label>
                <InputText
                  disabled={boolCreate}
                  name='objetoComision'
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  style={{ marginBottom: '5px' }}
                  type='text'
                  value={formik.values.objetoComision}
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
                dateFormat="dd/mm/yy"
                  disabled={boolCreate}
                  name='fechaInicio'
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  style={{ marginBottom: '5px' }}
                 
                  value={formik.values.fechaInicio  !== null ? new Date(formik.values.fechaInicio) : null }
                  showIcon
                />
                {formik.touched.fechaInicio && formik.errors.fechaInicio && (
                  <span style={{ color: '#e5432d' }}>
                    {formik.errors.fechaInicio}
                  </span>
                )}
              </div>
              <div className='field col-12 col-md-6'>
                <label htmlFor='fechaFin'>Fecha fin</label>
                <Calendar
                dateFormat="dd/mm/yy"
                  disabled={boolCreate}
                  name='fechaFin'
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  style={{ marginBottom: '5px' }}
                  
                  value={formik.values.fechaFin  !== null ? new Date(formik.values.fechaFin) : null }
                  showIcon
                />
                {formik.touched.fechaFin && formik.errors.fechaFin && (
                  <span style={{ color: '#e5432d' }}>
                    {formik.errors.fechaFin}
                  </span>
                )}
              </div>
            </div>
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
                label={isEditSolicitud ? 'Guardar' : 'Guardar'}
                type='submit'
                // disabled={!!dataLista.numeroSolicitud}
              />
            </div>
          </form>

          <hr />

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
              label='Agregar ITEM'
              onClick={handleClickProduct}
            />
          </div>

          <DataTable value={dataRegistro.productos} responsiveLayout='scroll'>
            <Column field='id' header='Item' />
            <Column field='descripcion' header='Descripción' />
            <Column field='partidaPresupuestal' header='Partida Presupuestal' />
            <Column field='importe' header='Importe' />
            <Column body={tableButtonEdit} />
            <Column body={tableButtonDelete} />
          </DataTable>

          <div>
            <button
              style={{
                border: '0px',
                padding: '5px',
                width: '445px',
                height: '30px',
                color: '#fff',
                backgroundColor: '#fff',
              }}
              className={isDarkMode ?  'dark-mode ' : ''  }
              disabled
            />
            <button
              style={{
                border: '0px',
                padding: '5px',
                width: '200px',
                color: '#575D63',
              }}
              disabled
            >
              Total $/
            </button>
            <button
              style={{
                border: '0px',
                padding: '5px',
                width: '200px',
                backgroundColor: '#ececec',
                color: '#575D63',
              }}
             
              disabled
            >
              {totales.toFixed(2)}
            </button>
          </div>
          {viewProduct && (
            <ModalCreacionProducto
              viewProduct={viewProduct}
              setViewProduct={setViewProduct}
              uuid={uuid}
              edit={editProduct}
              listaSolicitudDinero={listaSolicitudDinero}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export { RegistroDinero };
