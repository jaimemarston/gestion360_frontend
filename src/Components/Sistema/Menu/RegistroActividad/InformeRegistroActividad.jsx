import React, { useRef, useState } from 'react';

import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'primereact/calendar';

import { Toolbar } from 'primereact/toolbar';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { fetchPost, fetchPut } from '../../../../api';
import { useSelector } from 'react-redux';
import PDFActividad from './PDFActividad';
import { useLocation } from 'react-router-dom';
import { InputTextarea } from 'primereact/inputtextarea';

const InformeRegistroActividad = ({isDarkMode}) => {
  const { registroActividad } = useSelector((state) => state.solicitudDinero);
  
  const [boolCreate, setBoolCreate] = useState(false);
    const location = useLocation();
  const [edit, setEdit] = useState(location.state)

  const [data, setData] = useState()




 

  const navigate = useNavigate();
  const toast = useRef(null);

  const handleClickRetornar = () => {
    navigate('/informe-actividad');
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      nombreApellido: edit  ? edit?.nombreApellido : '',
      destino: edit ? edit?.destino : '',
      fechaFin: edit ? new Date(edit?.fechaFin)  : null,
      fechaInicio: edit ?  new Date(edit?.fechaInicio)  : null,
      objetoComision: edit ? edit?.objetoComision : '',
      detalleActividad: edit ? edit?.detalleActividad : '',
      otros: edit ? edit?.otros : '',
    },
    onSubmit: (values) => {

      if(edit === null){
        registreAdd(values);
      } else {
        registreUpdate(values)
      }

      
    },
    validationSchema: Yup.object({
      nombreApellido: Yup.string('No se permiten números').required(
        'El nombre y apellido es requerido'
      ),
      destino: Yup.string().required('El destino es requerido'),
      fechaFin: Yup.string().required('La fecha de fin es requerido'),
      fechaInicio: Yup.string().required('La fecha de inicio es requerido'),
      objetoComision: Yup.string().required(
        'El objeto de la comisión es requerido'
      ),
      detalleActividad: Yup.string().required(
        'El detalle de actividad es requerido'
      ),
      otros: Yup.string().required('Otros aspectos es requerido'),
    }),
  });

  const registreAdd = (values) => {
   
    fetchPost('regActividad', 'POST', values).then((data) => {
      console.log(data);
      if (data.registroActividad) {
        toast.current.show({
          severity: 'success',
          summary: 'Creado',
          detail: 'Se ha creado correctamente',
          life: 3000,
        });

        setData(data)
        // formik.resetForm();
      } else {
        toast.current.show({
          severity: 'warn',
          summary: 'Creado',
          detail: 'Ha ocurrido un error, hable con el administrador',
          life: 3000,
        });
      }
    });
  };



  const registreUpdate = (values) => {
   
    fetchPut(`regActividad/${edit?.id}`, 'PUT', values).then((data) => {
      console.log(data);
      if (data.registroActividad) {
        toast.current.show({
          severity: 'success',
          summary: 'Creado',
          detail: 'Se ha creado correctamente',
          life: 3000,
        });
        // formik.resetForm();
      } else {
        toast.current.show({
          severity: 'warn',
          summary: 'Creado',
          detail: 'Ha ocurrido un error, hable con el administrador',
          life: 3000,
        });
      }
    });
  };

  return (
    <div className={isDarkMode ?  'dark-mode-table grid crud-demo' : 'grid crud-demo'  }>
      <Toast ref={toast} />

      <div className='col-12'>
        <div  className={isDarkMode ?  'dark-mode card' : 'card'  }>
          <form onSubmit={formik.handleSubmit}>
            <Toolbar className={isDarkMode ?  'dark-mode mb-4' : 'mb-4'  } /* right={<PDFActividad edit={edit} data={data} />} */></Toolbar>

            <h4>Datos Personales</h4>

            <div className='p-fluid formgrid grid'>
              <div className='field col-12 col-md-6'>
                <label htmlFor='nombreApellido' className='block'>
                  Nombre y apellidos
                </label>
                <InputText
                  name='nombreApellido'
                  type='text'
                  {...formik.getFieldProps('nombreApellido')}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={{ marginBottom: '5px' }}
                  // disabled={boolCreate}
                />
                {formik.touched.nombreApellido &&
                  formik.errors.nombreApellido && (
                    <span style={{ color: '#e5432d' }}>
                      {formik.errors.nombreApellido}
                    </span>
                  )}
              </div>

              <div className='field col-12 col-md-6'>
                <label htmlFor='destino' className='block'>
                  Destino
                </label>
                <InputText
                  name='destino'
                  type='text'
                  {...formik.getFieldProps('destino')}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={{ marginBottom: '5px' }}
                  // disabled={boolCreate}
                />
                {formik.touched.destino && formik.errors.destino && (
                  <span style={{ color: '#e5432d' }}>
                    {formik.errors.destino}
                  </span>
                )}
              </div>

              <div className='field col-12 col-md-6'>
                <label htmlFor='fechaInicio'>Fecha inicio</label>
                <Calendar

                   {...formik.getFieldProps('fechaInicio')} 
                
            
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={{ marginBottom: '5px' }}
                  name='fechaInicio'
                  disabled={boolCreate}
                  showIcon
                  dateFormat="dd/mm/yy"
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
                     {...formik.getFieldProps('fechaFin')} 
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={{ marginBottom: '5px' }}
                  name='fechaFin'
                  showIcon
                  disabled={boolCreate}
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
              <div className='field col-12 col-md-12'>
                <label htmlFor='objetoComision' className='block'>
                  Objeto de la comisión:
                </label>
                <InputTextarea
                  name='objetoComision'
                  type='text'
                  {...formik.getFieldProps('objetoComision')}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={{ marginBottom: '5px' }}
                  rows={7}
                  cols={30}
                  autoResize
                />
                {formik.touched.objetoComision &&
                  formik.errors.objetoComision && (
                    <span style={{ color: '#e5432d' }}>
                      {formik.errors.objetoComision}
                    </span>
                  )}
              </div>
              <div className='field col-12 col-md-12'>
                <label htmlFor='detalleActividad' className='block'>
                  Detalle de actividad realizada:
                </label>
                <InputTextarea
                  name='detalleActividad'
                  type='text'
                  {...formik.getFieldProps('detalleActividad')}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={{ marginBottom: '5px' }}
                  rows={7}
                  cols={30}
                  autoResize
                />
                {formik.touched.detalleActividad &&
                  formik.errors.detalleActividad && (
                    <span style={{ color: '#e5432d' }}>
                      {formik.errors.detalleActividad}
                    </span>
                  )}
              </div>
              <div className='field col-12 col-md-12'>
                <label htmlFor='otros' className='block'>
                  Otros aspectos administrativos relevantes que afecten su
                  rendición de cuentas
                </label>
                <InputTextarea
                  name='otros'
                  type='text'
                  {...formik.getFieldProps('otros')}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={{ marginBottom: '5px' }}
                  rows={8}
                  cols={30}
                  autoResize
                />
                {formik.touched.otros && formik.errors.otros && (
                  <span style={{ color: '#e5432d' }}>
                    {formik.errors.otros}
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
                label='Guardar'
                type='submit'
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InformeRegistroActividad;
