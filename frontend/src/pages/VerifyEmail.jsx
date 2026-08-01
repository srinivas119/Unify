import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function VerifyEmail() {
  const { token } = useParams();

  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    async function verify() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/verify/${token}`
        );

        const data = await response.json();

        if (response.ok) {
          setMessage("✅ Email verified successfully!");
        } else {
          setMessage(data.message || "Verification failed.");
        }
      } catch (err) {
        setMessage("Server error.");
      }
    }

    verify();
  }, [token]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "24px",
      }}
    >
      {message}
    </div>
  );
}

export default VerifyEmail;
