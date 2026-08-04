import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

import {
    User,
    Mail,
    Phone,
    Edit3,
    Save,
    GraduationCap,
    Building2,
    BookOpen,
    Award,
    Briefcase,
    Target,
    CheckCircle2,
    Zap
} from "lucide-react";

function Profile() {

    const [loading, setLoading] = useState(true);

    const [isEditing, setIsEditing] = useState(false);

    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const [profile, setProfile] = useState({

        username: "",

        email: "",

        phone: "",

        full_name: "",

        college: "",

        branch: "",

        year_of_study: "",

        bio: "",

        location: "",

        github_url: "",

        linkedin_url: "",

        website_url: ""

    });

    useEffect(() => {

        fetchProfile();

    }, []);

    const fetchProfile = async () => {

        try{

            const res = await api.get("/profile");

            if (res.data && res.data.profile) {
                setProfile(res.data.profile);
            }

        }

        catch(err){

            console.log(err);

        }

        finally{

            setLoading(false);

        }

    };

    const handleSave = async () => {
        setSaving(true);
        setErrorMsg("");
        try {
            const res = await api.put("/profile", profile);
            if (res.data && res.data.profile) {
                setProfile((prev) => ({ ...prev, ...res.data.profile }));
            }
            setSaved(true);
            setIsEditing(false);
            setTimeout(() => {
                setSaved(false);
            }, 3000);
        } catch (err) {
            console.error("Failed to save profile:", err);
            setErrorMsg(err.response?.data?.message || "Failed to save profile. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e)=>{

        setProfile({

            ...profile,

            [e.target.name]:e.target.value

        });

    };

    if(loading){

        return(

            <div className="min-h-screen bg-slate-950 flex justify-center items-center text-white">

                Loading...

            </div>

        );

    }

    return(

        <div className="min-h-screen bg-slate-950 text-white">

            <Navbar/>

            <main className="max-w-6xl mx-auto px-6 py-12">

                <div className="flex justify-between items-center mb-10">

                    <div>

                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4">

                            <Zap size={14}/>

                            Developer Profile

                        </div>

                        <h1 className="text-5xl font-bold">

                            My Profile

                        </h1>

                    </div>

                    {

                        !isEditing ?

                        (

                            <button

                            onClick={()=>setIsEditing(true)}

                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl">

                                <Edit3 size={18}/>

                                Edit Profile

                            </button>

                        )

                        :

                        (

                            <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 px-6 py-3 rounded-xl">

                                <Save size={18}/>

                                {saving ? "Saving..." : "Save Profile"}

                            </button>

                        )

                    }

                </div>

                {

                    saved &&

                    <div className="mb-8 flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-green-400">

                        <CheckCircle2 size={18}/>

                        Profile Updated Successfully

                    </div>

                }

                {

                    errorMsg &&

                    <div className="mb-8 flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400">

                        {errorMsg}

                    </div>

                }

                {/* USER DETAILS */}

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8">

                    <div className="flex items-center gap-3 mb-8">

                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">

                            <User className="text-blue-500"/>

                        </div>

                        <div>

                            <h2 className="text-2xl font-semibold">

                                User Details

                            </h2>

                            <p className="text-slate-400">

                                Personal Information

                            </p>

                        </div>

                    </div>

                    <div className="grid md:grid-cols-3 gap-6">

                        <div>

                            <label className="text-sm mb-2 flex gap-2 items-center">

                                <User size={16}/>

                                Full Name

                            </label>

                            <input

                            name="full_name"

                            value={profile.full_name || ""}

                            onChange={handleChange}

                            disabled={!isEditing}

                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"

                            />

                        </div>

                        <div>

                            <label className="text-sm mb-2 flex gap-2 items-center">

                                <Mail size={16}/>

                                Email

                            </label>

                            <input

                            value={profile.email || ""}

                            disabled

                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"

                            />

                        </div>

                        <div>

                            <label className="text-sm mb-2 flex gap-2 items-center">

                                <Phone size={16}/>

                                Phone

                            </label>

                            <input

                            name="phone"

                            value={profile.phone || ""}

                            onChange={handleChange}

                            disabled={!isEditing}

                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"

                            />

                        </div>

                    </div>

                </div>
                                {/* EDUCATION DETAILS */}

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8">

                    <div className="flex items-center gap-3 mb-8">

                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">

                            <GraduationCap className="text-purple-400"/>

                        </div>

                        <div>

                            <h2 className="text-2xl font-semibold">

                                Education

                            </h2>

                            <p className="text-slate-400">

                                Academic Information

                            </p>

                        </div>

                    </div>

                    <div className="grid md:grid-cols-2 gap-6">

                        <div>

                            <label className="flex items-center gap-2 mb-2">

                                <Building2 size={16}/>

                                College

                            </label>

                            <input

                                name="college"

                                value={profile.college || ""}

                                onChange={handleChange}

                                disabled={!isEditing}

                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"

                            />

                        </div>

                        <div>

                            <label className="flex items-center gap-2 mb-2">

                                <BookOpen size={16}/>

                                Branch

                            </label>

                            <input

                                name="branch"

                                value={profile.branch || ""}

                                onChange={handleChange}

                                disabled={!isEditing}

                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"

                            />

                        </div>

                        <div>

                            <label className="flex items-center gap-2 mb-2">

                                <Award size={16}/>

                                Year Of Study

                            </label>

                            <input

                                name="year_of_study"

                                value={profile.year_of_study || ""}

                                onChange={handleChange}

                                disabled={!isEditing}

                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"

                            />

                        </div>

                        <div>

                            <label className="flex items-center gap-2 mb-2">

                                <Target size={16}/>

                                Location

                            </label>

                            <input

                                name="location"

                                value={profile.location || ""}

                                onChange={handleChange}

                                disabled={!isEditing}

                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"

                            />

                        </div>

                    </div>

                </div>

                {/* ABOUT */}

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8">

                    <div className="flex items-center gap-3 mb-8">

                        <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">

                            <Briefcase className="text-green-400"/>

                        </div>

                        <div>

                            <h2 className="text-2xl font-semibold">

                                About

                            </h2>

                            <p className="text-slate-400">

                                Tell others about yourself

                            </p>

                        </div>

                    </div>

                    <textarea

                        rows={5}

                        name="bio"

                        value={profile.bio || ""}

                        onChange={handleChange}

                        disabled={!isEditing}

                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"

                    />

                </div>

                {/* LINKS */}

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8">

                    <h2 className="text-2xl font-semibold mb-8">

                        Social Links

                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">

                        <input

                            placeholder="GitHub URL"

                            name="github_url"

                            value={profile.github_url || ""}

                            onChange={handleChange}

                            disabled={!isEditing}

                            className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"

                        />

                        <input

                            placeholder="LinkedIn URL"

                            name="linkedin_url"

                            value={profile.linkedin_url || ""}

                            onChange={handleChange}

                            disabled={!isEditing}

                            className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"

                        />

                        <input

                            placeholder="Website"

                            name="website_url"

                            value={profile.website_url || ""}

                            onChange={handleChange}

                            disabled={!isEditing}

                            className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"

                        />

                    </div>

                </div>

                {

                    isEditing &&

                    <div className="flex justify-end">

                        <button

                            onClick={handleSave}
                            disabled={saving}

                            className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"

                        >

                            <Save size={18}/>

                            {saving ? "Saving..." : "Save Profile"}

                        </button>

                    </div>

                }

            </main>

            <footer className="border-t border-slate-800 text-center py-8 text-slate-500">

                © {new Date().getFullYear()} UnifyCode

            </footer>

        </div>

    );

}

export default Profile;