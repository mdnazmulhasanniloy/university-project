"use client";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandItem,
  CommandEmpty,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Command as CommandPrimitive } from "cmdk";
import { X as RemoveIcon, Check } from "lucide-react";
import React, {
  KeyboardEvent,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useState,
} from "react";

const MultiSelectContext = createContext(null);

const useMultiSelect = () => {
  const context = useContext(MultiSelectContext);
  if (!context) {
    throw new Error("useMultiSelect must be used within MultiSelectProvider");
  }
  return context;
};

const MultiSelector = ({
  values: value,
  onValuesChange: onValueChange,
  loop = false,
  className,
  children,
  dir,
  ...props
}) => {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = React.useRef(null);
  const [isValueSelected, setIsValueSelected] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  const onValueChangeHandler = useCallback(
    (val) => {
      if (value?.includes(val)) {
        onValueChange(value.filter((item) => item !== val));
      } else {
        onValueChange([...value, val]);
      }
    },
    [value],
  );

  const handleSelect = useCallback(
    (e) => {
      e.preventDefault();
      const target = e.currentTarget;
      const selection = target.value.substring(
        target.selectionStart ?? 0,
        target.selectionEnd ?? 0,
      );

      setSelectedValue(selection);
      setIsValueSelected(selection === inputValue);
    },
    [inputValue],
  );

  const handleKeyDown = useCallback(
    (e) => {
      e.stopPropagation();
      const target = inputRef.current;

      if (!target) return;

      const moveNext = () => {
        const nextIndex = activeIndex + 1;
        setActiveIndex(
          nextIndex > value.length - 1 ? (loop ? 0 : -1) : nextIndex,
        );
      };

      const movePrev = () => {
        const prevIndex = activeIndex - 1;
        setActiveIndex(prevIndex < 0 ? value.length - 1 : prevIndex);
      };

      const moveCurrent = () => {
        const newIndex =
          activeIndex - 1 <= 0
            ? value.length - 1 === 0
              ? -1
              : 0
            : activeIndex - 1;
        setActiveIndex(newIndex);
      };

      switch (e.key) {
        case "ArrowLeft":
          if (dir === "rtl") {
            if (value.length > 0 && (activeIndex !== -1 || loop)) {
              moveNext();
            }
          } else {
            if (value.length > 0 && target.selectionStart === 0) {
              movePrev();
            }
          }
          break;

        case "ArrowRight":
          if (dir === "rtl") {
            if (value.length > 0 && target.selectionStart === 0) {
              movePrev();
            }
          } else {
            if (value.length > 0 && (activeIndex !== -1 || loop)) {
              moveNext();
            }
          }
          break;

        case "Backspace":
        case "Delete":
          if (value.length > 0) {
            if (activeIndex !== -1 && activeIndex < value.length) {
              onValueChangeHandler(value[activeIndex]);
              moveCurrent();
            } else {
              if (target.selectionStart === 0) {
                if (selectedValue === inputValue || isValueSelected) {
                  onValueChangeHandler(value[value.length - 1]);
                }
              }
            }
          }
          break;

        case "Enter":
          setOpen(true);
          break;

        case "Escape":
          if (activeIndex !== -1) {
            setActiveIndex(-1);
          } else if (open) {
            setOpen(false);
          }
          break;
      }
    },
    [value, inputValue, activeIndex, loop],
  );

  return (
    <MultiSelectContext.Provider
      value={{
        value,
        onValueChange: onValueChangeHandler,
        open,
        setOpen,
        inputValue,
        setInputValue,
        activeIndex,
        setActiveIndex,
        ref: inputRef,
        handleSelect,
      }}
    >
      <Command
        onKeyDown={handleKeyDown}
        className={cn(
          "flex flex-col overflow-visible bg-transparent",
          className,
        )}
        dir={dir}
        {...props}
      >
        {children}
      </Command>
    </MultiSelectContext.Provider>
  );
};

