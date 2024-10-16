import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useParams to get user ID
import axiosInstance from "../lib/axios";
import { useAuth } from "../context/AuthContext";

const UserDetailsForm = () => {
  const { id } = useParams(); // Get user._id from URL params
  const navigate = useNavigate();
  const { refetchUserInfo } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    photo: null,
    phoneNo: "",
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
      // Send the data to the backend
      await axiosInstance.post(`/api/v1/users/${id}/user-details`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setIsSubmitted(true);

      setTimeout(async () => {
        try {
          await refetchUserInfo();
        } catch (error) {
          console.log("Failed to call reFetchUserInfo() :", error);
        }
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
                  htmlFor="phoneNo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNo"
                  placeholder="Phone Number"
                  value={formData.phoneNo}
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

              <div>
                <label
                  htmlFor="currentAddress"
                  className="block text-sm font-medium text-gray-700"
                >
                  Current Address
                </label>
                <input
                  type="text"
                  name="currentAddress"
                  placeholder="Current Address"
                  value={formData.currentAddress}
                  onChange={handleChange}
                  className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 2: Educational & Occupational Background */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Education</h3>
              <div className="space-y-2">
                <label
                  htmlFor="degree"
                  className="block text-sm font-medium text-gray-700"
                >
                  Degree
                </label>
                <input
                  type="text"
                  name="degree"
                  placeholder="Degree"
                  value={formData.degree}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="college"
                  className="block text-sm font-medium text-gray-700"
                >
                  College/University
                </label>
                <input
                  type="text"
                  name="college"
                  placeholder="College/University"
                  value={formData.college}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="passingYear"
                  className="block text-sm font-medium text-gray-700"
                >
                  Passing Year
                </label>
                <input
                  type="number"
                  name="passingYear"
                  placeholder="Passing Year"
                  value={formData.passingYear}
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
                  htmlFor="jobTitle"
                  className="block text-sm font-medium text-gray-700"
                >
                  Job Title
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  placeholder="Job Title"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-gray-700"
                >
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  placeholder="Company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={formData.location}
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
                  htmlFor="homeParish"
                  className="block text-sm font-medium text-gray-700"
                >
                  Home Parish
                </label>
                <input
                  type="text"
                  name="homeParish"
                  placeholder="Home Parish"
                  value={formData.homeParish}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="district"
                  className="block text-sm font-medium text-gray-700"
                >
                  District
                </label>
                <input
                  type="text"
                  name="district"
                  placeholder="District"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700"
                >
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="pin"
                  className="block text-sm font-medium text-gray-700"
                >
                  PIN Code
                </label>
                <input
                  type="text"
                  name="pin"
                  placeholder="PIN Code"
                  value={formData.pin}
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
