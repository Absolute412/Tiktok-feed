import { useEffect, useRef } from "react";
import { VideoActions } from "./VideoActions";
import { Music } from "lucide-react";

export const VideoCard = ({ video }) => {
    const videoRef = useRef(null);

    const togglePlayback = () => {
        const element = videoRef.current;
        if (!element) return;

        if (element.paused) {
            element.play().catch((error) => {
                console.error("Could not play video:", error);
            }); 
        } else {
            element.pause();
        }
    };

    useEffect(() => {
        const element = videoRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
                element.play().catch((error) => {
                    console.error("Could not play video:", error);
                });
            } else {
                element.pause();
            }
        }, { threshold: [0, 0.6] });

        observer.observe(element);

        return () => {
            observer.disconnect();
            element.pause();
        };
    }, [video.src]);

    return (
        <section className="relative isolate h-dvh snap-start bg-background">
            <video
                ref={videoRef}
                src={video.src}
                className="absolute inset-0 h-full w-full object-cover cursor-pointer" 
                loop 
                playsInline
                preload="metadata"
                onClick={togglePlayback}
            />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-1 h-48 bg-linear-to-t from-black/70 to-transparent" />

            <div className="absolute bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] left-0 right-20 z-10 px-4 text-primary">
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