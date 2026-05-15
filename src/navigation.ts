// src/navigation.ts
import { createSharedPathnamesNavigation } from "next-intl/navigation";

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales: ["es", "en"] as const });
