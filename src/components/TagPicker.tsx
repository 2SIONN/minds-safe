import { useState } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TagChip } from "./TagChip";

interface TagPickerProps {
  availableTags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  maxTags?: number;
}

export const TagPicker = ({
  availableTags,
  selectedTags,
  onTagsChange,
  maxTags = 5,
}: TagPickerProps) => {
  const [newTag, setNewTag] = useState("");

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else if (selectedTags.length < maxTags) {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const addNewTag = () => {
    const trimmed = newTag.trim();
    if (
      trimmed &&
      !selectedTags.includes(trimmed) &&
      selectedTags.length < maxTags
    ) {
      onTagsChange([...selectedTags, trimmed]);
      setNewTag("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="새 태그 추가..."
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addNewTag();
            }
          }}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={addNewTag}
          disabled={!newTag.trim() || selectedTags.length >= maxTags}
          size="icon"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {selectedTags.length > 0 && (
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            선택된 태그 ({selectedTags.length}/{maxTags})
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <TagChip
                key={tag}
                label={tag}
                selected
                removable
                onRemove={() => toggleTag(tag)}
              />
            ))}
          </div>
        </div>
      )}

      {availableTags.length > 0 && (
        <div>
          <p className="text-sm text-muted-foreground mb-2">추천 태그</p>
          <div className="flex flex-wrap gap-2">
            {availableTags
              .filter((tag) => !selectedTags.includes(tag))
              .map((tag) => (
                <TagChip
                  key={tag}
                  label={tag}
                  onClick={() => toggleTag(tag)}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
