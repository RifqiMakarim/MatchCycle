"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Recycle, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";

const ROLES = [
  { id: "mitra_sisa_pangan_sppg", label: "Mitra Sisa Pangan (SPPG)" },
  { id: "mitra_sisa_pangan_sekolah", label: "Mitra Sisa Pangan (Sekolah)" },
  { id: "mitra_energy", label: "Mitra Waste-to-Energy" },
  { id: "peternak_hewan", label: "Peternak Hewan" },
  { id: "peternak_manggot", label: "Peternak Manggot" },
];

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(ROLES[0].id);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login delay
    setTimeout(() => {
        // Store selected role for the session
        localStorage.setItem("userRole", selectedRole);
        router.push("/dashboard");
    }, 800);
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
             <img src="/logo-EcoMatch.jpeg" alt="logo EcoMatch" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">EcoMatch Access</CardTitle>
            <CardDescription>Masuk untuk memonitor limbah dan dampak sirkular.</CardDescription>
          </div>
        </CardHeader>
        <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="role">Pilih Role Pengguna</Label>
                <select 
                    id="role"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                >
                    {ROLES.map((role) => (
                        <option key={role.id} value={role.id}>{role.label}</option>
                    ))}
                </select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email Dinas / Instansi</Label>
                <Input id="email" placeholder="contoh@EcoMatch.id" type="email" required />
            </div>
            <div className="space-y-2 pb-6">
                <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link href="#" className="text-xs text-primary hover:underline">Lupa password?</Link>
                </div>
                <Input id="password" type="password" placeholder="••••••••" required />
            </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full" size="lg" type="submit" disabled={loading}>
                    {loading ? "Memproses..." : "Masuk"}
                </Button>
            </CardFooter>
        </form>
      </Card>
      
      <div className="absolute bottom-4 text-center text-xs text-muted-foreground">
        &copy; 2026 EcoMatch System. Secure Login.
      </div>
    </div>
  );
}
