import React, { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';

import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

import { Button } from 'primereact/button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Calendar } from 'primereact/calendar';
import { AutoComplete } from 'primereact/autocomplete';
import { fetchGet, fetchPost, fetchPut } from '../../../../../api';
const ModalRendicionGastos = ({
  view,
  setView,
  listaSolicitudDinero,
  uuid,
  edit
}) => {
   console.log(edit);
  const toast = useRef(null);
  const [proyectos, setProyectos] = useState([]);
  const [rucs, setRucs] = useState([]);
  const [selectedProyecto, setSelectedProyecto] = useState(null);
  const [selectedRuc, setSelectedRuc] = useState(null);
  const [filteredProyecto, setFilteredProyecto] = useState(null);
  const [selectedCountry1, setSelectedCountry1] = useState(null);
  const [filteredCountries, setFilteredCountries] = useState(null);
  const [filteredRuc, setFilteredRuc] = useState(null);
  const [project, setProject] = useState('');
  const [countries, setCountries] = useState([]);
  const [dataLista, setDataLista] = useState({
    descripcion: null,
    partidaPresupuestal: null,
  });
  const listData = () => {
    fetchGet(`tipo-documentoAll`).then(({ result }) => {
      const data = result.map((element, item) => {
        return element;
      });

      setProyectos(data);

      fetchGet('regProyectoAll').then(({ registroProyecto }) => {
        const data = registroProyecto.map((element, item) => {
          return element;
        });
        setCountries(data);
      });
  
    });


   


    fetchGet(`registroReferencia`).then(({ codigoReferencias }) => {
      const data = codigoReferencias.map((element, item) => {
        element.nombre = `${element.ruc}-${element.nombre}`
        return element;
      });

    

      setRucs(data);
    });


  };



  

  const searchPartidaPresupuestal = (event) => {
    setTimeout(() => {
      let _filteredCountries;
      if (!event.query.trim().length) {
        _filteredCountries = [...countries];
      } else {
        _filteredCountries = countries.filter((country) => {
          return country.nombreAbreviado
            .toLowerCase()
            .startsWith(event.query.toLowerCase());
        });
      }
      setFilteredCountries(_filteredCountries);
    }, 250);
  };


  useEffect(() => {

    if(edit) {

      fetchGet(`rendGastosProducts/${edit?.id}`).then((res) => {

        const ruc =  res.rendicionGastosProduct.ruc.split('-')

        fetchGet(`registroReferencia/${ruc[0]}`).then((res) =>{

          const ruc = {...res.codigoReferencias, nombre: `${res.codigoReferencias.ruc}-${res.codigoReferencias.nombre}`}

          setSelectedRuc(ruc) 
     })
      })


      fetchGet(`tipo-documento/tipo/${edit?.tipo}`).then((res) => {
        console.log(res.result)
        setSelectedProyecto(res.result)
      })

      const project = encodeURIComponent(edit?.partidaPresupuestal)
      fetchGet(`regProyectos/${project}`).then((res) => {

        setProject(res.registroProyecto)
        console.log(res.registroProyecto.nombreAbreviado)
         
      })


    }

  }, [])



  const searchProyecto = (event) => {
    setTimeout(() => {
      let _filteredCountries;
      if (!event.query.trim().length) {
        _filteredCountries = [...proyectos];
      } else {
        _filteredCountries = proyectos.filter((country) => {
          return country.nombre
            .toLowerCase()
            .startsWith(event.query.toLowerCase());
        });
      }

      setFilteredProyecto(_filteredCountries);
    }, 200);
  };


  const searchRuc = (event) => {
    setTimeout(() => {
      let _filteredCountries;
      if (!event.query.trim().length) {
        _filteredCountries = [...rucs];
      } else {
        _filteredCountries = rucs.filter((ruc) => {
          return  ruc.nombre
            .toLowerCase()
            .startsWith(event.query.toLowerCase());
        });
      }

      setFilteredRuc(_filteredCountries);
    }, 200);
  };

  const formik = useFormik({
    initialValues: {
      fecha: edit ? new Date(edit?.fecha)  : null,
      serie: edit ? edit?.serie : '',
      numero: edit ? edit?.numero : '',
      ruc: edit ? edit?.ruc : '',
      descripcion: edit ? edit?.descripcion : '',
  
      importe: edit ? edit?.importe : '' ,
      tipo: edit ? edit?.tipo : '' ,
    },
    onSubmit: (values) => {
/*        values.importe = Number(values.importe);
       values.solicitudId = uuid; */
       console.log(project,'PROYECTO')
       values.partidaPresupuestal = project? project.nombreAbreviado : selectedCountry1.nombreAbreviado;

        if(edit){

          updateProduct(values)

        } else {
          createProduct(values);
        }

     
    },
    validationSchema: Yup.object({
      fecha: Yup.string().required('La fecha es requerida'),
      serie: Yup.string().required('La serie es requerida'),
      numero: Yup.number('Solo se permiten números').required(
        'El número es requerido'
      ),
      // tipo: Yup.string().required('EL tipo es requerido'),

      descripcion: Yup.string('No se permiten números').required(
        'La descripción es requerida'
      ),
      importe: Yup.number('Solo se ingresan números', (data) => {
        console.log(data);
      })
        .positive('Solo se ingresan números positivos')
        .required('El importe es requerido'),
    }),
  });

  const createProduct = (data) => {
    const datosRegistros =
      data.fecha.getMonth() +
      1 +
      '/' +
      data.fecha.getDate() +
      '/' +
      data.fecha.getFullYear();

    data.fecha = datosRegistros;
    data.rendicionGastosId = uuid;
    data.tipo = selectedProyecto.id;
    data.ruc = `${selectedRuc.ruc}-${selectedRuc.nombre}`;
 
    fetchPost('rendGastosProducts', 'POST', data).then(() => {
     
      formik.resetForm();
      listaSolicitudDinero();
      setView(false);
    });
  };

  const updateProduct = (data) => {
    const datosRegistros =
      data.fecha.getMonth() +
      1 +
      '/' +
      data.fecha.getDate() +
      '/' +
      data.fecha.getFullYear();

    data.fecha = datosRegistros;
    data.rendicionGastosId = uuid;
     data.tipo = selectedProyecto.id; 
     data.partidaPresupuestal
     console.log(selectedRuc.ruc,'RUC')
     data.ruc = `${selectedRuc.ruc}-${selectedRuc.nombre}`
     console.log(data, 'updated');
    fetchPut(`rendGastosProducts/${edit?.id}`, 'PUT', data).then(() => {
      setView(false);
      formik.resetForm();
      listaSolicitudDinero();
    });
  };

  useEffect(() => {
    listData();
  }, []);

  return (
    <Dialog
      visible={view}
      style={{ width: '450px' }}
      header='Creación de documentos rendidos'
      modal
      className='p-fluid'
      onHide={() => setView(false)}
    >
      <Toast ref={toast} />

      <form onSubmit={formik.handleSubmit}>
        <div className='p-fluid formgrid grid'>
          <div className='field col-12 md:col-6'>
            <label htmlFor='fecha'>Fecha</label>
            <Calendar
            dateFormat="dd/mm/yy"
              value={formik.values.fecha !== null ? new Date(formik.values.fecha) : null}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{ marginBottom: '5px' }}
              name='fecha'
              id='fecha'
              showIcon
            ></Calendar>
            {formik.touched.fecha && formik.errors.fecha && (
              <span style={{ color: '#e5432d' }}>{formik.errors.fecha}</span>
            )}
          </div>
          <div className='field col-12 md:col-6'>
            <label htmlFor='tipo'>Tipo</label>
            <AutoComplete
              value={selectedProyecto}
              suggestions={filteredProyecto}
              completeMethod={searchProyecto}
              field='nombre'
              name='tipo'
              id='tipo'
              onChange={(e) => {
                setSelectedProyecto(e.value);
              }}
              dropdown
              aria-label='nombre'
              dropdownAriaLabel='Seleccionar Proyecto'
            />
            {/* <InputText
              type='text'
              {...formik.getFieldProps('tipo')}
              style={{ marginBottom: '5px' }}
            />
            {formik.touched.tipo && formik.errors.tipo && (
              <span style={{ color: '#e5432d' }}>{formik.errors.tipo}</span>
            )} */}
          </div>{' '}
          <div className='field col-12 md:col-6'>
            <label htmlFor='serie'>Serie</label>

            <InputText
              type='text'
              {...formik.getFieldProps('serie')}
              style={{ marginBottom: '5px' }}
            />
            {formik.touched.serie && formik.errors.serie && (
              <span style={{ color: '#e5432d' }}>{formik.errors.serie}</span>
            )}
          </div>{' '}
          <div className='field col-12 md:col-6'>
            <label htmlFor='numero'>Número</label>

            <InputText
              type='text'
              {...formik.getFieldProps('numero')}
              style={{ marginBottom: '5px' }}
            />
            {formik.touched.numero && formik.errors.numero && (
              <span style={{ color: '#e5432d' }}>{formik.errors.numero}</span>
            )}
          </div>{' '}

          <div className='field col-12 md:col-12'>
            <label htmlFor='ruc'>RUC</label>

              <AutoComplete
              value={selectedRuc}
              suggestions={filteredRuc}
              completeMethod={searchRuc}
              field='nombre'
              name='tipo'
              id='tipo'
              onChange={(e) => {
                setSelectedRuc(e.value);
              }}
              dropdown
              aria-label='nombre'
              dropdownAriaLabel='Seleccionar Proyecto'
            />
            {formik.touched.ruc && formik.errors.ruc && (
              <span style={{ color: '#e5432d' }}>{formik.errors.ruc}</span>
            )}
          </div>
          <div className='field col-12 md:col-12'>
            <label htmlFor='descripcion'>Descripcion</label>

            <InputText
              type='text'
              {...formik.getFieldProps('descripcion')}
              style={{ marginBottom: '5px' }}
            />
            {formik.touched.descripcion && formik.errors.descripcion && (
              <span style={{ color: '#e5432d' }}>
                {formik.errors.descripcion}
              </span>
            )}
          </div>
          <div className='field col-12 md:col-12'>
            <label htmlFor='partidaPresupuestal'>Partida Presupuestal</label>
            <AutoComplete
                value={project ? project : selectedCountry1}
              suggestions={filteredCountries}
              completeMethod={searchPartidaPresupuestal}
              field='nombreAbreviado'
              name='partidaPresupuestal'
              id='partidaPresupuestal'
              onChange={(e) => {
                setSelectedCountry1(e.value);
/*                 if (selectedCountry1) {
                  dataLista.partidaPresupuestal = e.value.id;
                } */

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
              aria-label='partidaPresupuestal'
              dropdownAriaLabel='Seleccionar partida presupuestal'
            />
            {formik.touched.partidaPresupuestal &&
              formik.errors.partidaPresupuestal && (
                <span style={{ color: '#e5432d' }}>
                  {formik.errors.partidaPresupuestal}
                </span>
              )}
          </div>
          <div className='field col-12 md:col-12'>
            <label htmlFor='importe'>Importe</label>

            <InputText
              {...formik.getFieldProps('importe')}
              type='text'
              style={{ marginBottom: '5px' }}
            />
            {formik.touched.importe && formik.errors.importe && (
              <span style={{ color: '#e5432d' }}>{formik.errors.importe}</span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            label='No'
            style={{ width: '100px' }}
            icon='pi pi-times'
            className='p-button-text'
            type='button'
            onClick={() => {
              setView(false);
              formik.resetForm({});
            }}
          />
          <Button
            style={{ width: '100px', marginLeft: '20px' }}
            label='Guardar'
            icon='pi pi-check'
            type='submit'
          />
        </div>
      </form>
    </Dialog>
  );
};

export default ModalRendicionGastos;
