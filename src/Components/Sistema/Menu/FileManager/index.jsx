import React, { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { RegisterFolder } from "./modals/register-folder";
import { RegisterGroup } from "./modals/register-group";
import "./style-file-manager.scss";
import FileExplorer from "./test";
import usePermission from "../../../../hooks/usePermission";
import { useToast } from "../../../../hooks/useToast";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGroups,
  addFile,
  fetchFiles,
} from "../../../../store/slices/fileManager/fileManagerSlice";
import { PDFViewer } from "@react-pdf/renderer";
import { Image } from "primereact/image";
import { ViewFile } from "./modals/view-file";
import { DeleteFile } from "./modals/delete-file";
import { Tooltip } from 'primereact/tooltip';
import { EditFolder } from "./modals/edit-folder";

export default function FileManager() {
  const [selectedFolderId, setselectedFolderId] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [files, setFiles] = useState([]);
  const [pdfUrl, setPdfUrl] = useState();
  const [nameGroup, setNameGroup] = useState();
  const [nameFolder, setNameFolder] = useState();
  const [nameFolder2, setNameFolder2] = useState("");
  const [nameFolder3, setNameFolder3] = useState("");
  
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
            id: `${item.id}-${folder.id}-${doc.uuid}`,
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
    const pdfFiles = selectedFilesArray;

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

  const createFolder = (value) => {
    setShowModal(value);
  };

  const handleFolderId = (itemId) => {
    if (typeof itemId === "string") {
      const rootItemId = parseInt(itemId.split("-")[1]);
      const groupId = parseInt(itemId.split("-")[0]);
      setSelectedGroupId(groupId);
      setselectedFolderId(rootItemId);
      setFiles([])
      }
    if(typeof itemId === "number"){
      setSelectedGroupId(itemId)
    }
  };

  const handleGroupId = (itemId) => {
    setSelectedGroupId(parseInt(itemId));
  };

  const fileTypes = ["pdf", "jpg", "jpeg", "png"];

  const handleSubmit = async () => {
    const payload = {
      files: [...files],
      idFolder: selectedFolderId,
    };
    try {
      const resultAction = await dispatch(addFile(payload));
      if (resultAction.error) {
        showToast("error", "Error al subir archivos");
      } else {
        setFiles([]);
        dispatch(fetchFiles(payload));
        showToast("success", "Archivos subidos con éxito");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const deleteFileArray = (Files, idFileDelete) => {
    const newArray = [...Files];
    newArray.splice(idFileDelete, 1);
    setFiles(newArray);
  }

  const uploadedFiles = useSelector((state) => state.FileManager.files);
  const uploadedGroups = useSelector((state) => state.FileManager.groups);
  const isLoading = useSelector((state) => state.FileManager.isLoadingFile);

  const getFiles = async () => {
    const payload = {
      idFolder: selectedFolderId,
    };
    dispatch(fetchFiles(payload));
  };

  const handleDownload = (url) => {
    if (url) {
      window.location.href = url;
    }
  };

  useEffect(() => {
    if (selectedFolderId !== null) {
      getFiles();
    }
  }, [selectedFolderId]);

  useEffect(() => {
    const select = groups.filter((item) =>
      item.id === selectedGroupId ? item.label : ""
    );
    const name = select.map((itemName) => itemName.label);

    if (selectedGroupId && selectedFolderId) {
      const selectedGroup = uploadedGroups && uploadedGroups.find((group) => group.id === selectedGroupId);
    
      if (selectedGroup) {
        const selectedFolder = selectedGroup.folders.find(
          (folder) => folder.id === selectedFolderId
        );
    
        if (selectedFolder) {
          setNameFolder(selectedFolder.label1)
          setNameFolder2(selectedFolder.label2 ? selectedFolder.label2 : "")
          setNameFolder3(selectedFolder.label3 ? selectedFolder.label3 : "")
        }
      }
    }
    setNameGroup(name);
  }, [selectedGroupId, selectedFolderId]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 d-flex">
          {permissions === 2 && <RegisterGroup />}

          {showModal && (
            <RegisterFolder groupName={nameGroup} groupID={selectedGroupId} />
          )}
           {selectedFolderId && showModal && (
            <EditFolder folderName1={nameFolder} folderName2={nameFolder2} folderName3={nameFolder3} groupName={nameGroup} folderId={selectedFolderId} />
          )}
        </div>
        <div className="col-6">
          <FileExplorer
            date={groups}
            showCreateFolder={createFolder}
            selectGroupId={handleGroupId}
            selectIdFolder={handleFolderId}
          />
        </div>

        <div className={`col-6 d-grid w-50 h-50 ${selectedFolderId ? "justify-content-start" : "justify-content-center"}`}>
          <div className="col-12">
            <h3>{nameGroup} {nameFolder && " > " + nameFolder}</h3>
            {!selectedFolderId ? (
              <h1>Seleccione una carpeta</h1>
            ) : (
            <FileUploader
              multiple={true}
              children={
                <div className="upload-file">
                  <div className="d-flex align-items-center col-8">
                    <i className="pi pi-file" style={{ fontSize: "30px" }} />
                    <p className="ms-2 fw-bolder fs-3">
                      {files.length > 0
                        ? "Precione para subir otro archivo"
                        : "Subir o soltar un archivo aquí"}
                    </p>
                  </div>
                  <div className="d-flex justify-content-end col-4">
                    <p className="fs-4">pdf, jpg, jpeg, png</p>
                  </div>
                </div>
              }
              handleChange={handleChange}
              name="file"
              types={fileTypes}
            />
            )}
          </div>

          {selectedFolderId !== null &&uploadedFiles.data && uploadedFiles.data.length > 0 && (
            <h1>Archivos subidos</h1>
          )}
          {isLoading && selectedFolderId !== null && <h2>Cargando...</h2>}
          <div
            className={`col-12 align-items-start mt-4 ${uploadedFiles.data && uploadedFiles.data.length < 5
              ? "d-flex"
              : "row"
              }`}
          >
            {selectedFolderId !== null && uploadedFiles.data &&
              uploadedFiles.data.length > 0 &&
              !isLoading ? (
              uploadedFiles.data.map((file, index) => (
                <div
                  key={index}
                  className="col-2 card w-card pe-auto d-flex align-items-center justify-content-center ms-2 me-4"
                >
                  <div className="file-item d-grid justify-content-center">
                    {file.mimetype === "application/pdf" ? (
                      <i className="pi pi-file text-center size-file-card" />
                    ) : (
                      <div className="d-flex justify-content-center">
                        <img className="img-card-file" src={file.url} />
                      </div>
                    )}
                    <Tooltip position="top" target=".text" />
                    <p data-pr-tooltip={file.filename} className="w-p-card text fs-5 d-flex m-auto text-center">
                      {file.filename.length > 11
                        ? file.filename.slice(0, 5) + "..." + file.mimetype.split("/")[1]
                        : file.filename}
                    </p>
                    <div className="d-flex w-full justify-content-center">
                      <div className="w-p-card-icon justify-content-between d-flex pb-2">
                        <ViewFile objectFile={file} idFile={file.id} folderId={selectedFolderId} mimetype={file.mimetype} urlFile={file.url} />
                        <div
                          onClick={() => handleDownload(file.url)}
                          className="size-icon-card pi pi-download"
                        ></div>
                        <DeleteFile buttonIcon={true} folderId={selectedFolderId} fileId={file.id} />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : selectedFolderId !== null && !isLoading && uploadedFiles.data ? (
              <h2>Esta carpeta no contiene archivos</h2>
            ) : (
              <></>
            )}
          </div>

          {files.length > 0 && <h1>Archivos por subir</h1>}

          <div
            className={`col-12 align-items-start mt-4 ${files.length < 5 ? "d-flex" : "row"
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
                    <Tooltip position="top" target=".text-center" />
                    <p data-pr-tooltip={file.filename} className="ms-2 w-p-card fs-5 text-center">
                      {file.filename.length > 11
                        ? file.filename.slice(0, 5) + "..." + file.mimetype.split("/")[1]
                        : file.filename}
                    </p>
                    <div className="d-flex w-full justify-content-center">
                      <div className="w-p-card-icon justify-content-between d-flex pb-2">
                        <div onClick={() => deleteFileArray(files, index)} className="bg-trash cursor-pointer size-icon-card pi pi-trash"></div>

                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="col-12 d-flex justify-content-end">
            {files.length > 0 && (
              <button
                className="btn fs-5 pe-5 pt-3 pb-3 ps-5 p-button "
                onClick={handleSubmit}
              >
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
