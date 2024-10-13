import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";
import UserDetailsForm from "./pages/UserDetailsForm";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Login />;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user-details/:id" element={<UserDetailsForm />} />
          <Route path="/logout" element={<Logout />} />
          {/* Private route: only accessible if logged in */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
