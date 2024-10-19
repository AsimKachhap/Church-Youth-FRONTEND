import { useEffect, useState } from "react";
import axiosInstance from "../lib/axios";
import DownloadUserForm from "../components/DownloadUserForm";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error handling
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true); // Start loading
        const response = await axiosInstance.get(
          `/api/v1/users/${user._id}/user-details`
        );
        console.log("User Details for pdf:", response.data.data);
        setUserDetails(response.data.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError("Failed to load user details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchUserDetails();
    }
  }, [user?._id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 font-semibold">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <p>Click the Button to download your Membership Form.</p>
      {userDetails ? (
        <div className="px-8 py-4 bg-emerald-500 rounded-sm mt-6 sm:mt-4">
          <DownloadUserForm userDetails={userDetails} />
        </div>
      ) : (
        <div className="text-gray-500 mb-4">No user details found.</div>
      )}
    </div>
  );
};

export default UserProfile;
