import React, { useState, useEffect } from 'react';
import { Button, Grid, TextField, Select, MenuItem, Typography, Paper } from "@mui/material";
import Cookies from 'js-cookie';
import { useParams, useNavigate } from 'react-router-dom';
import APIClient from '../../../APIClient';

const EditEntry = () => {
  const { id } = useParams(); // Get the entry ID from the route params
  const navigate = useNavigate(); // Use navigate to go back or to another page

  const [entryData, setEntryData] = useState({
    section: '',
    question_type: '',
    question: '',
    input_type: 'None',
    attempted_answer: '',
    correct_answer: '',
    explanation: '',
    reason_for_mistake: '',
    choices: ['', '', '', '']
  });

  useEffect(() => {
    fetchEntryData();
  }, []);

  const fetchEntryData = async () => {
    try {
      const jwt_token = Cookies.get('jwt_token');
      const response = await APIClient.get(`/lawjournal/entry/${id}`, {
        headers: { 
          Authorization: `Bearer ${jwt_token}` 
        },
        withCredentials: true
      });

      const entry = response.data.entry;
      setEntryData({
        section: entry.section,
        question_type: entry.question_type,
        question: entry.question,
        input_type: entry.input_type,
        attempted_answer: entry.attempted_answer,
        correct_answer: entry.correct_answer,
        explanation: entry.explanation,
        reason_for_mistake: entry.reason_for_mistake,
        choices: [entry.choice_a, entry.choice_b, entry.choice_c, entry.choice_d]
      });
    } catch (error) {
      console.error('Error fetching entry data:', error);
    }
  };

  const handleInputChange = (e, index = null) => {
    const { name, value } = e.target;
    if (name.includes('choice')) {
      const updatedChoices = [...entryData.choices];
      updatedChoices[index] = value;
      setEntryData({ ...entryData, choices: updatedChoices });
    } else {
      setEntryData({ ...entryData, [name]: value });
    }
  };

  const updateEntry = async () => {
    try {
      const jwt_token = Cookies.get('jwt_token');
      const requestData = {
        section: entryData.section,
        question_type: entryData.question_type,
        question: entryData.question,
        input_type: entryData.input_type,
        attempted_answer: entryData.input_type === 'Attempted Answer' ? entryData.attempted_answer || 'N/A' : 'N/A',
        correct_answer: entryData.correct_answer,
        explanation: entryData.explanation,
        reason_for_mistake: entryData.reason_for_mistake || 'N/A',
        choice_a: entryData.input_type === 'Choices' ? entryData.choices[0] || 'N/A' : 'N/A',
        choice_b: entryData.input_type === 'Choices' ? entryData.choices[1] || 'N/A' : 'N/A',
        choice_c: entryData.input_type === 'Choices' ? entryData.choices[2] || 'N/A' : 'N/A',
        choice_d: entryData.input_type === 'Choices' ? entryData.choices[3] || 'N/A' : 'N/A'
      };

      await APIClient.put(`/lawjournal/${id}`, requestData, {
        headers: { 
          Authorization: `Bearer ${jwt_token}` 
        },
        withCredentials: true
      });

      alert('Entry updated successfully!');
      navigate('/previous-entries'); 
    } catch (error) {
      console.error('Error updating entry:', error);
    }
  };

  const addAsNewEntry = async () => {
    try {
      const jwt_token = Cookies.get('jwt_token');
      const requestData = {
        section: entryData.section,
        question_type: entryData.question_type,
        question: entryData.question,
        input_type: entryData.input_type,
        attempted_answer: entryData.attempted_answer || 'N/A',
        correct_answer: entryData.correct_answer,
        explanation: entryData.explanation,
        reason_for_mistake: entryData.reason_for_mistake || 'N/A',
        choice_a: entryData.choices[0] || 'N/A',
        choice_b: entryData.choices[1] || 'N/A',
        choice_c: entryData.choices[2] || 'N/A',
        choice_d: entryData.choices[3] || 'N/A'
      };

      await APIClient.post('/lawjournal', requestData, {
        headers: { 
          Authorization: `Bearer ${jwt_token}` 
        },
        withCredentials: true
      });

      alert('New entry added successfully!');
      navigate('/previous-entries');
    } catch (error) {
      console.error('Error adding new entry:', error);
    }
  };

  const getQuestionTypes = () => {
    switch (entryData.section) {
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
        <Typography variant="h4" align="center">Edit Test Entry</Typography>
      </Grid>

      <Grid item xs={12} md={12}>
        <Paper style={{ padding: 20 }}>
          <Typography variant="h6">Edit or Add as New Entry</Typography>
          
          <Select 
            fullWidth 
            value={entryData.section} 
            onChange={(e) => handleInputChange(e)} 
            name="section"
            style={{ marginBottom: '15px' }}
          >
            <MenuItem value="Logical Reasoning">Logical Reasoning</MenuItem>
            <MenuItem value="Analytical Reasoning">Analytical Reasoning</MenuItem>
            <MenuItem value="Reading Comprehension">Reading Comprehension</MenuItem>
          </Select>

          <Select 
            fullWidth 
            value={entryData.question_type} 
            onChange={(e) => handleInputChange(e)} 
            name="question_type"
            style={{ marginBottom: '15px' }}
          >
            {getQuestionTypes().map((type, index) => (
              <MenuItem key={index} value={type}>{type}</MenuItem>
            ))}
          </Select>

          <TextField 
            label="Question" 
            fullWidth 
            name="question" 
            value={entryData.question} 
            onChange={handleInputChange} 
            style={{ marginBottom: '15px' }}
          />

          <Select 
            fullWidth 
            value={entryData.input_type} 
            onChange={(e) => handleInputChange(e)} 
            name="input_type"
            style={{ marginBottom: '15px' }}
          >
            <MenuItem value="None">None</MenuItem>
            <MenuItem value="Choices">Choices</MenuItem>
            <MenuItem value="Attempted Answer">Attempted Answer</MenuItem>
          </Select>
          {entryData.input_type === 'Choices' && entryData.choices.map((choice, index) => (
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

          {entryData.input_type === 'Attempted Answer' && (
            <TextField 
              label="Attempted Answer" 
              fullWidth 
              name="attempted_answer" 
              value={entryData.attempted_answer} 
              onChange={handleInputChange} 
              placeholder="Enter the attempted answer" 
              style={{ marginBottom: '15px' }}
            />
          )}

          <TextField 
            label="Correct Answer" 
            fullWidth 
            name="correct_answer" 
            value={entryData.correct_answer} 
            onChange={handleInputChange} 
            style={{ marginBottom: '15px' }}
          />

          <TextField 
            label="Explanation" 
            fullWidth 
            name="explanation" 
            value={entryData.explanation} 
            onChange={handleInputChange} 
            style={{ marginBottom: '15px' }}
          />
          <TextField 
            label="Reason for Mistake" 
            multiline 
            rows={2} 
            fullWidth 
            name="reason_for_mistake" 
            value={entryData.reason_for_mistake} 
            onChange={handleInputChange} 
            placeholder="Enter the reason for the mistake" 
            style={{ marginBottom: '15px' }}
          />

          <Button variant="contained" color="primary" onClick={updateEntry} style={{ marginRight: '10px' }}>
            Update Entry
          </Button>

          <Button variant="contained" color="secondary" onClick={addAsNewEntry} style={{ marginRight: '10px' }}>
            Add as New Entry
          </Button>

          <Button 
            variant="contained" 
            color="default" 
            onClick={() => navigate('/previous-entries')}
          >
            Cancel
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default EditEntry;