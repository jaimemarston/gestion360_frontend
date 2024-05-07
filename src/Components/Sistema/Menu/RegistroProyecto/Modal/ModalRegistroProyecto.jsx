import React, { useRef } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { fetchPost, fetchPut } from '../../../../../api';

const ModalRegistroProyecto = ({ setView, view, listData, edit, setEdit }) => {
  const toast = useRef(null);

  const formik = useFormik({
    initialValues: {
      codigo: edit ? edit.codigo : '',
      nombreAbreviado: edit ? edit.nombreAbreviado : '',
      nombreCompleto: edit ? edit.nombreCompleto : '',
    },
    onSubmit: (values) => {
      if (edit) {
        updateAdd(values);
      } else {
        registreAdd(values);
      }
    },
    validationSchema: Yup.object({
      codigo: Yup.string().required('El campo es requerido'),
      nombreAbreviado: Yup.string().required('El campo es requerido'),
      nombreCompleto: Yup.string().required('El campo es requerido'),
    }),
  });

  const registreAdd = (data) => {
    fetchPost('regProyecto', 'POST', data).then(
      ({ registroProyecto, message }) => {
        if (registroProyecto === undefined || !registroProyecto) {
          toast.current.show({
            severity: 'warn',
            summary: 'Datos duplicados',
            detail: message,
          });
        } else {
          toast.current.show({
            severity: 'success',
            summary: 'Creado',
            detail: message,
          });
          setTimeout(() => {
            formik.resetForm();
            listData();
            setView(false);
            setEdit(null);
          }, 500);
        }
      }
    );
  };

  const updateAdd = (data) => {
    fetchPut(`regProyecto/${edit.id}`, 'PUT', data).then((response) => {
      if (response.proyecto === undefined) {
        toast.current.show({
          severity: 'warn',
          summary: 'Datos duplicados',
          detail: response.message,
        });
      } else {
        toast.current.show({
          severity: 'success',
          summary: 'Actualizado',
          detail: response.message,
        });
        setTimeout(() => {
          formik.resetForm();
          listData();
          setView(false);
          setEdit(null);
        }, 500);
      }
    });
  };

  return (
    <Dialog
      visible={view}
      style={{ width: '450px' }}
      header={
        edit ? 'Editar Registro de Proyecto' : 'Crear Registro de Proyecto'
      }
      modal
      className='p-fluid'
      onHide={() => {
        setEdit(null);
        setView(false);
      }}
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
              disabled={edit ? true : false}
            />
            {formik.touched.codigo && formik.errors.codigo && (
              <span style={{ color: '#e5432d' }}>{formik.errors.codigo}</span>
            )}
          </div>

          <div className='field col-12 md:col-12'>
            <label htmlFor='nombreAbreviado'>Nombre Abreviado</label>

            <InputText
              type='text'
              {...formik.getFieldProps('nombreAbreviado')}
              style={{ marginBottom: '5px' }}
            />
            {formik.touched.nombreAbreviado &&
              formik.errors.nombreAbreviado && (
                <span style={{ color: '#e5432d' }}>
                  {formik.errors.nombreAbreviado}
                </span>
              )}
          </div>

          <div className='field col-12 md:col-12'>
            <label htmlFor='nombreCompleto'>Nombre Completo</label>

            <InputText
              type='text'
              {...formik.getFieldProps('nombreCompleto')}
              style={{ marginBottom: '5px' }}
            />
            {formik.touched.nombreCompleto && formik.errors.nombreCompleto && (
              <span style={{ color: '#e5432d' }}>
                {formik.errors.nombreCompleto}
              </span>
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
              setEdit(null);
            }}
          />
          <Button
            style={{ width: '100px', marginLeft: '20px' }}
            label={edit ? 'Guardar' : 'Guardar'}
            icon='pi pi-check'
            type='submit'
          />
        </div>
      </form>
    </Dialog>
  );
};

export default ModalRegistroProyecto;
