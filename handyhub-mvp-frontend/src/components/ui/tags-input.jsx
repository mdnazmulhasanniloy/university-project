import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Input } from "./input";

const TagInput = React.forwardRef((props, ref) => {
  const { placeholder, tags, setTags, className } = props;

  const [inputValue, setInputValue] = React.useState("");
  const inputRef = React.useRef(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div>
      <div
        className={`flex flex-wrap gap-2 rounded-md ${tags.length !== 0 && "mb-3"}`}
      >
        {tags.map((tag, index) => (
          <span
            key={index}
            className="hover:bg-secondary/80 inline-flex h-8 items-center rounded-full border bg-primary-blue pl-4 text-sm text-primary-white transition-all"
          >
            {tag}
            <Button
              type="button"
              variant="ghost"
              onClick={() => removeTag(tag)}
              className={cn("h-full px-3 py-1 hover:bg-transparent")}
            >
              <X size={14} />
            </Button>
          </span>
        ))}
      </div>
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className={className}
      />
    </div>
  );
});

TagInput.displayName = "TagInput";

export { TagInput };
