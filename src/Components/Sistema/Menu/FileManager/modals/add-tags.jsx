import * as React from "react";
import { useAutocomplete } from "@mui/base/useAutocomplete";
import CheckIcon from "@mui/icons-material/Check";

import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';
import {
  addMetadata
} from "../../../../../store/slices/fileManager/fileManagerSlice";
import { useToast } from "../../../../../hooks/useToast";
import { useDispatch } from "react-redux";
import { StyledTag, Root, Listbox, InputWrapper, Label } from "./tags-component/Tags-component";

export default function AddTags({fileId, GetFiles, metadata}) {
  let empty = {
    title: metadata?.title,
    area: metadata?.area,
    project: metadata?.project,
    financial: metadata?.financial,
    date: metadata?.date,
    currency: metadata?.currency,
    file_related: metadata?.file_related,
  };

  const [inputValue, setInputValue] = React.useState("");
  const [tags, setTags] = React.useState( metadata?.tags.length > 0 ? metadata.tags : []);
  const { showToast, ToastComponent } = useToast();
  const [isModal, setIsModal] = React.useState(false);
  const [requiredField, setRequiredField] = React.useState(false);
  const [data, setData] = React.useState(empty);
  const [date, setDate] = React.useState(null);
  
  const dispatch = useDispatch();

  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    id: "customized-hook-demo",
    multiple: true,
    options: [],
    getOptionLabel: (option) => option.name,
    value: tags,
    defaultValue: tags,
    onChange: (event, newValue) => event.key !== 'Backspace' && setTags(newValue),
  });

  const openModal = () => {
    setIsModal(!isModal);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      setRequiredField(false);
      const newTag = { name: inputValue.trim()};
      if (!tags.find((tag) => tag.name === newTag.name)) {
        setTags((prev) => [...prev, newTag]);
      }
      setInputValue("");
      event.preventDefault();
    }
  };

  const onInputChange = (e, name) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const payload = {
      idFile: fileId,
      ...data,
      tags: tags.map((item)=> item.name),
    };

    try {
      if (tags.length) {
        setRequiredField(false);
        showToast("success", "Las etiquetas se han agregado con exito");
        const resultAction = await dispatch(addMetadata(payload));
        if (resultAction.error) {
          showToast("error", "Error al intentar agregar etiquetas al archivo");
        }else{
          GetFiles();
        }
        setData({});
        setIsModal(!isModal);

      } else {
        setRequiredField(true);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const leftToolbarTemplate = () => (
    <div className="cursor-pointer pi pi-pencil" onClick={openModal}></div>
  );

  const productDialogFooter = (
    <>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-text"
        onClick={() => {
          openModal();
        }}
      />
      <Button
        label="Enviar"
        icon="pi pi-check"
        className="p-button-text"
        onClick={handleSubmit}
      />
    </>
  );

  React.useEffect(() => {
    if (date !== null) {
      data.date = date?.toISOString().slice(0, 7);
    }
  }, [date])

  addLocale('es', {
    firstDayOfWeek: 1,
    showMonthAfterYear: true,
    monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    today: 'Hoy',
    clear: 'Limpiar'
  });

  const fecha = new Date(empty.date+ "/01");
  
  const Handler = ({
    isModal,
    productDialogFooter,
    openModal,
    data,
    onInputChange,
  }) => {
    const handleCoinChange = (event) => {
      onInputChange(event, 'currency'); // Pass the event and field name to onInputChange
    };
    return (
      <Dialog
        visible={isModal}
        style={{ width: "700px", height: "450px" }}
        header="Agregar etiquetas"
        modal
        className="p-fluid"
        footer={productDialogFooter}
        onHide={openModal}
      >
        <Root>
          <div {...getRootProps()}>
            <Label {...getInputLabelProps()}>
              Escribe tu etiqueta y preciona Enter para listarla
            </Label>
            <InputWrapper
              ref={setAnchorEl}
              className={focused ? "focused" : ""}
            >
              {tags.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index });
                return (
                  <StyledTag key={key} {...tagProps} label={option.name} />
                );
              })}
              <input
                {...getInputProps()}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
            </InputWrapper>
            {requiredField && (
              <p className="text-red mt-3">
                Debes de agregarle mínimo una etiqueta
              </p>
            )}
          </div>
          {groupedOptions.length > 0 ? (
            <Listbox {...getListboxProps()}>
              {groupedOptions.map((option, index) => {
                const { key, ...optionProps } = getOptionProps({
                  option,
                  index,
                });
                return (
                  <li key={key} {...optionProps}>
                    <span>{option.name}</span>
                    <CheckIcon fontSize="small" />
                  </li>
                );
              })}
            </Listbox>
          ) : null}
        </Root>
        <div className="d-flex">
        <div className="col-6">
            <InputText
              id="title"
              name="title"
              className="mt-4"
              placeholder="Titulo"
              value={data.title}
              onChange={(e) => onInputChange(e, "title")}
              autoFocus
            />
          </div>
          <div className="col-6">
            <InputText
              id="area"
              name="area"
              className="mt-4"
              placeholder="Area"
              value={data.area}
              onChange={(e) => onInputChange(e, "area")}
              autoFocus
            />
          </div>
        </div>
        <div className="d-flex">
        <div className="col-6">
            <InputText
              id="project"
              name="project"
              className="mt-4"
              placeholder="Proyecto"
              value={data.project}
              onChange={(e) => onInputChange(e, "project")}
              autoFocus
            />
          </div>
          <div className="col-6">
            <InputText
              id="financial"
              name="financial"
              className="mt-4"
              placeholder="Financiera"
              value={data.financial}
              onChange={(e) => onInputChange(e, "financial")}
              autoFocus
            />
          </div>
        </div>
        <div className="d-flex align-items-end">
        <div className="col-6">
            <select id="currency" name="currency" className="mt-4 form-select form-select-lg" value={data.currency?.trim()} onChange={handleCoinChange}>
              <option selected>Seleccione una moneda</option>
              <option value="soles">Soles</option>
              <option value="usd">usd</option>
              <option value="eur">eur</option>
            </select>
          </div>
          <div className="col-6">
            <Calendar locale="es" placeholder="Mes y año" value={date === null ? (empty.date !== null ? fecha : date) : date} onChange={(e) => setDate(e.value)} view="month" dateFormat="mm/yy" />
          </div>

        </div>
        <div className="col-6">
            <InputText
              id="file_related"
              name="file_related"
              className="mt-4"
              placeholder="Archivo relacionado"
              value={data.file_related?.trim()}
              onChange={(e) => onInputChange(e, "file_related")}
              autoFocus
            />
          </div>

      </Dialog>
    );
  };

  return (
    <div className="size-icon-card">
      <Toolbar
        style={{ background: "transparent", border: "none", padding: "0px" }}
        left={leftToolbarTemplate}
      ></Toolbar>
      {isModal &&
        Handler({
          isModal,
          data,
          openModal,
          productDialogFooter,
          onInputChange,
        })}
      {ToastComponent}
    </div>
  );
}
// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top