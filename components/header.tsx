"use client";

import { useState } from "react";
import { MoonIcon, SunIcon, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function Header() {
  const { setTheme, theme } = useTheme();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const routes = [
    {
      href: "/search",
      label: "Search",
    },
    {
      href: "/history",
      label: "History",
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo - always visible */}
          <Link href="/" className="text-xl md:text-2xl font-bold">
            Vocab Today
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === route.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {route.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons & Theme */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm">Sign Up</Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <DialogTitle>
                  <VisuallyHidden>Menu</VisuallyHidden>
                </DialogTitle>
                <nav className="flex flex-col gap-4 mt-8">
                  {routes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        pathname === route.href
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {route.label}
                    </Link>
                  ))}
                  <div className="h-px bg-border my-4" />
                  <Link
                    href="/sign-in"
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                  >
                    Sign Up
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
