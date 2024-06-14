import { Button } from "@mui/material";
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import React, { useState, useEffect } from "react";
import { DeleteFile } from "./delete-file";
import { PDFViewer } from "@react-pdf/renderer";

const ViewFile = ({ idFile, folderId, urlFile, mimetype, objectFile }) => {
  const [isModalView, setIsModalView] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const openModal = () => {
    setIsModalView(!isModalView);
  };

  const handleDownload = () => {
    if (urlFile) {
      window.location.href = urlFile;
    }
  };

  const getPdfUrl = async () => {
    if (mimetype === "application/pdf") {
      const response = await fetch(urlFile);
      const arrayBuffer = await response.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: "application/pdf" });
      const urlPDF = URL.createObjectURL(blob);
      setPdfUrl(urlPDF);

      return urlFile;
    }
  };

  useEffect(() => {
    getPdfUrl();
  }, []);

  const Print = () => (
    <div>
      <PDFViewer
        height={570}
        width={"100%"}
        src={`${pdfUrl}`}
        style={{ display: "block" }}
      ></PDFViewer>
    </div>
  );

  const leftToolbarTemplate = () => (
    <div className="size-icon-card pi pi-eye" onClick={() => openModal()}></div>
  );

  const productDialogFooter = (
    <div className="d-flex justify-content-center">
      <div className={`${mimetype !== "application/pdf" && "ml-5"}`}>
        <DeleteFile folderId={folderId} fileId={idFile} />
      </div>
      {mimetype !== "application/pdf" && (
        <button
          onClick={handleDownload}
          className="btn ml-2 fs-5 pe-5 pt-3 pb-3 ps-5 p-button "
        >
          Descargar
          <div className="size-icon-card pi pi-download" />
        </button>
      )}
    </div>
  );

  const Handler = ({ isModalView, productDialogFooter, openModal }) => {
    return (
      <Dialog
        visible={isModalView}
        style={mimetype === "application/pdf" ? { width: "900px", height: "730px" } : { width: "650px", height: "600px" }}
        header="Crear grupo"
        modal
        className="p-fluid"
        footer={productDialogFooter}
        onHide={openModal}
      >
        <h2 className="fw-bold">{objectFile.filename}</h2>
        {mimetype !== "application/pdf" ? (
          <>
            <div className="d-flex justify-content-center">
              <div
                className="img-visualicer"
                style={{ backgroundImage: `url(${urlFile})` }}
              ></div>
            </div>
          </>
        ) : (
          <div className="m-auto ">{Print({})}</div>
        )}
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
