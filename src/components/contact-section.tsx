"use client";

import React, { useState } from "react";
import { ArrowUpRight, Check, Copy, Mail, Send } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/lib/site-config";

export function ContactSection() {
  const [copied, setCopied] = useState(false);
  const [senderEmail, setSenderEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "fallback" | "invalid"
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = senderEmail.trim();
    const trimmedMessage = message.trim();

    if (
      !trimmedEmail ||
      !trimmedEmail.includes("@") ||
      trimmedMessage.length < 5
    ) {
      setStatus("invalid");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(siteConfig.contact.mailEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: trimmedEmail,
          email: trimmedEmail,
          to: siteConfig.contact.email,
          subject: `Message from ${trimmedEmail}`,
          message: trimmedMessage,
        }),
      });

      if (res.ok) {
        setStatus("sent");
        setSenderEmail("");
        setMessage("");
        return;
      }
      setStatus("fallback");
    } catch {
      setStatus("fallback");
    }
  };

  return (
    <div className="grid gap-10 md:grid-cols-12">
      {/* Direct Contact Details */}
      <div className="md:col-span-5 space-y-6">
        <div className="rounded-lg border border-border bg-card p-5 space-y-4">
          <div className="space-y-1">
            <span className="font-mono text-xs text-muted-subtle">Email</span>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="block font-mono text-sm font-medium text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            >
              {siteConfig.contact.email}
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="inline-flex min-h-[44px] sm:min-h-[36px] items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 sm:py-1.5 font-mono text-xs font-semibold text-primary-foreground transition-all duration-150 ease-[var(--ease-out-expo)] hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap shrink-0"
            >
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Open Mail App</span>
            </a>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex min-h-[44px] sm:min-h-[36px] items-center gap-1.5 rounded-md border border-border bg-secondary px-3.5 py-2 sm:py-1.5 font-mono text-xs text-foreground transition-all duration-150 ease-[var(--ease-out-expo)] hover:border-foreground/30 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap shrink-0"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  <span className="text-primary font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-muted-subtle" aria-hidden="true" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-2">
          <span className="block font-mono text-xs text-muted-subtle">
            Profiles
          </span>
          <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
            <a
              href={siteConfig.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-[48px] items-center justify-between px-4 py-3 text-sm text-foreground transition-colors duration-150 hover:bg-secondary/60 active:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
            >
              <span className="inline-flex items-center gap-2.5">
                <GithubIcon className="h-4 w-4 text-muted-foreground transition-colors duration-150 group-hover:text-foreground" />
                <span>GitHub</span>
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-subtle group-hover:text-primary transition-colors duration-150">
                <span>@shreyvats01</span>
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </span>
            </a>

            <a
              href={siteConfig.socials.x}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-[48px] items-center justify-between px-4 py-3 text-sm text-foreground transition-colors duration-150 hover:bg-secondary/60 active:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
            >
              <span className="inline-flex items-center gap-2.5">
                <TwitterIcon className="h-4 w-4 text-muted-foreground transition-colors duration-150 group-hover:text-foreground" />
                <span>X</span>
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-subtle group-hover:text-primary transition-colors duration-150">
                <span>@shreyvats01</span>
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </span>
            </a>

            <a
              href={siteConfig.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-[48px] items-center justify-between px-4 py-3 text-sm text-foreground transition-colors duration-150 hover:bg-secondary/60 active:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
            >
              <span className="inline-flex items-center gap-2.5">
                <LinkedinIcon className="h-4 w-4 text-muted-foreground transition-colors duration-150 group-hover:text-foreground" />
                <span>LinkedIn</span>
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-subtle group-hover:text-primary transition-colors duration-150">
                <span>shreyvats01</span>
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Simple Message Form */}
      <div className="md:col-span-7">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-lg border border-border bg-card p-5 sm:p-6 space-y-4"
        >
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-foreground">
              Send a message
            </h2>
            <p className="text-xs text-muted-foreground">
              Messages route through {siteConfig.contact.mailEndpoint} or open
              in your default email client if offline.
            </p>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="contact-email"
              className="block font-mono text-xs text-muted-foreground"
            >
              Your email
            </label>
            <Input
              id="contact-email"
              type="email"
              required
              value={senderEmail}
              onChange={(e) => {
                setSenderEmail(e.target.value);
                if (status === "invalid") setStatus("idle");
              }}
              placeholder="you@example.com"
              className="min-h-[44px] sm:min-h-[36px]"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="contact-message"
              className="block font-mono text-xs text-muted-foreground"
            >
              Message
            </label>
            <Textarea
              id="contact-message"
              rows={4}
              required
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (status === "invalid") setStatus("idle");
              }}
              placeholder="What would you like to discuss?"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div aria-live="polite" className="font-mono text-xs">
              {status === "invalid" && (
                <span className="text-destructive">
                  Please enter a valid email and a short message.
                </span>
              )}
              {status === "sent" && (
                <span className="text-primary">
                  Message confirmed and delivered.
                </span>
              )}
              {status === "fallback" && (
                <a
                  href={`mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
                    `Message from ${senderEmail || "Portfolio"}`
                  )}&body=${encodeURIComponent(message)}`}
                  className="text-primary underline underline-offset-4"
                >
                  Direct endpoint unreachable — click to send via email app →
                </a>
              )}
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="group inline-flex min-h-[44px] sm:min-h-[38px] items-center gap-2 rounded-md border border-border bg-secondary px-4 py-2 font-mono text-xs font-medium text-foreground transition-all duration-150 ease-[var(--ease-out-expo)] hover:border-primary/50 hover:text-primary active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 whitespace-nowrap shrink-0"
            >
              <Send
                className="h-3.5 w-3.5 transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
              <span>{status === "sending" ? "Sending..." : "Send"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
