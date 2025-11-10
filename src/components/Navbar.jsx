import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAppData } from "../context/AppContext";

export default function Navbar() {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const { notifications, unreadCount, markNotificationsAsRead } = useAppData();

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/");
    setMenuOpen(false);
  };

  const handleNotificationClick = () => {
    setNotificationOpen(!notificationOpen);
    if (!notificationOpen && unreadCount > 0) {
      markNotificationsAsRead();
    }
  };

  const formatNotificationDate = (date) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) {
      return `Today, ${d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (d.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return d.toLocaleString('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 md:px-6 py-4 shadow">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo + View Mode */}
        <div className="flex items-center gap-2 md:gap-4">
          <Link to="/" className="flex items-center gap-2 md:gap-3" onClick={() => setMenuOpen(false)}>
            <span className="text-xl md:text-2xl">🛕</span>
            <span className="font-bold text-base md:text-lg">Vishwanath Mandir</span>
          </Link>
          <span className="hidden lg:inline-block text-sm text-indigo-100/80">
            {isAdmin ? <strong>Admin View</strong> : "Public View"}
          </span>
        </div>

        {/* Mobile: Notification Bell + Hamburger */}
        <div className="md:hidden flex items-center gap-3">
          {/* Mobile Notification Bell */}
          <div className="relative">
            <button
              onClick={handleNotificationClick}
              className="relative text-2xl hover:scale-110 transition-transform"
            >
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Mobile Notification Dropdown */}
            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-80 overflow-y-auto">
                <div className="p-3 bg-indigo-600 text-white font-semibold rounded-t-lg">
                  Notifications
                </div>
                {notifications.length === 0 ? (
                  <div className="p-4 text-gray-500 text-center text-sm">
                    No notifications yet
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-3 ${!notif.read ? 'bg-blue-50' : ''}`}
                      >
                        <p className="text-gray-800 text-sm">{notif.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatNotificationDate(notif.date)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hamburger Menu Button */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white text-2xl focus:outline-none"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/poojan" className="hover:underline">Mandir Poojan</Link>
          <Link to="/recent" className="hover:underline text-sm lg:text-base">Recent Donations</Link>
          <Link to="/donations" className="hover:underline">Donate Now</Link>
          <Link to="/expenses" className="hover:underline">Expenses</Link>

          {/* Notification Bell */}
          <div className="relative ml-2">
            <button
              onClick={handleNotificationClick}
              className="relative text-2xl hover:scale-110 transition-transform"
            >
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                <div className="p-3 bg-indigo-600 text-white font-semibold rounded-t-lg">
                  Notifications
                </div>
                {notifications.length === 0 ? (
                  <div className="p-4 text-gray-500 text-center">
                    No notifications yet
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-3 hover:bg-gray-50 ${!notif.read ? 'bg-blue-50' : ''}`}
                      >
                        <p className="text-gray-800 text-sm">{notif.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatNotificationDate(notif.date)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {!isAdmin ? (
            <Link
              to="/login"
              className="ml-4 bg-white text-indigo-600 px-3 py-1 rounded shadow-sm text-sm lg:text-base"
            >
              Admin Login
            </Link>
          ) : (
            <>
              <Link
                to="/admin"
                className="ml-4 bg-white text-indigo-600 px-3 py-1 rounded shadow-sm text-sm lg:text-base"
              >
                Admin
              </Link>
              <button
                onClick={handleLogout}
                className="ml-2 bg-red-500 px-3 py-1 rounded text-white text-sm lg:text-base"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 space-y-2 bg-indigo-700 rounded-lg p-4">
          <Link to="/" className="block py-2 hover:bg-indigo-600 px-3 rounded" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/poojan" className="block py-2 hover:bg-indigo-600 px-3 rounded" onClick={() => setMenuOpen(false)}>Mandir Poojan</Link>
          <Link to="/recent" className="block py-2 hover:bg-indigo-600 px-3 rounded" onClick={() => setMenuOpen(false)}>Recent Donations</Link>
          <Link to="/donations" className="block py-2 hover:bg-indigo-600 px-3 rounded" onClick={() => setMenuOpen(false)}>Donate Now</Link>
          <Link to="/expenses" className="block py-2 hover:bg-indigo-600 px-3 rounded" onClick={() => setMenuOpen(false)}>Expenses</Link>
          
          {!isAdmin ? (
            <Link
              to="/login"
              className="block py-2 bg-white text-indigo-600 text-center rounded mt-2"
              onClick={() => setMenuOpen(false)}
            >
              Admin Login
            </Link>
          ) : (
            <>
              <Link
                to="/admin"
                className="block py-2 bg-white text-indigo-600 text-center rounded mt-2"
                onClick={() => setMenuOpen(false)}
              >
                Admin
              </Link>
              <button
                onClick={handleLogout}
                className="w-full py-2 bg-red-500 text-white rounded mt-2"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
