import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import React, { useState } from "react";

const ViewFile = () => {
  const [isModalView, setIsModalView] = useState(false);


  const openModal = () => {
    setIsModalView(!isModalView);
  };

  const leftToolbarTemplate = () => (
        <div
          className='size-icon-card pi pi-eye'
          onClick={() => openModal()}
        >
        </div>
  );

  const productDialogFooter = (
    <>
      <div
        icon="size-icon-card pi pi-eye"
        className="p-button-text"
        onClick={() => {
          openModal();
        }}
      />
    </>
  );

  const Handler = ({
    isModalView,
    productDialogFooter,
    openModal,
  }) => {
    return (
      <Dialog
        visible={isModalView}
        style={{ width: "650px", height: "400px" }}
        header="Crear grupo"
        modal
        className="p-fluid"
        footer={productDialogFooter}
        onHide={openModal}
      >
        <div className="text-center">Este componente es para visualizar el archivo</div>
      </Dialog>
    );
  };

  return (

      <div className="size-icon-card">
          <Toolbar
            style={{ background: "transparent", border: "none", padding: "0px" }}
            left={leftToolbarTemplate}
          ></Toolbar>
          {isModalView &&
            Handler({
              isModalView,
              openModal,
              productDialogFooter
            })}
      </div>
  );
};

export { ViewFile };
