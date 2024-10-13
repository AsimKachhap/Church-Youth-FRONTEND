import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const { user, logout } = useAuth();
  const [date, setDate] = useState(new Date());

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    try {
      console.log("I ran");
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  console.log("Home Page jus loaded");

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navbar */}
      <nav className="flex justify-between items-center bg-blue-600 text-white p-4 shadow-md">
        <div className="flex items-center space-x-4">
          <img
            src={user?.profilePicture} // Add fallback image for dp later
            alt="User DP"
            className="h-10 w-10 rounded-full"
          />
          <span className="text-lg">{user?.username || "Guest"}</span>
        </div>
        <div className="flex items-center space-x-6">
          <span>
            {date.toLocaleDateString()} {date.toLocaleTimeString()}
          </span>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="bg-gray-200 w-64 p-4 space-y-4">
          <h2 className="text-xl font-bold">Menu</h2>
          <ul className="space-y-3">
            <li className="hover:bg-gray-300 p-2 rounded">Dashboard</li>
            <li className="hover:bg-gray-300 p-2 rounded">Profile</li>
            <li className="hover:bg-gray-300 p-2 rounded">Settings</li>
          </ul>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-white p-8 overflow-auto">
          <h1 className="text-3xl font-bold mb-6">
            Welcome, {user?.username || "Guest"}!
          </h1>
          <div className="p-4 bg-gray-100 rounded shadow-md">
            <p>Main content goes here.</p>
          </div>
        </main>

        {/* Right Notification Sidebar */}
        <aside className="bg-gray-100 w-64 p-4 space-y-4 border-l">
          <h2 className="text-xl font-bold">Notifications</h2>
          <div className="space-y-3">
            <div className="bg-white p-3 shadow rounded">
              <p className="text-sm font-medium">New message from Admin</p>
              <p className="text-xs text-gray-500">2 minutes ago</p>
            </div>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer className="bg-blue-600 text-white p-4 text-center">
        <p>&copy; 2024 Your Organization. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
