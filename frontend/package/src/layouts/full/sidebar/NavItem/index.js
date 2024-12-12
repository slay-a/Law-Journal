// src/components/NavItem.js

import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import {
  ListItemIcon,
  ListItem,
  styled,
  ListItemText,
  useTheme,
} from '@mui/material';

const NavItem = ({ item, level, pathDirect, onClick }) => {
  const Icon = item.icon;
  const theme = useTheme();
  const itemIcon = <Icon fontSize="small" />;

  const ListItemStyled = styled(ListItem)(({ theme }) => ({
    whiteSpace: 'nowrap',
    marginBottom: '2px',
    padding: '8px 10px',
    borderRadius: '8px',
    backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
    color: theme.palette.text.secondary,
    paddingLeft: '10px',
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.main,
    },
    '&.Mui-selected': {
      color: 'white',
      backgroundColor: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
        color: 'white',
      },
    },
  }));

  // Determine if the link is external
  const isExternal = item.external;

  // Function to handle click for specific targets
  const handleClick = (event) => {
    if (isExternal && item.target === '_parent') {
      event.preventDefault(); // Prevent default navigation
      window.parent.location.href = item.href; // Navigate parent window
    }
  };

  return (
    <ListItemStyled
      button
      component={isExternal ? 'a' : NavLink}
      to={!isExternal ? item.href : undefined}
      href={isExternal ? item.href : undefined}
      disabled={item.disabled}
      selected={pathDirect === item.href}
      target={isExternal ? item.target || '_blank' : undefined}
      rel={isExternal && item.target === '_blank' ? 'noopener noreferrer' : undefined}
      onClick={isExternal && item.target === '_parent' ? handleClick : onClick}
    >
      <ListItemIcon
        sx={{
          minWidth: '36px',
          p: '3px 0',
          color: 'inherit',
        }}
      >
        {itemIcon}
      </ListItemIcon>
      <ListItemText>
        <>{item.title}</>
      </ListItemText>
    </ListItemStyled>
  );
};

NavItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    href: PropTypes.string.isRequired,
    external: PropTypes.bool,
    target: PropTypes.string,
    disabled: PropTypes.bool,
  }).isRequired,
  level: PropTypes.number,
  pathDirect: PropTypes.string,
  onClick: PropTypes.func,
};

NavItem.defaultProps = {
  level: 1,
  onClick: () => {},
};

export default NavItem;
// import React from 'react';
// import PropTypes from 'prop-types';
// import { NavLink } from 'react-router-dom';
// // mui imports
// import {
//   ListItemIcon,
//   ListItem,
//   List,
//   styled,
//   ListItemText,
//   useTheme
// } from '@mui/material';

// const NavItem = ({ item, level, pathDirect, onClick }) => {
//   const Icon = item.icon;
//   const theme = useTheme();
//   const itemIcon = <Icon stroke={1.5} size="1.3rem" />;

//   const ListItemStyled = styled(ListItem)(() => ({
//     whiteSpace: 'nowrap',
//     marginBottom: '2px',
//     padding: '8px 10px',
//     borderRadius: '8px',
//     backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
//     color:
//       theme.palette.text.secondary,
//     paddingLeft: '10px',
//     '&:hover': {
//       backgroundColor: theme.palette.primary.light,
//       color: theme.palette.primary.main,
//     },
//     '&.Mui-selected': {
//       color: 'white',
//       backgroundColor: theme.palette.primary.main,
//       '&:hover': {
//         backgroundColor: theme.palette.primary.main,
//         color: 'white',
//       },
//     },
//   }));

//   return (
//     <List component="li" disablePadding key={item.id}>
//       <ListItemStyled
//         button
//         component={item.external ? 'a' : NavLink}
//         to={item.href}
//         href={item.external ? item.href : ''}
//         disabled={item.disabled}
//         selected={pathDirect === item.href}
//         target={item.external ? '_blank' : ''}
//         onClick={onClick}
//       >
//         <ListItemIcon
//           sx={{
//             minWidth: '36px',
//             p: '3px 0',
//             color: 'inherit',
//           }}
//         >
//           {itemIcon}
//         </ListItemIcon>
//         <ListItemText>
//           <>{item.title}</>
//         </ListItemText>
//       </ListItemStyled>
//     </List>
//   );
// };

// NavItem.propTypes = {
//   item: PropTypes.object,
//   level: PropTypes.number,
//   pathDirect: PropTypes.any,
// };

// export default NavItem;
