import { useState } from "react";

interface Props {
  id:          string;
  num:         number;
  icon:        string;
  title:       string;
  headerBg:    string;
  headerText:  string;
  borderColor: string;
  bodyBg?:     string;
  defaultOpen: boolean;
  hidden:      boolean;
  badge?:      React.ReactNode;
  children:    React.ReactNode;
}

export default function TeachingSection({
  id, num, icon, title,
  headerBg, headerText, borderColor, bodyBg,
  defaultOpen, hidden, badge, children,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  if (hidden) return null;

  return (
    <div key={id} className="rounded-2xl border overflow-hidden shadow-sm" style={{ borderColor }}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2.5 px-4 py-3 text-left transition-colors hover:brightness-95"
        style={{ background: headerBg }}
      >
        <span className="text-base flex-shrink-0 leading-none">{icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black uppercase tracking-wider leading-none" style={{ color: headerText }}>
            {num}. {title}
          </p>
        </div>
        {badge && <span className="flex-shrink-0 mr-1">{badge}</span>}
        <span className="text-[10px] font-bold flex-shrink-0" style={{ color: headerText }}>
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div
          className="px-4 pb-4 pt-3 border-t"
          style={{ background: bodyBg ?? "#ffffff", borderColor }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
