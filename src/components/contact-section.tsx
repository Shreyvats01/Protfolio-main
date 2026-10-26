"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Copy, Mail, Send } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/icons";
import { siteConfig } from "@/lib/site-config";

export function ContactSection() {
  const [copied, setCopied] = useState(false);
  const [senderEmail, setSenderEmail] = useState("");
  const [message, setMessage] = useState("");
  const [dispatchState, setDispatchState] = useState<
    "idle" | "sending" | "sent" | "fallback"
  >("idle");

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${siteConfig.contact.email}`;
    }
  };

  const handleDirectDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setDispatchState("sending");
    try {
      const res = await fetch(siteConfig.contact.mailEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: senderEmail.trim() || "visitor@shrey.online",
          email: senderEmail.trim(),
          to: siteConfig.contact.email,
          subject: `Portfolio Inquiry from ${senderEmail.trim() || "shrey.online"}`,
          message: message.trim(),
        }),
      });

      if (res.ok) {
        setDispatchState("sent");
        setMessage("");
        setSenderEmail("");
        return;
      }
      setDispatchState("fallback");
    } catch {
      setDispatchState("fallback");
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="space-y-8 border-t border-border pt-16"
    >
      <div className="grid gap-10 lg:grid-cols-12">
        {/* Left Column: Direct Contact & Social Channels */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="font-mono text-xs text-primary">
              05 · Contact &amp; Collaboration
            </span>
            <h2
              id="contact-heading"
              className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground"
            >
              Let’s talk systems, Rust, or Solana.
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground max-w-xl">
              If you are working on low-level infrastructure, Solana on-chain
              protocols, or backend engineering—or want to discuss any of the
              repositories above—reach out directly via email or my contact
              portal.
            </p>
          </div>

          {/* Primary Email & Copy Bar */}
          <div className="rounded-lg border border-border bg-card p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="font-mono text-[11px] text-[#788391] uppercase">
                  Direct Email
                </span>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="block font-mono text-base font-medium text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
                >
                  {siteConfig.contact.email}
                </a>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  aria-label={`Copy email address ${siteConfig.contact.email}`}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-2 font-mono text-xs text-foreground transition-colors hover:border-[#36404B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-primary" />
                      <span className="text-primary">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-[#788391]" />
                      <span>Copy Address</span>
                    </>
                  )}
                </button>

                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 font-mono text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap shrink-0"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Email Me</span>
                </a>
              </div>
            </div>

            <div className="border-t border-border pt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#788391] font-mono">
              <span>Portal: contact.shrey.online</span>
              <Link
                href={siteConfig.contact.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
              >
                <span>Open contact.shrey.online</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Social Profiles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              href={siteConfig.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:border-[#36404B] hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="inline-flex items-center gap-2.5 text-sm font-medium text-foreground">
                <GithubIcon className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                <span>GitHub</span>
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 text-[#788391] group-hover:text-primary transition-colors" />
            </Link>

            <Link
              href={siteConfig.socials.x}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:border-[#36404B] hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="inline-flex items-center gap-2.5 text-sm font-medium text-foreground">
                <TwitterIcon className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                <span>X / Twitter</span>
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 text-[#788391] group-hover:text-primary transition-colors" />
            </Link>

            <Link
              href={siteConfig.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:border-[#36404B] hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="inline-flex items-center gap-2.5 text-sm font-medium text-foreground">
                <LinkedinIcon className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                <span>LinkedIn</span>
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 text-[#788391] group-hover:text-primary transition-colors" />
            </Link>
          </div>
        </div>

        {/* Right Column: Resend Endpoint Dispatch (mail.shrey.online) */}
        <div className="lg:col-span-6">
          <form
            onSubmit={handleDirectDispatch}
            className="rounded-lg border border-border bg-card p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Direct Message Dispatch
                </h3>
                <p className="text-xs text-[#788391]">
                  Routes via Resend endpoint ({siteConfig.contact.mailEndpoint})
                </p>
              </div>
              <span className="font-mono text-[11px] text-[#788391]">
                POST · JSON
              </span>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="sender-email"
                className="block font-mono text-xs text-muted-foreground"
              >
                Your Email Address
              </label>
              <input
                id="sender-email"
                type="email"
                required
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full rounded-md border border-border bg-[#0B0D0F] px-3 py-2 text-sm text-foreground placeholder:text-[#788391] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="sender-message"
                className="block font-mono text-xs text-muted-foreground"
              >
                Message / Technical Context
              </label>
              <textarea
                id="sender-message"
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Briefly describe what you're building or would like to discuss..."
                className="w-full rounded-md border border-border bg-[#0B0D0F] px-3 py-2 text-sm text-foreground placeholder:text-[#788391] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-y"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div aria-live="polite" className="text-xs font-mono">
                {dispatchState === "sent" && (
                  <span className="text-primary">
                    Message dispatched to {siteConfig.contact.email}.
                  </span>
                )}
                {dispatchState === "fallback" && (
                  <a
                    href={`mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
                      `Portfolio Inquiry from ${senderEmail || "Visitor"}`
                    )}&body=${encodeURIComponent(message)}`}
                    className="text-primary underline underline-offset-4"
                  >
                    Endpoint requires direct client — click to send in mail app →
                  </a>
                )}
                {dispatchState === "idle" && (
                  <span className="text-[#788391]">
                    Delivered directly to {siteConfig.contact.email}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={dispatchState === "sending"}
                className="inline-flex items-center gap-2 rounded-md bg-secondary border border-border px-4 py-2 font-mono text-xs font-medium text-foreground transition-colors hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 whitespace-nowrap shrink-0"
              >
                <Send className="h-3.5 w-3.5" />
                <span>
                  {dispatchState === "sending"
                    ? "Dispatching..."
                    : "Send Message"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
