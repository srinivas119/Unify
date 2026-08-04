import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useToast } from "../context/ToastContext";

function Signup() {
  const { error: toastError, success: toastSuccess } = useToast();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [usernameTaken, setUsernameTaken] = useState(false);
  
  // Resend state
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resendError, setResendError] = useState("");

  const handleResend = async () => {
    setIsResending(true);
    setResendMessage("");
    setResendError("");
    
    try {
        const res = await api.post("/auth/resend-verification", { email: form.email });
        setResendMessage(res.data.message);
        toastSuccess("Verification Resent", "Check your inbox (and spam folder).");
    } catch (err) {
        setResendError(err.response?.data?.message || "Failed to resend verification email");
        toastError("Resend Failed", err.response?.data?.message || "Failed to resend verification email");
    } finally {
        setIsResending(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setUsernameTaken(false);

    try {
      const res = await api.post("/auth/signup", form);
      setMessage(res.data.message);
      toastSuccess("Signup Successful", "Check your email for the verification link.");
    } catch (err) {
      if (err.response?.status === 409 && err.response?.data?.message === "Username is not available.") {
         setUsernameTaken(true);
      } else {
         toastError("Signup Failed", err.response?.data?.message || "An error occurred during signup");
      }
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
          Create your account
        </p>

        {message && (
          <div className="mb-4 rounded-lg border border-slate-700 bg-slate-800 p-5 shadow-inner">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-200">Signup Successful!</h3>
            </div>
            
            <p className="text-slate-300 text-sm mb-3 ml-11">
              {message}
            </p>

            <div className="ml-11 mb-4 rounded bg-yellow-500/10 p-3 border border-yellow-500/20">
              <p className="text-sm text-yellow-500">
                <span className="font-semibold">Don't see the email?</span> Check your Spam/Junk folder.
              </p>
            </div>

            <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="ml-11 mt-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isResending ? "Resending..." : "🔄 Resend Verification Email"}
            </button>
            
            {resendMessage && (
                <p className="ml-11 mt-2 text-xs text-green-400">{resendMessage}</p>
            )}
             {resendError && (
                <p className="ml-11 mt-2 text-xs text-red-400">{resendError}</p>
            )}
          </div>
        )}

        {usernameTaken && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500 text-red-400 p-4">
            <h3 className="font-bold text-lg mb-1">Username Not Available</h3>
            <p className="text-sm">This username is already taken.</p>
            <p className="text-sm mt-1">Please choose another username.</p>
          </div>
        )}

        <div className="space-y-5">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-400 outline-none focus:border-blue-500"
          />

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
            Signup
          </button>
        </div>

        <p className="mt-6 text-center text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-400 hover:text-blue-300"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
