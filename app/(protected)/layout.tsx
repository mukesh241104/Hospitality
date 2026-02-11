import { Navbar } from "@/components/navbar";
import { HotelProvider } from "@/contexts/hotel-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <TooltipProvider>
      <HotelProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar user={user ? { email: user.email as string } : null} />

          <main className="flex-1">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              {children}
            </div>
          </main>

          <footer className="border-t py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
              <p className="text-sm text-muted-foreground">
                © 2026 Hospitality. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </HotelProvider>
    </TooltipProvider>
  );
}
