import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import MyForm from "./MyForm"; // Import the PDF document

const DownloadUserForm = ({ userDetails }) => {
  return (
    <div>
      <h2>Download User Application Form</h2>
      <PDFDownloadLink
        document={<MyForm userDetails={userDetails} />}
        fileName="user-details.pdf"
      >
        {({ loading }) => (loading ? "Loading document..." : "Download PDF")}
      </PDFDownloadLink>
    </div>
  );
};

export default DownloadUserForm;
