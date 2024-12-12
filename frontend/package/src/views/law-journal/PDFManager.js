import React, { useState, useEffect } from 'react';
import { Button, Grid, TextField, Typography, Paper, IconButton } from "@mui/material";
import { CloudUpload, Download } from "@mui/icons-material";
import Cookies from 'js-cookie';
import APIClient from '../../../APIClient';

const PDFManager = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFiles, setPdfFiles] = useState([]);

  useEffect(() => {
    console.log('Fetching PDFs on component mount');
    fetchPDFs();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log('File selected:', file);

    const reader = new FileReader();
    reader.onload = () => {
      console.log('File converted to base64 successfully');
      setPdfFile({
        fileName: file.name,
        fileData: reader.result.split(',')[1] // Remove "data:application/pdf;base64," prefix
      });
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
    };

    reader.readAsDataURL(file); // Converts file to base64
  };

  const uploadPDF = async () => {
    if (!pdfFile) {
      alert('Please select a PDF file to upload.');
      console.warn('No file selected for upload');
      return;
    }

    const requestData = {
      fileName: pdfFile.fileName,
      fileData: pdfFile.fileData
    };

    try {
      const jwt_token = Cookies.get('jwt_token');
      console.log('JWT token retrieved:', jwt_token);

      const response = await APIClient.post('/upload-pdf', requestData, {
        headers: { 
          Authorization: `Bearer ${jwt_token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      
      console.log('Response from upload:', response);
      alert('PDF uploaded successfully!');
      setPdfFile(null);
      fetchPDFs();
    } catch (error) {
      console.error('Error uploading PDF:', error);
    }
  };

  const fetchPDFs = async () => {
    try {
      const jwt_token = Cookies.get('jwt_token');
      console.log('JWT token for fetching PDFs:', jwt_token);

      const response = await APIClient.get('/pdf-files', {
        headers: { 
          Authorization: `Bearer ${jwt_token}` 
        },
        withCredentials: true
      });
      
      console.log('Fetched PDFs:', response.data.files);
      setPdfFiles(response.data.files);
    } catch (error) {
      console.error('Error fetching PDF files:', error);
    }
  };

  const downloadPDF = async (fileId, fileName) => {
    try {
      const jwt_token = Cookies.get('jwt_token');
      console.log('JWT token for download:', jwt_token);
      
      const response = await APIClient.get(`/download-pdf/${fileId}`, {
        headers: { 
          Authorization: `Bearer ${jwt_token}` 
        },
        responseType: 'blob',
        withCredentials: true
      });
      
      console.log('Download response:', response);
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  return (
    <Grid container spacing={3} className="pdf-manager-container">
      <Grid item xs={12}>
        <Typography variant="h4" align="center">PDF Manager</Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper style={{ padding: 20 }}>
          <Typography variant="h6">Upload a New PDF</Typography>
          <input 
            type="file" 
            accept=".pdf" 
            onChange={handleFileChange} 
            style={{ marginBottom: '15px' }}
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={uploadPDF}
            startIcon={<CloudUpload />} 
          >
            Upload PDF
          </Button>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper style={{ padding: 20 }}>
          <Typography variant="h6">View and Download PDF Files</Typography>

          {pdfFiles.map((file, index) => (
            <Paper key={index} style={{ marginBottom: '15px', padding: '10px' }}>
              <Typography variant="body1"><strong>File Name:</strong> {file.file_name}</Typography>
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={() => downloadPDF(file.id, file.file_name)}
                startIcon={<Download />} 
              >
                Download
              </Button>
            </Paper>
          ))}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default PDFManager;