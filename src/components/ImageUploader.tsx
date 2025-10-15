import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  images: File[];
  onChange: (images: File[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
}

export const ImageUploader = ({
  images,
  onChange,
  maxImages = 3,
  maxSizeMB = 5,
}: ImageUploaderProps) => {
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);
    const validFiles: File[] = [];
    let errorMsg = "";

    for (const file of newFiles) {
      if (!file.type.startsWith("image/")) {
        errorMsg = "이미지 파일만 업로드할 수 있어요.";
        continue;
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        errorMsg = `파일 크기는 ${maxSizeMB}MB를 초과할 수 없어요.`;
        continue;
      }

      if (images.length + validFiles.length >= maxImages) {
        errorMsg = `최대 ${maxImages}개까지 업로드할 수 있어요.`;
        break;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      onChange([...images, ...validFiles]);
      setError("");
    }

    if (errorMsg) {
      setError(errorMsg);
      setTimeout(() => setError(""), 3000);
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 rounded-lg p-3">
          {error}
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((file, idx) => (
            <div key={idx} className="relative aspect-square group">
              <img
                src={URL.createObjectURL(file)}
                alt={`Upload ${idx + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={() => removeImage(idx)}
                className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length < maxImages && (
        <div
          onClick={() => inputRef.current?.click()}
          className={cn(
            "border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer transition-colors",
            "hover:border-primary hover:bg-accent"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />

          <ImageIcon className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-1">
            이미지를 선택하거나 드래그하세요
          </p>
          <p className="text-xs text-muted-foreground">
            최대 {maxImages}개, 각 {maxSizeMB}MB 이하
          </p>
        </div>
      )}
    </div>
  );
};
