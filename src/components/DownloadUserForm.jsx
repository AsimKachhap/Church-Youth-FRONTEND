import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import MyForm from "./MyForm";

const DownloadUserForm = ({ userDetails }) => {
  console.log("UserDetails before passing to PDFDownloadLink :", userDetails);
  const fullName = `${userDetails?.firstName || ""} ${
    userDetails?.middleName ? userDetails.middleName + " " : ""
  }${userDetails?.lastName || ""}`;

  return (
    <div>
      <PDFDownloadLink
        document={<MyForm userDetails={userDetails} />}
        fileName={`${fullName}.pdf`}
      >
        {({ loading }) => (loading ? "Loading document..." : "Download PDF")}
      </PDFDownloadLink>
    </div>
  );
};

export default DownloadUserForm;
