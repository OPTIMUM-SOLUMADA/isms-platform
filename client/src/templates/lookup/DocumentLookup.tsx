
import { useId, useMemo, useState } from "react";
import { CheckIcon, ChevronDownIcon, PlusIcon, FileText  } from "lucide-react";

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
import { useTranslation } from "react-i18next";
import { Document } from "@/types";

interface DocumentLookupProps {
  data?: Document[];
  value?: string;
  onValueChange?: (value: string) => void;
  hasError?: boolean;
}

export default function DocumentLookup({
  data = [],
  value,
  onValueChange,
  hasError = false,
}: DocumentLookupProps) {
  const id = useId();
  const [open, setOpen] = useState<boolean>(false);

  const selectedDocument = useMemo(
    () => data.find((doc) => doc.id === value),
    [value, data]
  );

  console.log("sele", selectedDocument);
  

  const { t } = useTranslation();

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
            <span
              className={cn("truncate flex-1 text-left", !value && "text-muted-foreground")}
            >
              {selectedDocument ? (
                <div className="flex items-center gap-2">
                  <FileText className="size-5 text-muted-foreground" aria-hidden="true" />
                  <span className="truncate max-w-[120px]">
                    {selectedDocument.title}
                  </span>
                </div>
              ) : (
                <span className="text-muted-foreground">
                  {t("components.lookup.document.placeholder")}
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
            <CommandInput placeholder={t("components.lookup.document.search")} />
            <CommandList>
              <CommandEmpty>
                {t("components.lookup.document.empty")}
              </CommandEmpty>
              <CommandGroup className="max-h-52 overflow-y-auto">
                {data.map((doc) => (
                  <CommandItem
                    key={doc.id}
                    value={doc.title}
                    onSelect={() => {
                      onValueChange?.(value === doc.id ? "" : doc.id);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex items-center justify-between",
                      value === doc.id && "bg-theme-2/10"
                    )}
                  >
                    <div className="flex items-center gap-2 w-full">
                       <FileText className="size-5 text-muted-foreground" aria-hidden="true" />

                      <div className="flex flex-col items-start w-full">
                        <div className="text-sm flex justify-between items-start w-full">
                          <span className="flex-1">{doc.title}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {doc.description}
                        </span>
                      </div>
                    </div>
                    {value === doc.id && (
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
                  {t("components.lookup.document.addNew")}
                </Button>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
