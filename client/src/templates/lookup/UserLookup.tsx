import { useId, useMemo, useState } from "react";
import { CheckIcon, ChevronDownIcon, PlusIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { UserAvatar } from "@/components/user-avatar";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { userRoleColors } from "@/constants/color";
import { User } from "@/types";

interface UserLookupProps {
    data?: User[];
    value?: string;
    onValueChange?: (value: string) => void;
    hasError?: boolean;
}

export default function UserLookup({
    data = [],
    value,
    onValueChange,
    hasError = false
}: UserLookupProps) {
    const id = useId()
    const [open, setOpen] = useState<boolean>(false);

    const selectedUser = useMemo(() => data.find((user) => user.id === value), [value, data]);

    const { t } = useTranslation();

    console.log("hasError", hasError);

    return (
        <div className="*:not-first:mt-2">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id={id}
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            "bg-background normal-case hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]",
                            hasError && "has-error"
                        )}
                    >
                        <span className={cn("truncate", !value && "text-muted-foreground")}>
                            {selectedUser ? (
                                <Badge
                                    key={selectedUser.id}
                                    className={cn(
                                        "flex items-center gap-1 px-2 py-0.5 text-xs font-normal w-full",
                                        userRoleColors[selectedUser.role]
                                    )}
                                >
                                    <UserAvatar
                                        id={selectedUser.id}
                                        name={selectedUser.name}
                                        className="size-5"
                                    />
                                    <span className="truncate max-w-[80px]">{selectedUser.name}</span>
                                </Badge>
                            ) : (
                                <span className="text-muted-foreground">
                                    {t("components.lookup.user.placeholder")}
                                </span>
                            )}
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
                    <Command>
                        <CommandInput placeholder={t("components.lookup.user.search")} />
                        <CommandList>
                            <CommandEmpty>{t("components.lookup.user.empty")}</CommandEmpty>
                            <CommandGroup className="max-h-52 overflow-y-auto">
                                {data.map((user) => (
                                    <CommandItem
                                        key={user.id}
                                        value={user.name}
                                        onSelect={() => {
                                            onValueChange?.(selectedUser?.id === user.id ? "" : user.id)
                                            setOpen(false)
                                        }}
                                        className={cn(
                                            "flex items-center justify-between",
                                            value === user.id && "bg-theme-2/10"
                                        )}
                                    >
                                        <div className="flex items-center gap-2 w-full">
                                            <UserAvatar
                                                id={user.id}
                                                name={user.name}
                                                className="size-6"
                                            />
                                            <div className="flex flex-col items-start w-full">
                                                <div className="text-sm flex justify-between items-start w-full">
                                                    <span className="flex-1">{user.name}</span>
                                                    <Badge
                                                        className={cn(
                                                            "ml-1 px-0.5 py-0 text-xxs text-white h-auto mr-auto shadow-none !capitalize",
                                                            userRoleColors[user.role]
                                                        )}
                                                    >
                                                        {user.role}
                                                    </Badge>
                                                </div>
                                                <span className="text-xs text-muted-foreground">{user.email}</span>
                                            </div>
                                        </div>
                                        {value === user.id && (
                                            <CheckIcon size={16} className="ml-auto text-theme-2" />
                                        )}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                            <CommandSeparator />
                            <CommandGroup>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="w-full justify-start font-normal"
                                >
                                    <PlusIcon
                                        size={16}
                                        className="opacity-60 mr-2"
                                        aria-hidden="true"
                                    />
                                    {t("components.lookup.user.addNew")}
                                </Button>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}
