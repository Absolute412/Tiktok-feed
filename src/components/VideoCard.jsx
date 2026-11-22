import { useEffect, useRef, useState } from "react";
import { VideoActions } from "./VideoActions";
import { Pause, Play, Music } from "lucide-react";

const playVideo = (element) => {
    element.play().catch((error) => {
        if (error.name !== "AbortError") {
            console.error("Could not play video:", error);
        }
    });
};

export const VideoCard = ({ video }) => {
    const videoRef = useRef(null);
    const indicatorTimeoutRef = useRef(null);

    const [playbackEffect, setPlaybackEffect] = useState(null);
    const [showPlaybackEffect, setShowPlaybackEffect] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const progress = duration > 0
        ? Math.min((currentTime / duration) * 100, 100)
        : 0;

    const flashPlaybackEffect = (effect) => {
        setPlaybackEffect(effect);
        setShowPlaybackEffect(true);

        window.clearTimeout(indicatorTimeoutRef.current);
        indicatorTimeoutRef.current = window.setTimeout(() =>
            setShowPlaybackEffect(false), 600
        );
    };

    const togglePlayback = () => {
        const element = videoRef.current;
        if (!element) return;

        if (element.paused) {
            playVideo(element);
            flashPlaybackEffect("play");
        } else {
            element.pause();
            flashPlaybackEffect("pause");
        }
    };

    const handleSeek = (event) => {
        const element = videoRef.current;
        if (!element) return;

        const time = Number(event.currentTarget.value);
        element.currentTime = time;
        setCurrentTime(time);
    };

    useEffect(() => {
        const element = videoRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
                playVideo(element);
            } else {
                element.pause();
            }
        }, { threshold: [0, 0.6] });

        observer.observe(element);

        return () => {
            observer.disconnect();
            element.pause();
            window.clearTimeout(indicatorTimeoutRef.current);
        };
    }, [video.src]);

    return (
        <section className="group relative isolate h-dvh snap-start bg-background">
            <video
                ref={videoRef}
                src={video.src}
                className="absolute inset-0 h-full w-full object-cover cursor-pointer" 
                loop 
                playsInline
                preload="metadata"
                onClick={togglePlayback}
                onTimeUpdate={(event) =>
                    setCurrentTime(event.currentTarget.currentTime)
                }
                onLoadedMetadata={(event) => {
                    const videoDuration = event.currentTarget.duration;
                    setDuration(Number.isFinite(videoDuration) ? videoDuration : 0);
                }}
            />

            <div className="absolute bottom-[calc(0.25rem+env(safe-area-inset-bottom,0px))] left-3 right-20 z-30 opacity-100 transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                <div className="group/seek relative flex h-6 items-center focus-within:rounded focus-within:outline-2 focus-within:outline-white">
                    <div
                        aria-hidden="true"
                        className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/40"
                    >
                        <div
                            className="h-full rounded-full bg-white"
                            style={{ width: `${progress}%` }}
                        />
                        <span
                            className="absolute top-1/2 size-2 -translate-y-1/2 rounded-full bg-white"
                            style={{ left: `${progress}%` }}
                        />
                    </div>
                    <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        step="0.1"
                        value={Math.min(currentTime, duration || 0)}
                        onChange={handleSeek}
                        disabled={!duration}
                        aria-label={`Seek ${video.creator} video`}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-default"
                    />
                </div>
            </div>

            <div
                aria-hidden="true"
                className={`
                pointer-events-none absolute inset-0 z-20 grid place-items-center transition-opacity duration-200 
                ${showPlaybackEffect ? "opacity-100" : "opacity-0"}`}
            >
                {playbackEffect && (
                    <span className="grid size-16 place-items-center rounded-full bg-black/50 text-white">
                        {playbackEffect === "pause" ? (
                            <Pause className="size-8 fill-current" />
                        ) : (
                            <Play className="size-8 fill-current" />
                        )}
                    </span>
                )}
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-1 h-48 bg-linear-to-t from-black/70 to-transparent" />

            <div className="absolute bottom-[calc(2rem+env(safe-area-inset-bottom,0px))] left-0 right-20 z-10 px-4 text-primary">
                <strong className="font-semibold">{video.creator}</strong>
                <p className="mt-1 line-clamp-2 text-sm text-description">{video.caption}</p>

                <div className="mt-3 flex max-w-full items-center gap-2 text-sm">
                    <Music className="size-4 shrink-0" aria-hidden="true" />
                    <p className="min-w-0 truncate">
                        {video.music || "Original sound"}
                        {video.artist && <span className="text-description"> · {video.artist}</span>}
                    </p>
                </div>
            </div>

            <div className="absolute bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] right-3 z-10">
                <VideoActions video={video} />
            </div>
        </section>
    );
};