import { Heart, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ReplyItemProps {
  id: string;
  content: string;
  authorNickname?: string;
  isAuthorOfPost?: boolean;
  isBest?: boolean;
  likeCount: number;
  isLiked?: boolean;
  createdAt: string;
  onLike?: () => void;
}

export const ReplyItem = ({
  content,
  authorNickname = "익명",
  isAuthorOfPost = false,
  isBest = false,
  likeCount,
  isLiked = false,
  createdAt,
  onLike,
}: ReplyItemProps) => {
  return (
    <div
      className={cn(
        "bg-card rounded-2xl p-4 transition-all",
        isBest && "ring-2 ring-primary/20 shadow-medium"
      )}
    >
      {isBest && (
        <div className="flex items-center gap-1 mb-2 badge-best">
          <Award className="w-3 h-3" />
          <span>베스트 응원</span>
        </div>
      )}

      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="font-medium text-card-foreground">
            {authorNickname}
          </span>
          {isAuthorOfPost && (
            <Tooltip>
              <TooltipTrigger>
                <span className="badge-author">글쓴이</span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">주작 방지: 작성자가 남긴 응원이에요.</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <time className="text-xs text-muted-foreground whitespace-nowrap">
          {createdAt}
        </time>
      </div>

      <p className="text-card-foreground mb-3 leading-relaxed">{content}</p>

      <button
        onClick={onLike}
        className={cn(
          "flex items-center gap-1 touch-target text-sm transition-colors",
          isLiked ? "text-primary" : "text-muted-foreground hover:text-primary"
        )}
      >
        <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
        <span>{likeCount}</span>
      </button>
    </div>
  );
};

export const ReplyItemSkeleton = () => {
  return (
    <div className="bg-card rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="skeleton h-5 w-20" />
        <div className="skeleton h-4 w-16" />
      </div>
      <div className="skeleton h-16 w-full mb-3" />
      <div className="skeleton h-4 w-12" />
    </div>
  );
};
