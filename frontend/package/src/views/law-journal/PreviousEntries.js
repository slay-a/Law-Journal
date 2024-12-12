import React, { useState, useEffect } from 'react';
import { Button, Grid, Select, MenuItem, Typography, Paper, IconButton } from "@mui/material";
import Cookies from 'js-cookie';
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import APIClient from '../../../APIClient';

const PreviousEntries = () => {
  const [testEntries, setTestEntries] = useState([]);
  const [filterSection, setFilterSection] = useState('');
  const [filterQuestionType, setFilterQuestionType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const jwt_token = Cookies.get('jwt_token');
      const result = await APIClient.get('/lawjournal/display', {
        headers: { 
          Authorization: `Bearer ${jwt_token}` 
        },
        withCredentials: true
      });
      setTestEntries(result.data.entries);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  const deleteEntry = async (id) => {
    try {
      const jwt_token = Cookies.get('jwt_token');
      await APIClient.delete(`/lawjournal/${id}`, {
        headers: { 
          Authorization: `Bearer ${jwt_token}` 
        },
        withCredentials: true
      });
      alert('Entry deleted successfully!');
      fetchEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const editEntry = (entry) => {
    navigate(`/edit-entry/${entry.id}`); 
  };
  const getQuestionTypes = () => {
    switch (filterSection) {
      case 'Logical Reasoning':
        return [
          'Assumption Questions', 
          'Strengthen/Weaken Questions', 
          'Flaw Questions', 
          'Inference Questions', 
          'Main Point Questions', 
          'Parallel Reasoning Questions', 
          'Method of Reasoning Questions', 
          'Point at Issue Questions', 
          'Paradox Questions', 
          'Principle Questions'
        ];
      case 'Analytical Reasoning':
        return [
          'Sequencing Games', 
          'Grouping Games', 
          'Matching Games', 
          'Hybrid Games', 
          'Local Questions', 
          'Global Questions'
        ];
      case 'Reading Comprehension':
        return [
          'Main Idea Questions', 
          'Author’s Tone Questions', 
          'Detail Questions', 
          'Inference Questions', 
          'Structure/Organization Questions', 
          'Function Questions', 
          'Analogy Questions', 
          'Weaken/Strengthen Questions'
        ];
      default:
        return [];
    }
  };
  return (
    <Grid container spacing={3} className="law-journal-container">
      <Grid item xs={12}>
        <Typography variant="h4" align="center">Law Journal - Previous Entries</Typography>
      </Grid>
      <Grid item xs={12} md={12}>
        <Paper style={{ padding: 20 }}>
          <Typography variant="h6">View and Filter Test Entries</Typography>

          <Select 
            fullWidth 
            value={filterSection} 
            onChange={(e) => setFilterSection(e.target.value)} 
            name="filterSection"
            style={{ marginBottom: '15px' }}
          >
            <MenuItem value="">All Sections</MenuItem>
            <MenuItem value="Logical Reasoning">Logical Reasoning</MenuItem>
            <MenuItem value="Analytical Reasoning">Analytical Reasoning</MenuItem>
            <MenuItem value="Reading Comprehension">Reading Comprehension</MenuItem>
          </Select>
          <Select 
            fullWidth 
            value={filterQuestionType} 
            onChange={(e) => setFilterQuestionType(e.target.value)} 
            name="filterQuestionType"
            style={{ marginBottom: '15px' }}
          >
            <MenuItem value="">All Question Types</MenuItem>
            {getQuestionTypes().map((type, index) => (
              <MenuItem key={index} value={type}>{type}</MenuItem>
            ))}
          </Select>

          {testEntries.filter(entry => 
            (!filterSection || entry.section === filterSection) && 
            (!filterQuestionType || entry.question_type === filterQuestionType)
          ).map((entry, index) => (
            <Paper key={index} style={{ marginBottom: '15px', padding: '10px' }}>
              <Typography variant="body1"><strong>Section:</strong> {entry.section}</Typography>
              <Typography variant="body1"><strong>Question Type:</strong> {entry.question_type}</Typography>
              <Typography variant="body1"><strong>Question:</strong> {entry.question}</Typography>
              <Typography variant="body1"><strong>Correct Answer:</strong> {entry.correct_answer}</Typography>
             {entry.attempted_answer !== 'N/A' && <Typography variant="body1"><strong>Attempted Answer:</strong> {entry.attempted_answer}</Typography>}
              <Typography variant="body1"><strong>Explanation:</strong> {entry.explanation}</Typography>
              <Typography variant="body1"><strong>Reason for mistake:</strong> {entry.reason_for_mistake}</Typography>
              {entry.input_type === 'Choices' && (
                <>
                  {entry.choice_a !== 'N/A' && <Typography variant="body1"><strong>Choice A:</strong> {entry.choice_a}</Typography>}
                  {entry.choice_b !== 'N/A' && <Typography variant="body1"><strong>Choice B:</strong> {entry.choice_b}</Typography>}
                  {entry.choice_c !== 'N/A' && <Typography variant="body1"><strong>Choice C:</strong> {entry.choice_c}</Typography>}
                  {entry.choice_d !== 'N/A' && <Typography variant="body1"><strong>Choice D:</strong> {entry.choice_d}</Typography>}
                </>
              )}
              <IconButton color="primary" onClick={() => editEntry(entry)}>
                <Edit />
              </IconButton>
              <IconButton color="secondary" onClick={() => deleteEntry(entry.id)}>
                <Delete/>              
            </IconButton>
            </Paper>
          ))}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default PreviousEntries;
// import React, { useState, useEffect } from 'react';
// import { Button, Grid, TextField, Select, MenuItem, Typography, Paper, IconButton } from "@mui/material";
// import { Edit, Delete } from "@mui/icons-material";
// import Cookies from 'js-cookie';
// import { useNavigate } from 'react-router-dom';
// import APIClient from '../../../APIClient';

// const PreviousEntries = () => {
//   const [testEntries, setTestEntries] = useState([]);
//   const [filterSection, setFilterSection] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchEntries();
//   }, []);

//   const fetchEntries = async () => {
//     try {
//       const jwt_token = Cookies.get('jwt_token');
//       const result = await APIClient.get('/lawjournal/display', {
//         headers: { 
//           Authorization: `Bearer ${jwt_token}` 
//         },
//         withCredentials: true
//       });
//       setTestEntries(result.data.entries);
//     } catch (error) {
//       console.error('Error fetching entries:', error);
//     }
//   };

//   const deleteEntry = async (id) => {
//     try {
//       const jwt_token = Cookies.get('jwt_token');
//       await APIClient.delete(`/lawjournal/${id}`, {
//         headers: { 
//           Authorization: `Bearer ${jwt_token}` 
//         },
//         withCredentials: true
//       });
//       alert('Entry deleted successfully!');
//       fetchEntries();
//     } catch (error) {
//       console.error('Error deleting entry:', error);
//     }
//   };

//   const editEntry = (entry) => {
//     navigate(`/edit-entry/${entry.id}`); // Navigates to the edit page with entry ID using React Router navigate
//   };

//   return (
//     <Grid container spacing={3} className="law-journal-container">
//       <Grid item xs={12}>
//         <Typography variant="h4" align="center">Law Journal - LSAT Practice Tracker</Typography>
//       </Grid>
//       <Grid item xs={12} md={6}>
//         <Paper style={{ padding: 20 }}>
//           <Typography variant="h6">View and Filter Test Entries</Typography>

//           <Select 
//             fullWidth 
//             value={filterSection} 
//             onChange={(e) => setFilterSection(e.target.value)} 
//             name="filterSection"
//             style={{ marginBottom: '15px' }}
//           >
//             <MenuItem value="">All Sections</MenuItem>
//             <MenuItem value="Logical Reasoning">Logical Reasoning</MenuItem>
//             <MenuItem value="Analytical Reasoning">Analytical Reasoning</MenuItem>
//             <MenuItem value="Reading Comprehension">Reading Comprehension</MenuItem>
//           </Select>

//           {testEntries.filter(entry => !filterSection || entry.section === filterSection).map((entry, index) => (
//             <Paper key={index} style={{ marginBottom: '15px', padding: '10px' }}>
//               <Typography variant="body1"><strong>Section:</strong> {entry.section}</Typography>
//               <Typography variant="body1"><strong>Question Type:</strong> {entry.question_type}</Typography>
//               <Typography variant="body1"><strong>Question:</strong> {entry.question}</Typography>
//               <Typography variant="body1"><strong>Correct Answer:</strong> {entry.correct_answer}</Typography>
//               <Typography variant="body1"><strong>Attempted Answer:</strong> {entry.attempted_answer}</Typography>
//               <Typography variant="body1"><strong>Explanation:</strong> {entry.explanation}</Typography>
//               <IconButton color="primary" onClick={() => editEntry(entry)}>
//                 <Edit />
//               </IconButton>
//               <IconButton color="secondary" onClick={() => deleteEntry(entry.id)}>
//                 <Delete />
//               </IconButton>
//             </Paper>
//           ))}
//         </Paper>
//       </Grid>
//     </Grid>
//   );
// };

// export default PreviousEntries;