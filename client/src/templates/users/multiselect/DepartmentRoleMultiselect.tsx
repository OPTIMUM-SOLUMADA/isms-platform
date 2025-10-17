import { useEffect, useId, useState } from "react"
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
import { useTranslation } from "react-i18next"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import type { DepartmentRole } from "@/types"
import { usePermissions } from "@/hooks/use-permissions"
import { useDepartmentRoleUI } from "@/stores/department/useDepartmentRoleUI"
import useDepartmentRoleStore from "@/stores/department/useDepatrmentRoleStore"
import { useFetchDepartmentRolesByIds, useSearchDepartmentRoles } from "@/hooks/queries/useDepartmentRoleMutations"

interface DepartmentRoleMultiSelectProps {
    data: DepartmentRole[];
    value?: string[]    ;
    onValueChange?: (value: string[]) => void;
    hasError?: boolean;
}

export default function DepartmentRoleMultiSelect({
    data = [],
    value = [],
    onValueChange,
    hasError = false,
}: DepartmentRoleMultiSelectProps) {
    const id = useId();
    const [open, setOpen] = useState<boolean>(false);
    const { openAdd } = useDepartmentRoleUI();

    const { setQuery } = useDepartmentRoleStore();
    const { data: departmentRole = data, isLoading } = useSearchDepartmentRoles();
    console.log("data", data);
    

    const { data: selectedDepartmentRoles = [] } = useFetchDepartmentRolesByIds(value);

    const { t } = useTranslation();
    const { hasActionPermission } = usePermissions();

    const toggleDepartmentRole = (id: string) => {
        if (value.includes(id)) {
            onValueChange?.(value.filter((v) => v !== id))
        } else {
            onValueChange?.([...value, id])
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
                            {selectedDepartmentRoles.length > 0 ? (
                                selectedDepartmentRoles.map((dep) => (
                                    <Badge
                                        key={dep.id}
                                        className={cn(
                                            "flex items-center gap-1 px-2 py-0.5 text-xs font-normal bg-theme-2/10 text-primary",
                                        )}
                                    >
                                        <span className="truncate max-w-[80px]">{dep.name}</span>
                                        <XIcon
                                            size={12}
                                            className="cursor-pointer opacity-70 hover:opacity-100"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                            }}
                                        />
                                    </Badge>
                                ))
                            ) : (
                                <span className="text-muted-foreground">
                                    {t("components.multiselect.departmentRole.placeholder")}
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
                        <CommandInput placeholder={t("components.multiselect.departmentRole.search")} onInput={(e) => setQuery(e.currentTarget.value)} />
                        <CommandList>
                            <CommandEmpty>
                                {isLoading ?
                                    t("components.multiselect.departmentRole.searching") :
                                    t("components.multiselect.departmentRole.empty")
                                }
                            </CommandEmpty>
                            <CommandGroup className="max-h-52 overflow-y-auto">
                                {departmentRole.map((dep) => {
                                    const isSelected = value.includes(dep.id)
                                    return (
                                        <CommandItem
                                            key={dep.id}
                                            value={dep.name}
                                            onSelect={() =>  toggleDepartmentRole(dep.id) }
                                            className="flex items-center gap-2"
                                        >
                                            <Checkbox
                                                checked={isSelected}
                                                className="shrink-0"
                                            />
                                            <div className="flex flex-col items-start w-full">
                                                <div className="text-sm flex justify-between items-start w-full">
                                                    <span className="flex-1">{dep.name}</span>
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                    {dep.description}
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
                                            {t("components.multiselect.departmentRole.addNew")}
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
