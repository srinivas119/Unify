import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

function Login() {

    const navigate = useNavigate();

    const { login } = useContext(AuthContext);

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        try {

            const res = await api.post("/auth/login", form);

            login(res.data);

            navigate("/");

        }

        catch (err) {

            setError(
                err.response?.data?.message ||
                "Login Failed"
            );

        }

    };

    return (

        <div className="auth-container">

            <form onSubmit={handleSubmit} className="auth-card">

                <h1>UnifyCode</h1>

                <h2>Login</h2>

                {error && <p className="error">{error}</p>}

                <input

                    type="email"

                    name="email"

                    placeholder="Email"

                    value={form.email}

                    onChange={handleChange}

                />

                <input

                    type="password"

                    name="password"

                    placeholder="Password"

                    value={form.password}

                    onChange={handleChange}

                />

                <button>

                    Login

                </button>

                <p>

                    Don't have an account?

                    <Link to="/signup">

                        Signup

                    </Link>

                </p>

            </form>

        </div>

    );

}

export default Login;