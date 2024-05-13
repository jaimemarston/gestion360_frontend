import  React from 'react';
import clsx from 'clsx';
import { animated, useSpring } from '@react-spring/web';
import { styled, alpha } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import ArticleIcon from '@mui/icons-material/Article';

import FolderRounded from '@mui/icons-material/FolderRounded';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { unstable_useTreeItem2 as useTreeItem2 } from '@mui/x-tree-view/useTreeItem2';
import {
  TreeItem2Content,
  TreeItem2IconContainer,
  TreeItem2Label,
  TreeItem2Root,
} from '@mui/x-tree-view/TreeItem2';
import { TreeItem2Icon } from '@mui/x-tree-view/TreeItem2Icon';
import { TreeItem2Provider } from '@mui/x-tree-view/TreeItem2Provider';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';

function DotIcon() {
    return (
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
}

const StyledTreeItemRoot = styled(TreeItem2Root)(({ theme }) => ({
  color:
    theme.palette.mode === 'light'
      ? theme.palette.grey[800]
      : theme.palette.grey[400],
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
      color:
        theme.palette.mode === 'light'
          ? theme.palette.primary.main
          : theme.palette.primary.dark,
    },
    '&::before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      left: '16px',
      top: '44px',
      height: 'calc(100% - 48px)',
      width: '1.5px',
      backgroundColor:
        theme.palette.mode === 'light'
          ? theme.palette.grey[300]
          : theme.palette.grey[700],
    },
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.mode === 'light' ? theme.palette.primary.main : 'white',
  },
  [`&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused`]: {
    backgroundColor:
      theme.palette.mode === 'light'
        ? theme.palette.primary.main
        : theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
  },
}));

const AnimatedCollapse = animated(Collapse);

function TransitionComponent(props) {
  const style = useSpring({
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(0,${props.in ? 0 : 20}px,0)`,
    },
  });

  return <AnimatedCollapse style={style} {...props} />;
}

const StyledTreeItemLabelText = styled(Typography)({
  color: 'inherit',
  fontFamily: 'General Sans',
  fontWeight: 500,
});

function CustomLabel({ icon: Icon, expandable, children, ...other }) {
  return (
    <TreeItem2Label
      {...other}
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {Icon && (
        <Box
          component={Icon}
          className="labelIcon"
          color="inherit"
          sx={{ mr: 1, fontSize: '1.6rem' }}
        />
      )}

      <StyledTreeItemLabelText variant="body2">{children}</StyledTreeItemLabelText>
      {expandable && <DotIcon id={children} />}
    </TreeItem2Label>
  );
}

const isExpandable = (reactChildren) => {
  if (Array.isArray(reactChildren)) {
    return reactChildren.length > 0 && reactChildren.some(isExpandable);
  }
  return Boolean(reactChildren);
};

const getIconFromFileTypeAndDepth = (item, depth) => {
  // Si el nodo es el grupo (nivel 4), muestra el icono de copia de carpeta
  if (depth === 4) {
    return FolderCopyIcon;
  }
  // Si el nodo es expandible, muestra el icono de carpeta
  if (isExpandable(item.children)) {
    return FolderRounded;
  }
  // Si el nodo tiene un fileType, muestra el icono correspondiente
  if (item.fileType) {
    return getIconFromFileType(item.fileType);
  }
  // Si el nodo no tiene hijos y no tiene un fileType, muestra el icono de PDF
  if (!item.children &&!item.fileType) {
    return ArticleIcon;
  }
  // Si el nodo tiene hijos pero no tiene un fileType, muestra el icono de carpeta
  if (item.children &&!item.fileType) {
    return FolderRounded;
  }
  // Por defecto, muestra el icono de artículo
  return ArticleIcon;
};


const CustomTreeItem = React.forwardRef(function CustomTreeItem(props, ref) {
    const { id, itemId, label, disabled, children, onItemSelect,...other } = props;
  
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
    let icon;
    // Determina la profundidad del nodo
    const depth = children? children.length : 0;
    // Usa la profundidad para determinar el icono
    icon = getIconFromFileTypeAndDepth(item, depth);
  
    const handleClick = () => {
      onItemSelect(itemId);
    };
  
    return (
      <div onClick={handleClick}>
        <TreeItem2Provider itemId={itemId}>
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
                {...getLabelProps({ icon, expandable: expandable && status.expanded })}
              />
            </CustomTreeItemContent>
            {children && <TransitionComponent {...getGroupTransitionProps()} />}
          </StyledTreeItemRoot>
        </TreeItem2Provider>
      </div>
    );
  });

export default function FileExplorer({date, select}) {
    const handleItemSelect = (selectedItemId) => {
        select(selectedItemId);
      };
      
  return (
    <RichTreeView
      items={date}
      aria-label="file explorer"
      sx={{ height: 'fit-content', flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
      slots={{ item: (props) => <CustomTreeItem {...props} onItemSelect={handleItemSelect} /> }}
    />
  );
}
