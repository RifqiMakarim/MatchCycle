"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Recycle, LogOut, TrendingUp, Scale, Leaf, DollarSign, Map, Package, User, ChevronDown } from "lucide-react";
// Removed static mock data imports
// import { IMPACT_STATS, RECENT_ACTIVITY, GRAPH_DATA } from "@/lib/mock-data";
import {
  REGIONAL_ENTITIES,
  CITIES,
  RegionalEntity,
  getRegionalDashboardData,
  RegionalStats,
  RegionalGraphData,
  RegionalActivity
} from "@/lib/regional-data";
import { MatchmakingPanel } from "@/components/MatchmakingPanel";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

export default function DashboardPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState("admin");
  const [showMatchmaking, setShowMatchmaking] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Slawi");
  const [displayedData, setDisplayedData] = useState<RegionalEntity[]>([]);

  // New state for dynamic dashboard data
  const [stats, setStats] = useState<RegionalStats | null>(null);
  const [graphData, setGraphData] = useState<RegionalGraphData[]>([]);
  const [activities, setActivities] = useState<RegionalActivity[]>([]);

  useEffect(() => {
    setMounted(true);
    const role = localStorage.getItem("userRole");
    if (role) {
      setUserRole(role);
    }
  }, []);

  useEffect(() => {
    // 1. Filter entity data (Table)
    const filtered = REGIONAL_ENTITIES.filter((item) => item.city === selectedLocation);
    setDisplayedData(filtered);

    // 2. Get regional dashboard stats (Cards, Graph, Activities)
    const data = getRegionalDashboardData(selectedLocation);
    setStats(data.stats);
    setGraphData(data.chartData);
    setActivities(data.activities);
  }, [selectedLocation]);

  if (!mounted) return null;

  // Determine if user is seeing School or SPPG specific view (for differentiation)
  const isSppg = userRole === "sppg" || userRole.includes("sppg");
  const isSchool = userRole === "school" || userRole === "sekolah";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Dashboard Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-white dark:bg-slate-900 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <img src="/logo-EcoMatch.jpeg" alt="Logo EcoMatch" className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg hidden sm:inline-block">
            EcoMatch <span className="text-muted-foreground font-normal">| Monitoring</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white border rounded-full text-sm font-medium shadow-sm">
            <div className={`h-2 w-2 rounded-full animate-pulse ${
              selectedLocation === "Slawi" ? "bg-blue-600" :
              selectedLocation === "Adiwerna" ? "bg-blue-600" :
              selectedLocation === "Talang" ? "bg-orange-600" : "bg-purple-600"
            }`} />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-transparent border-none outline-none text-sm font-medium cursor-pointer"
            >
              {CITIES.map((loc) => (
                <option key={loc} value={loc}>
                  Wilayah: {loc}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/profile">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <User className="h-4 w-4 mr-2" /> {isSppg ? "Profil SPPG" : "Profil"}
              </Button>
            </Link>
            <Link href="/login" onClick={() => localStorage.removeItem("userRole")}>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                <LogOut className="h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">Keluar</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-8 space-y-8 pb-24">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Halo, {userRole.replace(/_/g, " ").toUpperCase()}</h1>
            <p className="text-muted-foreground">
              Pantau distribusi pangan dan perkembangan sirkular ekonomi wilayah <span className="font-semibold text-primary">{selectedLocation}</span>.
            </p>
          </div>
          <Button size="lg" className="shadow-lg animate-bounce-slow" onClick={() => setShowMatchmaking(true)}>
            <Map className="mr-2 h-5 w-5" /> Cari Mitra (Matchmaking)
          </Button>
        </div>

        {/* Impact Tracker Grid - DYNAMIC DATA */}
        {stats && (
          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Volume Sisa Pangan MBG</CardTitle>
                <Scale className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.wasteManaged.toLocaleString()} <span className="text-sm text-muted-foreground font-normal">Kg</span>
                </div>
                <p className="text-xs text-muted-foreground">+{(Math.random() * 20 + 5).toFixed(1)}% dari bulan lalu</p>
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
                <p className="text-xs text-muted-foreground">Protein tinggi siap panen</p>
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
                <p className="text-xs text-muted-foreground">Setara {(parseFloat(stats.co2Reduced) * 8).toFixed(0)} pohon</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Economic Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp {stats.economicValue.toLocaleString("id-ID")}</div>
                <p className="text-xs text-muted-foreground">Total transaksi sirkular</p>
              </CardContent>
            </Card>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Chart Section - DYNAMIC DATA */}
            <section>
              <div className="mb-4">
                <h2 className="text-xl font-bold tracking-tight">Tren dan Distribusi Limbah</h2>
                <p className="text-sm text-muted-foreground">Visualisasi data limbah Sekolah dan SPPG minggu ini di {selectedLocation}.</p>
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
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}kg`}
                    />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="sekolah"
                      name="Limbah Sekolah"
                      stroke="#22c55e"
                      fillOpacity={1}
                      fill="url(#colorSekolah)"
                    />
                    <Area
                      type="monotone"
                      dataKey="sppg"
                      name="Limbah SPPG"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorSppg)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </section>

            {/* Regional Status Table */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Status</h2>
                  <p className="text-sm text-muted-foreground">
                    Status pengguna di wilayah {selectedLocation}.
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Unduh CSV
                </Button>
              </div>

              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama Mitra</TableHead>
                        <TableHead>Tipe</TableHead>
                        <TableHead>Lokasi</TableHead>
                        <TableHead>Stok</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Last Activity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedData.length > 0 ? (
                        displayedData.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell className="text-muted-foreground">
                                <Badge variant="outline">{item.category}</Badge>
                            </TableCell>
                            <TableCell>{item.address}</TableCell>
                            <TableCell className="font-bold">{item.stock}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  item.status === "Tersedia"
                                    ? "secondary"
                                    : item.status === "Proses Penjemputan"
                                    ? "default"
                                    : "outline"
                                }
                                className={
                                  item.status === "Tersedia"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : item.status === "Proses Penjemputan"
                                    ? "bg-blue-100 text-blue-800"
                                    : item.status === "Aktif"
                                    ? "bg-blue-100 text-blue-800 border-transparent"
                                    : "bg-slate-100"
                                }
                              >
                                {item.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground text-sm">
                              {item.lastActivity}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
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

          {/* Matchmaking Activity Widget - DYNAMIC DATA */}
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Aktivitas Terbaru</h2>
              <p className="text-sm text-muted-foreground">Daftar aktivitas terkini di {selectedLocation}.</p>
            </div>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Matchmaking Terkini</CardTitle>
                <CardDescription>Riwayat sistem {selectedLocation}.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.source} <span className="text-muted-foreground">→</span> {activity.target}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.amount} Kg ({activity.type}) • {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="pt-2">
                    <Button variant="ghost" className="w-full text-xs" size="sm">
                    Lihat Semua Riwayat
                    </Button>
                </div>
              </CardContent>
            </Card>

            {/* Regional Target Distribution Card - DYNAMIC DATA */}
            {stats && (
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-primary">Target Distribusi {selectedLocation}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold text-primary">{stats.distributionTarget.percentage}%</span>
                  <span className="text-xs text-muted-foreground mb-1">
                    {stats.distributionTarget.current} / {stats.distributionTarget.total} {stats.distributionTarget.unit}
                  </span>
                </div>
                <div className="h-2 w-full bg-primary/20 rounded-full mt-2">
                  <div
                    className="h-2 bg-primary rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${stats.distributionTarget.percentage}%` }}
                  />
                </div>
              </CardContent>
            </Card>
            )}
          </section>
        </div>
      </main>

      {/* Matchmaking Overlay Panel */}
      {showMatchmaking && <MatchmakingPanel userRole={userRole} onClose={() => setShowMatchmaking(false)} location={selectedLocation} />}
    </div>
  );
}
