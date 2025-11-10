import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 shadow">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo + View Mode */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            <span className="text-2xl">🛕</span>
            <span className="font-bold text-lg">Vishwanath Mandir</span>
          </Link>
          <span className="hidden md:inline-block text-sm text-indigo-100/80">
            {isAdmin ? <strong>Admin View</strong> : "Public View"}
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-3">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/recent" className="hover:underline">Recent Donations</Link>
          <Link to="/donations" className="hover:underline">Donations</Link>
          <Link to="/expenses" className="hover:underline">Expenses</Link>

          {!isAdmin ? (
            <Link
              to="/login"
              className="ml-4 bg-white text-indigo-600 px-3 py-1 rounded shadow-sm"
            >
              Admin Login
            </Link>
          ) : (
            <>
              <Link
                to="/admin"
                className="ml-4 bg-white text-indigo-600 px-3 py-1 rounded shadow-sm"
              >
                Admin
              </Link>
              <button
                onClick={handleLogout}
                className="ml-2 bg-red-500 px-3 py-1 rounded text-white"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
