import React, { useRef } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { fetchPost, fetchPut } from '../../../../../api';

const ModalRegistroDocumentos = ({
  setView,
  view,
  listData,
  edit,
  setEdit,
}) => {
  const toast = useRef(null);

  const formik = useFormik({
    initialValues: {
      codigo: edit ? edit?.codigo : '',
      nombre: edit ? edit?.nombre : '',
    },
    onSubmit: (values) => {
      if (edit) {
     
        updateAdd(values);
      } else {
     
        registreAdd(values);
      }
    },
    validationSchema: Yup.object({
      codigo: Yup.string()
        .required('El campo es requerido')
        .min(2, 'El código debe tener mas de 1 caracteres'),
      nombre: Yup.string().required('El campo es requerido'),
    }),
  });

  const registreAdd = (data) => {
    fetchPost('registro-tipo-documento/one', 'POST', data).then(({ message }) => {
      console.log(message,'mensaje')
      if (message === 'El código ya existe') {
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
        
        }, 500);
      }
    });
  };

  const updateAdd = (data) => {
    fetchPut(`tipo-documento/${edit.id}`, 'PUT', data).then(({ message }) => {
      console.log(data);
      if (message === '"El código ya existe"') {
        toast.current.show({
          severity: 'warn',
          summary: 'Datos duplicados',
          detail: message,
        });

      }    
      else  {
        toast.current.show({
          severity: 'success',
          summary: 'Actualizado',
          detail: message,
        });
        setTimeout(() => {
          formik.resetForm();
          listData();
          setView(false);
        
        }, 500);
      }
    });
  };

  return (
    <Dialog
      visible={view}
      style={{ width: '450px' }}
      header='Registro de Documento'
      modal
      className='p-fluid'
      onHide={() => {
       
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
              name='codigo'
              value={formik.values.codigo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{ marginBottom: '5px' }}
            />
            {formik.touched.codigo && formik.errors.codigo && (
              <span style={{ color: '#e5432d' }}>{formik.errors.codigo}</span>
            )}
          </div>

          <div className='field col-12 md:col-12'>
            <label htmlFor='nombre'>Tipo Documento</label>

            <InputText
              type='text'
              name='nombre'
              value={formik.values.nombre}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{ marginBottom: '5px' }}
            />
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
              // formik.resetForm({});
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

export default ModalRegistroDocumentos;
