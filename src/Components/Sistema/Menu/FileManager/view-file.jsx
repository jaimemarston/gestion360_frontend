import { Button } from "@mui/material";
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import React, { useState } from "react";

const ViewFile = ({ idFile, urlFile }) => {
  const [isModalView, setIsModalView] = useState(false);

  const openModal = () => {
    setIsModalView(!isModalView);
  };

  const handleDownload = () => {
    if (urlFile) {
      window.location.href = urlFile;
    }
  };

  const leftToolbarTemplate = () => (
    <div className="size-icon-card pi pi-eye" onClick={() => openModal()}></div>
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
      <button onClick={handleDownload} className="btn fs-5 pe-5 pt-3 pb-3 ps-5 p-button ">
        Descargar
        <div
          className="ml-2 size-icon-card pi pi-download"/>
      </button>
    </>
  );

  const Handler = ({ isModalView, productDialogFooter, openModal }) => {
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
        <div className="text-center">
          Este componente es para visualizar el archivo
        </div>
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
          productDialogFooter,
        })}
    </div>
  );
};

export { ViewFile };
