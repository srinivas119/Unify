import Navbar from "../components/NavBar";

function Home(){

return(

<div>

<Navbar/>

<div className="container">

<h1>

Welcome To UnifyCode 🚀

</h1>

<p>

Connect all your coding platforms in one place.

</p>

<div className="cards">

<div className="card">

<h2>GitHub</h2>

<p>Connect Repository</p>

</div>

<div className="card">

<h2>LeetCode</h2>

<p>Track Problems</p>

</div>

<div className="card">

<h2>Codeforces</h2>

<p>Track Rating</p>

</div>

<div className="card">

<h2>CodeChef</h2>

<p>Track Rating</p>

</div>

</div>

</div>

</div>

);

}

export default Home;
