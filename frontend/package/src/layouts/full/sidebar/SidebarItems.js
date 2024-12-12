import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, List, Button } from '@mui/material';
import NavItem from './NavItem';
import NavGroup from './NavGroup/NavGroup';
import Menuitems2 from './MenuItems2';
import Cookies from 'js-cookie';

const SidebarItems = () => {
  const { pathname } = useLocation();
  const pathDirect = pathname;
  const navigate = useNavigate();

  // Check if user is logged in (check if JWT token exists)
  const isLoggedIn = !!Cookies.get('jwt_token');

  // Logout function
  const handleLogout = () => {
    Cookies.remove('jwt_token'); // Remove the JWT token from cookies
    alert('You have been logged out');
    navigate('/auth/login'); // Redirect to the login page
  };

  return (
    <Box sx={{ px: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <List sx={{ pt: 0, flexGrow: 1 }} className="sidebarNav">
        {Menuitems2.map((item) => {
          // Don't show Login and Register if the user is already logged in
          if ((item.title === 'Login' || item.title === 'Register') && isLoggedIn) {
            return null;
          }

          // {/********SubHeader**********/}
          if (item.subheader) {
            return <NavGroup item={item} key={item.subheader} />;

            // {/********If Sub Menu**********/}
            /* eslint no-else-return: "off" */
          } else {
            return (
              <NavItem item={item} key={item.id} pathDirect={pathDirect} />
            );
          }
        })}
      </List>

      {/* Logout button at the bottom */}
      {isLoggedIn && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleLogout} 
            sx={{ width: '100%' }}
          >
            Logout
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default SidebarItems;