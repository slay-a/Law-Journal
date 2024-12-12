// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Checkbox,
  Alert,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import CustomTextField from "../../../components/forms/theme-elements/CustomTextField";
import APIClient from "../../../../APIClient";
import Cookies from "js-cookie"; // Import js-cookie

// eslint-disable-next-line react/prop-types
const AuthLogin = ({ title, subtitle, subtext }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setErrorMessage("Both email and password are required.");
      return;
    }

    try {
      const response = await APIClient.post(
        "/user/login",
        { email, password },
        { withCredentials: true } // Enable sending/receiving cookies
      );

      if (response.data.success) {
        const { jwt_token } = response.data.data;
        // Set JWT token in cookies (frontend side, for extra use if needed)
        Cookies.set("jwt_token", jwt_token, {secure: false});

        // Navigate to a protected route after successful login
        navigate("/quizz-app");
      } else {
        setErrorMessage(response.data.message || "Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(
        error.response?.data?.message || "An error occurred during login."
      );
    }
  };

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      {errorMessage && (
        <Alert severity="error" onClose={() => setErrorMessage(null)} sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <form onSubmit={handleLogin}>
        <Stack>
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="email"
              mb="5px"
            >
              Email
            </Typography>
            <CustomTextField
              id="email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Box>
          <Box mt="25px">
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="password"
              mb="5px"
            >
              Password
            </Typography>
            <CustomTextField
              id="password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Box>
          <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="Remember this Device"
              />
            </FormGroup>
            <Typography
              component={Link}
              to="/forgot-password"
              fontWeight="500"
              sx={{
                textDecoration: "none",
                color: "primary.main",
              }}
            >
              Forgot Password?
            </Typography>
          </Stack>
        </Stack>
        <Box>
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            type="submit"
          >
            Sign In
          </Button>
        </Box>
      </form>

      {subtitle}
    </>
  );
};

export default AuthLogin;
// // eslint-disable-next-line no-unused-vars
// import React, { useState } from "react";
// import {
//   Box,
//   Typography,
//   FormGroup,
//   FormControlLabel,
//   Button,
//   Stack,
//   Checkbox,
//   Alert,
// } from "@mui/material";
// import { Link, useNavigate } from "react-router-dom";
// import CustomTextField from "../../../components/forms/theme-elements/CustomTextField";
// import axios from "axios";

// // eslint-disable-next-line react/prop-types
// const AuthLogin = ({ title, subtitle, subtext }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState(null);
//   const navigate = useNavigate();

//   const handleLogin = async (event) => {
//     event.preventDefault();

//     if (!email || !password) {
//       setErrorMessage("Both email and password are required.");
//       return;
//     }

//     try {
//       const response = await axios.post("/user/login", {
//         email,
//         password,
//       }, { withCredentials: true }); // Enable cookies to be sent/received

//       if (response.data.success) {
//         // Navigate to a protected route after successful login
//         navigate("/sample-page");
//       } else {
//         setErrorMessage(response.data.message || "Login failed.");
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       setErrorMessage(
//         error.response?.data?.message || "An error occurred during login."
//       );
//     }
//   };

//   return (
//     <>
//       {title ? (
//         <Typography fontWeight="700" variant="h2" mb={1}>
//           {title}
//         </Typography>
//       ) : null}

//       {subtext}

//       {errorMessage && (
//         <Alert severity="error" onClose={() => setErrorMessage(null)} sx={{ mb: 2 }}>
//           {errorMessage}
//         </Alert>
//       )}

//       <form onSubmit={handleLogin}>
//         <Stack>
//           <Box>
//             <Typography
//               variant="subtitle1"
//               fontWeight={600}
//               component="label"
//               htmlFor="email"
//               mb="5px"
//             >
//               Email
//             </Typography>
//             <CustomTextField
//               id="email"
//               variant="outlined"
//               fullWidth
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </Box>
//           <Box mt="25px">
//             <Typography
//               variant="subtitle1"
//               fontWeight={600}
//               component="label"
//               htmlFor="password"
//               mb="5px"
//             >
//               Password
//             </Typography>
//             <CustomTextField
//               id="password"
//               type="password"
//               variant="outlined"
//               fullWidth
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </Box>
//           <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
//             <FormGroup>
//               <FormControlLabel
//                 control={<Checkbox defaultChecked />}
//                 label="Remember this Device"
//               />
//             </FormGroup>
//             <Typography
//               component={Link}
//               to="/forgot-password"
//               fontWeight="500"
//               sx={{
//                 textDecoration: "none",
//                 color: "primary.main",
//               }}
//             >
//               Forgot Password?
//             </Typography>
//           </Stack>
//         </Stack>
//         <Box>
//           <Button
//             color="primary"
//             variant="contained"
//             size="large"
//             fullWidth
//             type="submit"
//           >
//             Sign In
//           </Button>
//         </Box>
//       </form>

//       {subtitle}
//     </>
//   );
// };

// export default AuthLogin;