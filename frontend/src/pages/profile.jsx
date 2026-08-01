import Navbar from "../components/NavBar";

function Profile(){

return(

<div>

<Navbar/>

<div className="container">

<h1>Profile</h1>

<input placeholder="Full Name"/>

<input placeholder="College"/>

<input placeholder="Branch"/>

<input placeholder="Year"/>

<textarea placeholder="Bio"/>

<button>

Save

</button>

</div>

</div>

);

}

export default Profile;
