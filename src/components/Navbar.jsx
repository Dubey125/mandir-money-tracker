import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/");
    setMenuOpen(false);
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

        {/* Hamburger Menu Button (Mobile) */}
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white text-2xl focus:outline-none"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/poojan" className="hover:underline">Mandir Poojan</Link>
          <Link to="/recent" className="hover:underline text-sm lg:text-base">Recent Donations</Link>
          <Link to="/donations" className="hover:underline">Donate Now</Link>
          <Link to="/expenses" className="hover:underline">Expenses</Link>

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
