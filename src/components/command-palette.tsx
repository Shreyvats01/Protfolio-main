"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Activity,
  ArrowUpRight,
  Check,
  Code2,
  Copy,
  Cpu,
  FolderGit2,
  Mail,
  Send,
  User,
} from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/icons";
import { siteConfig } from "@/lib/site-config";
import projectsData from "@/data/projects.json";

const emptySubscribe = () => () => {};

export function CommandPalette({
  triggerClassName,
}: {
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const isMac = useSyncExternalStore(
    emptySubscribe,
    () =>
      /Mac|iPhone|iPod|iPad/i.test(
        navigator.platform || navigator.userAgent || ""
      ),
    () => true
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const navigateToSection = (hash: string) => {
    setOpen(false);
    const el = document.querySelector(hash);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      window.history.replaceState(null, "", hash);
    } else {
      window.location.hash = hash;
    }
  };

  const openExternal = (url: string) => {
    setOpen(false);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.contact.email);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setOpen(false);
      }, 650);
    } catch {
      window.location.href = `mailto:${siteConfig.contact.email}`;
      setOpen(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
        className={
          triggerClassName ||
          "inline-flex items-center gap-2 rounded-md border border-border bg-secondary px-2.5 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-[#36404B] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap shrink-0"
        }
      >
        <span>Command</span>
        <kbd className="pointer-events-none inline-flex items-center gap-0.5 rounded border border-border bg-[#0B0D0F] px-1.5 py-0.5 font-mono text-[10px] text-[#788391]">
          {isMac ? "⌘K" : "Ctrl K"}
        </kbd>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Portfolio Command Palette"
        description="Jump to sections, inspect repositories, or contact Shrey Vats"
      >
        <CommandInput placeholder="Jump to section, repository, or contact..." />
        <CommandList>
          <CommandEmpty>No matching commands or repositories.</CommandEmpty>

          <CommandGroup heading="Sections">
            <CommandItem onSelect={() => navigateToSection("#projects")}>
              <Code2 className="mr-2 h-4 w-4 text-primary" />
              <span>Selected Work &amp; Architecture</span>
              <CommandShortcut>#projects</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => navigateToSection("#about")}>
              <User className="mr-2 h-4 w-4" />
              <span>About &amp; Engineering Approach</span>
              <CommandShortcut>#about</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => navigateToSection("#systems")}>
              <Cpu className="mr-2 h-4 w-4" />
              <span>Systems &amp; Technical Focus</span>
              <CommandShortcut>#systems</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => navigateToSection("#activity")}>
              <Activity className="mr-2 h-4 w-4" />
              <span>GitHub Activity &amp; Pull Requests</span>
              <CommandShortcut>#activity</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => navigateToSection("#contact")}>
              <Mail className="mr-2 h-4 w-4" />
              <span>Contact &amp; Direct Dispatch</span>
              <CommandShortcut>#contact</CommandShortcut>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Featured Repositories">
            {projectsData.map((project) => (
              <CommandItem
                key={project.id}
                onSelect={() =>
                  openExternal(
                    project.projectUrl || `https://github.com/${project.repo}`
                  )
                }
              >
                <FolderGit2 className="mr-2 h-4 w-4 text-[#788391]" />
                <span>{project.title}</span>
                <CommandShortcut>{project.repo}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Direct Contact & Profiles">
            <CommandItem onSelect={handleCopyEmail}>
              {copied ? (
                <Check className="mr-2 h-4 w-4 text-primary" />
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}
              <span>
                {copied
                  ? `Copied ${siteConfig.contact.email}`
                  : `Copy Email (${siteConfig.contact.email})`}
              </span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setOpen(false);
                window.location.href = `mailto:${siteConfig.contact.email}`;
              }}
            >
              <Mail className="mr-2 h-4 w-4" />
              <span>Compose Email ({siteConfig.contact.email})</span>
            </CommandItem>
            <CommandItem
              onSelect={() => openExternal(siteConfig.contact.portalUrl)}
            >
              <Send className="mr-2 h-4 w-4" />
              <span>Open Contact Portal (contact.shrey.online)</span>
              <ArrowUpRight className="ml-auto h-3.5 w-3.5 text-[#788391]" />
            </CommandItem>
            <CommandItem onSelect={() => openExternal(siteConfig.socials.github)}>
              <GithubIcon className="mr-2 h-4 w-4" />
              <span>GitHub (@shreyvats01)</span>
            </CommandItem>
            <CommandItem onSelect={() => openExternal(siteConfig.socials.x)}>
              <TwitterIcon className="mr-2 h-4 w-4" />
              <span>X / Twitter (@shreyvats01)</span>
            </CommandItem>
            <CommandItem
              onSelect={() => openExternal(siteConfig.socials.linkedin)}
            >
              <LinkedinIcon className="mr-2 h-4 w-4" />
              <span>LinkedIn (shreyvats01)</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
