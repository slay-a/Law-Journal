import React, { useEffect, useState } from "react";
import { pdfjs } from "react-pdf";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  TableContainer,
  TextField
} from "@mui/material";
import APIClient from "../../../APIClient";
import Cookies from "js-cookie";
import PdfComp from "./PdfComp";
import DashboardCard from "../../components/shared/DashboardCard";

const url = import.meta.env.VITE_MIDDLEWARE_URL;
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
const PDFManager = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [allPDFs, setAllPDFs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfFile, setPdfFile] = useState(null);
  const pdfsPerPage = 5;


  useEffect(() => {
    fetchPDFs();
  }, []);

  const fetchPDFs = async () => {
    try {
      const jwtToken = Cookies.get("jwt_token");
      const result = await APIClient.get("/lawjournal/get-files", {
        headers: { Authorization: `Bearer ${jwtToken}` },
        withCredentials: true,
      });
      setAllPDFs(result.data.data);
    } catch (error) {
      console.error("Error fetching PDFs:", error);
    }
  };

  const submitPDF = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    try {
      const jwtToken = Cookies.get("jwt_token");
      const result = await APIClient.post("/lawjournal/upload-files", formData, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      if (result.data.status === "ok") {
        alert("Uploaded Successfully!");
        fetchPDFs();
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  };

  const showPdf = (pdf) => {
    setPdfFile(`${url}/lawjournal/files/${pdf}`);
  };

  const totalPages = Math.ceil(allPDFs.length / pdfsPerPage);
  const currentPDFs = allPDFs.slice(
    (currentPage - 1) * pdfsPerPage,
    currentPage * pdfsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <DashboardCard title="Upload and View PDFs">
        <Box display="flex" alignItems="center" mb={2}>
        <TextField
          label="Enter PDF Title"
          variant="outlined"
          size="small"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginRight: '5px',flex: '2' }}
        />
        <Button
          variant="outlined"
          component="label"
          style={{ marginRight: '5px' }}        >
          Choose File
          <input
            type="file"
            accept="application/pdf"
            hidden
            onChange={(e) => setFile(e.target.files[0])}
          />
        </Button>
          <Button variant="contained" color="primary" onClick={submitPDF}>
            Submit
          </Button>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button
            variant="outlined"
            disabled={currentPage === 1}
            onClick={handlePrevPage}
          >
            &lt;
          </Button>
          <Typography>
            Page {currentPage} of {totalPages}
          </Typography>
          <Button
            variant="outlined"
            disabled={currentPage === totalPages}
            onClick={handleNextPage}
          >
            &gt;
          </Button>
        </Box>
        <TableContainer sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Title
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="subtitle2" fontWeight={600}>
                    Actions
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentPDFs.map((pdf) => (
                <TableRow key={pdf.id}>
                <TableCell><Typography variant="subtitle1">{pdf.title}</Typography></TableCell>
                <TableCell align="right">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => showPdf(pdf.pdf)}
                    >
                      Show PDF
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DashboardCard>
      <Box mt={3}>
        <PdfComp pdfFile={pdfFile} />
      </Box>
    </div>
  );
};

export default PDFManager;