import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", form);

      login(res.data);

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-8 shadow-2xl"
      >
        <h1 className="text-4xl font-bold text-center text-blue-500">
          UnifyCode
        </h1>

        <p className="text-center text-slate-400 mt-2 mb-8">
          Login to your account
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500 text-red-400 p-3 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-5">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-400 outline-none focus:border-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-400 outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Login
          </button>
        </div>

        <div className="mt-4 text-center">
            <Link
                to="/forgot-password"
                className="text-sm font-semibold text-blue-400 hover:text-blue-300"
            >
                Forgot Password?
            </Link>
        </div>

        <p className="mt-6 text-center text-slate-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-blue-400 hover:text-blue-300"
          >
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
