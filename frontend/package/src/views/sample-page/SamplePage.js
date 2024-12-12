import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Grid,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Edit as EditIcon } from "@mui/icons-material";
import APIClient from "../../../APIClient";
import Cookies from "js-cookie";

const SamplePage = () => {
  const [inputText, setInputText] = useState("");
  const [transformedText, setTransformedText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [history, setHistory] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  // Fetch history from the backend on component mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const jwt_token = Cookies.get("jwt_token");
        const response = await APIClient.get("/history", {
          headers: {
            Authorization: `Bearer ${jwt_token}`,
          },
          withCredentials: true,
        });
        setHistory(response.data.history);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    fetchHistory();
  }, []);

  const handleTransformText = async () => {
    if (!inputText || wordCount < 3) {
      alert("Please enter at least 3 words!");
      return;
    }

    try {
      const response = await APIClient.post("http://127.0.0.1:5000/transform", {
        text: inputText,
        author: authorName,
      });
      setTransformedText(response.data.transformedText);
    } catch (error) {
      console.error("Error transforming text:", error);
    }
  };

  const handleSaveText = async () => {
    if (isSaving) return; // Prevent duplicate saves

    setIsSaving(true);
    try {
      const payload = {
        original_text: inputText,
        transformed_text: transformedText,
        author: authorName,
      };
      const jwt_token = Cookies.get("jwt_token");

      await APIClient.post("/save/text", payload, {
        headers: {
          Authorization: `Bearer ${jwt_token}`,
        },
        withCredentials: true,
      });

      alert("Text saved successfully!");
    } catch (error) {
      console.error("Error saving text:", error);
      alert("Failed to save text. Please try again.");
    } finally {
      setIsSaving(false); // Re-enable the button
    }
  };

  const handleEdit = (entry) => {
    setInputText(entry.original_text);
    setAuthorName(entry.author);
    setTransformedText(entry.transformed_text);
  };

  const handleInputChange = (text) => {
    const words = text.trim().split(/\s+/).length;
    if (words > 40) {
      alert("Get premium today to transform up to 1000 words!");
      return;
    }
    setInputText(text);
    setWordCount(words);
  };

  const transformedWordCount = transformedText.trim().split(/\s+/).length;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4">Text Styler</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          label={`Enter your text (Word count: ${wordCount}/40)`}
          multiline
          rows={4}
          fullWidth
          value={inputText}
          onChange={(e) => handleInputChange(e.target.value)}
          helperText="Enter between 3 and 40 words. Get premium to unlock up to 1000 words."
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Enter Author Full Name"
          fullWidth
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleTransformText}>
          Generate Text
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">
          Transformed Word Count: {transformedWordCount || 0}
        </Typography>
        <ReactQuill
          value={transformedText}
          onChange={(text) => setTransformedText(text)}
          theme="snow"
        />
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="secondary" onClick={handleSaveText}>
          Save Text
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          History
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Original Text</strong></TableCell>
                <TableCell><strong>Author</strong></TableCell>
                <TableCell><strong>Transformed Text</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>{entry.original_text}</TableCell>
                  <TableCell>{entry.author}</TableCell>
                  <TableCell>{entry.transformed_text}</TableCell>
                  <TableCell>{new Date(entry.created_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(entry)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default SamplePage;
// import React, { useState, useEffect } from "react";
// import {
//   Typography,
//   Button,
//   Grid,
//   TextField,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
// } from "@mui/material";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import { Edit as EditIcon } from "@mui/icons-material"; // Import Edit icon
// import axios from "axios";
// import Cookies from "js-cookie";

// const SamplePage = () => {
//   const [inputText, setInputText] = useState("");
//   const [transformedText, setTransformedText] = useState("");
//   const [authorName, setAuthorName] = useState("");
//   const [history, setHistory] = useState([]);
//   const [isSaving, setIsSaving] = useState(false);

//   // Fetch history from the backend on component mount
//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         const jwt_token = Cookies.get("jwt_token");
//         const response = await axios.get("/history", {
//           headers: {
//             Authorization: `Bearer ${jwt_token}`,
//           },
//           withCredentials: true,
//         });
//         setHistory(response.data.history);
//       } catch (error) {
//         console.error("Error fetching history:", error);
//       }
//     };

//     fetchHistory();
//   }, []);

//   const handleTransformText = async () => {
//     if (!inputText || !authorName || authorName.trim().split(" ").length < 2) {
//       alert("Please enter valid text and author name (at least two words)!");
//       return;
//     }

//     try {
//       const response = await axios.post("http://127.0.0.1:5000/transform", {
//         text: inputText,
//         author: authorName,
//       });
//       setTransformedText(response.data.transformedText);
//     } catch (error) {
//       console.error("Error transforming text:", error);
//     }
//   };

//   const handleSaveText = async () => {
//     if (isSaving) return; // Prevent duplicate saves

//     setIsSaving(true);
//     try {
//       const payload = {
//         original_text: inputText,
//         transformed_text: transformedText,
//         author: authorName,
//       };
//       const jwt_token = Cookies.get("jwt_token");

//       await axios.post("http://localhost:3500/save/text", payload, {
//         headers: {
//           Authorization: `Bearer ${jwt_token}`,
//         },
//         withCredentials: true,
//       });

//       alert("Text saved successfully!");
//     } catch (error) {
//       console.error("Error saving text:", error);
//       alert("Failed to save text. Please try again.");
//     } finally {
//       setIsSaving(false); // Re-enable the button
//     }
//   };

//   const handleEdit = (entry) => {
//     setInputText(entry.original_text);
//     setAuthorName(entry.author);
//     setTransformedText(entry.transformed_text);
//   };

//   return (
//     <Grid container spacing={3}>
//       <Grid item xs={12}>
//         <Typography variant="h4">Text Styler</Typography>
//       </Grid>
//       <Grid item xs={12}>
//         <TextField
//           label="Enter your text"
//           multiline
//           rows={4}
//           fullWidth
//           value={inputText}
//           onChange={(e) => setInputText(e.target.value)}
//         />
//       </Grid>
//       <Grid item xs={12}>
//         <TextField
//           label="Enter Author Full Name"
//           fullWidth
//           value={authorName}
//           onChange={(e) => setAuthorName(e.target.value)}
//         />
//       </Grid>
//       <Grid item xs={12}>
//         <Button variant="contained" color="primary" onClick={handleTransformText}>
//           Transform Text
//         </Button>
//       </Grid>
//       <Grid item xs={12}>
//         <ReactQuill
//           value={transformedText}
//           onChange={(text) => setTransformedText(text)}
//           theme="snow"
//         />
//       </Grid>
//       <Grid item xs={12}>
//         <Button variant="contained" color="secondary" onClick={handleSaveText}>
//           Save Text
//         </Button>
//       </Grid>
//       <Grid item xs={12}>
//         <Typography variant="h5" gutterBottom>
//           History
//         </Typography>
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell><strong>Original Text</strong></TableCell>
//                 <TableCell><strong>Author</strong></TableCell>
//                 <TableCell><strong>Transformed Text</strong></TableCell>
//                 <TableCell><strong>Date</strong></TableCell>
//                 <TableCell><strong>Actions</strong></TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {history.map((entry, index) => (
//                 <TableRow key={index}>
//                   <TableCell>{entry.original_text}</TableCell>
//                   <TableCell>{entry.author}</TableCell>
//                   <TableCell>{entry.transformed_text}</TableCell>
//                   <TableCell>{new Date(entry.created_at).toLocaleString()}</TableCell>
//                   <TableCell>
//                     <IconButton onClick={() => handleEdit(entry)}>
//                       <EditIcon />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Grid>
//     </Grid>
//   );
// };

// export default SamplePage;