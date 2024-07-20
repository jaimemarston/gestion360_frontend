import {
    addUsersGroup,
    fetchUsersGroups,
    addUsersToTheUserGroup
} from "../../../../store/slices/fileManager/fileManagerSlice";
import { Button } from "primereact/button";
import { fetchGet } from "../../../../api";
import { InputText } from "primereact/inputtext";
import { useDispatch } from "react-redux";
import { useToast } from "../../../../hooks/useToast";
import classNames from "classnames";
import React, { useState, useEffect, useRef } from "react";
import TablaUsuario from "../TableUsers";

export default function CreateGroupUsers() {
    let empty = {
        name: "",
    };
    const [listProduct, setlistProduct] = useState([]);
    const [usersActive, setUsersActive] = useState([]);
    const [isModal, setIsModal] = useState(false);
    const [newData, setNewData] = useState(null);
    const [isCloseModal, setIsCloseModal] = useState(false);
    const [value, setValue] = useState(empty.estado);
    const [selectedUsers, setSelectedProducts] = useState([]);
    const [selectedUsers2, setSelectedProducts2] = useState([]);

    const [data, setData] = useState(empty);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const dt = useRef(null);
    const [showSelectGroup, setShowSelectGroup] = useState(false);
    const [usersGroup, setGroupUsers] = useState([]);
    const [selectGroupId, setSelectGroupId] = useState('');

    const { showToast, ToastComponent } = useToast();

    const dispatch = useDispatch();

    const listarUsuarios = () => {
        fetchGet("usuario").then((data) => {
            setlistProduct(data.usuario);
        });
    };

    useEffect(() => {
        listarUsuarios();
    }, []);

    useEffect(() => {
        const active = listProduct.filter((item) => item.estado === true);
        setUsersActive(active)
    }, [listProduct])

    const openModal = () => {
        setIsModal(!isModal);

        if (data.length === 0) {
            setData({});
        }
    };

    const closeModal = () => {
        setIsModal(!isModal);
        setIsCloseModal(!isCloseModal);
    };

    const getGroups = () => {
        dispatch(fetchUsersGroups()).unwrap().then((result) => {
            setGroupUsers(result.data.parsedGroups); // result es el valor que devuelve tu action creator
        }).catch((error) => {
            console.error(error);
        });
    };

    useEffect(() => {
        getGroups();
    }, []);

    useEffect(() => {
        if (usersGroup.length > 0) {
            setSelectGroupId(usersGroup[0].id);
        }
    }, [usersGroup]);

    const save = async () => {
        if (!data.name) {
            setSubmitted(true);
            return
        } else {
            setSubmitted(false);
        }
        const payload = {
            ...data,
        };
        try {
            const resultAction = await dispatch(addUsersGroup(payload));
            if (resultAction.error) {
                showToast("error", "Error al intentar crear una carpeta");
            } else {
                showToast("success", "Carpeta creada con éxito");
                closeModal();
                getGroups();
                setSelectedProducts([])
            }
        } catch (error) {
            console.log("error", error);
        }
    };

    const AddUsers = async () => {
        if (!selectGroupId || !selectedUsers2.length) {
            setSubmitted(true);
            return
        } else {
            setSubmitted(false);
        }
        const payload = {
            id: selectGroupId,
            users: selectedUsers2.map((item) => item.id),
        };
        try {
            const resultAction = await dispatch(addUsersToTheUserGroup(payload));
            if (resultAction.error) {
                showToast("error", "Error al intentar agregar usuarios a un grupo");
            } else {
                showToast("success", "Usuarios agregados con éxito");
                closeModal();
                setSelectedProducts2([])
            }
        } catch (error) {
            console.log("error", error);
        }
    };

    const editProduct = (data) => {
        setData({ ...data });
        setIsModal();
    };

    const confirmDeleteProduct = (rowData) => {
        setNewData(rowData);
        closeModal();
    };

    const onInputChange = (e, name) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-success mr-2"
                    onClick={() => {
                        editProduct(rowData);
                        openModal();
                    }}
                />
            </div>
        );
    };

    const actionBodyTemplate2 = (rowData) => {
        return (
            <div className="actions">
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-warning "
                    onClick={() => {
                        confirmDeleteProduct(rowData);
                    }}
                />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column flex-md-row justify-content-md-between align-items-md-center">
            <div className="col-3">
                <h5 className="m-0">Lista de Usuarios</h5>
            </div>
            <div className="col-9">
                <span className="block mt-2 mt-md-0 p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        type="search"
                        className="w-full"
                        onInput={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Buscar..."
                    />
                </span>
            </div>
        </div>
    );

    return (
        <div
            className="grid crud-demo">
            <div className="col-12">
                {ToastComponent}
                <div className="d-flex me-4">
                    <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="d-grid w-full">
                                <h4 htmlFor="label">Nombre de el grupo de usuarios</h4>
                                <InputText
                                    id="name"
                                    name="name"
                                    placeholder="Nombre de el grupo"
                                    value={data.name?.trim()}
                                    onChange={(e) => onInputChange(e, "name")}
                                    required
                                    autoFocus
                                    className={classNames({
                                        "p-invalid": submitted && !data.name,
                                    }, "mb-0 w-full")}
                                />
                                {submitted && !data.name && (
                                    <small className="p-invalid">
                                        El nombre de el grupo de usuarios es requerido
                                    </small>
                                )}
                            </div>
                            <div className="col-2 d-flex justify-content-end">
                                <Button
                                    label="Crear grupo"
                                    icon="pi pi-check"
                                    className="p-button-text ms-3 mt-6"
                                    onClick={() => { save(), setData({ name: "" }) }}
                                />
                            </div>
                        </div>
                        <h4 htmlFor="label">Elige el grupo al que le quieres asignar usuarios</h4>
                        <select value={selectGroupId} onChange={(e) => setSelectGroupId(e.target.value)} className="form-select form-select-lg mb-3" aria-label=".form-select-lg example">
                            {usersGroup && usersGroup.map((group) => (
                                <option key={group.id} value={group.id}>{group.name}</option>
                            ))}
                        </select>
                        <TablaUsuario
                            dt={dt}
                            listProduct={usersActive}
                            selectedUsers={selectedUsers2}
                            setSelectedProducts={setSelectedProducts2}
                            globalFilter={globalFilter}
                            header={header}
                            actionBodyTemplate={actionBodyTemplate}
                            actionBodyTemplate2={actionBodyTemplate2}
                        />
                        <div className="w-full d-flex justify-content-end">
                            <Button
                                label="Asignar"
                                icon="pi pi-check"
                                className="p-button-text"
                                onClick={() => AddUsers()}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};
