"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, Folder, FolderOpen, Image as ImageIcon } from "lucide-react";
import type { PageSlotGroup } from "./Types";

type WorkspaceSidebarProps = {
  pageSections: { sectionName: string; pages: PageSlotGroup[] }[];
  selectedPageKey: string;
  onSelectPage: (key: string) => void;
};

// Sub-component for an accordion section
function SidebarSection({
  section,
  selectedPageKey,
  onSelectPage,
}: {
  section: { sectionName: string; pages: PageSlotGroup[] };
  selectedPageKey: string;
  onSelectPage: (key: string) => void;
}) {
  const hasActivePage = section.pages.some((p) => p.pageKey === selectedPageKey);
  const [isOpen, setIsOpen] = useState(hasActivePage);

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold tracking-wider text-white/40 uppercase hover:text-white/70 hover:bg-[#ffffff0a] rounded-lg transition-colors group"
      >
        <div className="flex items-center">
          {isOpen ? (
            <FolderOpen className="w-3.5 h-3.5 mr-2 text-[var(--primary)]" />
          ) : (
            <Folder className="w-3.5 h-3.5 mr-2 group-hover:text-white/60" />
          )}
          {section.sectionName}
        </div>
        {isOpen ? (
          <ChevronDown className="w-3 h-3 opacity-50" />
        ) : (
          <ChevronRight className="w-3 h-3 opacity-50" />
        )}
      </button>

      <div
        className={`mt-1 space-y-0.5 overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {section.pages.map((page) => {
          const isActive = page.pageKey === selectedPageKey;
          return (
            <button
              key={page.pageKey}
              onClick={() => onSelectPage(page.pageKey)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                isActive
                  ? "bg-[rgba(var(--primary-rgb),0.15)] text-[var(--primary)] font-medium shadow-[inset_0_0_0_1px_rgba(var(--primary-rgb),0.3)] ml-2 w-[calc(100%-8px)]"
                  : "text-white/60 hover:text-white/90 hover:bg-[#ffffff0a] font-light ml-2 w-[calc(100%-8px)]"
              }`}
            >
              <div className="flex items-center truncate">
                <ImageIcon
                  className={`w-4 h-4 mr-3 flex-shrink-0 ${
                    isActive ? "text-[var(--primary)]" : "text-white/40"
                  }`}
                />
                <span className="truncate">{page.pageLabel}</span>
              </div>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] flex-shrink-0 ml-2" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function WorkspaceSidebar({
  pageSections,
  selectedPageKey,
  onSelectPage,
}: WorkspaceSidebarProps) {
  return (
    <div className="w-80 flex-shrink-0 border-r border-[#ffffff10] bg-[#00000080] backdrop-blur-xl h-full overflow-y-auto hidden md:flex flex-col">
      <div className="p-6 border-b border-[#ffffff10]">
        <h2 className="text-xl font-outfit text-white tracking-widest font-light">
          Media Workspace
        </h2>
        <p className="text-xs text-white/50 mt-2 font-inter font-light">
          Select a page to manage its imagery.
        </p>
      </div>

      <div className="flex-1 py-4 px-2">
        {pageSections.map((section) => (
          <SidebarSection
            key={section.sectionName}
            section={section}
            selectedPageKey={selectedPageKey}
            onSelectPage={onSelectPage}
          />
        ))}
      </div>
    </div>
  );
}
