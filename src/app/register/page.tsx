"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useTransition } from "react";
import { register } from "@/app/actions/auth";

export default function RegisterPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await register(formData);
      if (res?.error) {
        setError(res.error);
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="absolute top-8 left-8">
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" /> Kembali
        </Link>
      </div>
      
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary my-12">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
             <img src="/logo-MatchCycle.jpeg" alt="logo MatchCycle" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Daftar MatchCycle</CardTitle>
            <CardDescription>Buat akun untuk memonitor limbah dan dampak sirkular.</CardDescription>
          </div>
        </CardHeader>
        <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/50 dark:text-red-200">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
                <Label htmlFor="role">Role Pengguna</Label>
                <select 
                    id="role"
                    name="role"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                >
                    <option value="sppg">Mitra Sisa Pangan (SPPG)</option>
                    <option value="sekolah">Sekolah (Penghasil Limbah)</option>
                    <option value="peternak_manggot">Peternak Maggot</option>
                    <option value="peternak_hewan">Peternak Hewan</option>
                    <option value="waste_to_energy">Mitra Waste-to-Energy</option>
                </select>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="name">Nama Instansi / Entitas</Label>
                <Input id="name" name="name" placeholder="Nama Anda" required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="city">Wilayah (Kota/Kabupaten)</Label>
                <select 
                    id="city"
                    name="city"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                >
                    <option value="Slawi">Slawi</option>
                    <option value="Adiwerna">Adiwerna</option>
                    <option value="Talang">Talang</option>
                    <option value="Dukuhturi">Dukuhturi</option>
                </select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="address">Alamat Detail</Label>
                <Input id="address" name="address" placeholder="Jalan Raya..." required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" placeholder="contoh@MatchCycle.id" type="email" required />
            </div>
            <div className="space-y-2 pb-6">
                <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" name="password" type="password" placeholder="••••••••" required minLength={6} />
            </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
                <Button className="w-full" size="lg" type="submit" disabled={isPending}>
                    {isPending ? "Mendaftar..." : "Daftar"}
                </Button>
                <div className="text-sm text-center text-muted-foreground">
                    Sudah punya akun? <Link href="/login" className="text-primary hover:underline">Masuk</Link>
                </div>
            </CardFooter>
        </form>
      </Card>
      
      <div className="mt-4 mb-4 text-center text-xs text-muted-foreground">
        &copy; 2026 MatchCycle System. Secure Login.
      </div>
    </div>
  );
}
