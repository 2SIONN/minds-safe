import { Heart, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";

interface WorryCardProps {
  id?: string;
  content: string;
  tags?: string[];
  likeCount: number;
  replyCount: number;
  createdAt: string;
  isLiked?: boolean;
  onLike?: () => void;
  onClick?: () => void;
  className?: string;
}

export const WorryCard = ({
  id,
  content,
  tags = [],
  likeCount,
  replyCount,
  createdAt,
  isLiked = false,
  onLike,
  onClick,
  className,
}: WorryCardProps) => {
  // Random corner sticker based on card ID
  const cornerSticker = useMemo(() => {
    const stickers = ["✨", "💌", "💬", "🌙"];
    const index = id ? parseInt(id, 10) % stickers.length : 0;
    return stickers[index];
  }, [id]);

  return (
    <div
      className={cn("worry-card cursor-pointer relative group", className)}
      onClick={onClick}
    >
      <p className="text-card-foreground line-clamp-3 mb-4 leading-relaxed">
        {content}
      </p>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.slice(0, 3).map((tag, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs rounded-full px-3 py-1">
              #{tag}
            </Badge>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-muted-foreground pt-3 border-t border-border/50">
        <div className="flex items-center gap-6">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike?.();
            }}
            className={cn(
              "flex items-center gap-1 touch-target transition-colors",
              isLiked ? "text-primary" : "hover:text-primary"
            )}
          >
            <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
            <span>{likeCount}</span>
          </button>

          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>{replyCount}</span>
          </div>
        </div>

        <time className="text-xs">{createdAt}</time>
      </div>
    </div>
  );
};

export const WorryCardSkeleton = () => {
  return (
    <div className="worry-card">
      <div className="skeleton h-16 w-full mb-3" />
      <div className="flex gap-2 mb-3">
        <div className="skeleton h-6 w-16" />
        <div className="skeleton h-6 w-20" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div className="skeleton h-4 w-12" />
          <div className="skeleton h-4 w-12" />
        </div>
        <div className="skeleton h-4 w-16" />
      </div>
    </div>
  );
};
