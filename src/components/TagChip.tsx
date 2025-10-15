import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface TagChipProps {
  label: string;
  selected?: boolean;
  removable?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  className?: string;
}

export const TagChip = ({
  label,
  selected = false,
  removable = false,
  onClick,
  onRemove,
  className,
}: TagChipProps) => {
  return (
    <Badge
      variant={selected ? "default" : "outline"}
      className={cn(
        "transition-all touch-target cursor-pointer gap-1",
        selected && "bg-primary text-primary-foreground",
        className
      )}
      onClick={onClick}
    >
      <span>#{label}</span>
      {removable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="hover:bg-primary-foreground/20 rounded-full p-0.5 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </Badge>
  );
};
