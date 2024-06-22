import * as React from "react";
import PropTypes from "prop-types";
import { useAutocomplete } from "@mui/base/useAutocomplete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { autocompleteClasses } from "@mui/material/Autocomplete";
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import EditIcon from "@mui/icons-material/Edit";
import { InputText } from "primereact/inputtext";
import { TreeSelect } from "primereact/treeselect";
import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';
import {
  addMetadata
} from "../../../../../store/slices/fileManager/fileManagerSlice";
import { useToast } from "../../../../../hooks/useToast";
import { useDispatch } from "react-redux";

const Root = styled("div")(
  ({ theme }) => `
  color: ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,.85)"
    };
  font-size: 14px;
`
);

const Label = styled("label")`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
`;

const InputWrapper = styled("div")(
  ({ theme }) => `
  width: 659px;
  border: 1px solid ${theme.palette.mode === "dark" ? "#434343" : "#d9d9d9"};
  background-color: ${theme.palette.mode === "dark" ? "#141414" : "#fff"};
  border-radius: 4px;
  padding: 1px;
  display: flex;
  margin-left: 5px;
  flex-wrap: wrap;

  &:hover {
    border-color: ${theme.palette.mode === "dark" ? "#177ddc" : "#40a9ff"};
  }

  &.focused {
    border-color: ${theme.palette.mode === "dark" ? "#177ddc" : "#40a9ff"};
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  & input {
    background-color: ${theme.palette.mode === "dark" ? "#141414" : "#fff"};
    color: ${theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.65)"
      : "rgba(0,0,0,.85)"
    };
    height: 30px;
    box-sizing: border-box;
    padding: 4px 6px;
    width: 0;
    min-width: 30px;
    flex-grow: 1;
    border: 0;
    margin: 0;
    outline: 0;
  }
`
);

function Tag(props) {
  const { label, onDelete, ...other } = props;
  return (
    <div {...other}>
      <span>{label}</span>
      <CloseIcon onClick={onDelete} />
    </div>
  );
}

Tag.propTypes = {
  label: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

const StyledTag = styled(Tag)(
  ({ theme }) => `
  display: flex;
  align-items: center;
  height: 24px;
  margin: 2px;
  line-height: 22px;
  background-color: ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "#fafafa"
    };
  border: 1px solid ${theme.palette.mode === "dark" ? "#303030" : "#e8e8e8"};
  border-radius: 2px;
  box-sizing: content-box;
  padding: 0 4px 0 10px;
  outline: 0;
  overflow: hidden;

  &:focus {
    border-color: ${theme.palette.mode === "dark" ? "#177ddc" : "#40a9ff"};
    background-color: ${theme.palette.mode === "dark" ? "#003b57" : "#e6f7ff"};
  }

  & span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & svg {
    font-size: 12px;
    cursor: pointer;
    padding: 4px;
  }
`
);

const Listbox = styled("ul")(
  ({ theme }) => `
  width: 700px;
  margin: 2px 0 0;
  padding: 0;
  position: absolute;
  list-style: none;
  background-color: ${theme.palette.mode === "dark" ? "#141414" : "#fff"};
  overflow: auto;
  max-height: 250px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1;

  & li {
    padding: 5px 12px;
    display: flex;

    & span {
      flex-grow: 1;
    }

    & svg {
      color: transparent;
    }
  }

  & li[aria-selected='true'] {
    background-color: ${theme.palette.mode === "dark" ? "#2b2b2b" : "#fafafa"};
    font-weight: 600;

    & svg {
      color: #1890ff;
    }
  }

  & li.${autocompleteClasses.focused} {
    background-color: ${theme.palette.mode === "dark" ? "#003b57" : "#e6f7ff"};
    cursor: pointer;

    & svg {
      color: currentColor;
    }
  }
`
);

export default function AddTags({fileId, metadata}) {
  let empty = {
    title: metadata?.title,
    area: metadata?.area,
    project: metadata?.project,
    financial: metadata?.financial,
    date: metadata?.date,
    currency: metadata?.currency,
    file_related: metadata?.file_related,
  };

  React.useEffect(()=>{
    console.log(metadata, "metadata")
  }, [])
  
  
  const [inputValue, setInputValue] = React.useState("");
  const [tags, setTags] = React.useState( metadata?.tags.length > 0 ? metadata.tags : []);
  const { showToast, ToastComponent } = useToast();
  const [isModal, setIsModal] = React.useState(false);
  const [requiredField, setRequiredField] = React.useState(false);
  const [data, setData] = React.useState(empty);
  const [date, setDate] = React.useState(null);
  
/*     React.useEffect(()=>{
      console.log(tags, "tags")
    }, [tags]) */
 
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
    getOptionLabel: (option) => option.title,
    value: tags,
    defaultValue: tags,
    onChange: (event, newValue) => setTags(newValue),
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
      const newTag = { title: inputValue.trim() };
      if (!tags.find((tag) => tag.title === newTag.title)) {
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
      tags: tags.map((item)=> item.title),
    };

    try {
      if (tags.length) {
        setRequiredField(false);
        showToast("success", "Las etiquetas se han agregado con exito");
        console.log(payload, "payload")
        const resultAction = dispatch(addMetadata(payload));
        if (resultAction.error) {
          showToast("error", "Error eliminar un archivo");
        } else {
          openModal();
          showToast("success", "Archivo eliminado con éxito");
        }
        setData({});
        setIsModal(!isModal);
        setTags([]);
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
                  <StyledTag key={key} {...tagProps} label={option.title} />
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
                    <span>{option.title}</span>
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
              <option value="USDT">usd</option>
              <option value="pesos">eur</option>
            </select>
          </div>
          <div className="col-6">
            <Calendar placeholder={`${empty.date !== null ? "Fecha seleccina: "+empty.date : "Mes y año"}`} locale="es" value={date} onChange={(e) => setDate(e.value)} view="month" dateFormat="mm/yy" />
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
