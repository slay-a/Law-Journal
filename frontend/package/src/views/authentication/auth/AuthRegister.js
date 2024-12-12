import React, { useState } from "react";
import { Box, Typography, Button, Alert } from "@mui/material";
import { Stack } from "@mui/system";
import CustomTextField from "../../../components/forms/theme-elements/CustomTextField";
import APIClient from "../../../../APIClient";

const AuthRegister = ({ title, subtitle, subtext }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleRegister = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate form data
    if (!formData.name || !formData.email || !formData.password) {
      setErrorMessage("All fields are required.");
      return;
    }

    try {
      const response = await APIClient.post("/user/register", formData);

      if (response.data.success) {
        setSuccessMessage("Registration successful! Please log in.");
      } else {
        setErrorMessage(response.data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage(error.response?.data?.message || "An error occurred during registration.");
    }
  };

  return (
    <>
      {title && (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      )}

      {subtext}

      {errorMessage && (
        <Alert severity="error" onClose={() => setErrorMessage(null)} sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" onClose={() => setSuccessMessage(null)} sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      <Box>
        <Stack mb={3}>
          <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="name" mb="5px">
            Name
          </Typography>
          <CustomTextField id="name" variant="outlined" fullWidth value={formData.name} onChange={handleChange} />

          <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="email" mb="5px" mt="25px">
            Email Address
          </Typography>
          <CustomTextField id="email" variant="outlined" fullWidth value={formData.email} onChange={handleChange} />

          <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="password" mb="5px" mt="25px">
            Password
          </Typography>
          <CustomTextField
            id="password"
            type="password"
            variant="outlined"
            fullWidth
            value={formData.password}
            onChange={handleChange}
          />
        </Stack>
        <Button color="primary" variant="contained" size="large" fullWidth onClick={handleRegister}>
          Sign Up
        </Button>
      </Box>
      {subtitle}
    </>
  );
};

export default AuthRegister;

// import React from 'react';
// import { Box, Typography, Button } from '@mui/material';
// import { Link } from 'react-router-dom';

// import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
// import { Stack } from '@mui/system';

// const AuthRegister = ({ title, subtitle, subtext }) => (
//     <>
//         {title ? (
//             <Typography fontWeight="700" variant="h2" mb={1}>
//                 {title}
//             </Typography>
//         ) : null}

//         {subtext}

//         <Box>
//             <Stack mb={3}>
//                 <Typography variant="subtitle1"
//                     fontWeight={600} component="label" htmlFor='name' mb="5px">Name</Typography>
//                 <CustomTextField id="name" variant="outlined" fullWidth />

//                 <Typography variant="subtitle1"
//                     fontWeight={600} component="label" htmlFor='email' mb="5px" mt="25px">Email Address</Typography>
//                 <CustomTextField id="email" variant="outlined" fullWidth />

//                 <Typography variant="subtitle1"
//                     fontWeight={600} component="label" htmlFor='password' mb="5px" mt="25px">Password</Typography>
//                 <CustomTextField id="password" variant="outlined" fullWidth />
//             </Stack>
//             <Button color="primary" variant="contained" size="large" fullWidth component={Link} to="/auth/login">
//                 Sign Up
//             </Button>
//         </Box>
//         {subtitle}
//     </>
// );

// export default AuthRegister;