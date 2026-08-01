import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/profile";
import PlatformConnection from "./pages/PlatformConnection";
import VerifyEmail from "./pages/VerifyEmail";

import ProtectedRoute from "./components/ProtectedRoute";

function App(){

return(

<Routes>

<Route path="/login" element={<Login/>}/>

<Route path="/signup" element={<Signup/>}/>

<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>

<Route path="/"

element={

<ProtectedRoute>

<Home/>

</ProtectedRoute>

}

/>



<Route path="/profile"

element={

<ProtectedRoute>

<Profile/>

</ProtectedRoute>

}

/>

<Route path="/platforms"

element={

<ProtectedRoute>

<PlatformConnection/>

</ProtectedRoute>

}

/>
<Route
  path="/verify/:token"
  element={<VerifyEmail />}
/>
</Routes>

);

}

export default App;
