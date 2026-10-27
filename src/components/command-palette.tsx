"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
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
  FolderGit2,
  Home,
  Mail,
  Search,
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
  const router = useRouter();

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

  const goToRoute = (href: string) => {
    setOpen(false);
    router.push(href);
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
      }, 600);
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
        aria-label="Search pages and projects"
        className={
          triggerClassName ||
          "inline-flex h-10 w-10 sm:h-auto sm:w-auto items-center justify-center gap-2 rounded-md border border-border bg-card sm:px-2.5 sm:py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-[#36404B] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap shrink-0"
        }
      >
        <Search className="h-4 w-4 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden sm:inline-flex pointer-events-none items-center gap-0.5 rounded border border-border bg-[#0B0D0F] px-1.5 py-0.5 font-mono text-[10px] text-[#788391]">
          {isMac ? "⌘K" : "Ctrl K"}
        </kbd>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Navigate Portfolio"
        description="Jump to pages, project details, or contact links"
      >
        <CommandInput placeholder="Go to page or project..." />
        <CommandList>
          <CommandEmpty>No matching pages or projects.</CommandEmpty>

          <CommandGroup heading="Pages">
            <CommandItem onSelect={() => goToRoute("/")}>
              <Home className="mr-2 h-4 w-4" />
              <span>Home</span>
              <CommandShortcut>/</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => goToRoute("/projects")}>
              <Code2 className="mr-2 h-4 w-4 text-primary" />
              <span>Projects</span>
              <CommandShortcut>/projects</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => goToRoute("/about")}>
              <User className="mr-2 h-4 w-4" />
              <span>About</span>
              <CommandShortcut>/about</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => goToRoute("/activity")}>
              <Activity className="mr-2 h-4 w-4" />
              <span>GitHub Activity</span>
              <CommandShortcut>/activity</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => goToRoute("/contact")}>
              <Mail className="mr-2 h-4 w-4" />
              <span>Contact</span>
              <CommandShortcut>/contact</CommandShortcut>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Projects">
            {projectsData.map((project) => (
              <CommandItem
                key={project.id}
                onSelect={() => goToRoute(`/projects/${project.id}`)}
              >
                <FolderGit2 className="mr-2 h-4 w-4 text-[#788391]" />
                <span>{project.title}</span>
                <CommandShortcut className="hidden sm:inline">
                  /projects/{project.id}
                </CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Contact & Profiles">
            <CommandItem onSelect={handleCopyEmail}>
              {copied ? (
                <Check className="mr-2 h-4 w-4 text-primary" />
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}
              <span className="truncate">
                {copied
                  ? `Copied ${siteConfig.contact.email}`
                  : `Copy email (${siteConfig.contact.email})`}
              </span>
            </CommandItem>
            <CommandItem onSelect={() => openExternal(siteConfig.socials.github)}>
              <GithubIcon className="mr-2 h-4 w-4" />
              <span>GitHub (@shreyvats01)</span>
              <ArrowUpRight className="ml-auto h-3.5 w-3.5 text-[#788391]" />
            </CommandItem>
            <CommandItem onSelect={() => openExternal(siteConfig.socials.x)}>
              <TwitterIcon className="mr-2 h-4 w-4" />
              <span>X (@shreyvats01)</span>
              <ArrowUpRight className="ml-auto h-3.5 w-3.5 text-[#788391]" />
            </CommandItem>
            <CommandItem
              onSelect={() => openExternal(siteConfig.socials.linkedin)}
            >
              <LinkedinIcon className="mr-2 h-4 w-4" />
              <span>LinkedIn (shreyvats01)</span>
              <ArrowUpRight className="ml-auto h-3.5 w-3.5 text-[#788391]" />
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
