import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { useToast } from "../context/ToastContext";

function ResetPassword() {
  const { error: toastError, success: toastSuccess } = useToast();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toastError("Invalid Token", "Missing reset token in URL.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toastError("Mismatch", "Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post("/auth/reset-password", {
        token,
        newPassword: form.newPassword,
      });

      toastSuccess("Success", res.data.message);
      
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      
    } catch (err) {
      toastError("Failed", err.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
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
          Create new password
        </p>

        {!token && (
            <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500 text-red-400 p-3 text-sm">
            Missing reset token in URL.
          </div>
        )}

        <div className="space-y-5">
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={form.newPassword}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-400 outline-none focus:border-blue-500"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-400 outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={isLoading || !token}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ResetPassword;
