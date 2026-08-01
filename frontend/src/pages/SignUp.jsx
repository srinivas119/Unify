import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Signup() {

    const [form, setForm] = useState({

        username: "",

        email: "",

        password: ""

    });

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");

        setError("");

        try {

            const res = await api.post(

                "/auth/signup",

                form

            );

            setMessage(res.data.message);

        }

        catch (err) {

            setError(

                err.response?.data?.message ||

                "Signup Failed"

            );

        }

    };

    return (

        <div className="auth-container">

            <form

                onSubmit={handleSubmit}

                className="auth-card"

            >

                <h1>UnifyCode</h1>

                <h2>Signup</h2>

                {message &&

                    <p className="success">

                        {message}

                    </p>

                }

                {error &&

                    <p className="error">

                        {error}

                    </p>

                }

                <input

                    type="text"

                    name="username"

                    placeholder="Username"

                    value={form.username}

                    onChange={handleChange}

                />

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

                    Signup

                </button>

                <p>

                    Already have an account?

                    <Link to="/login">

                        Login

                    </Link>

                </p>

            </form>

        </div>

    );

}

export default Signup;