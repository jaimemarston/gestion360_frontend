import React, { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { RegisterFolder } from "./register-folder";
import { RegisterGroup } from "./register-group";
import "./style-file-manager.scss";
import FileExplorer from "./test";
import usePermission from "../../../../hooks/usePermission";
import { useToast } from "../../../../hooks/useToast";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGroups,
  addFile,
} from "../../../../store/slices/fileManager/fileManagerSlice";

export default function FileManager() {
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [files, setFiles] = useState([]);
  const [nameItem, setNameItem] = useState();
  const permissions = usePermission.getPermissionLevel();
  const { showToast, ToastComponent } = useToast();

  const dispatch = useDispatch();

  const groups = useSelector((state) =>
    state.FileManager.groups.map((item) => ({
      id: item.id,
      label: item.name,
      father: true,
      children: item?.folders
        ? item.folders.map((folder) => {
            const documents = folder.documents.map((doc) => ({
              id: doc.uuid,
              label: doc.filename,
              mimetype: doc.mimetype,
              tags: doc.tags,
              isFile: true,
            }));
            let children = [];
            if (folder.label3) {
              children = [
                {
                  id: `${item.id}-${folder.id}-3`,
                  label: folder.label3,
                  children: documents,
                },
              ];
            }
            if (folder.label2) {
              children = [
                {
                  id: `${item.id}-${folder.id}-2`,
                  label: folder.label2,
                  children: children.length > 0 ? children : documents,
                },
              ];
            }
            return {
              id: `${item.id}-${folder.id}-1`,
              label: folder.label1,
              children: children.length > 0 ? children : documents,
            };
          })
        : [],
    }))
  );

  const fetch = async () => {
    dispatch(fetchGroups());
  };

  useEffect(() => {
    fetch();
  }, []);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]); // Remueve el prefijo data
      reader.onerror = (error) => reject(error);
    });
  };

  const handleChange = async (selectedFiles) => {
    const selectedFilesArray = Array.from(selectedFiles);
    const pdfFiles = selectedFilesArray.filter(
      (file) => file.type === "application/pdf"
    );

    if (pdfFiles.length > 0) {
      const pdfFilesWithBase64 = await Promise.all(
        pdfFiles.map(async (file) => {
          const base64Content = await convertToBase64(file);
          return {
            mimetype: file.type,
            filename: file.name,
            base64Content: base64Content,
            tags: ["tag1", "tag2", "tag3"],
          };
        })
      );

      setFiles((prevFiles) => [...prevFiles, ...pdfFilesWithBase64]);
    } else {
      alert("Solo se permiten archivos PDF.");
    }
  };

const createFolder = ((value) => {
  setShowModal(value);
})

  const handleFolderId = (itemId) => {
    const rootItemId = parseInt(itemId.split('-')[1]);
    setSelectedItemId(rootItemId);
  };

  const handleGroupId = (itemId) => {
    setSelectedGroupId(parseInt(itemId));
  };

  useEffect(() => {
    const select = groups.filter((item) =>
      item.id === selectedItemId ? item.label : ""
    );
    const name = select.map((itemName) => itemName.label);
    setNameItem(name);
  }, [selectedItemId]);

  const fileTypes = ["pdf"];

  const handleSubmit = async () => {
    const payload = {
      files: [...files],
      idFolder: selectedItemId,
    };
    try {
      const resultAction = await dispatch(addFile(payload));
      if (resultAction.error) {
        showToast("error", "Error al subir archivos");
      } else {
        setFiles([]);
        showToast("success", "Archivos subidos con éxito");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 d-flex">
          {permissions === 2 && <RegisterGroup />}

          {showModal && (
            <RegisterFolder groupName={nameItem} groupID={selectedGroupId} />
          )}
        </div>
        <div className="col-6">
          <FileExplorer date={groups} showCreateFolder={createFolder} selectGroupId={handleGroupId} selectIdFolder={handleFolderId} />
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
            className={`col-12 align-items-start mt-4 ${
              files.length < 5 ? "d-flex" : "row"
            }`}
          >
            {files.length > 0 &&
              files.map((file, index) => (
                <div
                  key={index}
                  className="col-2 card w-card d-flex align-items-center justify-content-center ms-2 me-4"
                >
                  <div className="file-item d-grid justify-content-center">
                    <i className="pi pi-file text-center size-file-card" />
                    <p className="ms-2 w-p-card fs-5 text-center">
                      {file.filename.length > 22
                        ? file.filename.slice(0, 22) + "... pdf"
                        : file.filename}
                    </p>
                  </div>
                </div>
              ))}
          </div>
          <div className="col-12 d-flex justify-content-end">
            {files.length > 0 && (
              <button className="btn fs-5 pe-5 pt-3 pb-3 ps-5 p-button " onClick={handleSubmit}>
                Enviar
              </button>
            )}
          </div>
        </div>
      </div>
      {ToastComponent}
    </div>
  );
}
