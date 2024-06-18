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

import { styled } from '@mui/system';
import {
  TablePagination,
  tablePaginationClasses as classes,
} from '@mui/base/TablePagination';
import FirstPageRoundedIcon from '@mui/icons-material/FirstPageRounded';
import LastPageRoundedIcon from '@mui/icons-material/LastPageRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

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
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

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

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 d-flex">
          {permissions === 2 && <RegisterGroup />}

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
            className={`col-12 align-items-start mt-4 ${uploadedFiles.data && uploadedFiles.data.totalRecords < 5
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
                        {/* <AddTags /> */}
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
          <CustomTablePagination
              rowsPerPageOptions={[5, 10, 20, { label: 'All', value: -1 }]}
              colSpan={3}
              count={13}
              rowsPerPage={rowsPerPage}
              page={page}
              slotProps={{
                select: {
                  'aria-label': 'Rows per page',
                },
                actions: {
                  showFirstButton: true,
                  showLastButton: true,
                  slots: {
                    firstPageIcon: FirstPageRoundedIcon,
                    lastPageIcon: LastPageRoundedIcon,
                    nextPageIcon: ChevronRightRoundedIcon,
                    backPageIcon: ChevronLeftRoundedIcon,
                  },
                },
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />}

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



const blue = {
  200: '#A5D8FF',
  400: '#3399FF',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const Root = styled('div')(
  ({ theme }) => `
  table {
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    width: 100%;
    background-color: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    box-shadow: 0px 4px 16px ${theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.3)' : grey[200]
    };
    border-radius: 12px;
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
    overflow: hidden;
  }

  td,
  th {
    padding: 16px;
  }

  th {
    background-color: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  }
  `,
);

const CustomTablePagination = styled(TablePagination)(
  ({ theme }) => `
  & .${classes.spacer} {
    display: none;
  }

  & .${classes.toolbar}  {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    background-color: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: center;
    }
  }

  & .${classes.selectLabel} {
    margin: 0;
  }

  & .${classes.select}{
    font-family: 'IBM Plex Sans', sans-serif;
    padding: 2px 0 2px 4px;
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
    border-radius: 6px; 
    background-color: transparent;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    transition: all 100ms ease;

    &:hover {
      background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
      border-color: ${theme.palette.mode === 'dark' ? grey[600] : grey[300]};
    }

    &:focus {
      outline: 3px solid ${theme.palette.mode === 'dark' ? blue[400] : blue[200]};
      border-color: ${blue[400]};
    }
  }

  & .${classes.displayedRows} {
    margin: 0;

    @media (min-width: 768px) {
      margin-left: auto;
    }
  }

  & .${classes.actions} {
    display: flex;
    gap: 6px;
    border: transparent;
    text-align: center;
  }

  & .${classes.actions} > button {
    display: flex;
    align-items: center;
    padding: 0;
    border: transparent;
    border-radius: 50%; 
    background-color: transparent;
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    transition: all 100ms ease;

    > svg {
      font-size: 22px;
    }

    &:hover {
      background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
      border-color: ${theme.palette.mode === 'dark' ? grey[600] : grey[300]};
    }

    &:focus {
      outline: 3px solid ${theme.palette.mode === 'dark' ? blue[400] : blue[200]};
      border-color: ${blue[400]};
    }

    &:disabled {
      opacity: 0.3;
      &:hover {
        border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
        background-color: transparent;
      }
    }
  }
  `,
);