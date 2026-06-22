/**
 * List the video clips jabberdimmy can play here.
 *
 * Each entry is a URL to an .mp4 (or .webm) file. They are played in a
 * random order, each clip loops nothing — when one ends, the next random
 * clip crossfades in. Once every clip has played, the order is reshuffled.
 *
 * To use your own clips, drop them in a `videos/` folder next to this file
 * and reference them like "videos/my-clip.mp4". Keep them short, muted and
 * web-optimized (H.264 .mp4) for smooth looping.
 *
 * The defaults below are Google's public sample clips so the site works out
 * of the box.
 */
window.JABBERDIMMY_VIDEOS = [
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
];
