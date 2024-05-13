import React, { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { FileUploader } from "react-drag-drop-files";
import { RegisterFolder } from "./register-folder";
import { RegisterGroup } from "./register-group";
import "./style-file-manager.scss";

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
      setFiles((prevFiles) => [...prevFiles,...pdfFiles]);
    } else {
      alert("Solo se permiten archivos PDF.");
    }
  };


  const handleItemClick = (itemId) => {
    setSelectedItemId(itemId);
    console.log("ID del item seleccionado:", itemId);
  };

  useEffect(() => {
    console.log(files);
  }, [files]);

  const fileTypes = ["pdf"];

  const Arr = [
    {
      id: 1,
      father: "item-father-1",
      // Nivel 2
      secondLevel: [
        {
          id: 2,
          title: "second-level-1",
          // Nivel 3
          thirdLevel: [
            { id: 3, title: "Ultimo nivel1-item1" },
            { id: 4, title: "Ultimo nivel1-item2" },
            { id: 5, title: "Ultimo nivel1-item3" },
          ],
        },
      ],
    },
    {
      id: 7,
      father: "item-father-2",
      // Nivel 2 opcional
      secondLevel: [
        {
          id: 8,
          title: "second-level-2",
          // Nivel 3 opcional
          thirdLevel: [
            { id: 9, title: "Ultimo nivel2-item1" },
            { id: 10, title: "Ultimo nivel2-item2" },
            { id: 11, title: "Ultimo nivel2-item3" },
          ],
        },
      ],
    },
    {
      id: 13,
      father: "item-father-3",
      // Solo un nivel
    },
    {
      id: 14,
      father: "item-father-4",
      // Nivel 2
      secondLevel: [
        {
          id: 15,
          title: "second-level-3",
          // Nivel 3
          thirdLevel: [
            { id: 16, title: "Ultimo nivel3-item1" },
            { id: 17, title: "Ultimo nivel3-item2" },
            { id: 18, title: "Ultimo nivel3-item3" },
          ],
        },
      ],
    },
    {
      id: 20,
      father: "item-father-5",
      // Solo un nivel
    },
    {
      id: 21,
      father: "item-father-6",
      secondLevel: [
        {
          id: 22,
          title: "second-level-6",
          thirdLevel: [
            { id: 25, title: "Ultimo nivel3-item1" },
            { id: 26, title: "Ultimo nivel3-item2" },
            { id: 27, title: "Ultimo nivel3-item3" },
          ],
        },
        { id: 23, title: "second-level-7" },
        { id: 24, title: "second-level-8" },
      ],
    },
  ];

  return (
    <div className="container">
      <div className="row">
      <div className="col-10">
        <RegisterGroup />
      </div>
      <div className="col-2">
        {showModal ? (
          <RegisterFolder />
        ) : (<></>)}
      </div>
        <div className="col-6">
          <Box sx={{ height: 220, maxWidth: 400 }}>
            {Arr.map((item, index) => (
              <SimpleTreeView key={index}>
                <TreeItem
                  itemId={item.id}
                  label={item.father}
                  onClick={() => {handleItemClick(item.id), setShowModal(true)}}
                >
                  {item.secondLevel &&
                    item.secondLevel.map((secondLevelItem) => (
                      <TreeItem
                        key={secondLevelItem.id}
                        itemId={secondLevelItem.id}
                        label={secondLevelItem.title}
                        onClick={() => {handleItemClick(secondLevelItem.id), setShowModal(true)}} // Manejar clic en el segundo nivel
                      >
                        {secondLevelItem.thirdLevel &&
                          secondLevelItem.thirdLevel.map((thirdLevelItem) => (
                            <TreeItem
                              key={thirdLevelItem.id}
                              itemId={thirdLevelItem.id}
                              label={thirdLevelItem.title}
                              onClick={() => {handleItemClick(thirdLevelItem.id), setShowModal(true)}} // Manejar clic en el tercer nivel
                            />
                          ))}
                      </TreeItem>
                    ))}
                </TreeItem>
              </SimpleTreeView>
            ))}
          </Box>
        </div>

        <div className="col-6 d-grid w-50 justify-content-center">
          <FileUploader
            multiple={true}
            children={
              <div className="upload-file">
                <div className="d-flex align-items-center col-10">
                  <i className="pi pi-file" style={{ fontSize: "22px" }} />
                  <p className="ms-2 fs-5">
                    {files.length > 0
                     ? 'Precione para subir otro archivo'
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
          <div className={`col-12 mt-4 ${files.length < 5 ? 'd-flex' : 'row' }`}>
            {files.length > 0
             ? files.map((file, index) => (
                  <div key={index} className="col-2 card w-card d-flex align-items-center justify-content-center me-4">
                    <div className="file-item d-grid justify-content-center">
                      <i className="pi pi-file text-center size-file-card" />
                      <p className="ms-2 w-p-card fs-5 text-center">{file.name.length > 22 ? file.name.slice(0, 22) + '... pdf' : file.name}</p>
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
