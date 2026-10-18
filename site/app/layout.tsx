import type { Metadata } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/header";
import { Footer } from "@/components/shell";
import "./globals.css";

const geist = localFont({
  src: "../public/fonts/geist.woff2",
  variable: "--font-geist",
  display: "swap",
});
const mono = localFont({
  src: "../public/fonts/geist-mono.woff2",
  variable: "--font-mono",
  display: "swap",
});
export const metadata: Metadata = {
  title: {
    default: "DSA Demystified · Make algorithms make sense",
    template: "%s · DSA Demystified",
  },
  description:
    "Learn data structures and algorithms through visual lessons, pattern guides, Blind 75 and NeetCode 150 notebooks, and company interview preparation.",
};
const themeScript = `try{var t=localStorage.getItem('dsa-website-theme');document.documentElement.dataset.theme=t==='dark'?'dark':'light'}catch(e){}`;
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
