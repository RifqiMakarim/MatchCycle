"use client";

import { useTransition, useState } from "react";
import { submitWasteRequest } from "@/app/actions/matchmaking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

export function SubmitWasteForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const formData = new FormData(e.currentTarget);
    const volume = Number(formData.get("volume"));
    
    startTransition(async () => {
      const res = await submitWasteRequest(volume);
      if (res?.error) {
        setError(res.error);
      } else {
        setSuccess("Limbah berhasil disubmit dan dicarikan mitra (matchmaking)!");
        (e.target as HTMLFormElement).reset();
      }
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Submit Sisa Pangan
        </CardTitle>
        <CardDescription>
          Masukkan estimasi volume sisa pangan hari ini (Kg) untuk dicarikan mitra peternak Maggot terdekat.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-700 border border-green-200">
              {success}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="volume">Volume (Kg)</Label>
            <Input 
                id="volume" 
                name="volume" 
                type="number" 
                min="1" 
                placeholder="Contoh: 50" 
                required 
                disabled={isPending}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isPending} className="w-full shadow-md animate-pulse">
            {isPending ? "Memproses Matchmaking..." : "Cari Mitra Sekarang"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
