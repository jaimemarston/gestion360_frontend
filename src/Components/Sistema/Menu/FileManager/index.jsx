import React, { useEffect, useState } from "react";

import { FileUploader } from "react-drag-drop-files";
import { RegisterFolder } from "./register-folder";
import { RegisterGroup } from "./register-group";
import "./style-file-manager.scss";
import FileExplorer from "./test";
import usePermission from "../../../../hooks/usePermission";
import groupsService from "../../../../api/services/fileManager/group.service";
import { useToast } from "../../../../hooks/useToast";

export default function FileManager() {
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [files, setFiles] = useState([]);
  const [nameItem, setNameItem] = useState();
  const permission = localStorage.getItem("rol");
  const permissions = usePermission.getPermissionLevel()
  const { showToast, ToastComponent } = useToast()

  const [groups, setGroups] = useState([]);

  const fetchGroups = async () => {
    const result = await groupsService.getAllGroups();

    console.log("result", result)

    const groups = result.map(item => ({
      id: item.id,
      label: item.name,
      father: true,
      children: item.folders.map((folder, index) => {
        let children = [];
        if (folder.label3) {
          children = [{
            id: `${item.id}-${folder.id}-3`,
            label: folder.label3,
            children: folder.documents || [],
          }];
        }
        if (folder.label2) {
          children = [{
            id: `${item.id}-${folder.id}-2`,
            label: folder.label2,
            children: children,
          }];
        }
        return {
          id: `${item.id}-${folder.id}-1`,
          label: folder.label1,
          children: children.length > 0 ? children : folder.documents || [],
        };
      }),
    }));

    setGroups(groups);
  };


  useEffect(() => {

    fetchGroups();
  }, []);

  const handleChange = (selectedFiles) => {
    const selectedFilesArray = Array.from(selectedFiles);
    const pdfFiles = selectedFilesArray.filter(
      (file) => file.type === "application/pdf"
    );
    if (pdfFiles.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...pdfFiles]);
    } else {
      alert("Solo se permiten archivos PDF.");
    }
  };
  const handleItemClick = (itemId) => {
    const selectedItem = groups.find((item) => item.id === itemId);

    if (selectedItem && selectedItem.father === true) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
    setSelectedItemId(itemId);
  };

  useEffect(() => {
    const select = groups.filter((item) =>
      item.id === selectedItemId ? item.label : ""
    );
    const name = select.map((itemName) => itemName.label);
    setNameItem(name);
  }, [selectedItemId]);

  const fileTypes = ["pdf"];




  return (
    <div className="container">
      <div className="row">
        <div className="col-12 d-flex">
          {permissions === 2 ? (<RegisterGroup />) : (<></>)}

          {showModal ? (
            permissions >= 2 ? (
              <RegisterFolder groupName={nameItem} groupID={selectedItemId} />
            ) : (
              <></>
            )
          ) : (
            <></>
          )}
        </div>
        <div className="col-6">
          <FileExplorer date={groups} select={handleItemClick} />
        </div>

        <div className="col-6 d-grid w-50 h-50 justify-content-start">
          <div className="col-12">
            <FileUploader
              multiple={true}
              children={
                <div className="upload-file">
                  <div className="d-flex align-items-center col-10">
                    <i className="pi pi-file" style={{ fontSize: "30px" }} />
                    <p className="ms-2 fw-bolder fs-3">
                      {files.length > 0
                        ? "Precione para subir otro archivo"
                        : "Subir o soltar un archivo aquí"}
                    </p>
                  </div>
                  <div className="d-flex justify-content-end col-2">
                    <p className="fs-4">{fileTypes}</p>
                  </div>
                </div>
              }
              handleChange={handleChange}
              name="file"
              types={fileTypes}
            />
          </div>
          <div
            className={`col-12 align-items-start mt-4 ${files.length < 5 ? "d-flex" : "row"
              }`}
          >
            {files.length > 0
              ? files.map((file, index) => (
                <div
                  key={index}
                  className="col-2 card w-card d-flex align-items-center justify-content-center ms-2 me-4"
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
      {ToastComponent}
    </div>
  );
}
