import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axiosInstance from "../lib/axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "react-toastify/dist/ReactToastify.css";

const UserDetailsForm = () => {
  const { refetchUserInfo } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    fatherName: "",
    aadhaarNo: "",
    phoneNo: "",
    age: "",
    gender: "",
    photo: null,
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

  const navigate = useNavigate();
  const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;
  const { id } = useParams();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith("image/")) {
      toast.error("Only image files are allowed!");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      photo: file,
    }));
  };

  const validateStep1 = () => {
    const {
      firstName,
      lastName,
      fatherName,
      aadhaarNo,
      phoneNo,
      age,
      gender,
      photo,
      currentAddress,
    } = formData;

    if (
      !firstName ||
      !lastName ||
      !fatherName ||
      !aadhaarNo ||
      !phoneNo ||
      !age ||
      !gender ||
      !photo ||
      !currentAddress
    ) {
      toast.error("All fields except Middle Name are required in Step 1!");
      return false;
    }

    if (phoneNo.length !== 10 || !/^\d+$/.test(phoneNo)) {
      toast.error("Phone number must be a valid 10-digit number!");
      return false;
    }

    if (age < 14) {
      toast.error("You are too young to join Youth.");
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    const { degree, college, passingYear, jobTitle, company, location } =
      formData;
    if (
      !degree ||
      !college ||
      !passingYear ||
      !jobTitle ||
      !company ||
      !location
    ) {
      toast.error("All fields are required in Step 2!");
      return false;
    }

    if (!/^\d{4}$/.test(passingYear)) {
      toast.error("Please provide a valid year of passing (e.g., 2020).");
      return false;
    }

    return true;
  };

  const validateStep3 = () => {
    const { homeParish, district, state, pin, churchContribution } = formData;
    if (!homeParish || !district || !state || !pin || !churchContribution) {
      toast.error("All fields are required in Step 3!");
      return false;
    }

    if (!/^\d{6}$/.test(pin)) {
      toast.error("Please provide a valid 6-digit PIN code.");
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // FORM SUBMISSION
  const handleSubmit = async (e) => {
    console.log("Form Data : ", formData);
    e.preventDefault();
    if (!validateStep3()) return;

    setLoading(true);
    try {
      const response = await axiosInstance.post(
        `${BACKEND_URI}api/v1/users/${id}/user-details`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        setIsSubmitted(true);
        setTimeout(async () => {
          try {
            await refetchUserInfo();
          } catch (error) {
            console.log("Failed to call refetchUserInfo() :", error);
          }
          navigate("/");
        }, 3000);
        toast.success("Form successfully submitted!");
        navigate("/");
      } else {
        toast.error("Form submission failed.");
      }
    } catch (error) {
      toast.error(`Error: Could not submit the form : ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const isStep1Complete = () => {
    const {
      firstName,
      lastName,
      fatherName,
      aadhaarNo,
      phoneNo,
      age,
      gender,
      photo,
      currentAddress,
    } = formData;
    return (
      firstName &&
      lastName &&
      fatherName &&
      aadhaarNo.length === 12 &&
      phoneNo.length === 10 &&
      age >= 14 &&
      gender &&
      photo &&
      currentAddress
    );
  };

  const isStep2Complete = () => {
    const { degree, college, passingYear, jobTitle, company, location } =
      formData;
    return (
      degree &&
      college &&
      /^\d{4}$/.test(passingYear) &&
      jobTitle &&
      company &&
      location
    );
  };

  const isStep3Complete = () => {
    const { homeParish, district, state, pin, churchContribution } = formData;
    return (
      homeParish &&
      district &&
      state &&
      /^\d{6}$/.test(pin) &&
      churchContribution
    );
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

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-center text-2xl font-bold text-gray-900">
          Member Details Form
        </h2>

        {/* Progress Bar */}
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-700 bg-gray-200">
                Step {currentStep} of 3
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
            <div
              style={{ width: `${(currentStep / 3) * 100}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-500"
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-center text-2xl font-semibold text-gray-700">
                Personal Details
              </h3>
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="middleName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Middle Name (Optional)
                </label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="fatherName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Father's Name
                </label>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="aadhaarNo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Aadhaar No.
                </label>
                <input
                  type="text"
                  name="aadhaarNo"
                  value={formData.aadhaarNo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  maxLength={12}
                  pattern="\d{12}"
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
                  type="text"
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  maxLength={10}
                  pattern="\d{10}"
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
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Photo
                </label>
                <input
                  type="file"
                  name="photo"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
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
                  value={formData.currentAddress}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 2: Education & Job Details */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-center text-2xl font-semibold text-gray-700">
                Occupational Details
              </h3>
              <div>
                <label
                  htmlFor="degree"
                  className="block text-sm font-medium text-gray-700"
                >
                  Highest Qualification (Degree)
                </label>
                <input
                  type="text"
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="college"
                  className="block text-sm font-medium text-gray-700"
                >
                  College / University
                </label>
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="passingYear"
                  className="block text-sm font-medium text-gray-700"
                >
                  Passing Year
                </label>
                <input
                  type="text"
                  name="passingYear"
                  value={formData.passingYear}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  maxLength={4}
                  pattern="\d{4}"
                />
              </div>
              <div>
                <label
                  htmlFor="jobTitle"
                  className="block text-sm font-medium text-gray-700"
                >
                  Job Title
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-gray-700"
                >
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Job Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 3: Parish Info */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-center text-2xl font-semibold text-gray-700">
                Parish Info & Church Involvement
              </h3>
              <div>
                <label
                  htmlFor="homeParish"
                  className="block text-sm font-medium text-gray-700"
                >
                  Home Parish
                </label>
                <input
                  type="text"
                  name="homeParish"
                  value={formData.homeParish}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="district"
                  className="block text-sm font-medium text-gray-700"
                >
                  District
                </label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700"
                >
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="pin"
                  className="block text-sm font-medium text-gray-700"
                >
                  PIN Code
                </label>
                <input
                  type="text"
                  name="pin"
                  value={formData.pin}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  maxLength={6}
                  pattern="\d{6}"
                />
              </div>
              <div>
                <label
                  htmlFor="churchContribution"
                  className="block text-sm font-medium text-gray-700"
                >
                  How I would Contribute to Church?
                </label>
                <textarea
                  name="churchContribution"
                  value={formData.churchContribution}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  placeholder="Church me kya krna chahoge. 1 line me bta do."
                />
              </div>
            </div>
          )}

          <div className="flex justify-between">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
              >
                Previous
              </button>
            )}

            {currentStep < 3 && (
              <button
                type="button"
                onClick={handleNext}
                className={`px-4 py-2 bg-indigo-500 text-white rounded-lg ${
                  (!isStep1Complete() && currentStep === 1) ||
                  (!isStep2Complete() && currentStep === 2)
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Next
              </button>
            )}

            {currentStep === 3 && (
              <button
                type="submit"
                className={`px-4 py-2 bg-indigo-500 text-white rounded-lg ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            )}
          </div>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
};

export default UserDetailsForm;
