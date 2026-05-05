"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Truck, CheckCircle2, X, Send, Calendar, Clock, DollarSign, User, MessageSquare } from "lucide-react";

// Mock Chat Initial Messages
const INITIAL_CHATS = [
  { sender: "partner", text: "Halo, apakah stok limbah hari ini masih tersedia?" },
];

import { REGIONAL_ENTITIES, CITY_COORDINATES, RegionalEntity, EntityRole } from "@/lib/regional-data";
import { createClient } from "@/utils/supabase/client";
import { submitDirectMatch } from "@/app/actions/matchmaking";

type MatchmakingPartner = {
  id: string;
  name: string;
  role: string;
  category: string;
  stock: string;
  avatar: string;
  distance: string;
  mapLat: number;
  mapLng: number;
  lat?: number;
  lng?: number;
  is_online?: boolean;
};

export function MatchmakingPanel({ userId, userRole, onClose, location = "Slawi" }: { userId: string, userRole: string, onClose: () => void, location?: string }) {
  const supabase = createClient();
  const [selectedPartner, setSelectedPartner] = useState<MatchmakingPartner | null>(null);
  const [step, setStep] = useState<"search" | "negotiate" | "waiting" | "success">("search");
  
  // Negotiation State
  const [chats, setChats] = useState<{sender: string, text: string}[]>([]);
  const [inputText, setInputText] = useState("");
  const [appointment, setAppointment] = useState({ date: "", time: "", location: "" });
  const [transactionDetails, setTransactionDetails] = useState<{ quantity: string, productType: string }>({ quantity: "", productType: "" });
  const scrollRef = useRef<HTMLDivElement>(null);

  const [partners, setPartners] = useState<MatchmakingPartner[]>([]);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Matchmaking
  useEffect(() => {
    let subscription: any;

    const initMatchmaking = async () => {
      setIsLoading(true);
      
      // 1. Get Real Location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLocation({ lat, lng });

          // 2. Register/Upsert to Supabase
          const mockNames: Record<string, string> = {
            sppg: "Bank Sampah SPPG",
            peternak_manggot: "Peternak Maggot Sejahtera",
            mitra_sisa_pangan: "Mitra Sisa Pangan",
            sekolah: "Sekolah Peduli Lingkungan",
            peternak_hewan: "Peternak Unggas Lokal",
            waste_to_energy: "Pusat Bio-Energi"
          };
          const userName = mockNames[userRole] || `Mitra ${userRole.replace(/_/g, ' ')}`;

          if (userId) {
              const { error: upsertError } = await supabase.from("active_matchmaking").upsert({
                 user_id: userId,
                 name: userName,
                 role: userRole,
                 category: "Umum",
                 location: `POINT(${lng} ${lat})`,
                 status: 'searching'
              });

              if (upsertError) {
                  console.error("Error upserting location:", upsertError.message || JSON.stringify(upsertError));
              }
          }

          // Determine Target Roles
          let targetRoles: string[] = [];
          if (["mitra_sisa_pangan", "mitra_sisa_pangan_sppg", "mitra_sisa_pangan_sekolah", "sppg", "sekolah", "school"].some(r => userRole.includes(r))) {
              targetRoles = ["peternak_manggot", "mitra_energy", "waste_to_energy", "peternak_hewan"];
          } else if (userRole === "peternak_manggot") {
              targetRoles = ["sppg", "sekolah", "mitra_sisa_pangan", "mitra_sisa_pangan_sppg", "mitra_sisa_pangan_sekolah", "peternak_hewan"];
          } else {
              targetRoles = ["sppg", "sekolah", "peternak_manggot", "peternak_hewan", "mitra_sisa_pangan"];
          }

          // 3. Fetch Nearest Partners
          const fetchPartners = async () => {
            const { data, error } = await supabase.rpc("find_nearest_partners", {
              user_lat: lat,
              user_lng: lng,
              search_radius_meters: 15000, // Search within 15 km
              target_roles: targetRoles,
              p_city: location
            });

            if (error) {
               console.error("Error fetching partners:", error);
               return;
            }

            if (data) {
               // Filter out current user's ID just in case
               const filteredData = data.filter((p: any) => p.id !== userId);
               const mapped = filteredData.map((p: any, index: number) => {
                  const angle = index * (Math.PI * 2 / 5);
                  const jitterRadius = 12 + (index % 3) * 5;
                  return {
                     id: p.id,
                     name: p.name,
                     role: p.role,
                     // category: p.category || "General",
                     stock: p.stock || "Tersedia",
                     avatar: p.name.substring(0, 2).toUpperCase(),
                     distance: (p.distance / 1000).toFixed(1) + " km",
                     mapLat: 50 + Math.sin(angle) * jitterRadius,
                     mapLng: 50 + Math.cos(angle) * jitterRadius,
                     lat: p.lat,
                     lng: p.lng,
                     is_online: p.is_online
                  };
               });
               setPartners(mapped);
            }
          };

          await fetchPartners();
          setIsLoading(false);

          // 4. Subscribe to Realtime Updates
          if (userId) {
              const channelName = `matchmaking_${userId}_${Math.random().toString(36).substring(7)}`;
              subscription = supabase.channel(channelName)
                .on('postgres_changes', { event: '*', schema: 'public', table: 'active_matchmaking' }, (payload) => {
                   // When someone else joins or moves, refetch nearest partners
                   fetchPartners();
                })
                .subscribe();
          }

        }, (err) => {
          console.error("Geolocation error:", err);
          setIsLoading(false);
        });
      } else {
        console.error("Geolocation is not supported by this browser.");
        setIsLoading(false);
      }
    };

    initMatchmaking();

    return () => {
       if (subscription) supabase.removeChannel(subscription);
       // Remove user from matchmaking pool on close
       if (userId) {
           supabase.from("active_matchmaking").delete().eq("user_id", userId).then();
       }
    }
  }, [userRole, userId, supabase]);

  const handleConnect = (partner: any) => {
    setSelectedPartner(partner);
    setChats([...INITIAL_CHATS]); // Reset chat for new partner
    setAppointment({ date: "", time: "", location: partner.address }); // Reset form
    setTransactionDetails({ quantity: "", productType: "" }); // Reset transaction details
    setStep("negotiate");
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    // User message
    const newChats = [...chats, { sender: "me", text: inputText }];
    setChats(newChats);
    setInputText("");

    // Simulate Partner Reply
    setTimeout(() => {
        setChats(prev => [...prev, { sender: "partner", text: "Baik, saya setuju dengan waktu tersebut. Silakan ajukan kesepakatan." }]);
    }, 1500);
  };
  
  // Auto-scroll chat
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chats]);

  const handleDeal = () => {
      // Transition to waiting state
      setStep("waiting");
  };

  const handleFinish = async () => {
      if (!selectedPartner || !userId) return;

      // 1. Determine Item Type
      let itemType = 'LIMBAH';
      if (transactionDetails.productType) {
          itemType = transactionDetails.productType.toUpperCase();
      } else if (selectedPartner.role === 'peternak_manggot' && transactionDetails.quantity) {
          itemType = 'MAGGOT';
      }

      // 2. Volume
      const volume = parseInt(transactionDetails.quantity) || 45;

      // 3. Submit Match using Server Action
      const result = await submitDirectMatch(selectedPartner.id, itemType, volume);
      if (result.error) {
          console.error("Match error:", result.error);
      }

      setStep("success");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-center pointer-events-none">
      <div className="fixed inset-0 bg-black/50 pointer-events-auto" onClick={onClose} />
      
      <div className="relative pointer-events-auto w-full max-w-4xl h-[95vh] sm:h-[85vh] bg-white dark:bg-slate-950 shadow-2xl rounded-t-2xl sm:rounded-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur">
            <div>
                <CardTitle className="text-xl">Matchmaking ({location})</CardTitle>
                <CardDescription>
                    {step === "search" && "Pilih mitra di sekitar Anda"}
                    {step === "negotiate" && `Diskusi dengan ${selectedPartner?.name}`}
                    {step === "waiting" && "Menunggu pertemuan"}
                    {step === "success" && "Transaksi Selesai"}
                </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <X className="h-5 w-5" />
            </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
            
            {/* STEP 1: MAP VISUALIZATION */}
            {step === "search" && (
                <div className="flex-1 grid md:grid-cols-2 h-full overflow-hidden">
                    {/* Map Simulation */}
                    <div className="bg-slate-100 dark:bg-slate-900 relative h-[300px] md:h-full flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r">
                        {/* Dynamic Map Background */}
                        <div 
                          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50 dark:opacity-40" 
                          style={{ backgroundImage: `url('/map-${location.toLowerCase()}.jpeg')` }}
                        ></div>
                        
                        {/* Fake Map Grid Overlay */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay" style={{ 
                            backgroundImage: "radial-gradient(#444 1px, transparent 1px)", 
                            backgroundSize: "20px 20px" 
                        }}></div>
                        
                        {/* Radar Scan Effect */}
                        <div className="absolute w-96 h-96 border-2 border-primary/30 rounded-full animate-pulse flex items-center justify-center pointer-events-none">
                             <div className="w-64 h-64 border border-primary/50 rounded-full"></div>
                        </div>
                        
                        {/* User Pin */}
                        <div className="absolute z-10 flex flex-col items-center" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-bounce"></div>
                            <span className="text-xs font-bold bg-white px-2 py-0.5 rounded shadow mt-1">Anda</span>
                        </div>

                        {/* Partner Pins */}
                        {!isLoading && partners.map((p, i) => (
                             <div key={p.id} className="absolute flex flex-col items-center group cursor-pointer" 
                                  style={{ top: `${Math.min(90, Math.max(10, p.mapLat))}%`, left: `${Math.min(90, Math.max(10, p.mapLng))}%`, transform: 'translate(-50%, -50%)' }}
                                  onClick={() => handleConnect(p)}>
                                <MapPin className="h-8 w-8 text-primary drop-shadow-md group-hover:scale-125 transition-transform" />
                                <span className="text-[10px] font-medium bg-white/90 px-2 py-1 rounded shadow mt-0.5 max-w-[100px] truncate group-hover:bg-white">{p.name}</span>
                             </div>
                        ))}
                    </div>

                    {/* Partner List */}
                    <div className="flex-1 overflow-y-auto w-full border-t md:border-t-0 p-4 space-y-4">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                            Mitra Terdekat {isLoading ? "..." : `(${partners.length})`}
                        </h3>
                        
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                                <p>Mencari mitra di sekitar...</p>
                            </div>
                        ) : (
                            <div className="space-y-3 pb-8">
                                {partners.length > 0 ? partners.map((partner) => (
                                    <Card key={partner.id} className="hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer border-l-4 border-l-transparent hover:border-l-primary group"
                                          onClick={() => handleConnect(partner)}>
                                        <div className="p-3 flex items-start gap-3">
                                            <Avatar className="h-10 w-10 border">
                                                <AvatarFallback>{partner.avatar}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-bold text-sm group-hover:text-primary transition-colors">{partner.name}</h4>
                                                    <Badge variant="outline" className="text-xs">{partner.distance}</Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">{partner.stock}</p>
                                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                                    {partner.is_online ? (
                                                        <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded flex items-center gap-1 border border-green-200">
                                                            <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></span> Online
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded flex items-center gap-1 border border-slate-200">
                                                            <span className="h-1.5 w-1.5 bg-slate-400 rounded-full"></span> Standby
                                                        </span>
                                                    )}
                                                    <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">Verified</span>
                                                    <Badge variant="secondary" className="text-[10px] h-5">{partner.category}</Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                )) : (
                                    <div className="text-center p-8 text-muted-foreground">
                                        Tidak ada mitra ditemukan dalam radius 15 km.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* STEP 2: NEGOTIATION (FORM + CHAT) */}
            {step === "negotiate" && selectedPartner && (
                <div className="flex-1 grid md:grid-cols-2 h-full overflow-hidden">
                    {/* Left: Form */}
                    <div className="p-6 overflow-y-auto border-r bg-slate-50/50">
                        <div className="flex items-center gap-4 mb-6">
                            <Avatar className="h-12 w-12 border-2 border-primary">
                                <AvatarFallback>{selectedPartner.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-bold text-lg">{selectedPartner.name}</h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Badge variant="secondary">{selectedPartner.distance}</Badge>
                                    <span>•</span>
                                    <span>Verified Partner</span>
                                </div>
                            </div>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Buat Janji Temu</CardTitle>
                                <CardDescription>Sepakati waktu dan lokasi pertemuan.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Tanggal Pertemuan</Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input type="date" className="pl-9" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Waktu</Label>
                                    <div className="relative">
                                        <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input type="time" className="pl-9" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Lokasi / Titik Temu</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input placeholder="Alamat lengkap..." defaultValue={`Titik Jemput (${selectedPartner.distance})`} className="pl-9" />
                                    </div>
                                </div>

                                {/* Custom Fields for Specific Roles */}
                                {selectedPartner.role === "peternak_manggot" && (
                                    <div className="space-y-2 pt-2 border-t">
                                        <Label className="text-blue-600 font-semibold">Pesanan Maggot</Label>
                                        <div className="space-y-2">
                                            <Label>Jumlah (Kg)</Label>
                                            <Input 
                                                type="number" 
                                                placeholder="0.0" 
                                                value={transactionDetails.quantity}
                                                onChange={(e) => setTransactionDetails({...transactionDetails, quantity: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                )}

                                {selectedPartner.role === "peternak_hewan" && (
                                    <div className="space-y-2 pt-2 border-t">
                                        <Label className="text-blue-600 font-semibold">Pesanan Produk Ternak</Label>
                                        <div className="space-y-2">
                                            <Label>Produk Hasil Ternak</Label>
                                            <Input 
                                                placeholder="Contoh: Telur, Daging Ayam, Susu" 
                                                value={transactionDetails.productType}
                                                onChange={(e) => setTransactionDetails({...transactionDetails, productType: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Jumlah (Kg / Unit)</Label>
                                            <Input 
                                                 type="text"
                                                 placeholder="0.0" 
                                                 value={transactionDetails.quantity}
                                                 onChange={(e) => setTransactionDetails({...transactionDetails, quantity: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                )}
                                
                                <div className="pt-4">
                                    <Button className="w-full" size="lg" onClick={handleDeal}>
                                        <CheckCircle2 className="h-4 w-4" />Lanjut
                                    </Button>
                                    <Button variant="ghost" className="w-full mt-2" onClick={() => setStep("search")}>
                                        Kembali
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Chat */}
                    <div className="flex flex-col h-full overflow-hidden bg-white">
                        <div className="p-3 border-b bg-slate-50 flex justify-between items-center">
                            <span className="text-sm font-medium flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" /> Live Chat
                            </span>
                            <span className="text-xs text-blue-600 flex items-center gap-1">
                                <span className="h-2 w-2 bg-blue-500 rounded-full translate-y-[1px]"></span> Online
                            </span>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30" ref={scrollRef}>
                            {chats.map((chat, idx) => (
                                <div key={idx} className={`flex ${chat.sender === "me" ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                                        chat.sender === "me" 
                                        ? "bg-primary text-primary-foreground rounded-br-none" 
                                        : "bg-white border rounded-bl-none"
                                    }`}>
                                        {chat.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-3 border-t bg-white">
                            <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
                                <Input 
                                    placeholder="Tulis pesan kesepakatan..." 
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    className="flex-1"
                                />
                                <Button type="submit" size="icon">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 3: WAITING FOR MEETING */}
            {step === "waiting" && selectedPartner && (
                <div className="flex-1 overflow-y-auto w-full animate-in fade-in duration-500">
                    <div className="flex flex-col items-center justify-center min-h-full p-8 pb-20 text-center space-y-8">
                        <div className="relative">
                            <div className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center animate-pulse">
                                <Clock className="h-16 w-16 text-yellow-600" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-lg">
                                <Truck className="h-6 w-6 text-primary" />
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold">Menunggu Pertemuan</h2>
                            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                                Kesepakatan telah dibuat. Silakan menuju titik temu untuk serah terima limbah/produk.
                            </p>
                        </div>

                        <Card className="w-full max-w-sm border-dashed bg-slate-50">
                            <CardContent className="p-6 space-y-4">
                                <div className="flex justify-between items-center border-b pb-4">
                                    <span className="text-muted-foreground">Mitra</span>
                                    <span className="font-bold">{selectedPartner.name}</span>
                                </div>
                                
                                {(selectedPartner.role === "peternak_manggot" || selectedPartner.role === "peternak_hewan") && transactionDetails.quantity ? (
                                    <>
                                         {selectedPartner.role === "peternak_hewan" && (
                                            <div className="flex justify-between items-center border-b pb-4">
                                                <span className="text-muted-foreground">Pesanan</span>
                                                <span className="font-medium text-right">{transactionDetails.productType}</span>
                                            </div>
                                         )}
                                         <div className="flex justify-between items-center border-b pb-4">
                                            <span className="text-muted-foreground">Jumlah (Kg)</span>
                                            <span className="font-bold">{transactionDetails.quantity} {selectedPartner.role === "peternak_manggot" ? "Kg" : ""}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b pb-4">
                                            <span className="text-muted-foreground">Estimasi Biaya</span>
                                            <span className="font-bold text-blue-600 text-lg">
                                                Rp {(parseInt(transactionDetails.quantity) * 5000).toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex justify-between items-center border-b pb-4">
                                        <span className="text-muted-foreground">Estimasi Biaya</span>
                                        <span className="font-bold text-blue-600 text-lg">Rp 25.000</span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Status</span>
                                    <Badge variant="warning">Menunggu</Badge>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex gap-4 w-full max-w-sm">
                            <Button variant="outline" className="flex-1" onClick={() => setStep("negotiate")}>Batal</Button>
                            <Button className="flex-1" size="lg" onClick={handleFinish}>Selesai</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 4: SUCCESS */}
            {step === "success" && (
                <div className="flex-1 overflow-y-auto w-full animate-in zoom-in-95 duration-500">
                    <div className="flex flex-col items-center justify-center min-h-full p-8 pb-20 text-center space-y-8">
                        
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center shadow-sm">
                            <CheckCircle2 className="h-12 w-12 text-blue-600" />
                        </div>
                        
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold text-blue-600">Transaksi Selesai!</h2>
                            <p className="text-muted-foreground text-lg max-w-md mx-auto">
                                Terima kasih telah berkontribusi pada sirkular ekonomi.
                            </p>
                        </div>
                        
                        <Card className="w-full max-w-sm border-2 border-blue-100 shadow-md bg-white">
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-1 pb-4 border-b border-dashed">
                                    <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Rincian Transaksi</div>
                                    <div className="text-xs text-slate-400">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                                </div>

                                <div className="space-y-4">
                                     {(selectedPartner?.role === "peternak_manggot" || selectedPartner?.role === "peternak_hewan") ? (
                                        <>
                                            <div className="flex justify-between items-center text-left">
                                                <span className="text-muted-foreground">{selectedPartner.role === "peternak_hewan" ? "Produk" : "Item"}</span>
                                                <span className="font-bold text-slate-800">{selectedPartner.role === "peternak_hewan" ? transactionDetails.productType : "Maggot"}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-left">
                                                <span className="text-muted-foreground">Jumlah</span>
                                                <span className="font-bold text-slate-800">{transactionDetails.quantity} {selectedPartner.role === "peternak_manggot" ? "Kg" : ""}</span>
                                            </div>
                                        </>
                                     ) : (
                                         <div className="flex justify-between items-center text-left">
                                            <span className="text-muted-foreground">Total Sampah</span>
                                            <span className="font-bold text-slate-800">45 Kg</span>
                                         </div>
                                     )}
                                     
                                     <div className="flex justify-between items-center text-left bg-blue-50 p-3 rounded-lg border border-blue-100">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">XP</Badge>
                                            <span className="text-sm font-medium text-blue-800">Poin Earned</span>
                                        </div>
                                        <span className="font-bold text-xl text-blue-700">+120</span>
                                     </div>
                                </div>

                                {(selectedPartner?.role === "peternak_manggot" || selectedPartner?.role === "peternak_hewan") && (
                                     <div className="pt-2 border-t border-dashed">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">Total Biaya</span>
                                            <span className="font-bold text-slate-800">Rp {(parseInt(transactionDetails.quantity) * 5000).toLocaleString('id-ID')}</span>
                                        </div>
                                     </div>
                                )}
                            </CardContent>
                        </Card>

                        <Button className="w-full max-w-sm shadow-lg" size="lg" onClick={onClose}>Kembali ke Dashboard</Button>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
}
