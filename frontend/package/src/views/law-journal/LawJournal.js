import React, { useState, useEffect } from 'react';
import { Button, Grid, TextField, Select, MenuItem, Typography, Paper, IconButton } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import Cookies from 'js-cookie';
import APIClient from '../../../APIClient';

const LawJournal = () => {
  // State to store all the LSAT practice test data
  const [testEntries, setTestEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({
    section: '',
    question: '',
    question_type:'',
    input_type: 'None',
    attempted_answer: '',
    correct_answer: '',
    explanation: '',
    reason_for_mistake: '',
    choices: ['', '', '', '']
  });

  const [filterSection, setFilterSection] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editEntryId, setEditEntryId] = useState(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  // Function to handle input changes
  const handleInputChange = (e, index = null) => {
    const { name, value } = e.target;
    if (name.includes('choice')) {
      const updatedChoices = [...newEntry.choices];
      updatedChoices[index] = value;
      setNewEntry({ ...newEntry, choices: updatedChoices });
    } else {
      setNewEntry({ ...newEntry, [name]: value });
    }
  };

  // Function to fetch all stored entries
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

  // Function to add or update a test entry
  const saveEntry = async () => {
    if (newEntry.section && newEntry.question && newEntry.correct_answer && newEntry.explanation) {
      try {
        const jwt_token = Cookies.get('jwt_token');
        const requestData = {
          section: newEntry.section,
          question: newEntry.question,
          question_type: newEntry.question_type,
          input_type: newEntry.input_type,
          attempted_answer: newEntry.input_type === 'Attempted Answer' ? newEntry.attempted_answer || 'N/A' : 'N/A',
          correct_answer: newEntry.correct_answer,
          explanation: newEntry.explanation,
          reason_for_mistake: newEntry.reason_for_mistake || 'N/A',
          choice_a: newEntry.input_type === 'Choices' ? newEntry.choices[0] || 'N/A' : 'N/A',
          choice_b: newEntry.input_type === 'Choices' ? newEntry.choices[1] || 'N/A' : 'N/A',
          choice_c: newEntry.input_type === 'Choices' ? newEntry.choices[2] || 'N/A' : 'N/A',
          choice_d: newEntry.input_type === 'Choices' ? newEntry.choices[3] || 'N/A' : 'N/A'
        };

        if (editMode && editEntryId) {
            await APIClient.put(`/lawjournal/${editEntryId}`, requestData, {
                headers: { 
                  Authorization: `Bearer ${jwt_token}` 
                },
                withCredentials: true
              });
              alert('Entry updated successfully!');
            } else {
              await APIClient.post('/lawjournal', requestData, {
                headers: { 
                  Authorization: `Bearer ${jwt_token}` 
                },
                withCredentials: true
              });
              alert('Entry added successfully!');
            }
    
            setNewEntry({
              section: '',
              question: '',
              question_type:'',
              input_type: 'None',
              attempted_answer: '',
              correct_answer: '',
              explanation: '',
              reason_for_mistake: '',
              choices: ['', '', '', '']
            });
            setEditMode(false);
            setEditEntryId(null);
            fetchEntries();
          } catch (error) {
            console.error('Error saving entry:', error);
          }
        } else {
          alert('Please fill in all required fields before adding or updating an entry.');
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
    setNewEntry({
      section: entry.section,
      question: entry.question,
      question_type: entry.question_type,
      input_type: entry.input_type,
      attempted_answer: entry.attempted_answer,
      correct_answer: entry.correct_answer,
      explanation: entry.explanation,
      reason_for_mistake: entry.reason_for_mistake,
      choices: [entry.choice_a, entry.choice_b, entry.choice_c, entry.choice_d]
    });
    setEditMode(true);
    setEditEntryId(entry.id);
  };

     // Function to add an entry as a new entry
     const addAsNewEntry = async (entry) => {
        try {
          const jwt_token = Cookies.get('jwt_token');
          const requestData = {
            section: entry.section,
            question_type: entry.question_type,
            question: entry.question,
            input_type: entry.input_type,
            attempted_answer: entry.attempted_answer || 'N/A',
            correct_answer: entry.correct_answer,
            explanation: entry.explanation,
            reason_for_mistake: entry.reason_for_mistake || 'N/A',
            choice_a: entry.choice_a || 'N/A',
            choice_b: entry.choice_b || 'N/A',
            choice_c: entry.choice_c || 'N/A',
            choice_d: entry.choice_d || 'N/A'
          };

          await APIClient.post('/lawjournal', requestData, {
            headers: { 
              Authorization: `Bearer ${jwt_token}` 
            },
            withCredentials: true
          });

          alert('New entry added successfully!');
          fetchEntries();
        } catch (error) {
          console.error('Error adding new entry:', error);
        }
      };
      const resetForm = () => {
        setNewEntry({
          section: '',
          question: '',
          question_type: '',
          input_type: 'None',
          attempted_answer: '',
          correct_answer: '',
          explanation: '',
          reason_for_mistake: '',
          choices: ['', '', '', '']
        });
        setEditMode(false);
        setEditEntryId(null);
      };
    
      // Dynamically display question types based on section selection
  const getQuestionTypes = () => {
    switch (newEntry.section) {
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
        <Typography variant="h4" align="center">Law Journal - LSAT Practice Tracker</Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper style={{ padding: 20 }}>
        <Typography variant="h6">{editMode ? 'Edit Test Entry' : 'Add a New Test Entry'}</Typography>
        <Select
            fullWidth
            value={newEntry.section}
            onChange={(e) => handleInputChange(e)}
            name="section"
            style={{ marginBottom: '15px' }}
          >
            <MenuItem value="">Select Section</MenuItem>
            <MenuItem value="Logical Reasoning">Logical Reasoning</MenuItem>
            <MenuItem value="Analytical Reasoning">Analytical Reasoning</MenuItem>
            <MenuItem value="Reading Comprehension">Reading Comprehension</MenuItem>
          </Select>

          <Select
            fullWidth
            value={newEntry.question_type}
            onChange={(e) => handleInputChange(e)}
            name="question_type"
            style={{ marginBottom: '15px' }}
          >
            <MenuItem value="">Select Question Type</MenuItem>
            {getQuestionTypes().map((type, index) => (
              <MenuItem key={index} value={type}>{type}</MenuItem>
            ))}
          </Select>


          <TextField 
            label="Question" 
            multiline 
            rows={3} 
            fullWidth 
            name="question" 
            value={newEntry.question} 
            onChange={handleInputChange} 
            placeholder="Enter the question text here" 
            style={{ marginBottom: '15px' }}
          />

          <Select 
            fullWidth 
            value={newEntry.input_type} 
            onChange={(e) => handleInputChange(e)} 
            name="input_type"
            style={{ marginBottom: '15px' }}
          >
            <MenuItem value="None">None</MenuItem>
            <MenuItem value="Choices">Choices</MenuItem>
            <MenuItem value="Attempted Answer">Attempted Answer</MenuItem>
          </Select>

          {newEntry.input_type === 'Choices' && newEntry.choices.map((choice, index) => (
            <TextField 
              key={index} 
              label={`Choice ${String.fromCharCode(65 + index)}`} 
              fullWidth 
              name={`choice${index}`} 
              value={choice} 
              onChange={(e) => handleInputChange(e, index)} 
              placeholder={`Choice ${String.fromCharCode(65 + index)}`} 
              style={{ marginBottom: '15px' }}
            />
          ))}

          {newEntry.input_type === 'Attempted Answer' && (
            <TextField 
              label="Attempted Answer" 
              fullWidth 
              name="attempted_answer" 
              value={newEntry.attempted_answer} 
              onChange={handleInputChange} 
              placeholder="Enter the attempted answer" 
              style={{ marginBottom: '15px' }}
            />
          )}

          <TextField 
            label="Correct Answer" 
            fullWidth 
            name="correct_answer" 
            value={newEntry.correct_answer} 
            onChange={handleInputChange} 
            placeholder="Enter the correct answer" 
            style={{ marginBottom: '15px' }}
          />

          <TextField 
            label="Explanation" 
            multiline 
            rows={4} 
            fullWidth 
            name="explanation" 
            value={newEntry.explanation} 
            onChange={handleInputChange} 
            placeholder="Enter the explanation" 
            style={{ marginBottom: '15px' }}
          />

          <TextField 
            label="Reason for Mistake" 
            multiline 
            rows={2} 
            fullWidth 
            name="reason_for_mistake" 
            value={newEntry.reason_for_mistake} 
            onChange={handleInputChange} 
            placeholder="Enter the reason for the mistake" 
            style={{ marginBottom: '15px' }}
          />
<Button variant="contained" color="primary" onClick={saveEntry}>
            {editMode ? 'Update Entry' : 'Add Entry'}
          </Button>
          {editMode && (
            <Button variant="contained" color="secondary" onClick={addAsNewEntry}>
              Add as New Entry
            </Button>
            
          )}
          <Button 
      variant="contained" 
      color="default" 
      onClick={resetForm}
      style={{ marginLeft: '10px' }}
    >
      Clear Form
    </Button>  
          </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
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

          {testEntries.filter(entry => !filterSection || entry.section === filterSection).map((entry, index) => (
            <Paper key={index} style={{ marginBottom: '15px', padding: '10px' }}>
              <Typography variant="body1"><strong>Section:</strong> {entry.section}</Typography>
              <Typography variant="body1"><strong>Question Type:</strong> {entry.question_type}</Typography>
              <Typography variant="body1"><strong>Question:</strong> {entry.question}</Typography>
              <Typography variant="body1"><strong>Correct Answer:</strong> {entry.correct_answer}</Typography>
              <Typography variant="body1"><strong>Attempted Answer:</strong> {entry.attempted_answer}</Typography>
              <Typography variant="body1"><strong>Explanation:</strong> {entry.explanation}</Typography>
              <IconButton color="primary" onClick={() => editEntry(entry)}>
                <Edit />
              </IconButton>
              <IconButton color="secondary" onClick={() => deleteEntry(entry.id)}>
                <Delete />
              </IconButton>
            </Paper>
          ))}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default LawJournal;