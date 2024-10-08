import React, { useRef } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { fetchPost, fetchPut } from '../../../../../api';

const ModalRegistroCargo = ({ setView, view, listData, edit, setEdit }) => {
  const toast = useRef(null);

  const formik = useFormik({
    initialValues: {
      codigo: edit ? edit?.codigo : '',
      descripcion: edit ? edit?.descripcion : '',
    },
    onSubmit: (values) => {
      if (edit) {
        console.log('edito');
        updateAdd(values);
      } else {
        console.log('creo');
        registreAdd(values);
      }
    },
    validationSchema: Yup.object({
      codigo: Yup.string()
        .required('El campo es requerido')
        .min(5, 'El código debe tener mas de 5 caracteres'),
      descripcion: Yup.string().required('El campo es requerido'),
    }),
  });

  const registreAdd = (data) => {
    fetchPost('registrocargo', 'POST', data).then(({ message }) => {
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
          setEdit(null);
        }, 500);
      }
    });
  };

  const updateAdd = (data) => {
    fetchPut(`registrocargo/${edit.id}`, 'PUT', data).then(({ message }) => {
      if (message === 'Hable con el administrador') {
        toast.current.show({
          severity: 'warn',
          summary: 'Verifique que el codigo no sea repetido',
        
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
    });
  };

  return (
    <Dialog
      visible={view}
      style={{ width: '450px' }}
      header='Registro de Cargo'
      modal
      className='p-fluid'
      onHide={() => setView(false)}
    >
      <Toast ref={toast} />
      <form onSubmit={formik.handleSubmit}>
        <div className='p-fluid formgrid grid'>
          <div className='field col-12 col-md-12'>
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

          <div className='field col-12 col-md-12'>
            <label htmlFor='nombreAbreviado'>Descripción</label>
            <InputText
              type='text'
              name='descripcion'
              onChange={formik.handleChange}
              value={formik.values.descripcion}
              onBlur={formik.handleBlur}
              style={{ marginBottom: '5px' }}
            />
            {formik.touched.descripcion && formik.errors.descripcion && (
              <span style={{ color: '#e5432d' }}>
                {formik.errors.descripcion}
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
              setEdit(null);
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

export default ModalRegistroCargo;
