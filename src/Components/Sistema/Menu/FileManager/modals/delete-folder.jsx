import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  removeFolder,
} from "../../../../../store/slices/fileManager/fileManagerSlice";
import { useToast } from "../../../../../hooks/useToast";
import DeleteIcon from "@mui/icons-material/Delete";

const DeleteFolder = ({ folderId }) => {
  const [isModalView, setIsModalView] = useState(false);

  const dispatch = useDispatch();
  const { showToast, ToastComponent } = useToast();

  const openModal = () => {
    setIsModalView(!isModalView);
  };

  const deleteFolder = async () => {
    const payload = {
        folderId: folderId,
    };
    try {
      const resultAction = await dispatch(removeFolder(payload));
      if (resultAction.error) {
        showToast("error", "Error eliminar una carpeta");
      } else {
        openModal();
        showToast("success", "Carpeta eliminado con éxito");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const leftToolbarTemplate = () => (
      <div className="mt-1">
        <button
          className="btn btn-outline-primary py-3 px-3 d-flex justify-content-center"
          onClick={openModal}
        >
          <DeleteIcon className="me-2" />
          Eliminar carpeta
        </button>
      </div>
  );

  const productDialogFooter = (
    <div className="d-flex justify-content-center">
      <button
        onClick={() => openModal()}
        className="btn me-5 fs-5 pe-5 pt-3 pb-3 ps-5 p-button "
      >
        No
      </button>
      <button
        onClick={() => deleteFolder()}
        className="btn bg-button-trash fs-5 pe-5 pt-3 pb-3 ps-5 "
      >
        Si
      </button>
    </div>
  );

  const Handler = ({ isModalView, productDialogFooter, openModal }) => {
    return (
      <Dialog
        visible={isModalView}
        style={{ width: "650px", height: "260px" }}
        modal
        className="p-fluid"
        footer={productDialogFooter}
        onHide={openModal}
      >
        <h1 className="text-center mt-4 d-flex align-items-center">
          Deseas eliminar esta carpeta? <br /> Si deseas eliminar esta carpeta
          sera eliminada definitivamente
        </h1>
      </Dialog>
    );
  };

  return (
        <div className="">
          <Toolbar
            style={{
              background: "transparent",
              border: "none",
            }}
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

export { DeleteFolder };
