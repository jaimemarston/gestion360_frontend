import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { animated, useSpring } from "@react-spring/web";
import { styled, alpha } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import ArticleIcon from "@mui/icons-material/Article";
import FolderRounded from "@mui/icons-material/FolderRounded";
import FolderCopyIcon from "@mui/icons-material/FolderCopy";
import { InputText } from "primereact/inputtext";

import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { treeItemClasses } from "@mui/x-tree-view/TreeItem";
import { unstable_useTreeItem2 as useTreeItem2 } from "@mui/x-tree-view/useTreeItem2";
import {
  TreeItem2Content,
  TreeItem2IconContainer,
  TreeItem2Label,
  TreeItem2Root,
} from "@mui/x-tree-view/TreeItem2";
import { TreeItem2Icon } from "@mui/x-tree-view/TreeItem2Icon";
import { TreeItem2Provider } from "@mui/x-tree-view/TreeItem2Provider";
import { Button } from "primereact/button";

const DotIcon = () => (
  <Box
    sx={{
      width: 6,
      height: 6,
      borderRadius: '70%',
      bgcolor: 'warning.main',
      display: 'inline-block',
      verticalAlign: 'middle',
      zIndex: 1,
      mx: 1,
    }}
  />
);

const StyledTreeItemRoot = styled(TreeItem2Root)(({ theme }) => ({
  color: theme.palette.mode === 'light' ? theme.palette.grey[800] : theme.palette.grey[400],
  position: 'relative',
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: theme.spacing(3.5),
  },
}));

const CustomTreeItemContent = styled(TreeItem2Content)(({ theme }) => ({
  flexDirection: 'row-reverse',
  borderRadius: theme.spacing(0.7),
  marginBottom: theme.spacing(0.5),
  marginTop: theme.spacing(0.5),
  padding: theme.spacing(0.5),
  paddingRight: theme.spacing(1),
  fontWeight: 500,
  [`& .${treeItemClasses.iconContainer}`]: {
    marginRight: theme.spacing(2),
  },
  [`&.Mui-expanded `]: {
    '&:not(.Mui-focused, .Mui-selected, .Mui-selected.Mui-focused) .labelIcon': {
      color: theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.primary.dark,
    },
    '&::before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      left: '16px',
      top: '44px',
      height: 'calc(100% - 48px)',
      width: '1.5px',
      backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
    },
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.mode === 'light' ? theme.palette.primary.main : 'white',
  },
  [`&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused`]: {
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
  },
}));

const AnimatedCollapse = animated(Collapse);

