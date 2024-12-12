import { useState } from "react";
import { Document, Page } from "react-pdf";
import PropTypes from 'prop-types';

function PdfComp(props) {
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div className="pdf-div">
      <p>
        Page {pageNumber} of {numPages}
      </p>
      <Document file={props.pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.apply(null, Array(numPages))
          .map((x, i) => i + 1)
          .map((page) => (
            <Page
              key={`page-${page}`} // Add a unique key prop
              pageNumber={page}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          ))}
      </Document>
    </div>
  );
}

// PropTypes validation
PdfComp.propTypes = {
  pdfFile: PropTypes.string.isRequired, // Ensure 'pdfFile' is a required string
};

export default PdfComp;