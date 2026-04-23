import axios from "axios";

const BASE_URL = "https://www.googleapis.com/youtube/v3";

// ✅ 1. Get playlist details (title + thumbnail)
export async function getPlaylistDetails(playlistId) {
  try {
    const res = await axios.get(`${BASE_URL}/playlists`, {
      params: {
        part: "snippet",
        id: playlistId,
        key: process.env.YOUTUBE_API_KEY,
      },
    });

    const item = res.data.items?.[0];
    if (!item) return null;

    return {
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails?.high?.url,
    };
  } catch (error) {
    console.error("Playlist Details Error:", error.response?.data || error.message);
    return null;
  }
}

// ✅ 2. Get all video IDs from playlist
export async function getAllVideoIds(playlistId) {
  let videoIds = [];
  let nextPageToken = null;

  try {
    do {
      const res = await axios.get(`${BASE_URL}/playlistItems`, {
        params: {
          part: "contentDetails",
          playlistId,
          maxResults: 50,
          pageToken: nextPageToken,
          key: process.env.YOUTUBE_API_KEY,
        },
      });

      const items = res.data.items || [];

      const ids = items.map(
        (item) => item.contentDetails.videoId
      );

      videoIds.push(...ids);
      nextPageToken = res.data.nextPageToken;

    } while (nextPageToken);

    return videoIds;

  } catch (error) {
    console.error("Video IDs Error:", error.response?.data || error.message);
    return [];
  }
}

// ✅ 3. Get durations for all videos
export async function getVideoDurations(videoIds) {
  let durations = [];

  try {
    for (let i = 0; i < videoIds.length; i += 50) {
      const chunk = videoIds.slice(i, i + 50);

      const res = await axios.get(`${BASE_URL}/videos`, {
        params: {
          part: "contentDetails",
          id: chunk.join(","), // 🔥 IMPORTANT
          key: process.env.YOUTUBE_API_KEY,
        },
      });

      const items = res.data.items || [];

      const videoDurations = items.map(
        (item) => item.contentDetails?.duration
      );

      durations.push(...videoDurations);
    }

    return durations;

  } catch (error) {
    console.error("Durations Error:", error.response?.data || error.message);
    return [];
  }
}

// ✅ 4. Convert ISO duration → seconds (FIXED VERSION)
export function convertISOToSeconds(duration) {
  if (!duration) return 0;

  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

  return (
    (parseInt(match?.[1]) || 0) * 3600 +
    (parseInt(match?.[2]) || 0) * 60 +
    (parseInt(match?.[3]) || 0)
  );
}