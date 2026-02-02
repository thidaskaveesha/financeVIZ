import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "FinanceVIZ",
  description:
    "FinanceVIZ is a finance data visualization web app that allows users to add transactions and make informed decisions using powerful charting tools. AI helps analyze spending habits and provides actionable insights. FinanceVIZ also provides an API for users to build their own applications to collect data, while all visualization and decision-making are handled by FinanceVIZ.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
