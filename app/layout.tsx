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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
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
        {/* AEM Universal Editor :: Preview site URL (wkndpreview.edgepatterns.dev) */}
        <meta
          name="urn:adobe:aue:config:preview"
          content="https://wkndpreview.edgepatterns.dev"
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
        <AppHeader isPreview={process.env.AEM_USE_PREVIEW_URL === "true"} />
        {children}
      </body>
    </html>
  );
}
