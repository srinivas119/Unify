import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import {
  Github,
  Trophy,
  Code2,
  BarChart3,
  ArrowRight,
  Sparkles,
  CheckCircle,
} from "lucide-react";

function Home() {
  const features = [
    {
      icon: <Github className="w-8 h-8 text-blue-400" />,
      title: "GitHub Integration",
      desc: "Track repositories, commits, followers and contribution graph automatically.",
    },
    {
      icon: <Code2 className="w-8 h-8 text-yellow-400" />,
      title: "LeetCode Tracker",
      desc: "Monitor solved problems, ratings, contests and daily streaks.",
    },
    {
      icon: <Trophy className="w-8 h-8 text-green-400" />,
      title: "Competitive Coding",
      desc: "Combine Codeforces, CodeChef and GFG stats into one profile.",
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-purple-400" />,
      title: "Unified Dashboard",
      desc: "One place to visualize your entire coding journey.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 mb-8">
            <Sparkles size={16} />
            Developer Portfolio Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight bg-gradient-to-r from-white via-slate-200 to-blue-400 bg-clip-text text-transparent">
            One Dashboard
            <br />
            For Every Developer
          </h1>

          <p className="mt-8 max-w-3xl mx-auto text-lg text-slate-400 leading-8">
            UnifyCode connects all your coding platforms into one professional
            portfolio. Track GitHub, LeetCode, Codeforces, CodeChef and
            GeeksforGeeks from a single dashboard.
          </p>

          <div className="flex flex-wrap justify-center gap-5 mt-12">

            <Link
              to="/dashboard"
              className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 transition flex items-center gap-2 font-semibold"
            >
              Go to Dashboard
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/platforms"
              className="px-8 py-4 rounded-xl border border-slate-700 hover:border-blue-500 hover:bg-slate-900 transition font-semibold"
            >
              Connect Platforms
            </Link>

          </div>

        </div>
      </section>

      {/* Feature Cards */}

      <section className="max-w-7xl mx-auto px-6 pb-20">

        <h2 className="text-4xl font-bold text-center mb-12">
          Everything in One Place
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-blue-500 transition duration-300 hover:-translate-y-2"
            >
              {feature.icon}

              <h3 className="text-xl font-bold mt-6 mb-3">
                {feature.title}
              </h3>

              <p className="text-slate-400">
                {feature.desc}
              </p>
            </div>
          ))}

        </div>

      </section>

      {/* Why Choose */}

      <section className="bg-slate-900/50 border-y border-slate-800">

        <div className="max-w-6xl mx-auto py-20 px-6">

          <h2 className="text-4xl font-bold text-center mb-12">
            Why Choose UnifyCode?
          </h2>

          <div className="grid md:grid-cols-2 gap-10">

            <div className="flex gap-4">

              <CheckCircle className="text-green-400 mt-1" />

              <div>

                <h3 className="font-semibold text-xl mb-2">
                  Automatic Profile Sync
                </h3>

                <p className="text-slate-400">
                  Sync coding statistics automatically from all supported
                  platforms.
                </p>

              </div>

            </div>

            <div className="flex gap-4">

              <CheckCircle className="text-green-400 mt-1" />

              <div>

                <h3 className="font-semibold text-xl mb-2">
                  Unified Developer Score
                </h3>

                <p className="text-slate-400">
                  Showcase your overall programming achievements in one place.
                </p>

              </div>

            </div>

            <div className="flex gap-4">

              <CheckCircle className="text-green-400 mt-1" />

              <div>

                <h3 className="font-semibold text-xl mb-2">
                  Modern Dashboard
                </h3>

                <p className="text-slate-400">
                  Visualize ratings, solved problems, repositories and coding
                  activity beautifully.
                </p>

              </div>

            </div>

            <div className="flex gap-4">

              <CheckCircle className="text-green-400 mt-1" />

              <div>

                <h3 className="font-semibold text-xl mb-2">
                  Resume Ready
                </h3>

                <p className="text-slate-400">
                  Build a professional developer portfolio with real coding
                  statistics.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Footer */}

      <footer className="py-10 text-center text-slate-500 border-t border-slate-800">
        © {new Date().getFullYear()} UnifyCode • Built for Developers ❤️
      </footer>

    </div>
  );
}

export default Home;
