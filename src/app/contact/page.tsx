import type { Metadata } from "next";
import { ContactSection } from "@/components/contact-section";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Shrey Vats via email, GitHub, X, or LinkedIn.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-2 border-b border-border pb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Contact
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
          {siteConfig.contactIntro}
        </p>
      </header>

      <ContactSection />
    </div>
  );
}
