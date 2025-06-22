import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  group?: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "选择选项...",
  searchPlaceholder = "搜索...",
  emptyText = "未找到选项",
  className,
  disabled = false,
  loading = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  // 根据搜索值过滤选项
  const filteredOptions = React.useMemo(() => {
    if (!searchValue) return options;
    
    return options.filter(option =>
      option.label.toLowerCase().includes(searchValue.toLowerCase()) ||
      option.value.toLowerCase().includes(searchValue.toLowerCase()) ||
      option.description?.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [options, searchValue]);

  // 按组分组选项
  const groupedOptions = React.useMemo(() => {
    const groups: Record<string, ComboboxOption[]> = {};
    
    filteredOptions.forEach(option => {
      const group = option.group || 'default';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(option);
    });
    
    return groups;
  }, [filteredOptions]);

  // 获取当前选中选项的显示文本
  const selectedOption = options.find(option => option.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  const handleSelect = (selectedValue: string) => {
    if (selectedValue === value) {
      onValueChange?.("");
    } else {
      onValueChange?.(selectedValue);
    }
    setOpen(false);
    setSearchValue("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled || loading}
        >
          <span className="truncate">{displayText}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            {Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
              <CommandGroup
                key={groupName}
                heading={groupName !== 'default' ? groupName : undefined}
              >
                {groupOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={handleSelect}
                    className="flex flex-col items-start gap-1"
                  >
                    <div className="flex items-center w-full">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === option.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span className="flex-1 truncate">{option.label}</span>
                    </div>
                    {option.description && (
                      <span className="text-xs text-muted-foreground ml-6 truncate w-full">
                        {option.description}
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
