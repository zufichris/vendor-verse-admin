import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { getLoggedInUser } from "@/lib/actions/auth.actions";
import { LoginForm } from "@/components/auth/login-form";

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
    if (!result.success) {
        return (
            <html lang="en">
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased p-2 md:p-4 lg:p-8 bg-background text-foreground`}
                >
                    <main className="flex items-center justify-center h-screen">
                        <LoginForm />
                    </main>
                </body>
            </html>
        );
    }
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased p-2 md:p-4 lg:p-8 bg-background text-foreground`}
            >
                <header className="mb-4">
                    <nav className="flex flex-col md:flex-row items-center justify-between">
                        <div className="flex items-center justify-between">
                            <Link href={"/"} className="text-5xl font-bold">
                                LOGO
                            </Link>
                        </div>
                        <div className="flex space-x-4">
                            <Link href={"/products"}>Prodcts</Link>
                            <Link href={"/categories"}>Categories</Link>
                            <Link href={"/users"}>Users</Link>
                            <Link href={"/orders"}>Orders</Link>
                            <Link href={"/banners"}>Banners</Link>
                        </div>
                    </nav>
                </header>
                <main>{children}</main>
            </body>
        </html>
    );
}
