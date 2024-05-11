import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';


import { InputSwitch } from 'primereact/inputswitch';
import { fetchDelete, fetchGet, fetchPut, postUser } from '../../../../api';

const RegisterFolder = ({isDarkMode}) => {
  let empty = {
    codigo: '',
    nombre: '',
    email: '',
    password: '',
    rol:"USER_ROLE",
    estado: true,
  };
  const [listProduct, setlistProduct] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const [newData, setNewData] = useState(null);
  const [isCloseModal, setIsCloseModal] = useState(false);
  const [value, setValue] = useState(empty.estado);

  const [product, setProduct] = useState(empty);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  const switchFondo = (e) => {
    setValue(e);
  };

  const listarUsuarios = () => {
      fetchGet('usuario').then((data) => {
        setlistProduct(data.usuario)
      })
  };

  useEffect(() => {
    listarUsuarios();
  }, []);

  const openModal = () => {
    setIsModal(!isModal);

    if (product.length === 0) {
      setProduct({});
    }
  };

  const closeModal = () => {
    setIsCloseModal(!isCloseModal);
  };

  const saveProduct = () => {
    setSubmitted(true);
    console.log(product)
    if (
      product?.nombre.trim() &&
      product?.codigo.trim() &&
      product?.email.trim() &&
      product?.password.trim()
    ) {
      if (product.id) {
        product.estado = value;
      
      
        fetchPut(`usuario/${product.id}`,'PATCH', product)
          .then((res) => {
            toast.current.show({
              severity: 'success',
              summary: 'Successful',
              detail: 'Usuario actualizado',
              life: 3000,
            });
            listarUsuarios();
            openModal();
            setProduct(empty);
          })
          .catch((error) => {
            toast.current.show({
              severity: 'error',
              summary: 'Successful',
              detail: error.response.data.message,
              life: 3000,
            });
          }); 
      } else {
 
        if (
          product?.nombre.trim() &&
          product?.codigo.trim() &&
          product?.email.trim() &&
          product?.password.trim()
        ) {
          product.estado = value;

          postUser(product).then((data) => {
            toast.current.show({
              severity: 'error',
              summary: 'Successful',
              detail: error.response.data.message,
              life: 3000,
            });
          })
        }
      }
    }
  };

  const editProduct = (product) => {
 
    setProduct({ ...product });
    // console.log('product', product);
    setIsModal();
  };

  const deleteSelected = () => {
      fetchDelete(`usuario/${newData.id}`)
      .then((res) => {
        toast.current.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'Usuario eliminado',
          life: 3000,
        });
        listarUsuarios();
        closeModal();
      })
      .catch((error) => {
        toast.current.show({
          severity: 'error',
          summary: 'Successful',
          detail: error.response.data.message,
          life: 3000,
        });
        closeModal();
      }); 
  };

  const onInputChange = (e, name) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const leftToolbarTemplate = () => (
    <>
      <div className='my-2'>
        <Button
          label='Nuevo'
          icon='pi pi-plus'
          className='p-button-success mr-2'
          onClick={openModal}
        />
      </div>
    </>
  );


  const productDialogFooter = (
    <>
      <Button
        label='Cancelar'
        icon='pi pi-times'
        className='p-button-text'
        onClick={() => {
          openModal();
          setProduct({});
        }}
      />
      <Button
        label='Guardar'
        icon='pi pi-check'
        className='p-button-text'
        onClick={saveProduct}
      />
    </>
  );

  return (
    <div className={isDarkMode ?  '' : ''  }>
      <div className='col-12'>
        <div className={isDarkMode ?  '' : ''  }>
          <Toast ref={toast} />
          <Toolbar left={leftToolbarTemplate}></Toolbar>
       
          {isCloseModal &&
            EliminarUsuario({
              isCloseModal,
              closeModal,
              deleteSelected,
            })}

          {isModal &&
            CrudUsuario({
              isModal,
              productDialogFooter,
              openModal,
              product,
              setProduct,
              onInputChange,
              submitted,
              switchFondo,
              value,
              setValue,
            })}
        </div>
      </div>
    </div>
  );
};

export { RegisterFolder };


const EliminarUsuario = ({ isCloseModal, closeModal, deleteSelected }) => {
  const deleteDialogFooter = (
    <>
      <Button
        label='No'
        icon='pi pi-times'
        className='p-button-text'
        onClick={closeModal}
      />
      <Button
        label='Si'
        icon='pi pi-check'
        className='p-button-text'
        onClick={() => deleteSelected()}
      />
    </>
  );

  return (
    <Dialog
      visible={isCloseModal}
      style={{ width: '450px' }}
      header='Confirmar'
      modal
      footer={deleteDialogFooter}
      onHide={closeModal}
    >
      <div className='flex align-items-center justify-content-center'>
        <i
          className='pi pi-exclamation-triangle mr-3'
          style={{ fontSize: '2rem' }}
        />
        <span>Desea eliminar al usuario?</span>
      </div>
    </Dialog>
  );
};

const CrudUsuario = ({
  isModal,
  productDialogFooter,
  openModal,
  product,
  onInputChange,
  submitted,
  switchFondo,
  value,
  setValue,
}) => {
  // console.log(product);

  return (
    <Dialog
      visible={isModal}
      style={{ width: '450px' }}
      header='Detalle del registro'
      modal
      className='p-fluid'
      footer={productDialogFooter}
      onHide={openModal}
    >
      <div className='field'>
        <label htmlFor='codigo'>Nombre de la carpeta</label>
        <InputText
          id='folderName'
          name='folderName'
          value={product?.codigo?.trim()}
          onChange={(e) => onInputChange(e, 'codigo')}
          required
          autoFocus
          className={classNames({
            'p-invalid': submitted && !product.codigo,
          })}
        />
        {submitted && !product.codigo && (
          <small className='p-invalid'>Nombre de la carpeta es Requerido.</small>
        )}
      </div>

      <div className='field'>
        <label htmlFor='nombre'>Sub carpeta</label>
        <InputText
          id='subFolder'
          name='subFolder'
          value={product?.nombre?.trim()}
          onChange={(e) => onInputChange(e, 'nombre')}
          required
          autoFocus
        />
      </div>

      <div className='field'>
        <label htmlFor='email'>Ultima carpeta</label>
        <InputText
          id='lastFolder'
          name='lastFolder'
          value={product?.email?.trim()}
          onChange={(e) => onInputChange(e, 'email')}
          required
          autoFocus
        />
      </div>
      <div className='field'>
        <label htmlFor='password'>Aqui va el select de el usuario</label>
        <InputText
          type='text'
          name='userId'
          id='userId'
          value={product?.password?.trim()}
          onChange={(e) => onInputChange(e, 'password')}
          required
          autoFocus
        />
      </div>

      <div
        className='field'
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <label htmlFor='estado'>Estado</label>
        <InputSwitch
          defaultValue={value}
          checked={product.estado}
          onChange={(e) => setValue(e.value)}
        />
      </div>
    </Dialog>
  );
};
