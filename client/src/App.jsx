import { useState } from "react";
import axios from "axios";

export default function App() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!url) return alert("Enter playlist URL");

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/playlist",
        { url }
      );
      setData(res.data);
    } catch {
      alert("Error fetching playlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">

      {/* Main Card */}
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl p-6 sm:p-8 rounded-3xl backdrop-blur-xl bg-white/20 border border-white/20 shadow-2xl">

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-white mb-6">
          🎬 Playlist Analyzer
        </h1>

        {/* Input */}
        <input
          type="text"
          placeholder="Paste YouTube Playlist URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-3 sm:p-4 rounded-xl bg-white/30 text-white placeholder-gray-200 outline-none border border-white/30 focus:ring-2 focus:ring-pink-400 text-sm sm:text-base"
        />

        {/* Button */}
        <button
          onClick={fetchData}
          className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold hover:scale-[1.02] transition"
        >
          {loading ? "Analyzing..." : "Analyze Playlist"}
        </button>

        {/* Loader */}
        {loading && (
          <div className="mt-4 text-center text-white animate-pulse text-sm">
            ⏳ Fetching playlist data...
          </div>
        )}

        {/* Result */}
        {data && (
          <div className="mt-6 text-white">

            {/* Thumbnail */}
            <img
              src={data.thumbnail}
              alt="thumbnail"
              className="w-full rounded-xl mb-4 shadow-lg"
            />

            {/* Title */}
            <h2 className="text-base sm:text-lg font-semibold mb-2">
              {data.title}
            </h2>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm mt-4">

              <div className="bg-white/20 p-3 rounded-xl">
                📹 Videos
                <p className="font-bold">{data.totalVideos}</p>
              </div>

              <div className="bg-white/20 p-3 rounded-xl">
                ⏱ Total
                <p className="font-bold">{data.totalDuration}</p>
              </div>

              <div className="bg-white/20 p-3 rounded-xl">
                📊 Avg
                <p className="font-bold">{data.averageVideoDuration}</p>
              </div>

              <div className="bg-white/20 p-3 rounded-xl">
                ⚡ 2x Speed
                <p className="font-bold">{data.playbackTime["2x"]}</p>
              </div>
            </div>

            {/* Speed Section */}
            <div className="mt-6">
              <h3 className="font-semibold mb-2 text-sm sm:text-base">
                ⚡ Playback Speeds
              </h3>

              <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                {Object.entries(data.playbackTime).map(([k, v]) => (
                  <div
                    key={k}
                    className="bg-white/20 p-2 rounded-lg text-center"
                  >
                    {k} → {v}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}