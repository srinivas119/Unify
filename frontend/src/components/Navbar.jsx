import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Code2,
  User,
  LayoutDashboard,
  LogOut,
  Link2,
  House,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [user, setUser] = useState({
    username: "",
    email: "",
  });

  const dropdownRef = useRef(null);

  useEffect(() => {
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");

    setUser({
      username: username || "Developer",
      email: email || "",
    });

    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");

    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-5">

        {/* Logo */}

        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <Code2
            className="text-blue-500"
            size={34}
          />

          <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            UnifyCode
          </span>
        </Link>

        {/* Navigation */}

        <div className="hidden md:flex items-center gap-8">

          <Link
            to="/"
            className="text-slate-300 hover:text-white transition"
          >
            Home
          </Link>

          <Link
            to="/dashboard"
            className="text-slate-300 hover:text-white transition"
          >
            Dashboard
          </Link>

          <Link
            to="/platforms"
            className="text-slate-300 hover:text-white transition"
          >
            Platforms
          </Link>

          <Link
            to="/profile"
            className="text-slate-300 hover:text-white transition"
          >
            Profile
          </Link>

        </div>

        {/* Profile */}

        <div
          className="relative"
          ref={dropdownRef}
        >
          <button
            onClick={() =>
              setDropdownOpen(!dropdownOpen)
            }
            className="w-11 h-11 rounded-full border border-slate-700 bg-slate-900 flex items-center justify-center hover:border-blue-500 transition"
          >
            <User
              size={20}
              className="text-blue-400"
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-4 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">

              <div className="p-4 border-b border-slate-800">

                <h3 className="font-semibold text-white">
                  {user.username}
                </h3>

                <p className="text-xs text-slate-400 truncate">
                  {user.email}
                </p>

              </div>

              <Link
                to="/"
                className="flex items-center gap-3 px-5 py-3 hover:bg-slate-800 transition"
              >
                <House size={18} />
                Home
              </Link>

              <Link
                to="/dashboard"
                className="flex items-center gap-3 px-5 py-3 hover:bg-slate-800 transition"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>

              <Link
                to="/platforms"
                className="flex items-center gap-3 px-5 py-3 hover:bg-slate-800 transition"
              >
                <Link2 size={18} />
                Platforms
              </Link>

              <Link
                to="/profile"
                className="flex items-center gap-3 px-5 py-3 hover:bg-slate-800 transition"
              >
                <User size={18} />
                Profile
              </Link>

              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-5 py-3 text-red-400 hover:bg-red-500/10 transition"
              >
                <LogOut size={18} />
                Logout
              </button>

            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
