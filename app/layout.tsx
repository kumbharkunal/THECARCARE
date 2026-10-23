import type { Metadata, Viewport } from "next";
import { Anek_Devanagari, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "lenis/dist/lenis.css";
import "./globals.css";
import { site } from "@/content/site";
import { Providers } from "@/components/shell/Providers";
import { Nav } from "@/components/shell/Nav";
import { WhatsAppFab } from "@/components/shell/WhatsAppFab";
import { InsightsIsland } from "@/components/shell/Insights";

// Archivo cut to the axis ranges and characters the site uses (scripts/build-fonts.mjs).
const archivo = localFont({
  src: "../assets/fonts/Archivo-Latin-VF.woff2",
  weight: "400 800",
  variable: "--font-archivo",
  display: "swap",
  adjustFontFallback: "Arial",
});
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap", preload: false });
const anek = Anek_Devanagari({
  subsets: ["devanagari"],
  weight: "600",
  variable: "--font-anek",
  display: "swap",
  preload: false,
});

const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.meta.title,
  description: site.meta.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  robots: allowIndexing
    ? { index: true, follow: true }
    : { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: site.meta.title,
    description: site.meta.description,
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title: site.meta.title, description: site.meta.description },
  formatDetection: { telephone: false, email: false, address: false },
  category: "automotive",
};

export const viewport: Viewport = {
  themeColor: "#F6F8FC",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Runs before first paint: hidden pre-reveal states only apply once the js class is set.
// After the load event, fonts-late attaches the below-the-fold faces (end of globals.css).
const JS_FLAG =
  "var d=document.documentElement;d.classList.add('js');addEventListener('load',function(){d.classList.add('fonts-late')})";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${archivo.variable} ${geistMono.variable} ${anek.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          {site.a11y.skip}
        </a>
        <Providers>
          <Nav />
          {children}
          <WhatsAppFab />
          {process.env.VERCEL ? <InsightsIsland /> : null}
        </Providers>
      </body>
    </html>
  );
}
