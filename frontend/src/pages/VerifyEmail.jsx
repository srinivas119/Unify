import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/verify/${token}`
        );

        const data = await res.json();

        if (res.ok) {
          setMessage("✅ Email verified successfully!");

          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          setMessage(data.message || "Verification failed.");
        }
      } catch (err) {
        setMessage("Server error. Please try again.");
      }
    };

    if (token) {
      verify();
    }
  }, [token, navigate]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "24px",
        fontWeight: "bold",
      }}
    >
      {message}
    </div>
  );
}

export default VerifyEmail;
