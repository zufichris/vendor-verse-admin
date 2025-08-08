import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ImageIcon, X } from "lucide-react";
interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onAltChange?: (alt: string) => void;
}
export function ImageUpload({
  value,
  onChange,
  onAltChange,
}: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState(value || "");
  const [altText, setAltText] = useState("");
  const [isEditing, setIsEditing] = useState(!value);
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };
  const handleAltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAltText(e.target.value);
    if (onAltChange) {
      onAltChange(e.target.value);
    }
  };
  const handleSave = () => {
    onChange(imageUrl);
    setIsEditing(false);
  };
  const handleRemove = () => {
    setImageUrl("");
    onChange("");
    setIsEditing(true);
  };
  return (
    <div className="space-y-4">
      {!isEditing && imageUrl ? (
        <div className="relative">
          <div className="rounded-md overflow-hidden border w-full max-w-[300px] aspect-video relative bg-muted">
            <img
              src={imageUrl}
              alt={altText || "Category image"}
              className="object-cover w-full h-full"
              onError={() => setIsEditing(true)}
            />
          </div>
          <div className="mt-2 flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Change
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemove}
            >
              <X className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="grid gap-2">
            <Label htmlFor="image-url">Image URL</Label>
            <Input
              id="image-url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={handleUrlChange}
            />
          </div>
          {onAltChange && (
            <div className="grid gap-2">
              <Label htmlFor="alt-text">Alt Text</Label>
              <Input
                id="alt-text"
                placeholder="Descriptive text for the image"
                value={altText}
                onChange={handleAltChange}
              />
            </div>
          )}
          <Button
            type="button"
            onClick={handleSave}
            disabled={!imageUrl}
            size="sm"
          >
            <ImageIcon className="h-4 w-4 mr-1" />
            {value ? "Update Image" : "Add Image"}
          </Button>
        </div>
      )}
    </div>
  );
}
