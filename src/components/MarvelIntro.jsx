import { useRef, useEffect } from "react";

/**
 * Fullscreen cinematic video overlay.
 * Plays automatically with no controls; navigates to dashboard.html on end.
 */
export default function MarvelIntro({ onComplete, onSkip }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force play (browsers may block autoplay without interaction)
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay blocked — try muted then unmute
        video.muted = true;
        video.play().then(() => {
          // Unmute after a short delay to ensure playback started
          setTimeout(() => { video.muted = false; }, 100);
        });
      });
    }
  }, []);

  const handleEnded = () => {
    if (onComplete) onComplete();
    else window.location.href = "/dashboard.html";
  };

  // On mobile, tapping the screen can dismiss / start
  const handleTapToStart = (e) => {
    const video = videoRef.current;
    if (video && video.paused) {
      video.play();
    }
  };

  return (
    <div className="marvel-intro" onClick={handleTapToStart}>
      <video
        ref={videoRef}
        className="marvel-intro__video"
        autoPlay
        playsInline
        onEnded={handleEnded}
      >
        <source
          src="/Screen Recording 2026-09-20 125031.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Skip link for accessibility */}
      <button
        className="marvel-intro__skip"
        onClick={(e) => {
          e.stopPropagation();
          if (onSkip) onSkip();
          else window.location.href = "/dashboard.html";
        }}
      >
        Skip →
      </button>
    </div>
  );
}
