import { Heart, MessageCircle, Bookmark, Share2, Plus } from "lucide-react";

const formatCount = (count) =>
  new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(count ?? 0);

export const VideoActions = ({ video }) => {
    const actions = [
        { id: 1, icon: Heart, count: video.likes },
        { id: 2, icon: MessageCircle, count: video.comments },
        { id: 3, icon: Bookmark, count: video.saves },
        { id: 4, icon: Share2, count: video.shares },
    ];

    return (
        <div className="flex flex-col items-center gap-5 text-xs font-semibold text-primary">
            {video.avatar && (
                <div className="relative">
                    <img 
                        src={video.avatar}
                        alt={`${video.creator}'s profile`}
                        className="size-12 rounded-full border-2 border-white object-cover"
                    />

                    <span
                        aria-hidden="true"
                        className="absolute -bottom-1 left-1/2 grid size-5 -translate-x-1/2 place-items-center rounded-full bg-[#fe2c55] text-white"
                    >
                        <Plus className="size-4 stroke-3" />
                    </span>
                </div>
            )}

            {actions.map(({ id, icon: Icon, count }) => (
                <button
                    key={id}
                    className="flex flex-col items-center gap-1 text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                    <Icon className="size-7" />
                    <span className="text-xs">{formatCount(count)}</span>
                </button>
            ))}
        </div>
    );
}