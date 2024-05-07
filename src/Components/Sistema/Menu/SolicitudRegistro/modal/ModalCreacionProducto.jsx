import React, { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { getUser } from "../../../../../utils/getUser";
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { fetchGet, fetchPost, fetchPut } from '../../../../../api';

export default function ModalCreacionProducto({
  viewProduct,
  setViewProduct,
  listaSolicitudDinero,
  uuid,
  edit
}) {
  const toast = useRef(null);
  //
  const [countries, setCountries] = useState([]);
  const [selectedCountry1, setSelectedCountry1] = useState(null);
  const [filteredCountries, setFilteredCountries] = useState(null);
  const [project, setProject] = useState('');
  const [descript, setDescript] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [filteredCountrie, setFilteredCountrie] = useState(null);
 

  const [dataLista, setDataLista] = useState({
    descripcion: null,
    partidaPresupuestal: null,
  });

  const [dataUser, setDataUser] = useState();

  useEffect( () =>  {
    async function doIt(){

      console.log(edit)
      if(edit){
       const project = encodeURIComponent(edit?.partidaPresupuestal)
      fetchGet(`regProyectos/${project}`).then((res) => {

        setProject(res.registroProyecto.nombreAbreviado)
        console.log(res.registroProyecto.nombreAbreviado)
         
      })

      }


      const userData = await getUser();
      
      setDataUser(userData);

    
    }

    doIt();

  }, [])
 
  const listData = () => {
    fetchGet('regProyectoAll').then(({ registroProyecto }) => {
      const data = registroProyecto.map((element, item) => {
        return element;
      });
      setCountries(data);
    });

    fetchGet('comision').then(({ lugar }) => {
      const data = lugar?.map((element, item) => {
        return element;
      });
      setDescript(data);
    });
  };

  const formik = useFormik({
    initialValues: {
      descripcion: edit ? edit?.descripcion : '',
      partidaPresupuestal: edit ? edit?.partidaPresupuestal :  '',
      importe: edit ? edit?.importe : '',
    },
    onSubmit: (values) => {
      values.importe = Number(values.importe);
      values.solicitudId = uuid;
  /*     values.descripcion = dataLista.descripcion; */
      values.partidaPresupuestal = project? project.nombreAbreviado : selectedCountry1.nombreAbreviado;
      


        if(!edit){
            createProduct(values); 
        }
       
        if(edit){
          editProduct(values)
        }

   

   
    },
    validationSchema: Yup.object({
      // descripcion: Yup.string().required('La descripción es requerida'),
      // partidaPresupuestal: Yup.string().required(
      //   'La partida presupuestal es requerido'
      // ),
      importe: Yup.number('Solo se ingresan números', (data) => {
        console.log(data);
      })
        .positive('Solo se ingresan números positivos')
        .required('El importe es requerido'),
    }),
  });

  const createProduct = (data) => {
    fetchPost('solicitudProducto', 'POST', data).then(() => {
      setViewProduct(false);
      formik.resetForm();
      listaSolicitudDinero();
    });
  };


  const editProduct = (data) => {
    console.log('data', edit)
    fetchPut(`solicitudProducto/${edit?.id}`, 'PUT', data).then(() => {
      setViewProduct(false);
      formik.resetForm();
      listaSolicitudDinero();
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

  const searchDescription = (event) => {
    setTimeout(() => {
      let _filteredCountries;
      if (!event.query.trim().length) {
        _filteredCountries = [...descript];
      } else {
        _filteredCountries = descript.filter((country) => {
          return country.descripcion
            .toLowerCase()
            .startsWith(event.query.toLowerCase());
        });
      }
      setFilteredCountrie(_filteredCountries);
    }, 250);
  };

  useEffect(() => {
    listData();
  }, []);

  return (
    <Dialog
      visible={viewProduct}
      style={{ width: '450px' }}
      header='Creación de producto'
      modal
      className='p-fluid'
      onHide={() => setViewProduct(false)}
    >
      <Toast ref={toast} />

      <form onSubmit={formik.handleSubmit}>
        <div className='p-fluid formgrid grid'>
          <div className='field col-12 md:col-12'>
            <label htmlFor='descripcion'>Descripción</label>
            <InputText
              name='descripcion'
              field='descripcion'
              id='descripcion'
              {...formik.getFieldProps('descripcion')}
              type='text'
              style={{ marginBottom: '5px' }}
            />
{/*             <AutoComplete
              aria-label='descripcion'
              completeMethod={searchDescription}
              value={ edit ? edit?.descripcion : selectedCountry}
              dropdown
              dropdownAriaLabel='Seleccionar descripcion'
              field='descripcion'
              id='descripcion'
              name='descripcion'
              onChange={(e) => {
                setSelectedCountry(e.value);
               
                if (selectedCountry) {
                  
                  dataLista.descripcion = e.value;
                }
              }}
              suggestions={filteredCountrie}
             
            /> */}
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
              setViewProduct(false);
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
}
