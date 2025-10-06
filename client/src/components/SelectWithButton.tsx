
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from '@/components/ui/button';
import { CheckIcon, ChevronDownIcon, PlusIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useTranslation } from "react-i18next";

export interface SelectItemType {
    value: string;
    label: string;
}

interface SelectWithButtonProps {
    items: SelectItemType[];
    value?: string;
    placeholder?: string;
    onChange: (value: string) => void;
    addLabel?: string; // label for "Add new"
    onButtonClick?: () => void; // when add button clicked
    className?: string;
    hasError?: boolean;
    onChangeSearch?: (value: string) => void;
    allowSearch?: boolean;
}

export function SelectWithButton({
    items,
    value,
    placeholder = "Select an option",
    onChange,
    addLabel = "Add new",
    onButtonClick,
    className,
    hasError = false,
    onChangeSearch,
    allowSearch = true,
}: SelectWithButtonProps) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("");
    const { t } = useTranslation();

    return (
        <div className="*:not-first:mt-2">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            "bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]",
                            "normal-case h-8",
                            className,
                            hasError && "border-destructive"
                        )}
                    >
                        <span className={cn("truncate", !value && "text-muted-foreground")}>
                            {value
                                ? items.find((item) => item.value === value)?.label
                                : placeholder}
                        </span>
                        <ChevronDownIcon
                            size={16}
                            className="text-muted-foreground/80 shrink-0"
                            aria-hidden="true"
                        />
                    </Button>
                </PopoverTrigger>

                <PopoverContent
                    className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
                    align="start"
                >
                    <Command {...onChangeSearch && { filter: () => 1 }}>
                        {allowSearch && (
                            <CommandInput
                                placeholder={t("components.selectWithButton.search.placeholder")}
                                value={search}
                                onValueChange={setSearch}
                                onKeyDown={(e) => e.stopPropagation()} // prevent blur
                                onInput={(e) => onChangeSearch?.(e.currentTarget.value)}
                            />
                        )}
                        <CommandList>
                            <CommandEmpty>{t("components.selectWithButton.noResults")}</CommandEmpty>

                            <CommandGroup>
                                {items.map((item) => (
                                    <CommandItem
                                        key={item.value}
                                        value={item.label}
                                        keywords={item.label.split(" ")}
                                        onSelect={() => {
                                            onChange(item.value === value ? "" : item.value)
                                            setOpen(false)
                                        }}
                                    >
                                        {item.label}
                                        {value === item.value && <CheckIcon size={16} className="ml-auto" />}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>


                        {onButtonClick && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start font-normal normal-case"
                                        onClick={onButtonClick}
                                    >
                                        <PlusIcon size={16} className="mr-2 opacity-60" aria-hidden="true" />
                                        {addLabel}
                                    </Button>
                                </CommandGroup>
                            </>
                        )}
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}