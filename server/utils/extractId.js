export function extractPlaylistId(url) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.searchParams.get("list");
  } catch (error) {
    return null;
  }
}