import { useState, useEffect } from "react";
import styles from "./UserProfile.module.css";

import { FaSave } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";

import {
  SiLeetcode,
  SiCodechef,
  SiCodeforces,
  SiGeeksforgeeks,
  SiGithub,
} from "react-icons/si";

function UserProfile() {
  const [leetcode, setLeetcode] = useState("");
  const [codechef, setCodechef] = useState("");
  const [codeforces, setCodeforces] = useState("");
  const [gfg, setGfg] = useState("");
  const [github, setGithub] = useState("");

  // Load saved usernames
  useEffect(() => {
    const loadPlatforms = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/platforms",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (result.success && result.data) {
          setGithub(result.data.github_username || "");
          setLeetcode(result.data.leetcode_username || "");
          setCodeforces(result.data.codeforces_username || "");
          setCodechef(result.data.codechef_username || "");
          setGfg(result.data.geeksforgeeks_username || "");
        }
      } catch (err) {
        console.log(err);
      }
    };

    loadPlatforms();
  }, []);

  // Save usernames
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/platforms/connect",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            github,
            leetcode,
            codeforces,
            codechef,
            gfg,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Platforms Connected Successfully");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  const handleCancel = () => {
    setLeetcode("");
    setCodechef("");
    setCodeforces("");
    setGfg("");
    setGithub("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>Connect Coding Platforms</h1>
          <p>Enter your usernames to build your profile.</p>
        </div>

        {/* LeetCode */}
        <div className={styles.platformCard}>
          <div className={styles.left}>
            <div className={styles.iconBox}>
              <SiLeetcode className={styles.leetcode} />
            </div>

            <div>
              <h3>LeetCode</h3>
              <span>Programming Challenges</span>
            </div>
          </div>

          <div className={styles.inputWrapper}>
            <input
              type="text"
              placeholder="Enter your LeetCode username"
              value={leetcode}
              onChange={(e) => setLeetcode(e.target.value)}
            />

            {leetcode && (
              <IoCloseCircle
                className={styles.clearIcon}
                onClick={() => setLeetcode("")}
              />
            )}
          </div>
        </div>

        {/* CodeChef */}
        <div className={styles.platformCard}>
          <div className={styles.left}>
            <div className={styles.iconBox}>
              <SiCodechef className={styles.codechef} />
            </div>

            <div>
              <h3>CodeChef</h3>
              <span>Competitive Programming</span>
            </div>
          </div>

          <div className={styles.inputWrapper}>
            <input
              type="text"
              placeholder="Enter your CodeChef username"
              value={codechef}
              onChange={(e) => setCodechef(e.target.value)}
            />

            {codechef && (
              <IoCloseCircle
                className={styles.clearIcon}
                onClick={() => setCodechef("")}
              />
            )}
          </div>
        </div>

        {/* Codeforces */}
        <div className={styles.platformCard}>
          <div className={styles.left}>
            <div className={styles.iconBox}>
              <SiCodeforces className={styles.codeforces} />
            </div>

            <div>
              <h3>Codeforces</h3>
              <span>Competitive Programming</span>
            </div>
          </div>

          <div className={styles.inputWrapper}>
            <input
              type="text"
              placeholder="Enter your Codeforces username"
              value={codeforces}
              onChange={(e) => setCodeforces(e.target.value)}
            />

            {codeforces && (
              <IoCloseCircle
                className={styles.clearIcon}
                onClick={() => setCodeforces("")}
              />
            )}
          </div>
        </div>

        {/* GeeksforGeeks */}
        <div className={styles.platformCard}>
          <div className={styles.left}>
            <div className={styles.iconBox}>
              <SiGeeksforgeeks className={styles.gfg} />
            </div>

            <div>
              <h3>GeeksforGeeks</h3>
              <span>DSA & Interview Prep</span>
            </div>
          </div>

          <div className={styles.inputWrapper}>
            <input
              type="text"
              placeholder="Enter your GeeksforGeeks username"
              value={gfg}
              onChange={(e) => setGfg(e.target.value)}
            />

            {gfg && (
              <IoCloseCircle
                className={styles.clearIcon}
                onClick={() => setGfg("")}
              />
            )}
          </div>
        </div>

        {/* GitHub */}
        <div className={styles.platformCard}>
          <div className={styles.left}>
            <div className={styles.iconBox}>
              <SiGithub className={styles.github} />
            </div>

            <div>
              <h3>GitHub</h3>
              <span>Projects & Repositories</span>
            </div>
          </div>

          <div className={styles.inputWrapper}>
            <input
              type="text"
              placeholder="Enter your GitHub username"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
            />

            {github && (
              <IoCloseCircle
                className={styles.clearIcon}
                onClick={() => setGithub("")}
              />
            )}
          </div>
        </div>

        <div className={styles.buttons}>
          <button
            className={styles.cancelBtn}
            onClick={handleCancel}
          >
            Cancel
          </button>

          <button
            className={styles.saveBtn}
            onClick={handleSave}
          >
            <FaSave />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;