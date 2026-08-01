import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function VerifyEmail() {

    const { token } = useParams();

    const navigate = useNavigate();

    const [message, setMessage] = useState("Verifying Email...");

    useEffect(() => {

        const verify = async () => {

            try {

                const res = await fetch(
                    `http://localhost:5000/api/auth/verify/${token}`
                );

                const data = await res.json();

                if (data.success) {

                    setMessage("✅ Email Verified Successfully");

                    setTimeout(() => {

                        navigate("/login");

                    }, 3000);

                } else {

                    setMessage(data.message);

                }

            } catch {

                setMessage("Verification Failed");

            }

        };

        verify();

    }, [token, navigate]);

    return (

        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                fontSize: "24px"
            }}
        >
            {message}
        </div>

    );

}

export default VerifyEmail;