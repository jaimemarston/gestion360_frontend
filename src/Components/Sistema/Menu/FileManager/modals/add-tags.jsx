import * as React from "react";
import PropTypes from "prop-types";
import { useAutocomplete } from "@mui/base/useAutocomplete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { autocompleteClasses } from "@mui/material/Autocomplete";
import { Dialog } from "primereact/dialog";
import { useToast } from "../../../../../hooks/useToast";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";

const Root = styled("div")(
  ({ theme }) => `
  color: ${
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,.85)"
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
  width: 570px;
  border: 1px solid ${theme.palette.mode === "dark" ? "#434343" : "#d9d9d9"};
  background-color: ${theme.palette.mode === "dark" ? "#141414" : "#fff"};
  border-radius: 4px;
  padding: 1px;
  display: flex;
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
    color: ${
      theme.palette.mode === "dark"
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
  background-color: ${
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "#fafafa"
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

export default function AddTags() {
  const [inputValue, setInputValue] = React.useState("");
  const [tags, setTags] = React.useState([]);
  const { showToast, ToastComponent } = useToast()
  const [isModal, setIsModal] = React.useState(false);
  const [requiredField, setRequiredField] = React.useState(false);

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
      setRequiredField(false)
      const newTag = { title: inputValue.trim() };
      if (!tags.find((tag) => tag.title === newTag.title)) {
        setTags((prev) => [...prev, newTag]);
      }
      setInputValue("");
      event.preventDefault();
    }
  };

  const handleSubmit = async () => {
    if(tags.length){
      const payload = {
        tags: [...tags],
      };
      setRequiredField(false)
      showToast('success', 'Las etiquetas se han agregado con exito');
      setIsModal(!isModal);
      setTags([]);
    }else{
      setRequiredField(true)      
      /* showToast('error', 'Error al intentar agregar las etiquetas'); */
    }
  };

  const leftToolbarTemplate = () => (
    <>
      <div className="my-2">
        <Button
          className='p-button-success d-flex align-items-center mr-2'
          onClick={openModal}
        >
          Agregar tags
        </Button>
      </div>
    </>
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
      <Button label="Enviar" icon="pi pi-check" className="p-button-text" onClick={handleSubmit} />
    </>
  );


  const Handler = ({
    isModal,
    productDialogFooter,
    openModal,
    data,
    onInputChange,
  }) => {
    return (
      <Dialog
        visible={isModal}
        style={{ width: "600px", height: "300px" }}
        header="Agregar etiquetas"
        modal
        className="p-fluid"
        footer={productDialogFooter}
        onHide={openModal}
      >
        <Root>
          <div {...getRootProps()}>
            <Label {...getInputLabelProps()}>Agregale etiquetas a tu archivo</Label>
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
            {requiredField && <p className="text-red mt-3">Debes de agregarle mínimo una etiqueta</p>}
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
      </Dialog>
    );
  };

  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div>
          <Toolbar
            style={{ background: "transparent", border: "none" }}
            left={leftToolbarTemplate}
          ></Toolbar>
          {isModal &&
            Handler({
              isModal,
              openModal,
              productDialogFooter,
            })}
        </div>
      </div>
      {ToastComponent}
    </div>
  );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
