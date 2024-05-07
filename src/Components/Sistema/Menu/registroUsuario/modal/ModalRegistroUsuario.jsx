
import React, { useRef } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { fetchPost, fetchPut, postUser } from '../../../../../api';

const ModalRegistroUsuario = ({ setView, view, listData, edit, setEdit }) => {
  const toast = useRef(null);

  const formik = useFormik({
    initialValues: {
      nombre: edit ? edit.codigo : '',
      apellido: edit ? edit.nombreAbreviado : '',
      email: edit ? edit.nombreCompleto : '',
      password: edit ? edit.nombreCompleto : '',
    },
    onSubmit: (values) => {
      values.rol = "USER_ROLE"
     
      if (edit) {
        updateAdd(values);
      } else {
        userAdd(values);
        
      } 
    }
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



  const userAdd = (data) => {
    postUser(data).then(
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
        edit ? 'Editar Usuario' : 'Crear Usuario'
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
            <label htmlFor='codigo'>Nombre</label>

            <InputText
              type='text'
              {...formik.getFieldProps('nombre')}
              style={{ marginBottom: '5px' }}
              disabled={edit ? true : false}
            />
            {formik.touched.nombre && formik.errors.nombre && (
              <span style={{ color: '#e5432d' }}>{formik.errors.nombre}</span>
            )}
          </div>

          <div className='field col-12 md:col-12'>
            <label htmlFor='codigo'>Apellido</label>

            <InputText
              type='text'
              {...formik.getFieldProps('apellido')}
              style={{ marginBottom: '5px' }}
              disabled={edit ? true : false}
            />
            {formik.touched.apellido && formik.errors.apellido && (
              <span style={{ color: '#e5432d' }}>{formik.errors.apellido}</span>
            )}
          </div>

          <div className='field col-12 md:col-12'>
            <label htmlFor='nombreCompleto'>Email</label>

            <InputText
              type='email'
              {...formik.getFieldProps('email')}
              style={{ marginBottom: '5px' }}
            />
            {formik.touched.email && formik.errors.email && (
              <span style={{ color: '#e5432d' }}>
                {formik.errors.email}
              </span>
            )}
          </div>

          <div className='field col-12 md:col-12'>
            <label htmlFor='nombreCompleto'>Password</label>

            <InputText
              type='password'
              {...formik.getFieldProps('password')}
              style={{ marginBottom: '5px' }}
            />
            {formik.touched.password && formik.errors.password && (
              <span style={{ color: '#e5432d' }}>
                {formik.errors.password}
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
            label={edit ? 'Editar' : 'Crear'}
            icon='pi pi-check'
            type='submit'
          />
        </div>
      </form>
    </Dialog>
  );
};

export default ModalRegistroUsuario;