import { useState } from "react";
import axios from "axios";
import StatsCard from "./components/StatsCard";
import SpeedControl from "./components/SpeedControl";
import WatchPlanner from "./components/WatchPlanner";

export default function App() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [speed, setSpeed] = useState(1.5);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchData = async () => {
    if (!url.trim()) {
      setError("Please enter a playlist URL");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const res = await axios.post(`${API_URL}/api/playlist`, { url });

      if (!res.data.success) {
        setError(res.data.message || "Invalid playlist");
        return;
      }

      setData(res.data);

    } catch {
      setError("Failed to fetch playlist. Check URL or try again.");
    } finally {
      setLoading(false);
    }
  };

  const totalSeconds = Number(data?.totalSeconds) || 0;

  const dynamicHours = totalSeconds
    ? (totalSeconds / 3600 / speed).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-[#05010a] text-white flex flex-col justify-between">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/10 to-indigo-900/20 blur-3xl opacity-40"></div>

      {/* MAIN */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 pt-20 sm:pt-28">

        {/* HERO */}
        {!data && (
          <div className="text-center mb-10 animate-fadeIn">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Play<span className="text-purple-400">Lyt</span>
            </h1>
            <p className="text-gray-400 mt-3 text-sm sm:text-base">
              YouTube Playlist Analyzer
            </p>
          </div>
        )}

        {/* INPUT CARD */}
        <div className="w-full max-w-xl bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl shadow-lg transition hover:shadow-purple-500/20">

          <input
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError("");
            }}
            placeholder="Paste YouTube playlist URL..."
            className={`w-full p-3 bg-transparent outline-none text-white placeholder-gray-400 border rounded-lg transition
              ${error ? "border-red-500" : "border-white/10"}
            `}
          />

          {/* ERROR MESSAGE */}
          {error && (
            <p className="text-red-400 text-sm mt-2 animate-fadeIn">
              ⚠️ {error}
            </p>
          )}

          <button
            onClick={fetchData}
            disabled={loading}
            className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-[1.02] active:scale-[0.98] transition font-semibold"
          >
            {loading ? "Analyzing..." : "Analyze Playlist"}
          </button>
        </div>

        {/* RESULT */}
        {data && (
          <div className="mt-12 w-full max-w-3xl animate-fadeUp">

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">

             {/* THUMBNAIL */}
<div className="relative mb-6 flex justify-center">

  <div className="relative w-full max-w-2xl">

    {/* Glow */}
    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 blur-xl opacity-25 rounded-xl"></div>

    {/* Image */}
    <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 shadow-md">
      <img
        src={data.thumbnail}
        alt="thumbnail"
        className="w-full h-full object-cover transition duration-500 hover:scale-105"
      />
    </div>

  </div>
</div>
              {/* TITLE */}
              <h2 className="text-xl font-semibold leading-snug">
                {data.title}
              </h2>

              <p className="text-gray-400 text-sm mb-5">
                YouTube Playlist
              </p>

              {/* SPEED */}
              <SpeedControl speed={speed} setSpeed={setSpeed} />

              {/* STATS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">

                <StatsCard icon="📹" label="Videos" value={data.totalVideos} />
                <StatsCard icon="⏱" label="Total Time" value={data.totalDuration} />
                <StatsCard icon="📊" label="Average" value={data.averageVideoDuration} />
                <StatsCard icon="⚡" label={`At ${speed}x`} value={`${dynamicHours}h`} />

              </div>

              {/* PLANNER */}
              <WatchPlanner totalSeconds={totalSeconds} />

            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="text-center text-gray-500 text-sm py-6 border-t border-white/10">
        © {new Date().getFullYear()} PlayLyt • Made with ❤️ by Prakash Salapu
      </footer>
    </div>
  );
}