import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../lib/axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load User on initial render
  useEffect(() => {
    (async () => {
      await fetchUserInfo();
    })();
  }, []);

  // Refresh Access Token
  const refreshAccessToken = async () => {
    console.log("refreshAccessToken is called");
    try {
      const response = await axiosInstance.get(
        "/api/v1/auth/refresh-access-token"
      );

      console.log("Access token refreshed: ", response);
    } catch (error) {
      console.error("Failed to refresh access token", error);
      logout(); // Logout if refresh fails
    }
  };

  // Login Functionality
  const login = async (email, password) => {
    console.log(`Email: ${email}, Password: ${password}`);
    setLoading(true);
    try {
      const response = await axiosInstance.post("/api/v1/auth/login", {
        email,
        password,
      });
      console.log("Login Response: ", response);

      await fetchUserInfo(); // Fetch user info after successful login
    } catch (error) {
      console.error("Login Failed !!!", error);
    } finally {
      setLoading(false);
    }
  };

  //Fetching User Info
  const fetchUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/users/me");
      console.log("My Profile: ", response);
      setUser(response.data.data);
    } catch (error) {
      console.error("Failed to fetch user info", error);
      if (error.response && error.response.status === 401) {
        await refreshAccessToken();
      }
    }
  };

  // Logout Functionality
  const logout = async () => {
    console.log("Logout is called");
    try {
      await axiosInstance.post("/api/v1/auth/logout");
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
