import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
    fetchGroups,
    fetchFiles,
    removeFile
} from "../../../../../store/slices/fileManager/fileManagerSlice";
import { useToast } from "../../../../../hooks/useToast";


const DeleteFile = ({ buttonIcon, fileId, folderId }) => {
    const [isModalView, setIsModalView] = useState(false);

    const dispatch = useDispatch();
    const { showToast, ToastComponent } = useToast();

    const openModal = () => {
        setIsModalView(!isModalView);
    };

    const deleteFile = async () => {
        const payload = {
            idFolder: folderId,
            idFile: fileId
        };
        try {
            const resultAction = await dispatch(removeFile(payload));
            if (resultAction.error) {
                showToast("error", "Error eliminar un archivo");
            } else {
                openModal();
                showToast("success", "Archivo eliminado con éxito");
                dispatch(fetchFiles(payload));
                dispatch(fetchGroups());
            }
        } catch (error) {
            console.log("error", error);
        }
    };


    const leftToolbarTemplate = () => (
        <>
        {buttonIcon ?
            (
                <div className="bg-trash cursor-pointer size-icon-card pi pi-trash" onClick={() => openModal()}></div>
            )
            :
            (
                <button onClick={() => openModal()} className="btn fs-5 pe-5 pt-3 pb-3 ps-5 p-button">
                    Eliminar
                </button>
            )
        }
        </>
    );

const productDialogFooter = (
    <div className="d-flex justify-content-center">
        <button onClick={() => openModal()} className="btn me-5 fs-5 pe-5 pt-3 pb-3 ps-5 p-button ">
            No
        </button>
        <button onClick={() => deleteFile()} className="btn fs-5 pe-5 pt-3 pb-3 ps-5 p-button ">
            Si
        </button>
    </div>
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
            <h1 className="text-center mt-8 d-flex align-items-center">
                Deseas eliminar este archivo? <br /> Si deseas eliminar este archivo sera eliminado definitivamente
            </h1>
        </Dialog>
    );
};

return (
    <div className={buttonIcon && "size-icon-card"}>
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

export { DeleteFile };
