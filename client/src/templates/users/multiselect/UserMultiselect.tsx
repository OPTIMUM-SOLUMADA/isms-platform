import { useEffect, useId, useMemo, useState } from "react"
import { ChevronDownIcon, PlusIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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
import { UserAvatar } from "@/components/user-avatar"
import { useTranslation } from "react-i18next"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { userRoleColors } from "@/constants/color"
import type { User } from "@/types"
import { usePermissions } from "@/hooks/use-permissions"
import { useUserUIStore } from "@/stores/user/useUserUIStore"
import useUserStore from "@/stores/user/useUserStore"
import { useSearchUsers } from "@/hooks/queries/useUserMutations"

interface UserMultiSelectProps {
    data: User[];
    value?: string[]
    onValueChange?: (value: string[]) => void;
    hasError?: boolean;
}

export default function UserMultiSelect({
    data = [],
    value = [],
    onValueChange,
    hasError = false,
}: UserMultiSelectProps) {
    const id = useId();
    const [open, setOpen] = useState<boolean>(false);
    const { openAdd } = useUserUIStore();

    const { setQuery } = useUserStore();
    const { data: users = data, isLoading } = useSearchUsers();

    const selectedUsers = useMemo(
        () => data.filter((user) => value.includes(user.id)),
        [value, data]
    );

    const { t } = useTranslation();
    const { hasActionPermission } = usePermissions();

    const toggleUser = (userId: string) => {
        if (value.includes(userId)) {
            onValueChange?.(value.filter((id) => id !== userId))
        } else {
            onValueChange?.([...value, userId])
        }
    };

    useEffect(() => {
        return () => setQuery("");
    }, [setQuery]);

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
                            "bg-background h-auto min-h-9 normal-case hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]",
                            hasError && "has-error"
                        )}
                    >
                        <div className="flex flex-wrap gap-1 truncate">
                            {selectedUsers.length > 0 ? (
                                selectedUsers.map((user) => (
                                    <Badge
                                        key={user.id}
                                        className={cn(
                                            "flex items-center gap-1 px-2 py-0.5 text-xs font-normal bg-theme-2/10 text-primary",
                                        )}
                                    >
                                        <UserAvatar
                                            id={user.id}
                                            name={user.name}
                                            className="size-5"
                                        />
                                        <span className="truncate max-w-[80px]">{user.name}</span>
                                        <XIcon
                                            size={12}
                                            className="cursor-pointer opacity-70 hover:opacity-100"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                toggleUser(user.id)
                                            }}
                                        />
                                    </Badge>
                                ))
                            ) : (
                                <span className="text-muted-foreground">
                                    {t("components.multiselect.user.placeholder")}
                                </span>
                            )}
                        </div>
                        <ChevronDownIcon
                            size={16}
                            className="text-muted-foreground/80 shrink-0 ml-2"
                            aria-hidden="true"
                        />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
                    align="start"
                >
                    <Command filter={() => 1}>
                        <CommandInput placeholder={t("components.multiselect.user.search")} onInput={(e) => setQuery(e.currentTarget.value)} />
                        <CommandList>
                            <CommandEmpty>
                                {isLoading ?
                                    t("components.multiselect.user.searching") :
                                    t("components.multiselect.user.empty")
                                }
                            </CommandEmpty>
                            <CommandGroup className="max-h-52 overflow-y-auto">
                                {users.map((user) => {
                                    const isSelected = value.includes(user.id)
                                    return (
                                        <CommandItem
                                            key={user.id}
                                            value={user.name}
                                            onSelect={() => toggleUser(user.id)}
                                            className="flex items-center gap-2"
                                        >
                                            <Checkbox
                                                checked={isSelected}
                                                className="shrink-0"
                                            />
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
                                                <span className="text-xs text-muted-foreground">
                                                    {user.email}
                                                </span>
                                            </div>
                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                            {hasActionPermission('user.create') && (
                                <>
                                    <CommandSeparator />
                                    <CommandGroup>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="w-full justify-start font-normal"
                                            onClick={openAdd}
                                        >
                                            <PlusIcon
                                                size={16}
                                                className="opacity-60 mr-2"
                                                aria-hidden="true"
                                            />
                                            {t("components.multiselect.user.addNew")}
                                        </Button>
                                    </CommandGroup>
                                </>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}
