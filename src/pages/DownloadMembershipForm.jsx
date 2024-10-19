import { useEffect, useState } from "react";
import axiosInstance from "../lib/axios";
import DownloadUserForm from "../components/DownloadUserForm";
import { useAuth } from "../context/AuthContext";

const UserProfile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error handling
  const { user } = useAuth();

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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      {userDetails ? (
        <DownloadUserForm userDetails={userDetails} />
      ) : (
        <div>No user details found.</div>
      )}
    </div>
  );
};

export default UserProfile;
