import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";
import { Building2, Search, GitCompareArrows, Shield } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"} className="text-lg">Hospitality</Link>
            </div>
            <div className="flex items-center gap-2">
              <ThemeSwitcher />
              <Suspense>
                <AuthButton />
              </Suspense>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="w-full flex flex-col items-center justify-center px-5 py-24 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Building2 className="h-4 w-4" />
            Powered by Hotelbeds API
          </div>
          <h1 className="mb-6 max-w-4xl bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl lg:text-7xl">
            Find & Compare Hotels Worldwide
          </h1>
          <p className="mb-10 max-w-2xl text-lg text-muted-foreground">
            Search through thousands of hotels, filter by destination and amenities,
            and compare side-by-side with interactive charts.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/hotels">
                <Search className="mr-2 h-5 w-5" />
                Search Hotels
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/sign-up">
                Get Started
              </Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full max-w-7xl px-5 py-16">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border bg-card p-6">
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Smart Search</h3>
              <p className="text-muted-foreground">
                Filter hotels by destination, country, and category. Find exactly what you&apos;re looking for.
              </p>
            </div>
            <div className="rounded-2xl border bg-card p-6">
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                <GitCompareArrows className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Compare Hotels</h3>
              <p className="text-muted-foreground">
                Select up to 4 hotels and compare them side-by-side with interactive charts and tables.
              </p>
            </div>
            <div className="rounded-2xl border bg-card p-6">
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Secure Auth</h3>
              <p className="text-muted-foreground">
                Your account is protected with secure authentication. Your selections are saved.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full flex items-center justify-center border-t text-center text-xs py-6 mt-auto">
          <p className="text-muted-foreground">
            © 2026 Hospitality. All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  );
}
