import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import DownloadUserForm from "../components/DownloadUserForm";

const UserProfile = ({ userId }) => {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/users/${userId}`);
        setUserDetails(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [userId]);

  if (!userDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      <DownloadUserForm userDetails={userDetails} />
    </div>
  );
};

export default UserProfile;
