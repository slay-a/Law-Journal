import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Button, CircularProgress, TextField, IconButton } from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';
import Cookies from 'js-cookie';
import APIClient from '../../../../APIClient'; // Ensure the path is correct

const url = import.meta.env.VITE_MIDDLEWARE_URL;

const ProfileView = () => {
  const [userData, setUserData] = useState({ name: '', email: '', profileImage: '', lsatScore: '', lsatGoalScore: '' });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ name: '', email: '', lsatScore: '', lsatGoalScore: '' });

  // 🔥 Fetch user details and profile image on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const jwtToken = Cookies.get('jwt_token');
        
        // 🔥 Get User Details
        const response = await APIClient.get('/user/details/display', {
          headers: { 
            Authorization: `Bearer ${jwtToken}` 
          }
        });

        if (response.data && response.data.data && response.data.data.length > 0) {
          const user = response.data.data[0];

          // 🔥 Get Profile Image using /images/get-images
          const imageResponse = await APIClient.get(`/images/get-images`, {
            headers: { 
              Authorization: `Bearer ${jwtToken}` 
            }
          });

          if (imageResponse.data && imageResponse.data.data && imageResponse.data.data.length > 0) {
            const imagePath = imageResponse.data.data[0].image; // Get first image path
            const fullImageUrl = `${url}/images/images/${imagePath}`; // Construct full URL
            setUserData({ 
              name: user.name, 
              email: user.email, 
              profileImage: fullImageUrl, 
              lsatScore: user.lsatScore || '', 
              lsatGoalScore: user.lsatGoalScore || ''
            });
          } else {
            setUserData({ 
              name: user.name, 
              email: user.email, 
              profileImage: 'src/assets/images/profile/user-1.jpg', // Fallback image
              lsatScore: user.lsatScore || '', 
              lsatGoalScore: user.lsatGoalScore || ''
            });
          }
          setEditedData({ name: user.name, email: user.email, lsatScore: user.lsatScore || '', lsatGoalScore: user.lsatGoalScore || '' });
        } else {
          console.error('No user data found in response:', response);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false); 
      }
    };

    fetchUserDetails();
  }, []);

  // 🔥 Handle input change for editable fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 🔥 Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('title', 'Profile Image');

      try {
        const jwtToken = Cookies.get('jwt_token');
        const response = await APIClient.post('/images/upload-image', formData, {
          headers: { 
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.data.status === 'ok') {
          const uploadedFilePath = response.data.data.image; // Get image path from response
          const fullImageUrl = `${url}/images/images/${uploadedFilePath}`; // Create full URL for the image

          setUserData((prevData) => ({
            ...prevData,
            profileImage: fullImageUrl
          }));

          alert('Image uploaded successfully!');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  // 🔥 Handle save changes
  const handleSave = async () => {
    try {
      const jwtToken = Cookies.get('jwt_token');
      const response = await APIClient.put('/user/details/update', editedData, {
        headers: { 
          Authorization: `Bearer ${jwtToken}` 
        }
      });

      if (response.data.success) {
        setUserData((prevData) => ({
          ...prevData,
          ...editedData
        }));
        setIsEditing(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh', 
        textAlign: 'center', 
        padding: 4 
      }}
    >
      {/* 🔥 Profile Image */}
      <Box sx={{ position: 'relative' }}>
        <Avatar 
          src={userData.profileImage} 
          alt="Profile Image" 
          sx={{ width: 120, height: 120, mb: 2 }} 
        />
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageUpload} 
          style={{ display: 'none' }} 
          id="profile-image-upload" 
        />
        <label htmlFor="profile-image-upload">
          <IconButton 
            color="primary" 
            component="span" 
            sx={{ position: 'absolute', bottom: -10, right: -10 }}
          >
            <EditIcon />
          </IconButton>
        </label>
      </Box>

      {/* 🔥 Edit Button */}
      <Button 
        variant="outlined" 
        color="primary" 
        onClick={() => setIsEditing(!isEditing)} 
        sx={{ mb: 2 }}
      >
        <EditIcon sx={{ mr: 1 }} /> Edit All
      </Button>

      {/* 🔥 Editable Fields */}
      {['name', 'email', 'lsatScore', 'lsatGoalScore'].map((field, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2, width: '100%', justifyContent: 'center' }}>
          {isEditing ? (
            <TextField 
              name={field} 
              label={field === 'lsatScore' ? 'LSAT Score' : field === 'lsatGoalScore' ? 'LSAT Goal Score' : field.charAt(0).toUpperCase() + field.slice(1)} 
              value={editedData[field]} 
              onChange={handleInputChange} 
              fullWidth
            />
          ) : (
            <Typography variant="body1" sx={{ fontWeight: 'bold', width: '100%', textAlign: 'center' }}>
              {field === 'lsatScore' ? 'LSAT Score: ' : field === 'lsatGoalScore' ? 'LSAT Goal Score: ' : ''} 
              {userData[field] || 'Not Available'}
            </Typography>
          )}
        </Box>
      ))}

      {isEditing && (
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSave} 
          sx={{ mt: 2, width: '50%' }}
        >
          <SaveIcon sx={{ mr: 1 }} /> Save Changes
        </Button>
      )}
    </Box>
  );
};

