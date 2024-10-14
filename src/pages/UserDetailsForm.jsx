import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useParams to get user ID
import axiosInstance from "../lib/axios";

const UserDetailsForm = () => {
  const { id } = useParams(); // Get user._id from URL params
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    photo: null,
    phone: "",
    age: "",
    gender: "",
    currentAddress: "",
    degree: "",
    college: "",
    passingYear: "",
    jobTitle: "",
    company: "",
    location: "",

    homeParish: "",
    district: "",
    state: "",
    pin: "",
    churchContribution: "",
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    // Directly update flat fields and handle the file input for 'photo'
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const nextStep = () => setCurrentStep((prevStep) => prevStep + 1);
  const prevStep = () => setCurrentStep((prevStep) => prevStep - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSubmit = new FormData();
      // Structure the data to match the expected backend format
      formDataToSubmit.append("firstName", formData.firstName);
      formDataToSubmit.append("middleName", formData.middleName);
      formDataToSubmit.append("lastName", formData.lastName);
      formDataToSubmit.append("phoneNo", formData.phone); // Change phone to phoneNo
      formDataToSubmit.append("age", formData.age);
      formDataToSubmit.append("gender", formData.gender);
      formDataToSubmit.append("currentAddress", formData.currentAddress);
      formDataToSubmit.append(
        "churchContribution",
        formData.churchContribution
      );

      // Manually append nested fields (flattened structure)
      formDataToSubmit.append(
        "highestQualification.degree",
        formData.highestQualification.degree
      );
      formDataToSubmit.append(
        "highestQualification.college",
        formData.highestQualification.college
      );
      formDataToSubmit.append(
        "highestQualification.passingYear",
        formData.highestQualification.passingYear
      );

      formDataToSubmit.append(
        "jobDetails.jobTitle",
        formData.jobDetails.jobTitle
      );
      formDataToSubmit.append(
        "jobDetails.company",
        formData.jobDetails.company
      );
      formDataToSubmit.append(
        "jobDetails.location",
        formData.jobDetails.location
      );

      formDataToSubmit.append(
        "parishInfo.homeParish",
        formData.parishInfo.homeParish
      );
      formDataToSubmit.append(
        "parishInfo.district",
        formData.parishInfo.district
      );
      formDataToSubmit.append("parishInfo.state", formData.parishInfo.state);
      formDataToSubmit.append("parishInfo.pin", formData.parishInfo.pin);

      // Append the photo file
      if (formData.photo) {
        formDataToSubmit.append("photo", formData.photo);
      }

      // Send the data to the backend
      await axiosInstance.post(
        `/api/v1/users/${id}/user-details`,
        formDataToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setIsSubmitted(true);

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
        <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank you!</h2>
          <p>
            Your form has been successfully submitted. You will be redirected to
            the homepage shortly.
          </p>
        </div>
      </div>
    );
  }

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="w-full max-w-2xl p-6 space-y-6 bg-white rounded-lg shadow-lg sm:p-8">
        {/* Progress Bar */}
        <div className="relative">
          <div className="h-2 w-full bg-gray-200 rounded-full">
            <div
              className="h-2 bg-blue-600 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="text-right text-sm font-medium text-gray-700 mt-2">
            Step {currentStep} of {totalSteps}
          </div>
        </div>

        <h2 className="text-center text-2xl font-bold text-gray-900">
          {currentStep === 1 && "Personal Details"}
          {currentStep === 2 && "Educational & Occupational Background"}
          {currentStep === 3 && "Parish Information & Church Involvement"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Personal Details */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="sm:w-1/3">
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="sm:w-1/3">
                  <label
                    htmlFor="middleName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Middle Name
                  </label>
                  <input
                    type="text"
                    name="middleName"
                    placeholder="Middle Name"
                    value={formData.middleName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="sm:w-1/3">
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Photo
                </label>
                <input
                  type="file"
                  name="photo"
                  onChange={handleChange}
                  className="block w-full text-sm text-gray-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="age"
                  className="block text-sm font-medium text-gray-700"
                >
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700"
                >
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Educational & Occupational Background */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Education</h3>
              <div className="space-y-2">
                <label
                  htmlFor="highestQualification.degree"
                  className="block text-sm font-medium text-gray-700"
                >
                  Degree
                </label>
                <input
                  type="text"
                  name="highestQualification.degree"
                  placeholder="Degree"
                  value={formData.highestQualification.degree}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="highestQualification.college"
                  className="block text-sm font-medium text-gray-700"
                >
                  College/University
                </label>
                <input
                  type="text"
                  name="highestQualification.college"
                  placeholder="College/University"
                  value={formData.highestQualification.college}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="highestQualification.passingYear"
                  className="block text-sm font-medium text-gray-700"
                >
                  Passing Year
                </label>
                <input
                  type="number"
                  name="highestQualification.passingYear"
                  placeholder="Passing Year"
                  value={formData.highestQualification.passingYear}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <h3 className="text-lg font-semibold text-gray-900">
                Job Details
              </h3>
              <div className="space-y-2">
                <label
                  htmlFor="jobDetails.jobTitle"
                  className="block text-sm font-medium text-gray-700"
                >
                  Job Title
                </label>
                <input
                  type="text"
                  name="jobDetails.jobTitle"
                  placeholder="Job Title"
                  value={formData.jobDetails.jobTitle}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="jobDetails.company"
                  className="block text-sm font-medium text-gray-700"
                >
                  Company
                </label>
                <input
                  type="text"
                  name="jobDetails.company"
                  placeholder="Company"
                  value={formData.jobDetails.company}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="jobDetails.location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location
                </label>
                <input
                  type="text"
                  name="jobDetails.location"
                  placeholder="Location"
                  value={formData.jobDetails.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          )}

          {/* Step 3: Parish Information & Church Involvement */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Parish Information
              </h3>
              <div className="space-y-2">
                <label
                  htmlFor="parishInfo.homeParish"
                  className="block text-sm font-medium text-gray-700"
                >
                  Home Parish
                </label>
                <input
                  type="text"
                  name="parishInfo.homeParish"
                  placeholder="Home Parish"
                  value={formData.parishInfo.homeParish}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="parishInfo.district"
                  className="block text-sm font-medium text-gray-700"
                >
                  District
                </label>
                <input
                  type="text"
                  name="parishInfo.district"
                  placeholder="District"
                  value={formData.parishInfo.district}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="parishInfo.state"
                  className="block text-sm font-medium text-gray-700"
                >
                  State
                </label>
                <input
                  type="text"
                  name="parishInfo.state"
                  placeholder="State"
                  value={formData.parishInfo.state}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="parishInfo.pin"
                  className="block text-sm font-medium text-gray-700"
                >
                  PIN Code
                </label>
                <input
                  type="text"
                  name="parishInfo.pin"
                  placeholder="PIN Code"
                  value={formData.parishInfo.pin}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="churchContribution"
                  className="block text-sm font-medium text-gray-700"
                >
                  Church Contribution
                </label>
                <textarea
                  name="churchContribution"
                  placeholder="Church Contribution"
                  value={formData.churchContribution}
                  onChange={handleChange}
                  className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Previous
              </button>
            )}
            {currentStep < totalSteps && (
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Next
              </button>
            )}
            {currentStep === totalSteps && (
              <button
                type="submit"
                className="px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserDetailsForm;
