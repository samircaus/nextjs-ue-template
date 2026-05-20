import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import AppHeader from "./components/Header";

/** AEM URL for Universal Editor connection (e.g. https://localhost:8443 or your AEM Author URL). */
const AEM_UE_CONNECTION =
  process.env.AEM_UE_CONNECTION ?? "https://localhost:8443";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "WKND - Adventure & Travel Magazine",
  description: "Stories and adventures for the weekend enthusiast. Magazine articles and curated trips.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { headers } = await import("next/headers");
  const h = await headers();
  const origin = h.get("x-origin") ?? "https://wknd.edgepatterns.dev";
  const pathname = h.get("x-pathname") ?? "/";
  const loginToken = h.get("x-aem-login-token") ?? "";
  // When inside UE (login-token present), send the preview to author via mode=author-preview + token.
  // Without a token we can't authenticate to author, so just point to the plain publish URL.
  const previewUrl = loginToken
    ? `${origin}${pathname}?mode=author-preview&login-token=${loginToken}`
    : `${origin}${pathname}?mode=author-preview`;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme on load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var s=localStorage.getItem('theme');if(s==='dark'||(s===null&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}})()`,
          }}
        />
        {/* AEM Universal Editor :: CORE Library – communication layer between app and Universal Editor */}
        <Script
          src="https://universal-editor-service.adobe.io/cors.js"
          strategy="afterInteractive"
        />
        {/* AEM Universal Editor :: Connection metadata – content source for editing */}
        <meta
          name="urn:adobe:aue:system:aemconnection"
          content={`aem:${AEM_UE_CONNECTION}`}
        />
        {/* AEM Universal Editor :: "Preview" button destination – current page on Publish with author-preview mode */}
        <meta
          name="urn:adobe:aue:config:preview"
          content={previewUrl}
        />
        {/* AEM Universal Editor :: Component definition (Content Fragments) */}
        <script
          type="application/vnd.adobe.aue.component+json"
          src="/component-definition.json"
        ></script>
        {/* AEM Universal Editor :: Model definitions for properties panel */}
        <script
          type="application/vnd.adobe.aue.model+json"
          src="/model-definition.json"
        ></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
