import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Debashrita Mishra — Senior RPA Developer",
  description:
    "Senior RPA developer building UiPath automations for banking and financial operations — REFramework, Document Understanding, SAP, and agentic automation.",
};

// Runs before paint: picks day (06:00–17:59) or night by the visitor's local time.
const themeScript = `(function(){try{var h=new Date().getHours();document.documentElement.setAttribute('data-theme',(h>=6&&h<18)?'day':'night');}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${spaceMono.variable}`}>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
      </body>
    </html>
  );
}