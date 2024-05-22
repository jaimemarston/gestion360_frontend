import { addGroup, fetchGroups } from "../../../../store/slices/fileManager/fileManagerSlice";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import { useDispatch } from "react-redux";
import { useToast } from "../../../../hooks/useToast";
import FolderCopyIcon from "@mui/icons-material/FolderCopy";
import React, { useState } from "react";

const RegisterGroup = ({ isDarkMode }) => {
  const [isModal, setIsModal] = useState(false);
  const [isCloseModal, setIsCloseModal] = useState(false);
  const { showToast, ToastComponent } = useToast()

  const [data, setData] = useState({ name: '' });

  const dispatch = useDispatch();

  const refetch = async () => {
    dispatch(fetchGroups());
  };

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
    try {
      
      dispatch(addGroup(data));

 

      showToast('success', 'Grupo creado con éxito');
      closeModal()
    } catch (error) {
      console.log("error", error)
      showToast('error', 'Error al crear el grupo');
    }
  };

  const leftToolbarTemplate = () => (
    <>
      <div className="my-2">
        <Button
          className='p-button-success d-flex align-items-center mr-2'
          onClick={openModal}
        >
          <FolderCopyIcon className="me-2" />
          Crear grupo
        </Button>
      </div>
    </>
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
      <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={save} />
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
        style={{ width: "450px", height: "200px" }}
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

          />
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
      className={
        isDarkMode ? "dark-mode-table grid crud-demo" : "grid crud-demo"
      }
    >
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
