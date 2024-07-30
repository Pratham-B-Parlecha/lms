"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

export const NavbarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPages = pathname?.startsWith("/teacher");
  const isPlayerPages = pathname?.includes("/courses");
  return (
    <div className="flex gap-x-2 ml-auto">
      {isTeacherPages || isPlayerPages ? (
        <Link href="/">
          <Button size="sm" variant="ghost">
            <LogOut className="h-4 w-4 mr-2" />
          </Button>
        </Link>
      ) : (
        <Link href="/teacher/courses">
          <Button size="sm" variant="ghost">
            Teacher Mode
          </Button>
        </Link>
      )}
      <UserButton />
    </div>
  );
};
