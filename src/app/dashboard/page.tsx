"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LogOut, TrendingUp, Scale, Leaf, DollarSign, Map, Package, User } from "lucide-react";
import {
  CITIES,
  getRegionalDashboardData,
  RegionalStats,
  RegionalGraphData,
} from "@/lib/regional-data";
import { MatchmakingPanel } from "@/components/MatchmakingPanel";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { createClient } from "@/utils/supabase/client";

export default function DashboardPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState("sppg");
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [showMatchmaking, setShowMatchmaking] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Slawi");
  
  // Dynamic live data
  const [displayedData, setDisplayedData] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  
  // Static Graph & Stats (can be made dynamic later)
  const [stats, setStats] = useState<RegionalStats | null>(null);
  const [graphData, setGraphData] = useState<RegionalGraphData[]>([]);

  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUserId(user.id);
      const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single();
      if (profile) {
        setUserRole(profile.role);
        setUserName(profile.name);
      }
    };
    fetchUser();
  }, [router, supabase]);

  // Fetch live data based on location
  useEffect(() => {
    const fetchLiveData = async () => {
      // 1. Fetch Users in the city (for the Table)
      const { data: usersData } = await supabase
        .from("users")
        .select("*")
        .eq("city", selectedLocation);
      
      setDisplayedData(usersData || []);

      // 2. Fetch recent matches involving users in this city
      // We can fetch matches, then join requests and users to get names.
      const { data: matchesData } = await supabase
        .from("matches")
        .select(`
          id,
          matched_at,
          request:requests(volume, item_type, user:users!requests_user_id_fkey(name, city)),
          partner:users!matches_partner_id_fkey(name, city)
        `)
        .order("matched_at", { ascending: false })
        .limit(10);
      
      if (matchesData) {
        // Filter matches where either requester or partner is in the selected city
        const cityMatches = matchesData.filter((m: any) => 
            m.request?.user?.city === selectedLocation || m.partner?.city === selectedLocation
        ).map((m: any) => ({
            id: m.id,
            source: m.request?.user?.name,
            target: m.partner?.name,
            amount: m.request?.volume,
            type: m.request?.item_type || 'LIMBAH',
            timestamp: new Date(m.matched_at).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit' }) + " lalu"
        }));
        setActivities(cityMatches);
      }

      // 3. Get static graph data for aesthetics
      const data = getRegionalDashboardData(selectedLocation);
      setStats(data.stats);
      setGraphData(data.chartData);
    };

    fetchLiveData();

    // Set up realtime subscription for users and matches
    const channel = supabase.channel('live-dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => fetchLiveData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, () => fetchLiveData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedLocation, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Dashboard Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-white dark:bg-slate-900 px-4 md:px-6 py-3 flex flex-wrap items-center justify-between shadow-sm gap-y-3">
        <div className="flex items-center gap-2">
          <img src="/logo-MatchCycle.jpeg" alt="Logo" className="h-6 w-6 text-primary" onError={(e) => e.currentTarget.style.display='none'} />
          <span className="font-bold text-lg">
            MatchGate <span className="text-muted-foreground font-normal hidden sm:inline-block">| Monitoring</span>
          </span>
        </div>

        <div className="flex items-center gap-2 md:gap-4 ml-auto">
          <div className="flex items-center gap-2 px-2 md:px-3 py-1 bg-white border rounded-full text-xs md:text-sm font-medium shadow-sm">
            <div className={`h-2 w-2 rounded-full animate-pulse shrink-0 ${
              selectedLocation === "Slawi" ? "bg-blue-600" :
              selectedLocation === "Adiwerna" ? "bg-blue-600" :
              selectedLocation === "Talang" ? "bg-orange-600" : "bg-purple-600"
            }`} />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-transparent border-none outline-none text-xs md:text-sm font-medium cursor-pointer max-w-[80px] md:max-w-none"
            >
              {CITIES.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            <Button variant="outline" size="sm" className="px-2 md:px-3 h-8" onClick={() => router.push("/profile")}>
              <User className="h-4 w-4 md:mr-2" /> <span className="hidden md:inline">Profil</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="px-2 md:px-3 h-8 text-muted-foreground hover:text-destructive">
              <LogOut className="h-4 w-4 md:mr-2" /> <span className="hidden md:inline">Keluar</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-8 space-y-8 pb-24">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="w-full md:w-auto">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight truncate">Halo, {userName}</h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Pantau distribusi pangan dan sirkular ekonomi wilayah <span className="font-semibold text-primary">{selectedLocation}</span>.
            </p>
          </div>
          <Button size="lg" className="w-full md:w-auto shadow-lg animate-bounce-slow bg-blue-600 hover:bg-blue-700" onClick={() => setShowMatchmaking(true)}>
            <Map className="mr-2 h-5 w-5" /> Cari Mitra (Matchmaking)
          </Button>
        </div>

        {/* Impact Tracker Grid */}
        {stats && (
          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Volume Sisa Pangan</CardTitle>
                <Scale className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.wasteManaged.toLocaleString()} <span className="text-sm text-muted-foreground font-normal">Kg</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produksi Maggot</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.maggotProduction.toLocaleString()} <span className="text-sm text-muted-foreground font-normal">Kg</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reduksi CO2</CardTitle>
                <Leaf className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.co2Reduced} <span className="text-sm text-muted-foreground font-normal">Ton</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Economic Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp {stats.economicValue.toLocaleString("id-ID")}</div>
              </CardContent>
            </Card>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Chart Section */}
            <section>
              <div className="mb-4">
                <h2 className="text-xl font-bold tracking-tight">Tren dan Distribusi Limbah</h2>
              </div>
              <Card className="pl-0 pr-6 pt-6 pb-2 min-h-[350px]">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={graphData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSekolah" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorSppg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}kg`} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="sekolah" name="Limbah Sekolah" stroke="#22c55e" fillOpacity={1} fill="url(#colorSekolah)" />
                    <Area type="monotone" dataKey="sppg" name="Limbah SPPG" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSppg)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </section>

            {/* LIVE Database Table */}
            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Status Entitas (LIVE)</h2>
              </div>
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <Table className="min-w-[500px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama Mitra</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Lokasi</TableHead>
                        <TableHead>Kapasitas/Stok</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedData.length > 0 ? (
                        displayedData.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>
                                <Badge variant="outline" className="uppercase">{item.role.replace(/_/g, ' ')}</Badge>
                            </TableCell>
                            <TableCell>{item.address}</TableCell>
                            <TableCell className="font-bold text-primary">{item.capacity} Kg</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                            Tidak ada data untuk wilayah {selectedLocation}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </section>
          </div>

          {/* Activity Widget */}
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Aktivitas Matchmaking</h2>
            </div>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Matchmaking Terkini (LIVE)</CardTitle>
                <CardDescription>Riwayat sistem {selectedLocation}.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {activities.length > 0 ? activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none text-wrap">
                        {activity.source} <span className="text-muted-foreground">→</span> {activity.target}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.amount} Kg ({activity.type}) • {activity.timestamp}
                      </p>
                    </div>
                  </div>
                )) : (
                    <p className="text-sm text-muted-foreground text-center">Belum ada aktivitas di wilayah ini.</p>
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      {showMatchmaking && <MatchmakingPanel userId={userId} userRole={userRole} onClose={() => setShowMatchmaking(false)} location={selectedLocation} />}
    </div>
  );
}
