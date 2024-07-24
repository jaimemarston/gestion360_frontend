import {
    addUsersGroup,
    fetchUsersGroups,
    addUsersToTheUserGroup,
    fetchUsersGroupsAssing,
    desassignateUsersToaGroupUsers
} from "../../../../store/slices/fileManager/fileManagerSlice";
import { Button } from "primereact/button";
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
    const [listUsers, setListUsers] = useState([]);
    const [listUsersAssig, setListUsersAssig] = useState([]);
    const [usersActive, setUsersActive] = useState([]);
    const [isModal, setIsModal] = useState(false);
    const [selectedUsersCheck, setSelectedUsersCheck] = useState([]);
    //ids de usuarios por asignar
    const [selectedUsersAssign, setSelectedUsersAsiggn] = useState([]);

    const [selectedUsersDelete, setSelectedUsersDelete] = useState([])

    const [data, setData] = useState(empty);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const dt = useRef(null);
    const [usersGroup, setGroupUsers] = useState([]);
    const [selectGroupId, setSelectGroupId] = useState('');
    const [filterStatus, setFilterStatus] = useState('sin asignar')

    const { showToast, ToastComponent } = useToast();

    const dispatch = useDispatch();

    const listarUsuarios = () => {
        dispatch(fetchUsersGroupsAssing(selectGroupId)).unwrap().then((result) => {
            setListUsers(result.usuario)
            setListUsersAssig(result.alreadyIncluded)
        }).catch((error) => {
            console.error(error);
        });
    };

    useEffect(() => {
        if (selectGroupId) {
            listarUsuarios();
        }
    }, [selectGroupId]);

    useEffect(() => {
        const active = listUsers.filter((item) => item.estado === true);
        setUsersActive(active)
    }, [listUsers])

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
                getGroups();
                setSelectedUsersCheck([])
            }
        } catch (error) {
            if (import.meta.env.MODE === 'development') {
                console.log(error);
            }
        }
    };

    const AddUsers = async () => {
        if (!selectGroupId || !selectedUsersAssign.length) {
            showToast("error", "Debes seleccionar un usuario");
            return
        }
        const payload = {
            id: selectGroupId,
            users: selectedUsersAssign.map((item) => item.id),
        };
        try {
            const resultAction = await dispatch(addUsersToTheUserGroup(payload));
            if (resultAction.error) {
                showToast("error", "Error al intentar agregar usuarios a un grupo");
            } else {
                showToast("success", "Usuarios agregados con éxito");
                listarUsuarios()
                setSelectedUsersAsiggn([])
            }
        } catch (error) {
            if (import.meta.env.MODE === 'development') {
                console.log(error);
            }
        }
    };


    const deleteUsersGroup = async () => {
        if (!selectGroupId || !selectedUsersDelete.length) {
            showToast("error", "Debes deseleccionar un usuario");
            return
        }
        const payload = {
            id: selectGroupId,
            users: selectedUsersDelete.map((item) => item.id),
        };
        try {
            const resultAction = await dispatch(desassignateUsersToaGroupUsers(payload));
            if (resultAction.error) {
                showToast("error", "Error al intentar eliminar usuarios a un grupo");
            } else {
                showToast("success", "Usuarios eliminados con éxito");
                listarUsuarios()
                setSelectedUsersDelete([])
            }
        } catch (error) {
            if (import.meta.env.MODE === 'development') {
                console.log(error);
            }
        }
    };

    const onInputChange = (e, name) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const header = (
        <div className="flex flex-column flex-md-row justify-content-md-between align-items-md-center">
            <div className="col-3">
                <h5 className="m-0">Lista de Usuarios</h5>
            </div>
            <div className="col-5">
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
            <div className="col-4 mt-3">
                <span className="block mt-md-0 p-input-icon-left">
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="form-select form-select-lg mb-3" aria-label=".form-select-lg example">
                        <option value="sin asignar">Sin asignar</option>
                        <option value="asignados">Asignados</option>
                    </select>
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
                            listProduct={filterStatus === 'sin asignar' ? usersActive : listUsersAssig}
                            selectedUsers={filterStatus === 'sin asignar' ? selectedUsersAssign : selectedUsersCheck}
                            setSelectedProducts={filterStatus === 'sin asignar' ? setSelectedUsersAsiggn : setSelectedUsersCheck}
                            selectedDelete={selectedUsersDelete}
                            assign={filterStatus === 'asignados' ? true : false}
                            setSelectedDelete={setSelectedUsersDelete}
                            globalFilter={globalFilter}
                            header={header}
                        />
                        <div className="w-full d-flex justify-content-end">
                            <Button
                                label={`${filterStatus === "sin asignar" ? "Asignar" : "Desasignar"}`}
                                icon="pi pi-check"
                                className="p-button-text"
                                onClick={filterStatus === "sin asignar" ? AddUsers : deleteUsersGroup}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};
