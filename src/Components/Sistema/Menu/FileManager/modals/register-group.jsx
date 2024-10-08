import { addGroup } from "../../../../../store/slices/fileManager/fileManagerSlice";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import { useDispatch } from "react-redux";
import { useToast } from "../../../../../hooks/useToast";
import FolderCopyIcon from "@mui/icons-material/FolderCopy";
import React, { useState } from "react";
import classNames from 'classnames';

const RegisterGroup = () => {
  const [isModal, setIsModal] = useState(false);
  const [isCloseModal, setIsCloseModal] = useState(false);
  const { showToast, ToastComponent } = useToast()

  const [data, setData] = useState({ name: '' });
  const [submitted, setSubmitted] = useState(false);

  const dispatch = useDispatch();

  const openModal = () => {
    setIsModal(!isModal);

    if (data.length === 0) {
      setData({});
    }
  };

  const closeModal = () => {
    setIsCloseModal(!isCloseModal);
    setIsModal(!isModal);
  };

  const onInputChange = (e, name) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const save = async () => {

    if(!data.name){
      setSubmitted(true)
      return;
    }else{
      setSubmitted(false)
    }

    try{
      const payload = {
        ...data,
      }
      const resultAction = await dispatch(addGroup(payload));
      if (resultAction.error) {
        showToast('error', 'Error al intentar crear un grupo');
      } else {
        showToast('success', 'Grupo creado con éxito');
        closeModal()
      }
    }catch{
      console.log(resultAction)
    }
  };

  const leftToolbarTemplate = () => (
      <div className="my-1">
        <button
          className='btn btn-outline-primary py-3 px-3 d-flex align-items-center'
          onClick={openModal}
        >
          <FolderCopyIcon className="me-2" />
          Crear grupo
        </button>
      </div>
  );

  const productDialogFooter = (
    <>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-text"
        onClick={() => {
          openModal();
          setData({});
        }}
      />
      <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={()=> {save(), setData({})}} />
    </>
  );

  const Handler = ({
    isModal,
    productDialogFooter,
    openModal,
    data,
    onInputChange,
  }) => {
    return (
      <Dialog
        visible={isModal}
        style={{ width: "450px", height: "220px" }}
        header="Crear grupo"
        modal
        className="p-fluid"
        footer={productDialogFooter}
        onHide={openModal}
      >
        <div className="field">
          <label htmlFor="name">Carpeta principal</label>
          <InputText
            id="name"
            name="name"
            value={data?.name?.trim()}
            onChange={(e) => onInputChange(e, "name")}
            required
            autoFocus
            className={classNames({
              'p-invalid': submitted && !data.name,
            })}
          />
          {submitted && !data.name && (
            <small className='p-invalid'>El nombre de el grupo es requerido</small>
          )}
        </div>

        <div
          className="field"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        ></div>
      </Dialog>
    );
  };

  return (
    <div
      className="grid crud-demo">
      <div className="col-12">
        <div>
          <Toolbar
            style={{ background: "transparent", border: "none" }}
            left={leftToolbarTemplate}
          ></Toolbar>
          {isModal &&
            Handler({
              isModal,
              openModal,
              data,
              setData,
              onInputChange,
              productDialogFooter
            })}
        </div>
      </div>
      {ToastComponent}
    </div>
  );
};

export { RegisterGroup };
