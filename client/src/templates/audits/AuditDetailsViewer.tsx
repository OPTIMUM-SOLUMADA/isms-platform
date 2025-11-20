import { useState } from "react";
import { ChevronDown, ChevronRight, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  details: Record<string, any>;
  level?: number;
}

function FormatKey({ _key }: { _key: string }) {
  const { t } = useTranslation();
  return <>{t(`auditLog.details.${_key}`, { defaultValue: _key })}</>;
}

export default function AuditDetailsViewer({ details, level = 0 }: Props) {
  const [showAll, setShowAll] = useState(false);
  const { t } = useTranslation();
  const entries = Object.entries(details);
  const hasTooMany = entries.length > 3;

  const visibleEntries = showAll ? entries : entries.slice(0, 3);

  return (
    <div className="font-mono text-sm">
      {visibleEntries.map(([key, value]) => (
        <AuditItem key={key} k={key} value={value} level={level} />
      ))}

      {hasTooMany && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="text-xs text-blue-900 font-bold mt-1 hover:underline"
        >
          {t("auditLog.table.cells.details.actions.viewMore.label")}
        </button>
      )}

      {hasTooMany && showAll && (
        <button
          onClick={() => setShowAll(false)}
          className="text-xs text-blue-900 font-bold mt-1 hover:underline"
        >
          {t("auditLog.table.cells.details.actions.viewLess.label")}
        </button>
      )}
    </div>
  );
}

function AuditItem({ k, value, level }: { k: string; value: any; level: number }) {
  const [open, setOpen] = useState(false);
  const isObject = typeof value === "object" && value !== null;

  const isChangeItem = isChange(value);

  return (
    <div className="" style={{ marginLeft: level * 16 }}>
      <div className="flex items-center gap-1">
        {isObject && !isChangeItem ? (
          <button
            onClick={() => setOpen(!open)}
            className="text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <span className="text-blue-700">
              <FormatKey _key={k} />
            </span>
            <span className="text-gray-400 ml-1 text-xs">{`(${Object.keys(value).length})`}</span>
          </button>
        ) : isChangeItem ? (
          <div className="flex items-center gap-1">
            <span className="text-blue-700">
              <FormatKey _key={k} />:
            </span>
            <span className="text-theme-danger/60 ml-1 line-through">{String(value.before)}</span>
            <ArrowRight size={14} className="text-gray-400" xlinkTitle="After" />
            <span className="text-green-600 ml-1">{String(value.after)}</span>
          </div>
        ) : (
          <>
            <span className="text-blue-600">
              <FormatKey _key={k} />:
            </span>{" "}
            <span className="ml-1 text-foreground">{String(value)}</span>
          </>
        )}
      </div>

      {isObject && !isChangeItem && open && (
        <div className="pl-4 border-l border-muted mt-1">
          {Object.entries(value).map(([key, val]) => (
            <AuditItem key={key} k={key} value={val} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function isChange(value: any): value is { before: any; after: any } {
  return value && typeof value === "object" && "before" in value && "after" in value;
}
