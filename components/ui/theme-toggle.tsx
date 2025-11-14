'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/components/providers/theme-provider';
import { Button } from './button';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { isDark, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full hover:bg-frost-1/10 transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-frost-1" />
      ) : (
        <Moon className="w-5 h-5 text-frost-1" />
      )}
    </Button>
  );
}
