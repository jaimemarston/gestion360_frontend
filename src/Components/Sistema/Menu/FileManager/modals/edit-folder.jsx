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

const EditFolder = ({ isDarkMode, folderName, groupName, folderId }) => {
  const [usersId, setUsersId] = useState([]);

  useEffect(()=>{
    let empty = {
      label: folderName,
      folderId: folderId
    }

    setData(empty)
  }, [folderName, folderId])

  const [isModal, setIsModal] = useState(false);
  const [isCloseModal, setIsCloseModal] = useState(false);

  const [data, setData] = useState();
  const [submitted, setSubmitted] = useState(false);
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
    if(!data.label){
      setSubmitted(true);
      return;
    }else{
      setSubmitted(false);
    }
  
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
        style={{ width: '600px', height: "250px" }}
        header={`Grupo seleccionado: ${groupName}`}
        modal
        className='p-fluid'
        footer={productDialogFooter}
        onHide={openModal}
      >
        <h5 className='fw-bold text-bold mb-5'>Carpeta seleccionada: {folderName}</h5>
        <div className='field'>
          <label htmlFor='label'>Carpeta principal</label>
          <InputText
            id='label'
            name='label'
            value={data?.label?.trim()}
            onChange={(e) => onInputChange(e, 'label')}
            required
            autoFocus
            className={classNames({
              'p-invalid': submitted && !data.label,
            })}
          />
          {submitted && !data.label && (
            <small className='p-invalid'>Nombre de la carpeta principal es requerido</small>
          )}
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
