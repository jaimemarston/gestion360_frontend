import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

const RegisterGroup = ({ isDarkMode }) => {
  const [usersId, setUsersId] = useState([]);
  let empty = {
    nameGroup: "",
  };
  const [isModal, setIsModal] = useState(false);
  const [isCloseModal, setIsCloseModal] = useState(false);
  const toast = useRef(null);

  const [product, setProduct] = useState(empty);

  const openModal = () => {
    setIsModal(!isModal);

    if (product.length === 0) {
      setProduct({});
    }
  };

  const closeModal = () => {
    setIsCloseModal(!isCloseModal);
  };

  const onInputChange = (e, name) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const saveProduct = () => {
    console.log(product);
  };

  const leftToolbarTemplate = () => (
    <>
      <div className="my-2">
        <Button
          label="Crear grupo"
          icon="pi pi-plus"
          className="p-button-success mr-2"
          onClick={openModal}
        />
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
            setProduct({});
        }}
      />
      <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
    </>
  );

  const CrudUsuario = ({
    isModal,
    productDialogFooter,
    openModal,
    product,
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
          <label htmlFor="nameGroup">Carpeta principal</label>
          <InputText
            id="nameGroup"
            name="nameGroup"
            value={product?.nameGroup?.trim()}
            onChange={(e) => onInputChange(e, "nameGroup")}
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
          <Toast ref={toast} />
          <Toolbar
            style={{ background: "transparent", border: "none" }}
            left={leftToolbarTemplate}
          ></Toolbar>
          {isModal &&
            CrudUsuario({
              isModal,
              openModal,
              product,
              setProduct,
              onInputChange,
              productDialogFooter
            })}
        </div>
      </div>
    </div>
  );
};

export { RegisterGroup };
