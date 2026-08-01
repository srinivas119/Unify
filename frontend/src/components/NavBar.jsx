import { Link, useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const logout = () => {

        localStorage.removeItem("token");

        navigate("/login");

    };

    return (

        <nav className="navbar">

            <h2>UnifyCode</h2>

            <div>

                <Link to="/">Home</Link>

                <Link to="/dashboard">Dashboard</Link>

                <Link to="/profile">Profile</Link>

                <Link to="/platforms">Platforms</Link>

                <button onClick={logout}>

                    Logout

                </button>

            </div>

        </nav>

    );

}

export default Navbar;