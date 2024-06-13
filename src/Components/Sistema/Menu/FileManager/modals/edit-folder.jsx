import { addFolder, fetchGroups } from '../../../../../store/slices/fileManager/fileManagerSlice';
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

const EditFolder = ({ isDarkMode, label1, label2, label3, groupName, groupID }) => {
  const [usersId, setUsersId] = useState([]);
  let empty = {
    label1: label1,
    label2: label2,
    label3: label3,
  };
  const [listProduct, setlistProduct] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const [newData, setNewData] = useState(null);
  const [isCloseModal, setIsCloseModal] = useState(false);
  const [value, setValue] = useState(empty.estado);
  const [selectedUsers, setSelectedProducts] = useState([]);

  const [data, setData] = useState(empty);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const dt = useRef(null);

  const { showToast, ToastComponent } = useToast()

  const dispatch = useDispatch();

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

    if (data.length === 0) {
      setData({});
    }
  };

  const closeModal = () => {
    setIsModal(!isModal);
    setIsCloseModal(!isCloseModal);
  };

  const save = async () => {
    setSubmitted(true);
  
    const payload = {
     ...data,
      groupId: groupID,
      usersId: selectedUsers.map((item) => item.id),
    };
    try {
      const resultAction = await dispatch(addFolder(payload));
      if (resultAction.error) {
        showToast('error', 'Error al intentar crear una carpeta')
      } else {
        showToast('success', 'Carpeta creada con éxito');
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

  useEffect(() => {
    if (selectedUsers !== null) {
      const id = selectedUsers.map((item) => item.id);
      setUsersId(id)
      empty.usersId = id;
    }
  }, [selectedUsers])


  const leftToolbarTemplate = () => (
    <>
      <div className='my-2'>
        <Button
          className='p-button-success d-flex justify-content-center mr-2'
          onClick={openModal}
        >
          <FolderIcon className='me-2' />
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
        style={{ width: '700px', height: "320px" }}
        header={`Grupo seleccionado: ${groupName}`}
        modal
        className='p-fluid'
        footer={productDialogFooter}
        onHide={openModal}
      >
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
          setData({});
        }}
      />
      <Button
        label='Guardar'
        icon='pi pi-check'
        className='p-button-text'
        onClick={()=> {save(), setData({})}}
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
              value,
              setValue,
            })}
        </div>
      </div>
    </div>
  );
};

export { EditFolder };
