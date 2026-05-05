"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useTransition } from "react";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await login(formData);
      if (res?.error) {
        setError(res.error);
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="absolute top-8 left-8">
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" /> Kembali
        </Link>
      </div>
      
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
             <img src="/logo-MatchCycle.jpeg" alt="logo MatchCycle" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">MatchCycle Access</CardTitle>
            <CardDescription>Masuk untuk memonitor limbah dan dampak sirkular.</CardDescription>
          </div>
        </CardHeader>
        <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/50 dark:text-red-200">
                {error}
              </div>
            )}
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" placeholder="contoh@MatchCycle.id" type="email" required />
            </div>
            <div className="space-y-2 pb-6">
                <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" name="password" type="password" placeholder="••••••••" required />
            </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
                <Button className="w-full" size="lg" type="submit" disabled={isPending}>
                    {isPending ? "Memproses..." : "Masuk"}
                </Button>
                <div className="text-sm text-center text-muted-foreground">
                    Belum punya akun? <Link href="/register" className="text-primary hover:underline">Daftar</Link>
                </div>
            </CardFooter>
        </form>
      </Card>
      
      <div className="absolute bottom-4 text-center text-xs text-muted-foreground">
        &copy; 2026 MatchCycle System. Secure Login.
      </div>
    </div>
  );
}
