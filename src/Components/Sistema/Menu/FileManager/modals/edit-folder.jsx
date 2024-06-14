import { editFolder } from '../../../../../store/slices/fileManager/fileManagerSlice';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { fetchGet, } from '../../../../../api';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { useDispatch } from 'react-redux';
import { useToast } from '../../../../../hooks/useToast';
import classNames from 'classnames';
import FolderIcon from '@mui/icons-material/Folder';
import React, { useState, useEffect, useRef } from 'react';
import BorderColorIcon from '@mui/icons-material/BorderColor';

const EditFolder = ({ isDarkMode, folderName1, folderName2, folderName3, groupName, folderId }) => {
  const [usersId, setUsersId] = useState([]);

  useEffect(()=>{
    let empty = {
      label1: folderName1,
      label2: folderName2,
      label3: folderName3,
      folderId: folderId
    }

    setData(empty)
  }, [folderName1, folderName2, folderName3, folderId])

  const [listProduct, setlistProduct] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const [newData, setNewData] = useState(null);
  const [isCloseModal, setIsCloseModal] = useState(false);
  const [selectedUsers, setSelectedProducts] = useState([]);

  const [data, setData] = useState();
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const dt = useRef(null);

  const { showToast, ToastComponent } = useToast()

  const dispatch = useDispatch();

  const switchFondo = (e) => {
    setValue(e);
  };

  const openModal = () => {
    setIsModal(!isModal);
  };

  const closeModal = () => {
    setIsModal(!isModal);
    setIsCloseModal(!isCloseModal);
  };

  const save = async () => {
    setSubmitted(true);
  
    const payload = {
     ...data,
    };

    try {
      const resultAction = await dispatch(editFolder(payload));
      if (resultAction.error) {
        showToast('error', 'Error al intentar editar la carpeta')
      } else {
        showToast('success', 'Carpeta editada con éxito');
        closeModal();
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setSubmitted(false);
    }
  };

  const onInputChange = (e, name) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };


  const leftToolbarTemplate = () => (
    <>
      <div className='my-2'>
        <Button
          className='p-button-success d-flex justify-content-center mr-2'
          onClick={openModal}
        >
          <BorderColorIcon className='me-2 mb-2' />
          Editar carpeta
        </Button>
      </div>
    </>
  );

  const Handler = ({
    isModal,
    productDialogFooter,
    openModal,
    data,
    onInputChange,
    submitted,
  }) => {
    // console.log(data);

    return (
      <Dialog
        visible={isModal}
        style={{ width: '700px', height: "350px" }}
        header={`Grupo seleccionado: ${groupName}`}
        modal
        className='p-fluid'
        footer={productDialogFooter}
        onHide={openModal}
      >
        <h5 className='fw-bold text-bold mb-5'>Carpeta seleccionada: {folderName1}</h5>
        <div className='field'>
          <label htmlFor='label1'>Carpeta principal</label>
          <InputText
            id='label1'
            name='label1'
            value={data?.label1?.trim()}
            onChange={(e) => onInputChange(e, 'label1')}
            required
            autoFocus
            className={classNames({
              'p-invalid': submitted && !data.label1,
            })}
          />
          {submitted && !data.codigo && (
            <small className='p-invalid'>Nombre de la carpeta principal es requerido</small>
          )}
        </div>

        <div className='field'>
          <label htmlFor='label2'>Sub carpeta</label>
          <InputText
            id='label2'
            name='label2'
            value={data?.label2?.trim()}
            onChange={(e) => onInputChange(e, 'label2')}
            required
            autoFocus
          />
        </div>

        <div className='field'>
          <label htmlFor='label3'>Ultima carpeta</label>
          <InputText
            id='label3'
            name='label3'
            type='text'
            value={data?.label3?.trim()}
            onChange={(e) => onInputChange(e, 'label3')}
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
        </div>
      </Dialog>
    );
  };

  const productDialogFooter = (
    <>
      <Button
        label='Cancelar'
        icon='pi pi-times'
        className='p-button-text'
        onClick={() => {
          openModal();
        }}
      />
      <Button
        label='Guardar'
        icon='pi pi-check'
        className='p-button-text'
        onClick={()=> {save()}}
      />
    </>
  );

  return (
    <div className={isDarkMode ? 'dark-mode-table grid crud-demo' : 'grid crud-demo'}>
      <div className='col-12'>
        <div >
          {ToastComponent}
          <Toolbar style={{ background: "transparent", border: "none" }} left={leftToolbarTemplate}></Toolbar>
          {isModal &&
            Handler({
              isModal,
              productDialogFooter,
              openModal,
              data,
              setData,
              onInputChange,
              submitted,
              switchFondo,
            })}
        </div>
      </div>
    </div>
  );
};

export { EditFolder };
