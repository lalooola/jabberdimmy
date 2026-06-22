(function () {
  "use strict";

  var sources = (window.JABBERDIMMY_VIDEOS || []).slice();
  if (sources.length === 0) {
    console.warn("jabberdimmy: no videos configured in videos.js");
    return;
  }

  var videos = Array.prototype.slice.call(
    document.querySelectorAll(".bg__video")
  );
  var muteToggle = document.querySelector(".mute-toggle");
  var muteIcon = document.querySelector(".mute-toggle__icon");

  var active = 0; // index into `videos` of the currently visible element
  var queue = []; // remaining clips in the current shuffled cycle
  var muted = true;

  // Fisher–Yates shuffle, returning a new array.
  function shuffle(list) {
    var out = list.slice();
    for (var i = out.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = out[i];
      out[i] = out[j];
      out[j] = tmp;
    }
    return out;
  }

  // Pull the next clip, reshuffling once the cycle is exhausted. Avoids
  // immediately repeating the clip that just played when reshuffling.
  function nextSource(justPlayed) {
    if (queue.length === 0) {
      queue = shuffle(sources);
      if (sources.length > 1 && queue[0] === justPlayed) {
        queue.push(queue.shift());
      }
    }
    return queue.shift();
  }

  function crossfadeTo(nextEl, currentEl) {
    nextEl.classList.add("is-active");
    currentEl.classList.remove("is-active");
  }

  // Load `src` into the hidden element, then crossfade once it can play.
  function playNext(justPlayed) {
    var currentEl = videos[active];
    var nextEl = videos[(active + 1) % videos.length];
    var src = nextSource(justPlayed);

    nextEl.muted = muted;
    nextEl.src = src;
    nextEl.load();

    var swapped = false;
    function swap() {
      if (swapped) return;
      swapped = true;
      nextEl.removeEventListener("canplay", swap);
      nextEl.play().catch(function () {});
      crossfadeTo(nextEl, currentEl);
      active = (active + 1) % videos.length;
    }

    nextEl.addEventListener("canplay", swap);
    nextEl.play().then(swap).catch(function () {});

    // When this clip ends, move on to another random one.
    nextEl.onended = function () {
      playNext(src);
    };

    // If a clip fails to load, skip to the next one.
    nextEl.onerror = function () {
      console.warn("jabberdimmy: failed to load", src);
      playNext(src);
    };
  }

  // --- Mute toggle ---
  function applyMuted() {
    videos.forEach(function (v) {
      v.muted = muted;
    });
    muteIcon.textContent = muted ? "🔇" : "🔊";
    muteToggle.setAttribute(
      "aria-label",
      muted ? "Unmute video" : "Mute video"
    );
  }

  muteToggle.addEventListener("click", function () {
    muted = !muted;
    applyMuted();
    // Browsers may block unmuted playback until a gesture; this click is one.
    videos[active].play().catch(function () {});
  });

  applyMuted();
  playNext(null);
})();
