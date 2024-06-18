import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { useFormik } from 'formik';
import { Button } from 'primereact/button';
import * as Yup from 'yup';

export default function ModalSolicitudDinero({ view, setView, setData }) {
  const formik = useFormik({
    initialValues: {
      numeroSolicitud: '',
      fechaRegistro: '',
      nombre: '',
      nombreProyecto: '',
      lugarComision: '',
      itenerarioTransporte: '',
      objetoComision: '',
      fechaInicio: '',
      fechaFin: '',
      products: [],
      total: 0,
    },
    onSubmit: (values) => {
      //
      if (values.fechaRegistro) {
        const datosRegistros =
          values.fechaRegistro.getMonth() +
          1 +
          '/' +
          values.fechaRegistro.getDate() +
          '/' +
          values.fechaRegistro.getFullYear();
        values.fechaRegistro = datosRegistros;
        console.log(datosRegistros);
      }
      if (values.fechaInicio) {
        const fechaInicio =
          values.fechaInicio.getMonth() +
          1 +
          '-' +
          values.fechaInicio.getDate() +
          '-' +
          values.fechaInicio.getFullYear();
        values.fechaInicio = fechaInicio;
      }
      if (values.fechaFin) {
        const fechaFin =
          values.fechaFin.getMonth() +
          1 +
          '-' +
          values.fechaFin.getDate() +
          '-' +
          values.fechaFin.getFullYear();
        values.fechaFin = fechaFin;
      }
      //
      localStorage.setItem('solicitudDinero', JSON.stringify(values));
      setData(values);
      setView(false);
    },
    validationSchema: Yup.object({
      numeroSolicitud: Yup.number('Solo se permite numeros')
        .min(8)
        .required('Requerido'),
      nombre: Yup.string().required('Rquerido'),
      nombreProyecto: Yup.string().required('Rquerido'),
      lugarComision: Yup.string().required('Rquerido'),
      itenerarioTransporte: Yup.string().required('Rquerido'),
      objetoComision: Yup.string().required('Rquerido'),
    }),
  });

  return (
    <Dialog
      visible={view}
      style={{ width: '450px' }}
      header='Detalle del registro'
      modal
      className='p-fluid'
      onHide={() => setView(false)}
    >
      <>
        <form onSubmit={formik.handleSubmit} noValidate>
          <h4>Datos Personales</h4>

          <div className='p-fluid formgrid grid'>
            <div className='field col-12 col-md-12'>
              <label htmlFor='numeroSolicitud' className='block'>
                N. solicitud
              </label>
              <InputText
                name='numeroSolicitud'
                type='text'
                values={formik.values.numeroSolicitud}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                style={{ marginBottom: '5px' }}
              />
              {formik.touched.numeroSolicitud &&
                formik.errors.numeroSolicitud && (
                  <span style={{ color: '#e5432d' }}>
                    {formik.errors.numeroSolicitud}
                  </span>
                )}
            </div>
            <div className='field col-12 col-md-12'>
              <label htmlFor='fechaRegistro'>Fecha Registro</label>
              <Calendar
                inputId='calendar'
                values={formik.values.fechaRegistro}
                onChange={formik.handleChange}
                // onBlur={formik.handleBlur}
                style={{ marginBottom: '5px' }}
                // required
                name='fechaRegistro'
              ></Calendar>
            </div>
            <div className='field col-12 col-md-12'>
              <label htmlFor='nombre' className='block'>
                Nombre
              </label>
              <InputText
                name='nombre'
                type='text'
                values={formik.values.nombre}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                style={{ marginBottom: '5px' }}
              />
              {formik.touched.nombre && formik.errors.nombre && (
                <span style={{ color: '#e5432d' }}>{formik.errors.nombre}</span>
              )}
            </div>
          </div>
          <h4>Informacion del proyecto</h4>
          <div className='field col-12 col-md-12'>
            <label htmlFor='nombreProyecto' className='block'>
              Nombre del proyecto`
            </label>
            <InputText
              name='nombreProyecto'
              type='text'
              values={formik.values.nombreProyecto}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{ marginBottom: '5px' }}
            />
            {formik.touched.nombreProyecto && formik.errors.nombreProyecto && (
              <span style={{ color: '#e5432d' }}>
                {formik.errors.nombreProyecto}
              </span>
            )}
          </div>
          <div className='field col-12 col-md-12'>
            <label htmlFor='lugarComision' className='block'>
              Lugar comisión
            </label>
            <InputText
              name='lugarComision'
              type='text'
              values={formik.values.lugarComision}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{ marginBottom: '5px' }}
            />
            {formik.touched.lugarComision && formik.errors.lugarComision && (
              <span style={{ color: '#e5432d' }}>
                {formik.errors.lugarComision}
              </span>
            )}
          </div>
          <div className='field col-12 col-md-12'>
            <label htmlFor='itenerarioTransporte' className='block'>
              Itinerario de transporte
            </label>
            <InputText
              name='itenerarioTransporte'
              type='text'
              values={formik.values.itenerarioTransporte}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{ marginBottom: '5px' }}
            />
            {formik.touched.itenerarioTransporte &&
              formik.errors.itenerarioTransporte && (
                <span style={{ color: '#e5432d' }}>
                  {formik.errors.itenerarioTransporte}
                </span>
              )}
          </div>
          <div className='field col-12 col-md-12'>
            <label htmlFor='objetoComision' className='block'>
              Objeto de la comisión
            </label>
            <InputText
              name='objetoComision'
              type='text'
              values={formik.values.objetoComision}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.objetoComision && formik.errors.objetoComision && (
              <span style={{ color: '#e5432d' }}>
                {formik.errors.objetoComision}
              </span>
            )}
          </div>

          <div className='field col-12 col-md-12'>
            <label htmlFor='fechaInicio'>Fecha inicio</label>
            <Calendar
              inputId='calendar'
              name='fechaInicio'
              values={formik.values.fechaInicio}
              onChange={formik.handleChange}
            ></Calendar>
          </div>
          <div className='field col-12 col-md-12'>
            <label htmlFor='fechaFin'>Fecha fin</label>
            <Calendar
              inputId='calendar'
              values={formik.values.fechaFin}
              onChange={formik.handleChange}
              name='fechaFin'
            ></Calendar>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              label='No'
              style={{ width: '100px' }}
              icon='pi pi-times'
              className='p-button-text'
              type='button'
              onClick={() => {
                setView(false);
                formik.resetForm();
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
      </>
    </Dialog>
  );
}
