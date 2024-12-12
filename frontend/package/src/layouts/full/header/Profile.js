import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate for navigation
import {
  Avatar,
  Box,
  Menu,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
const url = import.meta.env.VITE_MIDDLEWARE_URL;
import { IconUser } from '@tabler/icons-react';
import ProfileImg from 'src/assets/images/profile/user-1.jpg';
import Cookies from 'js-cookie';
import APIClient from '../../../../APIClient'; // Ensure the path is correct

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [profileImage, setProfileImage] = useState(ProfileImg); // Default profile image
  const navigate = useNavigate(); // Added navigate for redirection

  // 🔥 Fetch profile image from API on component mount
  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const jwtToken = Cookies.get('jwt_token');
        const response = await APIClient.get('/images/get-images', {
          headers: { 
            Authorization: `Bearer ${jwtToken}` 
          }
        });

        if (response.data && response.data.data && response.data.data.length > 0) {
          const imagePath = response.data.data[0].image; // Get the image path from the API response
          const fullImageUrl = `${url}/images/images/${imagePath}`; // Construct the full URL of the image
          setProfileImage(fullImageUrl);
        } else {
          console.error('No profile image found in response:', response);
        }
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };

    fetchProfileImage();
  }, []);

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleNavigateToProfile = () => {
    handleClose2();
    navigate('/profile/view'); // Navigate to /profile/view
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show profile menu"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === 'object' && {
            color: 'primary.main',
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={profileImage} // 🔥 Dynamically loaded profile image
          alt="Profile Image"
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>

      {/* ------------------------------------------- */}
      {/* Profile Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '200px',
          },
        }}
      >
        <MenuItem onClick={handleNavigateToProfile}> 
          <ListItemIcon>
            <IconUser width={20} />
          </ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Profile;

// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import {
//   Avatar,
//   Box,
//   Menu,
//   Button,
//   IconButton,
//   MenuItem,
//   ListItemIcon,
//   ListItemText
// } from '@mui/material';

// import { IconListCheck, IconMail, IconUser } from '@tabler/icons-react';

// import ProfileImg from 'src/assets/images/profile/user-1.jpg';

// const Profile = () => {
//   const [anchorEl2, setAnchorEl2] = useState(null);
//   const handleClick2 = (event) => {
//     setAnchorEl2(event.currentTarget);
//   };
//   const handleClose2 = () => {
//     setAnchorEl2(null);
//   };

//   return (
//     <Box>
//       <IconButton
//         size="large"
//         aria-label="show 11 new notifications"
//         color="inherit"
//         aria-controls="msgs-menu"
//         aria-haspopup="true"
//         sx={{
//           ...(typeof anchorEl2 === 'object' && {
//             color: 'primary.main',
//           }),
//         }}
//         onClick={handleClick2}
//       >
//         <Avatar
//           src={ProfileImg}
//           alt={ProfileImg}
//           sx={{
//             width: 35,
//             height: 35,
//           }}
//         />
//       </IconButton>
//       {/* ------------------------------------------- */}
//       {/* Message Dropdown */}
//       {/* ------------------------------------------- */}
//       <Menu
//         id="msgs-menu"
//         anchorEl={anchorEl2}
//         keepMounted
//         open={Boolean(anchorEl2)}
//         onClose={handleClose2}
//         anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
//         transformOrigin={{ horizontal: 'right', vertical: 'top' }}
//         sx={{
//           '& .MuiMenu-paper': {
//             width: '200px',
//           },
//         }}
//       >
//         <MenuItem>
//           <ListItemIcon>
//             <IconUser width={20} />
//           </ListItemIcon>
//           <ListItemText>My Profile</ListItemText>
//         </MenuItem>
//       </Menu>
//     </Box>
//   );
// };

// export default Profile;

// // {/* <Box mt={1} py={1} px={2}>
// //           <Button to="/auth/login" variant="outlined" color="primary" component={Link} fullWidth>
// //             Logout
// //           </Button>
// //         </Box> */}
// //         <MenuItem>
// //         <ListItemIcon>
// //           <IconMail width={20} />
// //         </ListItemIcon>
// //         <ListItemText>My Account</ListItemText>
// //       </MenuItem>
// //       <MenuItem>
// //         <ListItemIcon>
// //           <IconListCheck width={20} />
// //         </ListItemIcon>
// //         <ListItemText>My Tasks</ListItemText>
// //       </MenuItem>
      