const TransitionComponent = (props) => {
  const style = useSpring({
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(0,${props.in ? 0 : 20}px,0)`,
    },
  });

  return <AnimatedCollapse style={style} {...props} />;
};

const StyledTreeItemLabelText = styled(Typography)({
  color: 'inherit',
  fontFamily: 'General Sans',
  fontWeight: 500,
});

const CustomLabel = ({ icon: Icon, expandable, children, ...other }) => (
  <TreeItem2Label
    {...other}
    sx={{
      display: 'flex',
      alignItems: 'center',
    }}
  >
    {Icon && (
      <Box component={Icon} className="labelIcon" color="inherit" sx={{ mr: 1, fontSize: '2rem' }} />
    )}
    <StyledTreeItemLabelText variant="body2">{children}</StyledTreeItemLabelText>
    {expandable && <DotIcon id={children} />}
  </TreeItem2Label>
);

const isExpandable = (reactChildren) => {
  if (Array.isArray(reactChildren)) {
    return reactChildren.length > 0 && reactChildren.some(isExpandable);
  }
  return Boolean(reactChildren);
};

const getIconFromFileTypeAndDepth = (item, depth) => {
  if (item.father) {
    return FolderCopyIcon;
  }
  if (isExpandable(item.children)) {
    return FolderRounded;
  }
  if (!item.children && !item.fileType) {
    return ArticleIcon;
  }
  if (item.children && !item.fileType) {
    return FolderRounded;
  }
  return ArticleIcon;
};

const CustomTreeItem = React.forwardRef(function CustomTreeItem(props, ref) {
  const { id, itemId, label, disabled, children, showModal, selectGroup, onItemSelect, setNameFolder, setNameGroup, setSelectedFolderFather, ...other } = props;

  const {
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getLabelProps,
    getGroupTransitionProps,
    status,
    publicAPI,
  } = useTreeItem2({ id, itemId, children, label, disabled, rootRef: ref });

  const item = publicAPI.getItem(itemId);
  const expandable = isExpandable(children);

  const icon = item.isFile ? ArticleIcon : getIconFromFileTypeAndDepth(item, children.length);

  const handleClick = () => {
    if (icon === FolderCopyIcon) {
      showModal(true);
      selectGroup(itemId);
      setNameGroup(label);
    }
    if (icon === FolderRounded) {
      onItemSelect(Number(itemId.split("-")[0]));
      setNameFolder(label);
      setSelectedFolderFather(item.fatherFolder)
    }
  };

  return (
    <TreeItem2Provider itemId={itemId.toString()}>
      <StyledTreeItemRoot {...getRootProps(other)}>
        <CustomTreeItemContent
          {...getContentProps({
            className: clsx('content', {
              'Mui-expanded': status.expanded,
              'Mui-selected': status.selected,
              'Mui-focused': status.focused,
              'Mui-disabled': status.disabled,
            }),
          })}
        >
          <TreeItem2IconContainer {...getIconContainerProps()}>
            <TreeItem2Icon status={status} />
          </TreeItem2IconContainer>
          <CustomLabel
            onClick={handleClick}
            {...getLabelProps({
              icon,
              expandable: expandable && status.expanded,
            })}
          />
        </CustomTreeItemContent>
        {children && <TransitionComponent {...getGroupTransitionProps()} />}
      </StyledTreeItemRoot>
    </TreeItem2Provider>
  );
});

const filterFolders = (folders, searchText) => {

  return folders.filter(folder => {
    const folderMatch = folder.label.toLowerCase().includes(searchText.toLowerCase());

    const childMatch = folder.children && folder.children.some(child => filterFolders([child], searchText).length > 0);

    return folderMatch || childMatch;
  });
};

const handleApplyFilter = (groups, filterText) => {
  if (filterText.trim() === "") {
    return groups;
  }

  const filterGroups = (groups) => {
    return Object.values(groups)
      .map(group => {
        // Filter folders within the group
        const filteredFolders = filterFolders(group.children || [], filterText);

         const valueFilter = filteredFolders.length > 0 || group.label.toLowerCase().includes(filterText.toLowerCase())
          ? { ...group, folders: filteredFolders }
          : null;

          return valueFilter
      })
      .filter(group => group !== null);
  };

  return filterGroups(groups);
};

export default function FileExplorer({ selectIdFolder, groups, showCreateFolder, selectGroupId, setNameFolder, setNameGroup, setSelectedFolderFather }) {
  const [filterText, setFilterText] = useState("");
  const [filteredGroups, setFilteredGroups] = useState(Object.values(groups));

  const handleFilterTextChange = (event) => {
    setFilterText(event.target.value);
  };

  useEffect(() => {
    if (filterText.trim() === "") {
      setFilteredGroups(Object.values(groups)); // Muestra todos los grupos si el filtro está vacío
    } else {
      setFilteredGroups(handleApplyFilter(groups, filterText)); // Aplica el filtro si hay texto
    }
  }, [groups]); // Dependencia de useEffect

  const handleApplyFilterButtonClick = () => {
    setFilteredGroups(handleApplyFilter(groups, filterText));
  };

  const handleClearFilter = () => {
    setFilterText("");
    setFilteredGroups(Object.values(groups));
  };

  const handleItemSelect = (selectedItemId) => {
    selectIdFolder(selectedItemId);
  };

  return (
    <div>
      <div>
        <InputText
          id="label"
          name="label"
          className="mb-4 w-input-filter"
          placeholder="Buscar por nombre"
          value={filterText}
          onChange={handleFilterTextChange}
          autoFocus
        />
        <Button
          label="Filtrar"
          className="p-button-text mb-4 ms-2 me-3" onClick={handleApplyFilterButtonClick}
        />
        <Button
          label="Limpiar"
          className="p-button-text mb-4"
          onClick={handleClearFilter}
        />
      </div>
      <RichTreeView
        items={filteredGroups}
        aria-label="file explorer"
        sx={{
          height: 'fit-content',
          flexGrow: 1,
          maxWidth: 400,
          overflowY: 'auto',
        }}
        slots={{
          item: (props) => (
            <CustomTreeItem
              {...props}
              showModal={showCreateFolder}
              selectGroup={selectGroupId}
              setNameGroup={setNameGroup}
              setNameFolder={setNameFolder}
              onItemSelect={handleItemSelect}
              setSelectedFolderFather={setSelectedFolderFather}
            />
          ),
        }}
      />
    </div>
  );
}