const MultiSelectorTrigger = forwardRef(
  ({ className, children, ...props }, ref) => {
    const {
      value: selectedValues,
      onValueChange,
      activeIndex,
    } = useMultiSelect();

    const mousePreventDefault = useCallback((e) => {
      e.preventDefault();
      e.stopPropagation();
    }, []);

    return (
      <div
        ref={ref}
        className={cn(
          "focus:ring-ring bg-background flex flex-wrap gap-1 rounded-md border border-gray-400 px-2 py-2 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-blue",
          className,
        )}
        {...props}
      >
        {selectedValues?.map((item, index) => (
          <Badge
            key={item?.value}
            className={cn(
              "flex items-center gap-1 rounded-full p-2",
              activeIndex === index && "ring-muted-foreground ring-2",
            )}
            variant={"secondary"}
          >
            <span className="mr-1 text-xs">{item?.label}</span>

            <button
              aria-label={`Remove ${item?.label} option`}
              aria-roledescription="button to remove option"
              type="button"
              onMouseDown={mousePreventDefault}
              onClick={() => onValueChange(item)}
            >
              <span className="sr-only">Remove {item?.label} option</span>
              <RemoveIcon className="hover:stroke-destructive h-4 w-4" />
            </button>
          </Badge>
        ))}
        {children}
      </div>
    );
  },
);

MultiSelectorTrigger.displayName = "MultiSelectorTrigger";

const MultiSelectorInput = forwardRef(({ className, ...props }, ref) => {
  const {
    setOpen,
    inputValue,
    setInputValue,
    activeIndex,
    setActiveIndex,
    handleSelect,
    ref: inputRef,
  } = useMultiSelect();

  return (
    <CommandPrimitive.Input
      {...props}
      tabIndex={0}
      ref={inputRef}
      value={inputValue}
      onValueChange={activeIndex === -1 ? setInputValue : undefined}
      onSelect={handleSelect}
      onBlur={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onClick={() => setActiveIndex(-1)}
      className={cn(
        "placeholder:text-muted-foreground ml-2 flex-1 bg-transparent outline-none",
        className,
        activeIndex !== -1 && "caret-transparent",
      )}
      disabled={props.disabled}
    />
  );
});

MultiSelectorInput.displayName = "MultiSelectorInput";

const MultiSelectorContent = forwardRef(({ children }, ref) => {
  const { open } = useMultiSelect();
  return (
    <div ref={ref} className="relative">
      {open && children}
    </div>
  );
});

MultiSelectorContent.displayName = "MultiSelectorContent";

const MultiSelectorList = forwardRef(
  ({ className, children, emptyText }, ref) => {
    return (
      <CommandList
        ref={ref}
        className={cn(
          "scrollbar-thumb-muted-foreground bg-background scrollbar-thumb-rounded-lg absolute top-0 z-10 flex w-full flex-col gap-2 rounded-md border border-muted bg-white p-2 shadow-md transition-colors scrollbar-thin scrollbar-track-transparent dark:scrollbar-thumb-muted",
          className,
        )}
      >
        {children}
        <CommandEmpty>
          <span className="text-muted-foreground">
            {emptyText || "No results found"}
          </span>
        </CommandEmpty>
      </CommandList>
    );
  },
);

MultiSelectorList.displayName = "MultiSelectorList";

const MultiSelectorItem = forwardRef(
  ({ className, value, label, children, ...props }, ref) => {
    const { value: Options, onValueChange, setInputValue } = useMultiSelect();

    const mousePreventDefault = useCallback((e) => {
      e.preventDefault();
      e.stopPropagation();
    }, []);

    const isIncluded = Options?.includes(value);
    return (
      <CommandItem
        ref={ref}
        {...props}
        onSelect={() => {
          onValueChange({ value, label });
          setInputValue("");
        }}
        className={cn(
          "flex cursor-pointer justify-between rounded-md px-2 py-1 text-base transition-colors",
          className,
          isIncluded && "cursor-default opacity-50",
          props.disabled && "cursor-not-allowed opacity-50",
        )}
        onMouseDown={mousePreventDefault}
      >
        {children}
        {isIncluded && <Check className="h-4 w-4" />}
      </CommandItem>
    );
  },
);

MultiSelectorItem.displayName = "MultiSelectorItem";

export {
  MultiSelector,
  MultiSelectorTrigger,
  MultiSelectorInput,
  MultiSelectorContent,
  MultiSelectorList,
  MultiSelectorItem,
};
