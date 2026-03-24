import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { PreferencesProvider } from "@/components/preferences-provider";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "자격증 도우미",
    template: "%s · 자격증 도우미",
  },
  description:
    "자격증별 모의고사로 실력을 점검하세요. 빠른 진단, 약점 분석, 실전 대비.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full antialiased`}>
      <body className="min-h-full bg-zinc-50 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
        <PreferencesProvider>
          <div className="flex min-h-full flex-col">{children}</div>
        </PreferencesProvider>
      </body>
    </html>
  );
}
