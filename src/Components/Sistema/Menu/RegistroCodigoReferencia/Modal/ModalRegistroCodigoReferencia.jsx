import React, { useRef, useState, useEffect } from 'react';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { useFormik } from 'formik';
import { Dropdown } from 'primereact/dropdown';
import { AutoComplete } from 'primereact/autocomplete';
import * as Yup from 'yup';
import { fetchGet, fetchPost, fetchPut } from '../../../../../api';

const ModalRegistroCodigoReferencia = ({ setView, view, edit, setAddData, listDatas, setEdit }) => {
  const toast = useRef(null);
  const [value, setValue] = useState();
  const [selectedRuc, setSelectedRuc] = useState(null);
  const [filteredRuc, setFilteredRuc] = useState(null);
  const [proyectos, setProyectos] = useState([]);
  const [selectedProyecto, setSelectedProyecto] = useState(null);
  const [filteredProyecto, setFilteredProyecto] = useState(null);
  const [rucs, setRucs] = useState([]);
  const [proyecto, setProyecto] = useState([]);

  const listData = () => {
    fetchGet(`tipo-documento`).then(({ result }) => {
      const data = result.map((element, item) => {
        return element;
      });

       setProyectos(data); 

  
    });




    fetchGet(`registroReferencia`).then(({ codigoReferencias }) => {
      const data = codigoReferencias.map((element, item) => {
        element.nombre = `${element.codigo}-${element.nombre}`
        return element;
      });

    

      setRucs(data);
    });


  };


  const searchRuc = (event) => {
    setTimeout(() => {
      let _filteredCountries;
      if (!event.query.trim().length) {
        _filteredCountries = [...rucs];
      } else {
        _filteredCountries = rucs.filter((ruc) => {
          return  ruc.codigo
            .toLowerCase()
            .startsWith(event.query.toLowerCase());
        });
      }

      setFilteredRuc(_filteredCountries);
    }, 200);
  };

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


  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      codigo: edit ? edit?.codigo : '',
      categoria: edit ? edit?.categoria : '',
      telf: edit ? edit?.telf : '',
      direc: edit ? edit?.direc : '',
      apaterno: edit ? edit?.apaterno : '',
      amaterno: edit ? edit?.amaterno : '',
      nombre: edit ? edit?.nombre : '',
      ruc: edit ? edit?.ruc : ''
    },
    onSubmit: (values) => {
      
     /*  values.codidoc = selectedProyecto.id */
    

    

      if(value === undefined || value === null){
        values.exonerar = false
      } else {
         values.exonerar = value
      }


         if(edit){

          updateAdd(values)

        } else {
          registreAdd(values);
        } 

     
    },
    validationSchema: Yup.object({


      codigo: Yup.string().required(
        'El codigo es requerida'
      ),

       categoria: Yup.string().required(
        'La categoria es requerida'
      ),

      telf: Yup.string().required(
        'Ea telfono es requerida'
      ),


      direc: Yup.string().required(
        'La direccion es requerida'
      ),
      apaterno: Yup.string().required(
        'El Apellido Paterno es requerida'
      ),

      amaterno: Yup.string().required(
        'El Apellido Materno es requerida'
      ),

      nombre: Yup.string().required(
        'El Nombre Materno es requerida'
      ), 
    }),
  });

  const registreAdd = (data) => {
    fetchPost('registroReferencia', 'POST', data).then(
      ({  message, codigoReferencias }) => {
        if (!codigoReferencias) {
          toast.current.show({
            severity: 'warn',
            summary: 'ocurrio un error',
            detail: message,
          });
          
        } else {
          toast.current.show({
            severity: 'success',
            summary: 'Creado',
            detail: message,
          });
          formik.resetForm({});
          
/*           setTimeout(() => {
            formik.resetForm();
            fetchGet(`/registroReferenciaAll`).then(( { codigoReferencias } ) => {
          
     
              const data = codigoReferencias.map((element, item) => {
                element.index = item;
                return element;
              });
        
              setAddData(data);
            
            });
            setView(false);
 
          }, 500); */
          listDatas()
        
        }
      }
    );
  };


  const updateAdd = (data) => {
   
    fetchPut(`registroReferenciaAll/${edit?.id}`, 'PUT', data).then((response) => {
      if (response.codigoReferencias === undefined) {
        toast.current.show({
          severity: 'warn',
          summary: 'Datos duplicados',
          detail: response.message,
        });
        listData()
      } else {
        toast.current.show({
          severity: 'success',
          summary: 'Actualizado',
          detail: response.message,
        });

/*         setTimeout(() => {
          formik.resetForm();

            async function doIt(){
  
              const {codigoReferencias} = await  fetchGet('registroReferenciaAll')
        
              if(codigoReferencias){
                 setAddData(codigoReferencias);
              }
             
            }
        
            doIt();
          
          setView(false);
         
        }, 500); */
        listDatas()
        setView(false)
      }
    });
  };

  useEffect(() => {
    listData();
  }, []);
  return (
    <Dialog
      visible={view}
      style={{ width: '550px' }}
      header='Registro Código de Referencia'
      modal
      className='p-fluid'
      onHide={() => setView(false)}
    >
      <Toast ref={toast} />
      <form onSubmit={formik.handleSubmit}>
        <div className='p-fluid formgrid grid'>
          <div className='field col-12 md:col-12'>
            <label htmlFor='codigo'>Código</label>

            <InputText
              type='text'
               {...formik.getFieldProps('codigo')}
              style={{ marginBottom: '5px' }}
              name='codigo'
            />
            {/* {formik.touched.descripcion && formik.errors.descripcion && (
              <span style={{ color: '#e5432d' }}>
                {formik.errors.descripcion}
              </span>
            )} */}
          </div>

          <div
            className='field col-12 md:col-12'
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '5px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <label htmlFor='nombreAbreviado'>Exonerar</label>
              <TriStateCheckbox
               value={value} onChange={(e) => setValue(e.value)}
                style={{ marginLeft: '5px' }}
               
              />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <label htmlFor='nombreCompleto'>Categoría</label>
{/*               <Dropdown
                 value={selectedCity1}
                 options={cities}
                 onChange={onCityChange}
                optionLabel='name'
                placeholder='Seleccionar categoría'
                style={{ marginLeft: '5px' }}
              /> */}
              <InputText
                 {...formik.getFieldProps('categoria')}
                 name='categoria'
                type='text'
                style={{ marginLeft: '5px' }}
              />
            </div>
          </div>
          {/*  */}
         {/*  <div className='field col-12 md:col-12'> */}
            {/* <label htmlFor='nombreAbreviado'>Código Documento</label> */}
{/*             <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Dropdown
                 value={selectedCity1}
                 options={cities}
                 onChange={onCityChange}
                optionLabel='name'
                placeholder='Seleccionar categoría'
              />
              <InputText
                type='text'
                 {...formik.getFieldProps('partidaPresupuestal')}
                style={{ marginLeft: '5px' }}
              />
            </div> */}
{/*                <AutoComplete
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
            /> */}
          {/* </div> */}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '99.3%',
            }}
          >
            <div className='field ' style={{ marginLeft: '5px', width: '90%' }}>
              <label htmlFor='nombreAbreviado'>RUC</label>

              <InputText type='text' 
               {...formik.getFieldProps('ruc')}
                name='ruc'
              />

