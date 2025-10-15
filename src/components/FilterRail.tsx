import { TagChip } from "@/components/TagChip";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FilterRailProps {
  availableTags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  period: "today" | "week";
  onPeriodChange: (period: "today" | "week") => void;
  likeRange: [number, number];
  onLikeRangeChange: (range: [number, number]) => void;
  replyStatus: "all" | "no-reply" | "many-replies";
  onReplyStatusChange: (status: "all" | "no-reply" | "many-replies") => void;
  onReset: () => void;
}

export const FilterRail = ({
  availableTags,
  selectedTags,
  onTagsChange,
  period,
  onPeriodChange,
  likeRange,
  onLikeRangeChange,
  replyStatus,
  onReplyStatusChange,
  onReset,
}: FilterRailProps) => {
  const hasActiveFilters = selectedTags.length > 0 || period !== "week" || replyStatus !== "all";

  return (
    <div className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-24 space-y-6 glass-card p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">필터</h3>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onReset}>
              <X className="w-4 h-4 mr-1" />
              초기화
            </Button>
          )}
        </div>

        {/* Tags */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">태그</Label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <TagChip
                key={tag}
                label={tag}
                selected={selectedTags.includes(tag)}
                onClick={() => {
                  if (selectedTags.includes(tag)) {
                    onTagsChange(selectedTags.filter((t) => t !== tag));
                  } else {
                    onTagsChange([...selectedTags, tag]);
                  }
                }}
              />
            ))}
          </div>
        </div>

        {/* Period */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">기간</Label>
          <RadioGroup value={period} onValueChange={(v) => onPeriodChange(v as "today" | "week")}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="today" id="today" />
              <Label htmlFor="today" className="font-normal cursor-pointer">오늘</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="week" id="week" />
              <Label htmlFor="week" className="font-normal cursor-pointer">이번주</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Like Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">공감수 ({likeRange[0]}~{likeRange[1]})</Label>
          <Slider
            value={likeRange}
            onValueChange={(v) => onLikeRangeChange(v as [number, number])}
            min={0}
            max={100}
            step={5}
            className="mt-2"
          />
        </div>

        {/* Reply Status */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">답변 상태</Label>
          <RadioGroup value={replyStatus} onValueChange={(v) => onReplyStatusChange(v as any)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all" className="font-normal cursor-pointer">전체</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no-reply" id="no-reply" />
              <Label htmlFor="no-reply" className="font-normal cursor-pointer">미응답</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="many-replies" id="many-replies" />
              <Label htmlFor="many-replies" className="font-normal cursor-pointer">응답많음</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};
