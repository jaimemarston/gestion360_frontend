import React, { useRef, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { fetchPost, fetchPut, fetchGet } from '../../../../../api';


const ModalRegistroProsupuesto = ({ setView, view, edit, setAddData }) => {
  

  const toast = useRef(null);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      codigo: edit ? edit?.codigo : '',
      nombreAbreviado: edit ? edit?.nombreAbreviado : '',
      nombreCompleto: edit ? edit?.nombreCompleto : '',
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
    fetchPost('registroPresupuestoFinanciero', 'POST', data).then(
      ({ presupuestos, message }) => {
        if (presupuestos === undefined || !presupuestos) {
          toast.current.show({
            severity: 'warn',
            summary: 'Datos duplicados',
            detail: message,
          });
        } else {
          toast.current.show({
            severity: 'success',
            summary: 'Presupuesto financiador creado',
            detail: message,
          });
          setTimeout(() => {
            formik.resetForm();
            async function doIt(){
  
              const {presupuestos} = await  fetchGet('registroPresupuestoFinanciero')
        
              if(presupuestos){
                 setAddData(presupuestos);
              }
             
            }
        
            doIt();
            setView(false);
         
          }, 500);
        }
      }
    );
  };

  const updateAdd = (data) => {
    fetchPut(`registroPresupuestoFinanciero/${edit?.id}`, 'PUT', data).then((response) => {
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

                      async function doIt(){
  
              const {presupuestos} = await  fetchGet('registroPresupuestoFinanciero')
        
              if(presupuestos){
                 setAddData(presupuestos);
              }
             
            }
        
            doIt();
          
          setView(false);
         
        }, 500);
      }
    });
  };

  return (
    <Dialog
      visible={view}
      style={{ width: '450px' }}
      header={
        edit ? 'Editar Registro de Presupuesto' : 'Crear Registro de Presupuesto'
      }
      modal
      className='p-fluid'
      onHide={() => {
      
        setView(false);
      }}
    >
      <Toast ref={toast} />
      <form onSubmit={formik.handleSubmit}>
        <div className='p-fluid formgrid grid'>
          <div className='field col-12 col-md-12'>
            <label htmlFor='codigo'>Código</label>

            <InputText
              type='text'
              {...formik.getFieldProps('codigo')}
              name='codigo'
              style={{ marginBottom: '5px' }}
            
            />
            {formik.touched.codigo && formik.errors.codigo && (
              <span style={{ color: '#e5432d' }}>{formik.errors.codigo}</span>
            )}
          </div>

          <div className='field col-12 col-md-12'>
            <label htmlFor='nombreAbreviado'>Nombre Abreviado</label>

            <InputText
              type='text'
            
              {...formik.getFieldProps('nombreAbreviado')}
              name='nombreAbreviado'
              style={{ marginBottom: '5px' }}
            />
            {formik.touched.nombreAbreviado &&
              formik.errors.nombreAbreviado && (
                <span style={{ color: '#e5432d' }}>
                  {formik.errors.nombreAbreviado}
                </span>
              )}
          </div>

          <div className='field col-12 col-md-12'>
            <label htmlFor='nombreCompleto'>Nombre Completo</label>

            <InputText
              type='text'
              {...formik.getFieldProps('nombreCompleto')}
              name='nombreCompleto'
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

export default ModalRegistroProsupuesto;
