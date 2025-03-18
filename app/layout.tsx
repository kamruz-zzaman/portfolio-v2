import type React from "react";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth-provider";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { NavigationLoader } from "@/components/navigation-loader";
import { autoSeedDatabase } from "@/lib/auto-seed";
import { Suspense } from "react";

// Run database seeding in development mode
// if (process.env.NODE_ENV === "development") {
//   autoSeedDatabase().catch(console.error)
// }

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Kamruz - Full Stack Developer",
  description:
    "Portfolio website of Kamruz, a Full Stack Developer specializing in modern web applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background`}>
        <Suspense fallback={null}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <NavigationLoader />
              <div className="flex min-h-screen flex-col">
                <Header />
                {children}
                <Footer />
              </div>
              <Toaster />
            </AuthProvider>
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}
