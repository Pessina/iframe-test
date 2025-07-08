import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "./providers/WalletProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "iFrame dApp",
  description: "Solana dApp in iFrame",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Suppress cross-origin errors in iframe
              (function() {
                // Handle global errors
                window.addEventListener('error', function(e) {
                  if (e.message && 
                      (e.message.includes('cross-origin') || 
                       e.message.includes('Blocked a frame') ||
                       e.message.includes('origin'))) {
                    e.preventDefault();
                    return false;
                  }
                });
                
                // Handle unhandled promise rejections
                window.addEventListener('unhandledrejection', function(e) {
                  if (e.reason && e.reason.message &&
                      (e.reason.message.includes('cross-origin') ||
                       e.reason.message.includes('Blocked a frame') ||
                       e.reason.message.includes('origin'))) {
                    e.preventDefault();
                  }
                });
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
