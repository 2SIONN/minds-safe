import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { TagChip } from "./TagChip";
import { Slider } from "@/components/ui/slider";

interface FilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableTags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  period: "today" | "week";
  onPeriodChange: (period: "today" | "week") => void;
  likeRange: [number, number];
  onLikeRangeChange: (range: [number, number]) => void;
  replyStatus: "all" | "no-reply" | "many-replies";
  onReplyStatusChange: (status: "all" | "no-reply" | "many-replies") => void;
  onApply: () => void;
  onReset: () => void;
}

export const FilterSheet = ({
  open,
  onOpenChange,
  availableTags,
  selectedTags,
  onTagsChange,
  period,
  onPeriodChange,
  likeRange,
  onLikeRangeChange,
  replyStatus,
  onReplyStatusChange,
  onApply,
  onReset,
}: FilterSheetProps) => {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>필터</SheetTitle>
          <SheetDescription>
            원하는 조건으로 고민을 찾아보세요
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Tags */}
          <div>
            <h3 className="font-medium mb-3">태그</h3>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <TagChip
                  key={tag}
                  label={tag}
                  selected={selectedTags.includes(tag)}
                  onClick={() => toggleTag(tag)}
                />
              ))}
            </div>
          </div>

          {/* Period */}
          <div>
            <h3 className="font-medium mb-3">기간</h3>
            <div className="flex gap-2">
              <Button
                variant={period === "today" ? "default" : "outline"}
                onClick={() => onPeriodChange("today")}
                className="flex-1"
              >
                오늘
              </Button>
              <Button
                variant={period === "week" ? "default" : "outline"}
                onClick={() => onPeriodChange("week")}
                className="flex-1"
              >
                이번주
              </Button>
            </div>
          </div>

          {/* Like Range */}
          <div>
            <h3 className="font-medium mb-3">
              공감 수: {likeRange[0]} - {likeRange[1]}+
            </h3>
            <Slider
              value={likeRange}
              onValueChange={(val) => onLikeRangeChange(val as [number, number])}
              min={0}
              max={100}
              step={10}
            />
          </div>

          {/* Reply Status */}
          <div>
            <h3 className="font-medium mb-3">응답 상태</h3>
            <div className="flex gap-2">
              <Button
                variant={replyStatus === "all" ? "default" : "outline"}
                onClick={() => onReplyStatusChange("all")}
                className="flex-1"
              >
                전체
              </Button>
              <Button
                variant={replyStatus === "no-reply" ? "default" : "outline"}
                onClick={() => onReplyStatusChange("no-reply")}
                className="flex-1"
              >
                미응답
              </Button>
              <Button
                variant={replyStatus === "many-replies" ? "default" : "outline"}
                onClick={() => onReplyStatusChange("many-replies")}
                className="flex-1"
              >
                응답많음
              </Button>
            </div>
          </div>
        </div>

        <SheetFooter className="gap-2">
          <Button variant="outline" onClick={onReset} className="flex-1">
            초기화
          </Button>
          <Button onClick={onApply} className="flex-1">
            적용하기
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
