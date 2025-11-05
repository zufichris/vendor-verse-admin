import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { getLoggedInUser } from "@/lib/actions/auth.actions";
import { LoginForm } from "@/components/auth/login-form";
import { Toaster } from "@/components/ui/sonner";
import { redirect } from "next/navigation";
import Header from "@/components/layout/header";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Vendor Verse Admin",
    description: "Admin dashboard for managing Vendor Verse",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const result = await getLoggedInUser();
    // if (!result.success || !result.data) {
    //     redirect('/auth/login')
    // }

    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased p-2 md:p-4 lg:p-8 bg-background text-foreground`}
            >
                <Toaster />
                <header className="mb-4">
                    <Header />
                </header>
                <main>{children}</main>
            </body>
        </html>
    );
}
