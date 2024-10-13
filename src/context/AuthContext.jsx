import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //Fetching User Info
  const fetchUserInfo = async () => {
    console.log("fetchUserInfo is called");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/users/me`,
        {
          withCredentials: true,
        }
      );
      console.log("My Profile: ", response);
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user info", error);
      if (error.response && error.response.status === 401) {
        await refreshAccessToken();
      }
    }
  };

  // Load User on initial render
  useEffect(() => {
    fetchUserInfo();
  }, [user]);

  // Refresh Access Token
  const refreshAccessToken = async () => {
    console.log("refreshAccessToken is called");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/auth/refresh-access-token`,
        {
          withCredentials: true,
        }
      );

      console.log("Access token refreshed: ", response);
    } catch (error) {
      console.error("Failed to refresh access token", error);
      logout(); // Logout if refresh fails
    }
  };

  // Login Functionality
  const login = async (email, password) => {
    console.log("Login is called");
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      console.log("Login Response: ", response);
      await fetchUserInfo(); // Fetch user info after successful login
    } catch (error) {
      console.error("Login Failed !!!", error);
    } finally {
      setLoading(false);
    }
  };

  // Logout Functionality
  const logout = async () => {
    console.log("Logout is called");
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/auth/logout`,
        { withCredentials: true }
      );
      console.log("Logout successful");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout Failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
