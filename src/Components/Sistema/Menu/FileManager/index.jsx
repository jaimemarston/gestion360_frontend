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
import { ViewFile } from "./modals/view-file";
import { DeleteFile } from "./modals/delete-file";
import { Tooltip } from "primereact/tooltip";
import { EditFolder } from "./modals/edit-folder";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { DeleteFolder } from "./modals/delete-folder";
import AddTags from "./modals/add-tags";

import { CustomTablePagination, Root } from "./tablePagination/table-pagination";
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { EditGroup } from "./modals/edit-group";
import { DeleteGroup } from "./modals/delete-group";
import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';

export default function FileManager() {
  const [selectedFolderId, setselectedFolderId] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [files, setFiles] = useState([]);
  const [pdfUrl, setPdfUrl] = useState();
  const [nameGroup, setNameGroup] = useState("");
  const [nameFolder, setNameFolder] = useState();
  const [parentFolder, setParentFolder] = useState(false);
  const [folderSe, setFolderSe] = useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalElements, setTotalElements] = useState(0);
  const [date, setDate] = React.useState(null);

  const permissions = usePermission.getPermissionLevel();
  const { showToast, ToastComponent } = useToast();

  const dispatch = useDispatch();

  const transformFolder = (folder) => {
    const children = folder.children.map(transformFolder);
    const documents = folder.documents?.map((doc) => ({
      id: doc.uuid,
      label: doc.filename,
      mimetype: doc.mimetype,
      tags: doc.tags,
      isFile: true,
    })) || [];

    return {
      id: folder.id + "-" + folder.uuid,
      label: folder.label,
      children: [...children, ...documents],
    };
  };

  const useTransformedGroups = () => {
    return useSelector((state) =>
      state.FileManager.groups.map((group) => ({
        id: group.id,
        label: group.name,
        father: true,
        children: group.folders?.map(transformFolder),
      }))
    );
  };

  const groups = useTransformedGroups();

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
    setselectedFolderId(itemId);
    setFiles([]);
    setParentFolder(false);
  };

  const handleGroupId = (itemId) => {
    setParentFolder(true);
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
  };

  const uploadedFiles = useSelector((state) => state.FileManager.files);
  const uploadedGroups = useSelector((state) => state.FileManager.groups);
  const isLoading = useSelector((state) => state.FileManager.isLoadingFile);

  const getFiles = async () => {
    const payload = {
      idFolder: selectedFolderId,
      page: page + 1,
      rowsPerPage: rowsPerPage

    };
    dispatch(fetchFiles(payload));
  };

  useEffect(() => {
    if (uploadedFiles.data && uploadedFiles.data.totalRecords > 0) {
      setRowsPerPage(uploadedFiles.data.per_page)
      setTotalElements(uploadedFiles.data.totalRecords)
    }
  }, [uploadedFiles])

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
  }, [selectedFolderId, page, rowsPerPage]);

  addLocale('es', {
    firstDayOfWeek: 1,
    showMonthAfterYear: true,
    monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    today: 'Hoy',
    clear: 'Limpiar'
  });

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 d-flex">
          <div className="d-flex col-8">
            {permissions === 2 && <RegisterGroup />}
            {permissions === 2 && nameGroup !== "" &&

              selectedGroupId !== null && <EditGroup name={nameGroup} id={selectedGroupId} />}

            {selectedGroupId &&
              showModal &&
              !isLoading && (
                <DeleteGroup groupId={selectedGroupId} />
              )}

            {showModal && (
              <RegisterFolder
                parentFolder={parentFolder}
                folderId={selectedFolderId}
                groupName={nameGroup}
                groupID={selectedGroupId}
              />
            )}
            {selectedFolderId && showModal && (
              <EditFolder
                folderName={nameFolder}
                groupName={nameGroup}
                folderId={selectedFolderId}
              />
            )}
            {selectedFolderId &&
              showModal &&
              !isLoading &&
              uploadedFiles.data &&
              uploadedFiles.data.data.length === 0 && (
                <DeleteFolder folderId={selectedFolderId} />
              )}
          </div>
          <div className="col-4 d-flex align-items-center justify-content-center">
            <div className="mb-3">
              <Calendar style={{width: "220px"}} locale="es" placeholder="Filtrar por año" value={date} onChange={(e) => setDate(e.value)} view="year" dateFormat="yy" />
            </div>
          </div>
        </div>
        <div className="col-6 folder-list">
          <FileExplorer
            groups={groups}
            showCreateFolder={createFolder}
            selectGroupId={handleGroupId}
            selectIdFolder={handleFolderId}
            setNameFolder={setNameFolder}
            setNameGroup={setNameGroup}
          />
        </div>

        <div
          className={`col-6 d-grid w-50 h-50 ${selectedFolderId
            ? "justify-content-start"
            : "justify-content-center"
            }`}
        >
          <div className="col-12">
            <Breadcrumbs className="mb-3" aria-label="breadcrumb">
              <Typography className="cursor-none" color="text.primary">
                {nameGroup}
              </Typography>
              {nameFolder && (
                <Typography className="cursor-none" color="text.primary">
                  {nameFolder}
                </Typography>
              )}
            </Breadcrumbs>

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

          {selectedFolderId !== null &&
            uploadedFiles.data &&
            uploadedFiles.data.totalRecords > 0 && <h1>Archivos subidos</h1>}
          {isLoading && selectedFolderId !== null && <h2>Cargando...</h2>}
          <div
            className={`col-12 h-group-file align-items-start mt-4 ${uploadedFiles.data && uploadedFiles.data.totalRecords < 5
              ? "d-flex"
              : "row"
              }`}
          >
            {selectedFolderId !== null &&
              uploadedFiles.data &&
              uploadedFiles.data.totalRecords > 0 &&
              !isLoading ? (
              uploadedFiles.data.data.map((file, index) => (
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
                    <p
                      data-pr-tooltip={file.filename}
                      className="w-p-card text fs-5 d-flex m-auto text-center"
                    >
                      {file.filename.length > 18
                        ? file.filename.slice(0, 15) +
                        "..." +
                        file.mimetype.split("/")[1]
                        : file.filename}
                    </p>
                    <div className="d-flex w-full align-items-center justify-content-center">
                      <div className="w-p-card-icon justify-content-between d-flex pb-3 pt-2">
                        <ViewFile
                          objectFile={file}
                          idFile={file.id}
                          folderId={selectedFolderId}
                          mimetype={file.mimetype}
                          urlFile={file.url}
                        />
                        <div
                          onClick={() => handleDownload(file.url)}
                          className="size-icon-card pi pi-download"
                        ></div>
                        <DeleteFile
                          buttonIcon={true}
                          folderId={selectedFolderId}
                          fileId={file.id}
                        />

                        <AddTags GetFiles={getFiles} metadata={file.metadata} fileId={file.id} />
                      </div>
                    </div>
                    {file.filename.length < 12 && (
                      <>
                        <p className="mb-4"></p>
                      </>
                    )}
                  </div>

                </div>
              ))
            ) : selectedFolderId !== null &&
              !isLoading &&
              uploadedFiles.data && uploadedFiles.data.data ? (
              <h2>Esta carpeta no contiene archivos</h2>
            ) : (
              <></>
            )}
          </div>
          {uploadedFiles.data && uploadedFiles.data.totalRecords > 0 &&
            <Root sx={{ width: 540, maxWidth: '100%' }}>
              <table className="border-table" aria-label="custom pagination table">
                <tfoot>
                  <tr>
                    <CustomTablePagination
                      rowsPerPageOptions={[5, 10, 20]}
                      colSpan={3}
                      count={totalElements}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      labelRowsPerPage="Archivos por página"
                      slotProps={{
                        select: {
                          'aria-label': 'Archivos por página',
                        },
                        actions: {
                          slots: {
                            nextPageIcon: ChevronRightRoundedIcon,
                            backPageIcon: ChevronLeftRoundedIcon,
                          },
                        },
                      }}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </tr>
                </tfoot>
              </table>
            </Root>
          }

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
                    <p
                      data-pr-tooltip={file.filename}
                      className="ms-2 w-p-card fs-5 text-center"
                    >
                      {file.filename.length > 18
                        ? file.filename.slice(0, 15) +
                        "..." +
                        file.mimetype.split("/")[1]
                        : file.filename}
                    </p>
                    <div className="d-flex w-full justify-content-center">
                      <div className="w-p-card-icon justify-content-between d-flex pb-2">
                        <div
                          onClick={() => deleteFileArray(files, index)}
                          className="bg-trash cursor-pointer size-icon-card pi pi-trash"
                        ></div>
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