export default ProfileView;
// import React, { useEffect, useState } from 'react';
// import { Box, Typography, Avatar, Button, CircularProgress, TextField, IconButton } from '@mui/material';
// import { Edit as EditIcon, Save as SaveIcon, Close as CloseIcon } from '@mui/icons-material';
// import Cookies from 'js-cookie';
// import APIClient from '../../../../APIClient'; // Ensure the path is correct

// const url = import.meta.env.VITE_MIDDLEWARE_URL;
// const ProfileView = () => {
//   const [userData, setUserData] = useState({ name: '', email: '', profileImage: '' });
//   const [loading, setLoading] = useState(true);
//   const [isEditing, setIsEditing] = useState({ name: false, email: false, profileImage: false });
//   const [editedData, setEditedData] = useState({ name: '', email: '' });

//   // 🔥 Fetch user details and profile image on component mount
//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       try {
//         const jwtToken = Cookies.get('jwt_token');
        
//         // 🔥 Get User Details
//         const response = await APIClient.get('/user/details/display', {
//           headers: { 
//             Authorization: `Bearer ${jwtToken}` 
//           }
//         });

//         if (response.data && response.data.data && response.data.data.length > 0) {
//           const user = response.data.data[0];

//           // 🔥 Get Profile Image using /images/get-images
//           const imageResponse = await APIClient.get(`/images/get-images`, {
//             headers: { 
//               Authorization: `Bearer ${jwtToken}` 
//             }
//           });

//           if (imageResponse.data && imageResponse.data.data && imageResponse.data.data.length > 0) {
//             const imagePath = imageResponse.data.data[0].image; // Get first image path
//             const fullImageUrl = `${url}/images/images/${imagePath}`; // Construct full URL
//             setUserData({ 
//               name: user.name, 
//               email: user.email, 
//               profileImage: fullImageUrl
//             });
//           } else {
//             setUserData({ 
//               name: user.name, 
//               email: user.email, 
//               profileImage: 'src/assets/images/profile/user-1.jpg' // Fallback image
//             });
//           }
//           setEditedData({ name: user.name, email: user.email });
//         } else {
//           console.error('No user data found in response:', response);
//         }
//       } catch (error) {
//         console.error('Error fetching user details:', error);
//       } finally {
//         setLoading(false); 
//       }
//     };

//     fetchUserDetails();
//   }, []);

//   // 🔥 Handle input change for editable fields
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditedData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   // 🔥 Handle image upload
//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const formData = new FormData();
//       formData.append('image', file);
//       formData.append('title', 'Profile Image');

