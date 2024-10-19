import React from "react";
import {
  Page,
  View,
  Text,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFF",
  },
  body: {
    margin: 20,
    border: "1px solid #000",
  },
  section: {
    marginBottom: 5,
  },
  sectionContent: {
    padding: 5,
  },
  header: {
    fontSize: 18,
    padding: 10,
    backgroundColor: "#0038A8",
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  subHeader: {
    fontSize: 14,
    marginBottom: 3,
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "center",
    padding: 5,
    backgroundColor: "#0038A8",
    color: "#FFF",
  },
  label: {
    fontSize: 12,
    fontStyle: "italic",
    marginBottom: 2,
  },
  value: {
    fontSize: 12,
    marginBottom: 3,
  },
  profilePhoto: {
    height: 100,
    width: "auto",
    marginLeft: 15,
    marginRight: 15,
    border: "1.5px solid #000",
  },
  textBlock: {
    flex: 1,
    justifyContent: "flex-start",
  },
  row: {
    flexDirection: "row",
  },
  boldName: {
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  declaration: {
    textAlign: "justify",
  },
  declarationContent: {
    padding: 10,
  },
  declarationText: {
    fontSize: 12,
    textAlign: "justify",
  },
  forOfficeUse: {
    marginTop: 5, // Add margin to separate it from the previous section
  },
  forOfficeContent: {
    padding: 10, // Added padding only around the content
  },
  signatures: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10, // Added 5px more space after the signatures section
  },
  signatureBlock: {
    textAlign: "center",
    width: "30%",
    marginBottom: 5, // Increased space after each signature
  },
  sealSpace: {
    height: 50,
    borderBottom: "1px dashed #000",
  },
});

