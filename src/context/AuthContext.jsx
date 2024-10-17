import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../lib/axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false); // Track refresh status
  const [failedRequestsQueue, setFailedRequestsQueue] = useState([]); // Queue for failed requests
  const navigate = useNavigate();

  // Load User on initial render
  useEffect(() => {
    (async () => {
      await fetchUserInfo();
    })();
  }, []);

  // Axios Interceptors
  useEffect(() => {
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config; // Store the original request configuration

        if (
          error.response &&
          error.response.status === 401 &&
          !originalRequest._retry
        ) {
          if (isRefreshing) {
            // If a token refresh is already happening, queue the requests
            return new Promise((resolve, reject) => {
              failedRequestsQueue.push({ resolve, reject });
            })
              .then(() => {
                return axiosInstance(originalRequest); // Retry the original request without re-adding withCredentials
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true; // Mark the original request as retried
          setIsRefreshing(true); // Set token refreshing flag

          try {
            await refreshAccessToken(); // Call your refresh token logic

            // Retry any requests that failed during the refresh process
            failedRequestsQueue.forEach((prom) => {
              prom.resolve();
            });
            setFailedRequestsQueue([]); // Clear the queue

            // Retry the original request
            return axiosInstance(originalRequest); // Retry the request directly
          } catch (err) {
            failedRequestsQueue.forEach((prom) => prom.reject(err)); // Reject queued requests if refresh fails
            setFailedRequestsQueue([]);
            logout(); // Logout if refresh fails
            return Promise.reject(err);
          } finally {
            setIsRefreshing(false); // Reset refreshing state
          }
        }

        return Promise.reject(error); // Reject any other error
      }
    );

    // Clean up the interceptor when the component unmounts
    return () => {
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [isRefreshing, failedRequestsQueue]);

  // Refresh Access Token
  const refreshAccessToken = async () => {
    try {
      const response = await axiosInstance.get(
        "api/v1/auth/refresh-access-token"
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
      const response = await axiosInstance.post("api/v1/auth/login", {
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
      const response = await axiosInstance.get("api/v1/users/me", {
        withCredentials: true,
      });
      console.log(
        "Response.data.data of fetchUserInfo() : ",
        response.data.data
      );

      console.log("Current user state : ", user);
      setUser(response.data.data);
    } catch (error) {
      console.error("Failed to fetch user info", error);
      if (error.response && error.response.status === 401) {
        await refreshAccessToken();
      }
    }
  };

  // Add a function in your AuthContext to refetch user info
  const refetchUserInfo = async () => {
    try {
      const response = await axiosInstance.get("api/v1/users/me", {
        withCredentials: true,
      });
      setUser(response.data.data);
    } catch (error) {
      console.error("Failed to refetch user info", error);
    }
  };

  // Logout Functionality
  const logout = async () => {
    console.log("Logout is called");
    try {
      await axiosInstance.post("api/v1/auth/logout");
      console.log("Logout successful");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout Failed", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, refetchUserInfo, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