//       try {
//         const jwtToken = Cookies.get('jwt_token');
//         const response = await APIClient.post('/images/upload-image', formData, {
//           headers: { 
//             Authorization: `Bearer ${jwtToken}`,
//             'Content-Type': 'multipart/form-data'
//           }
//         });

//         if (response.data.status === 'ok') {
//           const uploadedFilePath = response.data.data.image; // Get image path from response
//           const fullImageUrl = `${url}/images/images/${uploadedFilePath}`; // Create full URL for the image

//           setUserData((prevData) => ({
//             ...prevData,
//             profileImage: fullImageUrl
//           }));

//           alert('Image uploaded successfully!');
//         }
//       } catch (error) {
//         console.error('Error uploading image:', error);
//       }
//     }
//   };

//   // 🔥 Handle save changes
//   const handleSave = async () => {
//     try {
//       const jwtToken = Cookies.get('jwt_token');
//       const response = await APIClient.put('/user/details/update', editedData, {
//         headers: { 
//           Authorization: `Bearer ${jwtToken}` 
//         }
//       });

//       if (response.data.success) {
//         setUserData((prevData) => ({
//           ...prevData,
//           ...editedData
//         }));
//         setIsEditing({ name: false, email: false, profileImage: false });
//         alert('Profile updated successfully!');
//       }
//     } catch (error) {
//       console.error('Error updating user details:', error);
//     }
//   };

//   // 🔥 Toggle edit mode for name or email
//   const toggleEditMode = (field) => {
//     setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box 
//       sx={{ 
//         display: 'flex', 
//         flexDirection: 'column', 
//         alignItems: 'center', 
//         justifyContent: 'center', 
//         height: '100vh', 
//         textAlign: 'center', 
//         padding: 4 
//       }}
//     >
//       {/* 🔥 Profile Image */}
//       <Box sx={{ position: 'relative' }}>
//         <Avatar 
//           src={userData.profileImage} 
//           alt="Profile Image" 
//           sx={{ width: 120, height: 120, mb: 2 }} 
//         />
//         <input 
//           type="file" 
//           accept="image/*" 
//           onChange={handleImageUpload} 
//           style={{ display: 'none' }} 
//           id="profile-image-upload" 
//         />
//         <label htmlFor="profile-image-upload">
//           <IconButton 
//             color="primary" 
//             component="span" 
//             sx={{ position: 'absolute', bottom: -10, right: -10 }}
//           >
//             <EditIcon />
//           </IconButton>
//         </label>
//       </Box>

//       {/* 🔥 User Name */}
//       <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//         {isEditing.name ? (
//           <TextField 
//             name="name" 
//             value={editedData.name} 
//             onChange={handleInputChange} 
//             sx={{ mr: 1 }} 
//           />
//         ) : (
//           <Typography variant="h4" sx={{ fontWeight: 'bold', mr: 1 }}>
//             {userData.name}
//           </Typography>
//         )}
//         <IconButton onClick={() => toggleEditMode('name')}>
//           {isEditing.name ? <CloseIcon /> : <EditIcon />}
//         </IconButton>
//       </Box>

//       {/* 🔥 User Email */}
//       <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//         {isEditing.email ? (
//           <TextField 
//             name="email" 
//             value={editedData.email} 
//             onChange={handleInputChange} 
//             sx={{ mr: 1 }} 
//           />
//         ) : (
//           <Typography variant="body1" color="textSecondary" sx={{ mr: 1 }}>
//             {userData.email}
//           </Typography>
//         )}
//         <IconButton onClick={() => toggleEditMode('email')}>
//           {isEditing.email ? <CloseIcon /> : <EditIcon />}
//         </IconButton>
//       </Box>

//       {(isEditing.name || isEditing.email) && (
//         <Button 
//           variant="contained" 
//           color="primary" 
//           onClick={handleSave} 
//           sx={{ mt: 2, width: '50%' }}
//         >
//           <SaveIcon sx={{ mr: 1 }} /> Save Changes
//         </Button>
//       )}
//     </Box>
//   );
// };

// export default ProfileView;