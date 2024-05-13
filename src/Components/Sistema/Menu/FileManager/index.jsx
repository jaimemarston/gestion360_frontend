import React, { useEffect, useState } from "react";

import { FileUploader } from "react-drag-drop-files";
import { RegisterFolder } from "./register-folder";
import { RegisterGroup } from "./register-group";
import "./style-file-manager.scss";
import FileExplorer from "./test";

export default function FileManager() {
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [files, setFiles] = useState([]);

  const handleChange = (selectedFiles) => {
    // Mapear los archivos seleccionados y filtrar los que son PDF
    const selectedFilesArray = Array.from(selectedFiles);
    const pdfFiles = selectedFilesArray.filter(
      (file) => file.type === "application/pdf"
    );
    if (pdfFiles.length > 0) {
      // Concatenar los nuevos archivos PDF al array existente
      setFiles((prevFiles) => [...prevFiles, ...pdfFiles]);
    } else {
      alert("Solo se permiten archivos PDF.");
    }
  };

  const handleItemClick = (itemId) => {
    setSelectedItemId(itemId);
    console.log("ID del item seleccionado:", itemId);
  };

  const fileTypes = ["pdf"];

  const ITEMS = [
    {id: 13, label: 'group', children: [
      {
        id: 1,
        label: "item-father-1",
        children: [
          {
            id: 2,
            label: "second-level-1",
            children: [
              { id: 3, label: "Ultimo nivel1-item1" },
              { id: 4, label: "Ultimo nivel1-item2" },
              { id: 5, label: "Ultimo nivel1-item3" },
            ],
          },
        ],
      },
      {
        id: 6,
        label: "Bookmarked",
        fileType: "pinned",
        children: [
          {
            id: 7,
            label: "Learning materials",
          },
          { id: 8, label: "News" },
          { id: 9, label: "Forums" },
          { id: 10, label: "Travel documents" },
        ],
      },
      { id: 11, label: "History" },
      { id: 12, label: "Trash" },
    ]}
  ];

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 d-flex">
          <RegisterGroup />
           <RegisterFolder /> 
        </div>
        <div className="col-6">
          <FileExplorer date={ITEMS} select={handleItemClick} />
        </div>

        <div className="col-6 d-grid w-50 h-50 justify-content-start">
          <div className="col-12">
            <FileUploader
              multiple={true}
              children={
                <div className="upload-file">
                  <div className="d-flex align-items-center col-10">
                    <i className="pi pi-file" style={{ fontSize: "22px" }} />
                    <p className="ms-2 fs-5">
                      {files.length > 0
                        ? "Precione para subir otro archivo"
                        : "Subir o soltar un archivo aquí"}
                    </p>
                  </div>
                  <div className="d-flex justify-content-end col-2">
                    <p className="fs-5">{fileTypes.join(", ")}</p>
                  </div>
                </div>
              }
              handleChange={handleChange}
              name="file"
              types={fileTypes}
            />
          </div>
          <div
            className={`col-12 align-items-start mt-4 ${
              files.length < 5 ? "d-flex" : "row"
            }`}
          >
            {files.length > 0
              ? files.map((file, index) => (
                  <div
                    key={index}
                    className="col-2 card w-card d-flex align-items-center justify-content-center me-4"
                  >
                    <div className="file-item d-grid justify-content-center">
                      <i className="pi pi-file text-center size-file-card" />
                      <p className="ms-2 w-p-card fs-5 text-center">
                        {file.name.length > 22
                          ? file.name.slice(0, 22) + "... pdf"
                          : file.name}
                      </p>
                    </div>
                  </div>
                ))
              : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