const MyForm = ({ userDetails }) => {
  if (!userDetails) {
    return <Text>No user details available</Text>;
  }

  const fullName = `${userDetails?.firstName || ""} ${
    userDetails?.middleName ? userDetails.middleName + " " : ""
  }${userDetails?.lastName || ""}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.body}>
          {/* Form Header */}
          <View style={styles.header}>
            <Text style={{ textTransform: "uppercase" }}>
              St Mary&apos;s Assumption Church
            </Text>
            <Text style={{ fontSize: 12 }}>
              Mariam Nagar Ghaziabad-201003 (U.P)
            </Text>
            <Text style={{ fontSize: 12 }}>smachurch.gzb@gmail.com</Text>
            <Text
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                marginTop: 5,
                fontWeight: "bold",
              }}
            >
              Youth Membership Form
            </Text>
          </View>

          {/* Space Between Header and Personal Information */}
          <View style={{ marginTop: 10 }}></View>

          {/* Personal Information */}
          <View style={styles.section}>
            <Text style={styles.subHeader}>Personal Information</Text>
            <View style={styles.row}>
              {userDetails?.photo && (
                <Image
                  source={{ uri: userDetails.photo }}
                  style={styles.profilePhoto}
                />
              )}

              <View style={styles.textBlock}>
                <Text style={styles.label}>
                  Name:{" "}
                  <Text style={[styles.value, styles.boldName]}>
                    {fullName}
                  </Text>
                </Text>
                <Text style={styles.label}>
                  Father's Name:{" "}
                  <Text style={[styles.value, styles.boldName]}>
                    {userDetails?.fatherName}
                  </Text>
                </Text>
                <Text style={styles.label}>
                  Aadhaar No:{" "}
                  <Text style={styles.value}>{userDetails?.aadhaarNo}</Text>
                </Text>
                <Text style={styles.label}>
                  Phone Number:{" "}
                  <Text style={styles.value}>{userDetails?.phoneNo}</Text>
                </Text>
                <Text style={styles.label}>
                  Age: <Text style={styles.value}>{userDetails?.age}</Text>
                </Text>
                <Text style={styles.label}>
                  Gender:{" "}
                  <Text style={styles.value}>{userDetails?.gender}</Text>
                </Text>
                <Text style={styles.label}>
                  Address:{" "}
                  <Text style={styles.value}>
                    {userDetails?.currentAddress}
                  </Text>
                </Text>
              </View>
            </View>
          </View>

          {/* Education Information */}
          <View style={styles.section}>
            <Text style={styles.subHeader}>Educational Information</Text>
            <View style={styles.sectionContent}>
              <Text style={styles.label}>
                Degree:{" "}
                <Text style={styles.value}>
                  {userDetails?.highestQualification?.degree}
                </Text>
              </Text>
              <Text style={styles.label}>
                College:{" "}
                <Text style={styles.value}>
                  {userDetails?.highestQualification?.college}
                </Text>
              </Text>
              <Text style={styles.label}>
                Year of Passing:{" "}
                <Text style={styles.value}>
                  {userDetails?.highestQualification?.passingYear}
                </Text>
              </Text>
            </View>
          </View>

          {/* Job Information */}
          <View style={styles.section}>
            <Text style={styles.subHeader}>Occupational Information</Text>
            <View style={styles.sectionContent}>
              <Text style={styles.label}>
                Job Title:{" "}
                <Text style={styles.value}>
                  {userDetails?.jobDetails?.jobTitle}
                </Text>
              </Text>
              <Text style={styles.label}>
                Organization:{" "}
                <Text style={styles.value}>
                  {userDetails?.jobDetails?.company}
                </Text>
              </Text>
              <Text style={styles.label}>
                Location:{" "}
                <Text style={styles.value}>
                  {userDetails?.jobDetails?.location}
                </Text>
              </Text>
            </View>
          </View>

          {/* Parish Information */}
          <View style={styles.section}>
            <Text style={styles.subHeader}>Home Parish Information</Text>
            <View style={styles.sectionContent}>
              <Text style={styles.label}>
                Home Parish:{" "}
                <Text style={styles.value}>
                  {userDetails?.parishInfo?.homeParish}
                </Text>
              </Text>
              <Text style={styles.label}>
                District:{" "}
                <Text style={styles.value}>
                  {userDetails?.parishInfo?.district}
                </Text>
              </Text>
              <Text style={styles.label}>
                State:{" "}
                <Text style={styles.value}>
                  {userDetails?.parishInfo?.state}
                </Text>
              </Text>
              <Text style={styles.label}>
                PIN Code:{" "}
                <Text style={styles.value}>{userDetails?.parishInfo?.pin}</Text>
              </Text>
            </View>
          </View>

          {/* Church Contribution */}
          <View style={styles.section}>
            <Text style={styles.subHeader}>
              How I would contribute to the Church
            </Text>
            <View style={styles.sectionContent}>
              <Text style={styles.value}>
                {userDetails?.churchContribution}
              </Text>
            </View>
          </View>

          {/* Declaration Section */}
          <View style={styles.declaration}>
            <Text style={styles.subHeader}>Declaration</Text>
            <View style={styles.declarationContent}>
              <Text style={styles.declarationText}>
                I hereby declare that the above information is true to the best
                of my knowledge and belief.
              </Text>
              <Text style={styles.label}>Signature:</Text>
            </View>
          </View>

          {/* For Office Use Section */}
          <View style={styles.forOfficeUse}>
            <Text style={styles.subHeader}>For Office Use</Text>
            <View style={styles.forOfficeContent}>
              <Text style={{ fontSize: 12 }}>Reg. No: __________</Text>
              <View style={styles.signatures}>
                <View style={styles.signatureBlock}>
                  <Text style={{ fontSize: 12 }}>Youth President</Text>
                  <View style={styles.sealSpace} />
                </View>
                <View style={styles.signatureBlock}>
                  <Text style={{ fontSize: 12 }}>Youth Coordinator</Text>
                  <View style={styles.sealSpace} />
                </View>
                <View style={styles.signatureBlock}>
                  <Text style={{ fontSize: 12 }}>Parish Priest</Text>
                  <View style={styles.sealSpace} />
                </View>
              </View>

              <View />
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default MyForm;
