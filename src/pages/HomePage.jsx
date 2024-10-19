import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const HomePage = () => {
  const { user, logout } = useAuth();
  const [date, setDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      console.log(user);
      console.log("isComplete :", user?.isDetailsComplete);
      navigate("/login");
    } else if (!user.isDetailsComplete) {
      console.log(user);
      console.log("isComplete :", user?.isDetailsComplete);
      // Show modal if user details are incomplete
      setShowModal(true);
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  console.log("PhotoUrl on HomePage : ", user?.profilePhoto);

  const handleConfirmRedirect = () => {
    setShowModal(false); // Close modal
    navigate(`/user-details/${user._id}`); // Redirect to user details page
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navbar */}
      <nav className="flex justify-between items-center bg-blue-600 text-white p-2 shadow-md">
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 sm:w-28 sm:h-28 relative overflow-hidden rounded-full flex items-center justify-center">
            <img
              src={user?.profilePhoto}
              alt="User DP"
              className="absolute inset-0 w-full h-full rounded-full object-cover object-top"
              style={{ objectPosition: "top" }} // Adjusts the image position
            />
          </div>

          <span className="text-lg">{user?.username || "Guest"}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>{date.toLocaleDateString()}</span>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Body */}
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar */}
        <aside className="bg-gray-200 w-full md:w-64 p-4 space-y-4">
          <h2 className="text-xl font-bold">Menu</h2>
          <ul className="space-y-3">
            <li className="hover:bg-gray-300 p-2 rounded">Dashboard</li>
            <li className="hover:bg-gray-300 p-2 rounded">Profile</li>
            <li className="hover:bg-gray-300 p-2 rounded">Settings</li>
            <li className="hover:bg-gray-300 p-2 rounded">
              <Link to="/my-form">My Form</Link>
            </li>
          </ul>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-white p-4 overflow-auto">
          <h1 className="text-3xl font-bold mb-6">
            Welcome, {user?.username || "Guest"}!
          </h1>
          <div className="p-4 bg-gray-100 rounded shadow-md">
            <p>Main content goes here.</p>
          </div>
        </main>

        {/* Right Notification Sidebar */}
        <aside className="bg-gray-100 w-full md:w-64 p-4 space-y-4 border-l">
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Complete Your Profile</h2>
            <p className="mb-4">
              Please complete your user details before continuing.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleConfirmRedirect}
              >
                Complete Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
