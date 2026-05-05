"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Mail, Phone, MapPin, Building, BadgeCheck, School, Utensils, Loader2, Edit2 } from "lucide-react";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  
  const [isEditingCapacity, setIsEditingCapacity] = useState(false);
  const [newCapacity, setNewCapacity] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveCapacity = async () => {
    if (!profile) return;
    setIsSaving(true);
    const capacityNum = parseInt(newCapacity);
    if (isNaN(capacityNum) || capacityNum < 0) {
       setIsSaving(false);
       return;
    }
    
    const { error } = await supabase.from('users').update({ capacity: capacityNum }).eq('id', profile.id);
    if (!error) {
       setProfile({ ...profile, capacity: capacityNum });
       setIsEditingCapacity(false);
    } else {
       console.error("Error updating capacity:", error);
    }
    setIsSaving(false);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        router.push("/login");
        return;
      }

      const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single();
      
      if (userData) {
        setProfile({
          ...userData,
          email: user.email,
          createdAt: user.created_at,
        });
      }
      setLoading(false);
    };

    fetchProfile();
  }, [router, supabase]);

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-slate-50">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
      )
  }

  if (!profile) return null;

  const isSppg = profile.role === "sppg";
  const isSchool = profile.role === "sekolah";
  const Icon = isSppg ? Utensils : isSchool ? School : Building;
  const avatarSrc = isSppg ? "/sppg-logo.png" : isSchool ? "/tutwuri-logo.png" : "/logo-matchgate.png";

  const getCapacityLabel = () => {
    if (isSchool) return "Kapasitas Limbah Harian";
    if (isSppg) return "Kapasitas Sisa Pangan";
    if (profile.role === 'waste_to_energy') return "Kapasitas Serap Limbah";
    return "Kapasitas Produksi / Stok";
  };

  const getRoleDisplayName = (role: string) => {
      const names: Record<string, string> = {
          'sppg': 'Mitra SPPG',
          'sekolah': 'Institusi Pendidikan (Sekolah)',
          'peternak_manggot': 'Peternakan Maggot',
          'peternak_hewan': 'Peternakan Hewan',
          'waste_to_energy': 'Mitra Waste-to-Energy'
      };
      return names[role] || role;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
       <header className="sticky top-0 z-40 w-full border-b bg-white dark:bg-slate-900 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
           <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
               <ArrowLeft className="h-4 w-4" /> Kembali
           </Link>
        </div>
        <div className="font-bold">Profil Pengguna</div>
        <div className="w-8"></div>
      </header>
      
      <main className="flex-1 container mx-auto p-4 md:p-8 flex flex-col items-center">
         <Card className="w-full max-w-2xl overflow-hidden">
             <div className="h-32 bg-primary/10 w-full relative">
                 <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#444 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
             </div>
             <div className="px-8 pb-8">
                 <div className="relative -mt-16 mb-6 flex justify-between items-end">
                     <div className="rounded-full p-2 bg-white dark:bg-slate-900 shadow-xl">
                        <Avatar className="h-32 w-32 border-4 border-white dark:border-slate-900">
                            <AvatarImage src={avatarSrc} alt={profile.name} className="object-cover bg-white p-2" />
                            <AvatarFallback className="text-4xl bg-primary text-white">
                                <Icon className="h-12 w-12" />
                            </AvatarFallback>
                        </Avatar>
                     </div>
                     <Button variant="outline">Edit Profil</Button>
                 </div>
                 
                 <div className="space-y-6">
                     <div>
                         <h1 className="text-3xl font-bold flex items-center gap-2">
                             {profile.name}
                             <BadgeCheck className="h-6 w-6 text-blue-500" />
                         </h1>
                         <p className="text-muted-foreground flex items-center gap-2 mt-1">
                             <MapPin className="h-4 w-4" /> {profile.address}, {profile.city}
                         </p>
                         <Badge className="mt-3 text-sm px-3 py-1" variant="secondary">{getRoleDisplayName(profile.role)}</Badge>
                     </div>
                     
                     <div className="grid md:grid-cols-2 gap-4">
                         <Card className="bg-slate-50 dark:bg-slate-900 border-none">
                             <CardContent className="p-4 space-y-3">
                                 <div className="flex items-center gap-3">
                                     <Mail className="h-5 w-5 text-muted-foreground" />
                                     <span className="text-sm">{profile.email}</span>
                                 </div>
                                 <div className="flex items-center gap-3">
                                     <Building className="h-5 w-5 text-muted-foreground" />
                                     <span className="text-sm">Terdaftar: {new Date(profile.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}</span>
                                 </div>
                             </CardContent>
                         </Card>
                         
                         <Card className="bg-slate-50 dark:bg-slate-900 border-none">
                            <CardContent className="p-4">
                                <h3 className="font-semibold mb-2">Statistik Kontribusi</h3>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Status Akun</span>
                                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">Verified Partner</Badge>
                                    </li>
                                </ul>
                            </CardContent>
                         </Card>
                     </div>
                     
                     <div className="pt-6 border-t">
                         <h3 className="font-semibold mb-4">Informasi Operasional</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-4 border rounded-lg bg-white shadow-sm">
                                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">{getCapacityLabel()}</div>
                                   {isEditingCapacity ? (
                                       <div className="flex flex-wrap items-center gap-2 mt-1">
                                           <div className="flex items-center gap-2">
                                               <Input 
                                                   type="number" 
                                                   className="w-24 font-bold text-lg h-9" 
                                                   value={newCapacity} 
                                                   onChange={(e) => setNewCapacity(e.target.value)} 
                                                   disabled={isSaving}
                                               />
                                               <span className="text-sm text-muted-foreground font-medium mr-2">Kg</span>
                                           </div>
                                           <div className="flex items-center gap-2">
                                               <Button size="sm" onClick={handleSaveCapacity} disabled={isSaving}>
                                                   {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Simpan"}
                                               </Button>
                                               <Button size="sm" variant="ghost" onClick={() => setIsEditingCapacity(false)} disabled={isSaving}>Batal</Button>
                                           </div>
                                       </div>
                                   ) : (
                                      <div className="flex justify-between items-end mt-1">
                                          <div className="font-bold text-3xl text-primary">{profile.capacity} <span className="text-base text-muted-foreground font-medium">Kg</span></div>
                                          <Button variant="ghost" size="sm" className="h-8 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50" onClick={() => { setIsEditingCapacity(true); setNewCapacity(profile.capacity.toString()); }}>
                                              <Edit2 className="h-3 w-3 mr-1" /> Edit
                                          </Button>
                                      </div>
                                  )}
                              </div>
                              <div className="p-3 border rounded-lg bg-white">
                                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Wilayah Operasional</div>
                                  <div className="font-bold text-lg mt-1">{profile.city}</div>
                              </div>
                          </div>
                     </div>
                 </div>
             </div>
         </Card>
      </main>
    </div>
  );
}
