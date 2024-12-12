import { useEffect, useState } from "react";
import { pdfjs } from "react-pdf";
import PdfComp from "./PdfComp";
import APIClient from "../../../APIClient";
import Cookies from "js-cookie";
 
const url = import.meta.env.VITE_MIDDLEWARE_URL;
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function PDFManager() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState("");
  const [allImage, setAllImage] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    getPdf();
  }, []);

  const getPdf = async () => {
    try {
      const jwtToken = Cookies.get("jwt_token");
      const result = await APIClient.get("/lawjournal/get-files", {
        headers: { Authorization: `Bearer ${jwtToken}` },
        withCredentials: true
      });
      console.log(result.data.data);
      setAllImage(result.data.data);
    } catch (error) {
      console.error("Error fetching PDFs:", error);
    }
  };

  const submitImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);
    console.log(title, file);

    try {
      const jwtToken = Cookies.get("jwt_token");
      const result = await APIClient.post(
        "/lawjournal/upload-files",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${jwtToken}`
          },
          withCredentials: true
        }
      );
      console.log(result);
      if (result.data.status === "ok") {
        alert("Uploaded Successfully!!!");
        getPdf();
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const showPdf = (pdf) => {
    setPdfFile(`${url}/lawjournal/files/${pdf}`);
  };

  return (
    <div className="PDFManager">
      <form className="formStyle" onSubmit={submitImage}>
        <h4>Upload Pdf</h4>
        <br />
        <input
          type="text"
          className="form-control"
          placeholder="Title"
          required
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <input
          type="file"
          className="form-control"
          accept="application/pdf"
          required
          onChange={(e) => setFile(e.target.files[0])}
        />
        <br />
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
      </form>
      <div className="uploaded">
        <h4>Uploaded PDF:</h4>
        <div className="output-div">
          {allImage == null
            ? ""
            : allImage.map((data) => {
                return (
                  <div className="inner-div" key={data.id}>
                    <h6>Title: {data.title}</h6>
                    <button
                      className="btn btn-primary"
                      onClick={() => showPdf(data.pdf)}
                    >
                      Show Pdf
                    </button>
                  </div>
                );
              })}
        </div>
      </div>
      <PdfComp pdfFile={pdfFile} />
    </div>
  );
}

export default PDFManager;
// import { useEffect, useState } from "react";
// // import axios from "axios";
// import { pdfjs } from "react-pdf";
// import PdfComp from "./PdfComp";
// import APIClient from "../../../APIClient";

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;


// function PDFManager() {
//   const [title, setTitle] = useState("");
//   const [file, setFile] = useState("");
//   const [allImage, setAllImage] = useState(null);
//   const [pdfFile, setPdfFile] = useState(null);

//   useEffect(() => {
//     getPdf();
//   }, []);

//   const getPdf = async () => {
//     const result = await APIClient.get("/lawjournal/get-files");
//     console.log(result.data.data);
//     setAllImage(result.data.data);
//   };

//   const submitImage = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("file", file);
//     console.log(title, file);

//     const result = await APIClient.post(
//       "/lawjournal/upload-files",
//       formData,
//       {
//         headers: { "Content-Type": "multipart/form-data" },
//       }
//     );
//     console.log(result);
//     if (result.data.status == "ok") {
//       alert("Uploaded Successfully!!!");
//       getPdf();
//     }
//   };

//   const showPdf = (pdf) => {
//     setPdfFile(`http://0.0.0.0:10000/lawjournal/files/${pdf}`);
//   };

//   return (
//     <div className="PDFManager">
//       <form className="formStyle" onSubmit={submitImage}>
//         <h4>Upload Pdf</h4>
//         <br />
//         <input
//           type="text"
//           className="form-control"
//           placeholder="Title"
//           required
//           onChange={(e) => setTitle(e.target.value)}
//         />
//         <br />
//         <input
//           type="file"
//           className="form-control"
//           accept="application/pdf"
//           required
//           onChange={(e) => setFile(e.target.files[0])}
//         />
//         <br />
//         <button className="btn btn-primary" type="submit">
//           Submit
//         </button>
//       </form>
//       <div className="uploaded">
//         <h4>Uploaded PDF:</h4>
//         <div className="output-div">
//           {allImage == null
//             ? ""
//             : allImage.map((data) => {
//                 return (
//                   <div className="inner-div" key={data.id}>
//                     <h6>Title: {data.title}</h6>
//                     <button
//                       className="btn btn-primary"
//                       onClick={() => showPdf(data.pdf)}
//                     >
//                       Show Pdf
//                     </button>
//                   </div>
//                 );
//               })}
//         </div>
//       </div>
//       <PdfComp pdfFile={pdfFile} />
//     </div>
//   );
// }

// export default PDFManager;