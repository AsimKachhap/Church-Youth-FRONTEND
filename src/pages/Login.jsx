import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login, loading: isLoggingIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state before login attempt

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed, please try again."); // Set error message
    }
  };

  useEffect(() => {
    // Clear form fields on unmount
    return () => {
      setEmail("");
      setPassword("");
      setError(null);
    };
  }, []);

  if (isLoggingIn) return <p>Logging In...</p>;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-center text-2xl font-bold text-gray-900">Login</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-600 rounded">
            <p aria-live="assertive">{error}</p>
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoggingIn} // Disable button while logging in
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white ${
              isLoggingIn ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            {isLoggingIn ? "Logging In..." : "Login"}
          </button>
        </form>
        {/* Option to go to Register page */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-600 hover:text-indigo-500"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
