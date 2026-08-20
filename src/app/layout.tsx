import type { Metadata } from "next";
import type { ReactNode } from "react";
import Providers from "../providers";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.feetchy.com"),
};

import "../styles/style.css";
import "../styles/responsive.css";
import "../styles/swiper.css";
import "../styles/bootstrap.min.css";
import "../styles/font-awesome.min.css";
import "../styles/linearicons-icon-font.min.css";
import "../styles/custom.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}