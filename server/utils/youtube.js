import axios from "axios";

const BASE_URL = "https://www.googleapis.com/youtube/v3";

// ✅ 1. getPlaylistDetails
export async function getPlaylistDetails(playlistId) {
  try {
    const res = await axios.get(`${BASE_URL}/playlists`, {
      params: {
        part: "snippet",
        id: playlistId,
        key: process.env.YOUTUBE_API_KEY,
      },
    });

    const item = res.data.items[0];
    if (!item) return null;

    return {
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high.url,
    };
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

// ✅ 2. getAllVideoIds
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

      const ids = res.data.items.map(
        item => item.contentDetails.videoId
      );

      videoIds.push(...ids);
      nextPageToken = res.data.nextPageToken;

    } while (nextPageToken);

    return videoIds;

  } catch (error) {
    console.error(error.message);
    return [];
  }
}

// ✅ 3. getVideoDurations
export async function getVideoDurations(videoIds) {
  let durations = [];

  try {
    for (let i = 0; i < videoIds.length; i += 50) {
      const chunk = videoIds.slice(i, i + 50);

      const res = await axios.get(`${BASE_URL}/videos`, {
        params: {
          part: "contentDetails",
          id: chunk.join(","),
          key: process.env.YOUTUBE_API_KEY,
        },
      });

      const videoDurations = res.data.items.map(
        item => item.contentDetails.duration
      );

      durations.push(...videoDurations);
    }

    return durations;

  } catch (error) {
    console.error(error.message);
    return [];
  }
}


export function convertISOToSeconds(duration) {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;

  return hours * 3600 + minutes * 60 + seconds;
}