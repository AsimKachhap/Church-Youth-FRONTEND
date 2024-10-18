import React from "react";
import { Page, View, Text, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFF",
    padding: 20,
  },
  section: {
    marginBottom: 10,
    padding: 10,
    borderBottom: "1px solid #000",
  },
  header: {
    fontSize: 18,
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
  },
  value: {
    fontSize: 12,
  },
});

// MyForm Component (PDF content)
const MyForm = ({ userDetails }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>Personal Information</Text>
        <Text style={styles.label}>
          First Name: <Text style={styles.value}>{userDetails.firstName}</Text>
        </Text>
        <Text style={styles.label}>
          Last Name: <Text style={styles.value}>{userDetails.lastName}</Text>
        </Text>
        <Text style={styles.label}>
          Phone Number: <Text style={styles.value}>{userDetails.phoneNo}</Text>
        </Text>
        <Text style={styles.label}>
          Age: <Text style={styles.value}>{userDetails.age}</Text>
        </Text>
        <Text style={styles.label}>
          Gender: <Text style={styles.value}>{userDetails.gender}</Text>
        </Text>
        <Text style={styles.label}>
          Address:{" "}
          <Text style={styles.value}>{userDetails.currentAddress}</Text>
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.header}>Education Information</Text>
        <Text style={styles.label}>
          Degree:{" "}
          <Text style={styles.value}>
            {userDetails.highestQualification.degree}
          </Text>
        </Text>
        <Text style={styles.label}>
          College:{" "}
          <Text style={styles.value}>
            {userDetails.highestQualification.college}
          </Text>
        </Text>
        <Text style={styles.label}>
          Year of Passing:{" "}
          <Text style={styles.value}>
            {userDetails.highestQualification.passingYear}
          </Text>
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.header}>Job Information</Text>
        <Text style={styles.label}>
          Job Title:{" "}
          <Text style={styles.value}>{userDetails.jobDetails.jobTitle}</Text>
        </Text>
        <Text style={styles.label}>
          Company:{" "}
          <Text style={styles.value}>{userDetails.jobDetails.company}</Text>
        </Text>
        <Text style={styles.label}>
          Location:{" "}
          <Text style={styles.value}>{userDetails.jobDetails.location}</Text>
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.header}>Parish Information</Text>
        <Text style={styles.label}>
          Home Parish:{" "}
          <Text style={styles.value}>{userDetails.parishInfo.homeParish}</Text>
        </Text>
        <Text style={styles.label}>
          District:{" "}
          <Text style={styles.value}>{userDetails.parishInfo.district}</Text>
        </Text>
        <Text style={styles.label}>
          State:{" "}
          <Text style={styles.value}>{userDetails.parishInfo.state}</Text>
        </Text>
        <Text style={styles.label}>
          PIN Code:{" "}
          <Text style={styles.value}>{userDetails.parishInfo.pin}</Text>
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.header}>Church Contribution</Text>
        <Text>{userDetails.churchContribution}</Text>
      </View>
    </Page>
  </Document>
);

export default MyForm;
