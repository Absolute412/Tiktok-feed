import { useRef } from "react";
import { videos } from "../data/video";
import { VideoCard } from "./VideoCard";

const loopVideos = [...videos, ...videos];

export const VideoFeed = () => {
    const feedRef = useRef(null);

    const handleScroll = () => {
        const feed = feedRef.current;
        if (!feed) return;

        const firstCopyHeight = feed.scrollHeight / 2;

        if (feed.scrollTop >= firstCopyHeight) {
            feed.scrollTop -= firstCopyHeight;
        }
    };

    return (
        <div className="relative mx-auto h-dvh w-full max-w-112.5 overflow-hidden bg-background">
            <header className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-linear-to-b from-black/50 to-transparent pt-[calc(0.75rem+env(safe-area-inset-top,0px))] pb-5">
                <div className="flex items-center justify-center gap-2 text-sm drop-shadow sm:text-base">
                    <span className="text-white/70">Following</span>
                    <span className="text-white/45">|</span>
                    <span className="font-bold text-white">For You</span>
                </div>
            </header>

            <main
                ref={feedRef}
                onScroll={handleScroll}
                className="custom-scrollbar mx-auto h-dvh w-full max-w-112.5 snap-y snap-mandatory overflow-y-auto overscroll-y-contain bg-background"
            >
                {loopVideos.map((video, index) => (
                    <VideoCard key={`${video.id}-${index}`} video={video} />
                ))}
            </main>
        </div>
    );
};