{/*               <AutoComplete
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
            /> */}
            </div>
            <div className='field' style={{ marginLeft: '5px', width: '90%' }}>
              <label htmlFor='nombreAbreviado'>Teléfono</label>

              <InputText type='text' 
               {...formik.getFieldProps('telf')}
                name='telf'
              />
            </div>
          </div>

          <div className='field col-12 md:col-12'>
            <label htmlFor='nombreAbreviado'>Dirección</label>

            <InputText
              type='text'
              {...formik.getFieldProps('direc')}
              name='direc'
              style={{ marginBottom: '5px' }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '99.3%',
            }}
          >
            <div
              className='field '
              style={{ marginLeft: '5px', width: '100%' }}
            >
              <label htmlFor='nombreAbreviado'>Apellido Paterno</label>

              <InputText
                type='text'
                {...formik.getFieldProps('apaterno')}
                name='apaterno'
                style={{ marginBottom: '5px' }}
              />
            </div>
            <div
              className='field '
              style={{ marginLeft: '5px', width: '100%' }}
            >
              <label htmlFor='nombreAbreviado'>Apellido Materno</label>

              <InputText
                type='text'
                {...formik.getFieldProps('amaterno')}
                name='amaterno'
                style={{ marginBottom: '5px' }}
              />
            </div>
          </div>
           <div className='field col-12 md:col-12'>
            <label htmlFor='nombreAbreviado'>Nombres</label>

            <InputText
              type='text'
               {...formik.getFieldProps('nombre')}
               name='nombre'
              style={{ marginBottom: '5px' }}
            />
          </div>

{/*           <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '99.3%',
            }}
          >
            <div
              className='field '
              style={{ marginLeft: '5px', width: '100%' }}
            >
              <label htmlFor='nombreAbreviado'>Razón</label>

              <InputText
                type='text'
                 {...formik.getFieldProps('partidaPresupuestal')}
                 style={{ marginBottom: '5px' }}
              />
            </div>
            <div className='field ' style={{ marginLeft: '5px' }}>
              <label htmlFor='nombreAbreviado'>Fecha Nacimiento</label>

              <InputText
                type='text'
                 {...formik.getFieldProps('partidaPresupuestal')}
                 style={{ marginBottom: '5px' }}
              />
            </div>
          </div>

          <div className='field col-12 md:col-12'>
            <label htmlFor='nombreAbreviado'>Regimen</label>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Dropdown
                 value={selectedCity1}
                 options={cities}
                 onChange={onCityChange}
                optionLabel='name'
                placeholder='Seleccionar regimen'
              />
              <InputText
                type='text'
                 {...formik.getFieldProps('partidaPresupuestal')}
                style={{ marginLeft: '5px' }}
              />
            </div>
          </div>
          <div className='field col-12 md:col-12'>
            <label htmlFor='nombreAbreviado'>CUPSS</label>

            <InputText
              type='text'
               {...formik.getFieldProps('partidaPresupuestal')}
              style={{ marginBottom: '5px' }}
            />
          </div>  */}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            label='No'
            style={{ width: '100px' }}
            icon='pi pi-times'
            className='p-button-text'
            type='submit'
            onClick={() => {
              setView(false);
              formik.resetForm({});
              setEdit(null)
              
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

export default ModalRegistroCodigoReferencia;
