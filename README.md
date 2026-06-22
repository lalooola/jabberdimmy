# jabberdimmy

A simple website with full-screen video backgrounds that play in **random
order** and loop forever, crossfading from one clip to the next.

## Run it

It's a static site — no build step. Open `index.html` directly, or serve the
folder with any static server, e.g.:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

> Some browsers block remote videos when opening the file directly (`file://`).
> Using a local server as above avoids that.

## Use your own videos

Edit `videos.js` and list your clips:

```js
window.JABBERDIMMY_VIDEOS = [
  "videos/sunset.mp4",
  "videos/city.mp4",
  "https://example.com/clip.webm",
];
```

Drop local files in a `videos/` folder next to the page. For smooth looping,
keep them short, muted, and web-optimized (H.264 `.mp4`).

The clips are shuffled into a random cycle; when the cycle finishes it
reshuffles, so the order keeps changing.

## How it works

- `index.html` — markup (two stacked `<video>` elements for crossfading).
- `styles.css` — full-bleed video, dark overlay, title, mute button.
- `videos.js` — the list of clips (the only thing you normally edit).
- `app.js` — shuffles the playlist, advances on `ended`, crossfades, and
  handles muting and load errors.

Audio starts **muted** (so autoplay works everywhere); use the speaker button
in the bottom-right to toggle sound.
