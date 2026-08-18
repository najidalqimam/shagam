"use client";

import { buildContactChannels } from "@/lib/contact";
import { useLocale } from "./LocaleProvider";
import { useSiteContent } from "./SiteContentProvider";

function ChannelIcon({ id }: { id: string }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "h-5 w-5",
    fill: "currentColor",
    "aria-hidden": true as const,
  };

  switch (id) {
    case "email":
      return (
        <svg {...common}>
          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z" />
        </svg>
      );
    case "phone":
      return (
        <svg {...common}>
          <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg {...common}>
          <path d="M12.04 2C6.5 2 2 6.46 2 11.96c0 1.75.46 3.45 1.34 4.95L2 22l5.26-1.38a10 10 0 0 0 4.78 1.22h.01c5.54 0 10.04-4.46 10.04-9.96C22.09 6.46 17.58 2 12.04 2zm5.52 14.24c-.23.65-1.35 1.2-1.88 1.28-.48.07-1.1.1-1.77-.11-.41-.13-.93-.3-1.6-.59-2.82-1.22-4.65-4.07-4.79-4.26-.14-.19-1.15-1.53-1.15-2.92 0-1.39.73-2.07.99-2.36.26-.28.57-.35.76-.35h.54c.18 0 .41-.07.64.49.24.58.8 2 .87 2.14.07.14.12.31.02.5-.1.19-.15.31-.3.48-.14.16-.3.36-.43.49-.14.13-.29.27-.12.53.16.26.72 1.19 1.55 1.93 1.06.95 1.96 1.24 2.23 1.38.28.14.44.12.6-.07.16-.19.7-.81.88-1.09.19-.28.37-.23.62-.14.26.1 1.63.77 1.91.91.28.14.47.21.54.33.07.11.07.66-.16 1.31z" />
        </svg>
      );
    case "facebookUrl":
      return (
        <svg {...common}>
          <path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.03H7.9v-2.9h2.4V9.85c0-2.37 1.4-3.69 3.56-3.69 1.03 0 2.11.19 2.11.19v2.33h-1.19c-1.17 0-1.54.73-1.54 1.48v1.78h2.62l-.42 2.9h-2.2V22c4.78-.75 8.44-4.91 8.44-9.93z" />
        </svg>
      );
    case "instagramUrl":
      return (
        <svg {...common}>
          <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
        </svg>
      );
    case "twitterUrl":
      return (
        <svg {...common}>
          <path d="M18.9 2H22l-6.8 7.77L23.2 22h-6.4l-5-6.55L5.9 22H2.1l7.27-8.31L.8 2h6.55l4.52 5.98L18.9 2zm-1.12 18h1.78L6.34 3.9H4.43L17.78 20z" />
        </svg>
      );
    case "linkedinUrl":
      return (
        <svg {...common}>
          <path d="M6.94 6.5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0zM3.5 9.25h3V21h-3V9.25zM9.75 9.25h2.88v1.6h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.6V21h-3v-5.8c0-1.38-.02-3.16-1.93-3.16-1.93 0-2.22 1.5-2.22 3.06V21h-3V9.25z" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}

export function ContactChannels({
  className = "",
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  const { settings } = useSiteContent();
  const { t } = useLocale();

  const channels = buildContactChannels(
    settings,
    {
      email: t.contactEmailLabel,
      phone: t.contactPhoneLabel,
      whatsapp: t.contactWhatsappLabel,
      facebook: t.contactFacebook,
      instagram: t.contactInstagram,
      twitter: t.contactTwitter,
      linkedin: t.contactLinkedin,
    },
    t.whatsappPrefill,
  );

  if (channels.length === 0) return null;

  const isLight = tone === "light";

  return (
    <div className={className}>
      <p
        className={`mb-4 font-display text-[0.75rem] tracking-[0.28em] ${
          isLight ? "text-brand" : "text-sand"
        }`}
      >
        {t.contactChannelsTitle}
      </p>
      <ul className="flex flex-wrap gap-2.5">
        {channels.map((channel) => (
          <li key={channel.id}>
            <a
              href={channel.href}
              aria-label={channel.label}
              title={channel.label}
              {...(channel.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition ${
                isLight
                  ? "border-brand/20 bg-white text-brand hover:border-brand hover:bg-brand hover:text-ink"
                  : channel.id === "whatsapp"
                    ? "border-[#25D366]/50 bg-[#25D366]/15 text-[#25D366] hover:bg-[#25D366] hover:text-white"
                    : "border-line bg-white/5 text-ink hover:border-sand/50 hover:text-sand"
              }`}
            >
              <ChannelIcon id={channel.id} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
