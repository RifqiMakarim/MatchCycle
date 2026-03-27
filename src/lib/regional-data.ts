export type EntityRole = 
  | "sppg" 
  | "sekolah" 
  | "peternak_hewan" 
  | "peternak_manggot" 
  | "waste_to_energy";

export interface RegionalEntity {
  id: string;
  city: string;
  category: string;
  role: EntityRole;
  name: string;
  address: string;
  lat: number;
  lng: number;
  stock: string;
  wasteStock: number;
  status: "Tersedia" | "Proses Penjemputan" | "Aktif" | "Penuh";
  lastActivity: string;
  avatar: string;
}

export const CITIES = ["Slawi", "Adiwerna", "Talang", "Dukuhturi"];

export const REGIONAL_ENTITIES: RegionalEntity[] = [
  // --- SLAWI ---
  // SPPG
  { id: "slw-sppg-1", city: "Slawi", category: "SPPG", role: "sppg", name: "SPPG Slawi Kulon", address: "Slawi Kulon", lat: -6.9850, lng: 109.1400, stock: "Ada 45kg", wasteStock: 45, status: "Tersedia", lastActivity: "2 jam lalu", avatar: "SK" },
  { id: "slw-sppg-2", city: "Slawi", category: "SPPG", role: "sppg", name: "SPPG Arjuna", address: "Kawasan Slawi", lat: -6.9800, lng: 109.1350, stock: "Ada 30kg", wasteStock: 30, status: "Proses Penjemputan", lastActivity: "5 jam lalu", avatar: "SA" },
  // Sekolah
  { id: "slw-sch-1", city: "Slawi", category: "Sekolah", role: "sekolah", name: "SMAN 1 Slawi", address: "Jl. KH. Wahid Hasyim, Slawi", lat: -6.9820, lng: 109.1380, stock: "Ada 25kg", wasteStock: 25, status: "Tersedia", lastActivity: "Hari ini", avatar: "S1" },
  { id: "slw-sch-2", city: "Slawi", category: "Sekolah", role: "sekolah", name: "SMAN 2 Slawi", address: "Slawi Wetan", lat: -6.9900, lng: 109.1420, stock: "Ada 15kg", wasteStock: 15, status: "Aktif", lastActivity: "Kemarin", avatar: "S2" },
  { id: "slw-sch-3", city: "Slawi", category: "Sekolah", role: "sekolah", name: "SMAN 3 Slawi", address: "Kawasan Komplek Pendidikan", lat: -6.9880, lng: 109.1360, stock: "Ada 20kg", wasteStock: 20, status: "Tersedia", lastActivity: "3 jam lalu", avatar: "S3" },
  // Peternak & WTE (Generic untuk fitur matchmaking)
  { id: "slw-pm-1", city: "Slawi", category: "Peternak Maggot", role: "peternak_manggot", name: "Maggot Center Slawi", address: "Slawi Wetan", lat: -6.9920, lng: 109.1450, stock: "Butuh 50kg", wasteStock: 50, status: "Aktif", lastActivity: "2 jam lalu", avatar: "MC" },
  { id: "slw-wte-1", city: "Slawi", category: "Waste to Energy", role: "waste_to_energy", name: "TPA Penujah", address: "Penujah", lat: -7.0100, lng: 109.1500, stock: "Butuh 1000kg", wasteStock: 1000, status: "Aktif", lastActivity: "Setiap Hari", avatar: "TP" },

  // --- ADIWERNA ---
  // SPPG
  { id: "adw-sppg-1", city: "Adiwerna", category: "SPPG", role: "sppg", name: "SPPG Penarukan Adiwerna", address: "Penarukan", lat: -6.9400, lng: 109.1200, stock: "Ada 60kg", wasteStock: 60, status: "Tersedia", lastActivity: "1 jam lalu", avatar: "PA" },
  // Sekolah
  { id: "adw-sch-1", city: "Adiwerna", category: "Sekolah", role: "sekolah", name: "SMPN 1 Adiwerna Tegal", address: "Kalimati, Adiwerna", lat: -6.9350, lng: 109.1250, stock: "Ada 10kg", wasteStock: 10, status: "Aktif", lastActivity: "4 jam lalu", avatar: "S1" },
  { id: "adw-sch-2", city: "Adiwerna", category: "Sekolah", role: "sekolah", name: "SMPN 3 Adiwerna Tegal", address: "Adiwerna", lat: -6.9420, lng: 109.1180, stock: "Ada 20kg", wasteStock: 20, status: "Tersedia", lastActivity: "30 menit lalu", avatar: "S3" },
  { id: "adw-sch-3", city: "Adiwerna", category: "Sekolah", role: "sekolah", name: "SD Islam Pelangi Ujungrusi", address: "Ujungrusi", lat: -6.9450, lng: 109.1220, stock: "Ada 12kg", wasteStock: 12, status: "Tersedia", lastActivity: "Kemarin", avatar: "SD" },
  // Peternak (Generic)
  { id: "adw-pm-1", city: "Adiwerna", category: "Peternak Maggot", role: "peternak_manggot", name: "Biomagg Adiwerna", address: "Selatan Adiwerna", lat: -6.9500, lng: 109.1300, stock: "Butuh 100kg", wasteStock: 100, status: "Aktif", lastActivity: "1 jam lalu", avatar: "BA" },

  // --- TALANG ---
  // SPPG
  { id: "tlg-sppg-1", city: "Talang", category: "SPPG", role: "sppg", name: "SPPG Talang 02", address: "Talang Tengah", lat: -6.9100, lng: 109.1350, stock: "Ada 25kg", wasteStock: 25, status: "Aktif", lastActivity: "Hari ini", avatar: "T2" },
  { id: "tlg-sppg-2", city: "Talang", category: "SPPG", role: "sppg", name: "SPPG Pacul Talang", address: "Pacul", lat: -6.9050, lng: 109.1400, stock: "Ada 40kg", wasteStock: 40, status: "Tersedia", lastActivity: "30 menit lalu", avatar: "PT" },
  // Sekolah
  { id: "tlg-sch-1", city: "Talang", category: "Sekolah", role: "sekolah", name: "SDN Talang 01", address: "Talang", lat: -6.9150, lng: 109.1300, stock: "Ada 5kg", wasteStock: 5, status: "Aktif", lastActivity: "1 jam lalu", avatar: "S1" },
  { id: "tlg-sch-2", city: "Talang", category: "Sekolah", role: "sekolah", name: "SMPN 1 Kramat", address: "Kramat (Area Talang)", lat: -6.8900, lng: 109.1550, stock: "Ada 15kg", wasteStock: 15, status: "Tersedia", lastActivity: "Hari ini", avatar: "K1" },
  { id: "tlg-sch-3", city: "Talang", category: "Sekolah", role: "sekolah", name: "SMPN 1 Tarub", address: "Tarub (Area Talang)", lat: -6.9100, lng: 109.1600, stock: "Ada 18kg", wasteStock: 18, status: "Proses Penjemputan", lastActivity: "1 jam lalu", avatar: "T1" },
  // Peternak (Generic)
  { id: "tlg-pm-1", city: "Talang", category: "Peternak Maggot", role: "peternak_manggot", name: "Maggot Center Talang", address: "Talang", lat: -6.9200, lng: 109.1300, stock: "Butuh 80kg", wasteStock: 80, status: "Aktif", lastActivity: "Kemarin", avatar: "MT" },

  // --- DUKUHTURI ---
  // SPPG
  { id: "dkt-sppg-1", city: "Dukuhturi", category: "SPPG", role: "sppg", name: "SPPG Dukuhturi", address: "Dukuhturi Center", lat: -6.8900, lng: 109.1100, stock: "Ada 50kg", wasteStock: 50, status: "Tersedia", lastActivity: "3 jam lalu", avatar: "SD" },
  { id: "dkt-sppg-2", city: "Dukuhturi", category: "SPPG", role: "sppg", name: "SPPG Pagongan 002 Dukuhturi", address: "Pagongan", lat: -6.8950, lng: 109.1050, stock: "Ada 35kg", wasteStock: 35, status: "Tersedia", lastActivity: "Hari ini", avatar: "SP" },
  // Sekolah
  { id: "dkt-sch-1", city: "Dukuhturi", category: "Sekolah", role: "sekolah", name: "SMKN 1 Dukuhturi", address: "Karanganyar, Dukuhturi", lat: -6.9000, lng: 109.1150, stock: "Ada 30kg", wasteStock: 30, status: "Tersedia", lastActivity: "1 jam lalu", avatar: "S1" },
  { id: "dkt-sch-2", city: "Dukuhturi", category: "Sekolah", role: "sekolah", name: "SDN Karanganyar 01", address: "Karanganyar", lat: -6.9020, lng: 109.1180, stock: "Ada 10kg", wasteStock: 10, status: "Aktif", lastActivity: "Kemarin", avatar: "SK" },
  { id: "dkt-sch-3", city: "Dukuhturi", category: "Sekolah", role: "sekolah", name: "SDN Kepandean", address: "Kepandean", lat: -6.8850, lng: 109.1200, stock: "Ada 12kg", wasteStock: 12, status: "Aktif", lastActivity: "Hari ini", avatar: "SK" },
  // Peternak (Generic)
  { id: "dkt-pm-1", city: "Dukuhturi", category: "Peternak Hewan", role: "peternak_hewan", name: "Dukuhturi Cattle Farm", address: "Dukuhturi Barat", lat: -6.8980, lng: 109.1000, stock: "Butuh 200kg", wasteStock: 200, status: "Aktif", lastActivity: "Hari ini", avatar: "DF" },
];

export const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "Slawi": { lat: -6.9850, lng: 109.1400 },
  "Adiwerna": { lat: -6.9400, lng: 109.1200 },
  "Talang": { lat: -6.9100, lng: 109.1350 },
  "Dukuhturi": { lat: -6.8900, lng: 109.1100 }
};

export interface RegionalStats {
  wasteManaged: number;
  maggotProduction: number;
  co2Reduced: string;
  economicValue: number;
  distributionTarget: {
    percentage: number;
    current: number;
    total: number;
    unit: string;
  };
}

export interface RegionalGraphData {
  name: string;
  sekolah: number;
  sppg: number;
}

export interface RegionalActivity {
  id: number;
  source: string;
  target: string;
  amount: number;
  type: string;
  timestamp: string;
}

const MOCK_STATS: Record<string, RegionalStats> = {
  "Slawi": {
    wasteManaged: 8540,
    maggotProduction: 2100,
    co2Reduced: "12.5",
    economicValue: 32000000,
    distributionTarget: { percentage: 80, current: 800, total: 1000, unit: "Paket" }
  },
  "Adiwerna": {
    wasteManaged: 6400,
    maggotProduction: 1800,
    co2Reduced: "9.2",
    economicValue: 24500000,
    distributionTarget: { percentage: 70, current: 520, total: 750, unit: "Paket" }
  },
  "Talang": {
    wasteManaged: 5200,
    maggotProduction: 1200,
    co2Reduced: "7.1",
    economicValue: 18800000,
    distributionTarget: { percentage: 85, current: 425, total: 500, unit: "Paket" }
  },
  "Dukuhturi": {
    wasteManaged: 7800,
    maggotProduction: 1950,
    co2Reduced: "11.5",
    economicValue: 24200000,
    distributionTarget: { percentage: 65, current: 390, total: 600, unit: "Paket" }
  }
};

const MOCK_GRAPH: Record<string, RegionalGraphData[]> = {
  "Slawi": [
    { name: "Sen", sekolah: 200, sppg: 140 },
    { name: "Sel", sekolah: 180, sppg: 139 },
    { name: "Rab", sekolah: 210, sppg: 180 },
    { name: "Kam", sekolah: 240, sppg: 190 },
    { name: "Jum", sekolah: 180, sppg: 220 },
    { name: "Sab", sekolah: 220, sppg: 180 },
    { name: "Min", sekolah: 300, sppg: 230 },
  ],
  "Adiwerna": [
    { name: "Sen", sekolah: 150, sppg: 180 },
    { name: "Sel", sekolah: 180, sppg: 200 },
    { name: "Rab", sekolah: 220, sppg: 220 },
    { name: "Kam", sekolah: 160, sppg: 150 },
    { name: "Jum", sekolah: 210, sppg: 240 },
    { name: "Sab", sekolah: 140, sppg: 180 },
    { name: "Min", sekolah: 250, sppg: 290 },
  ],
  "Talang": [
    { name: "Sen", sekolah: 150, sppg: 120 },
    { name: "Sel", sekolah: 120, sppg: 140 },
    { name: "Rab", sekolah: 160, sppg: 150 },
    { name: "Kam", sekolah: 140, sppg: 130 },
    { name: "Jum", sekolah: 180, sppg: 210 },
    { name: "Sab", sekolah: 150, sppg: 160 },
    { name: "Min", sekolah: 190, sppg: 200 },
  ],
  "Dukuhturi": [
    { name: "Sen", sekolah: 250, sppg: 210 },
    { name: "Sel", sekolah: 220, sppg: 260 },
    { name: "Rab", sekolah: 240, sppg: 230 },
    { name: "Kam", sekolah: 260, sppg: 210 },
    { name: "Jum", sekolah: 290, sppg: 310 },
    { name: "Sab", sekolah: 230, sppg: 220 },
    { name: "Min", sekolah: 310, sppg: 330 },
  ]
};

const MOCK_ACTIVITIES: Record<string, RegionalActivity[]> = {
  "Slawi": [
    { id: 1, source: "SPPG Slawi Kulon", target: "Maggot Center Slawi", amount: 45, type: "Organik", timestamp: "20 min lalu" },
    { id: 2, source: "SMAN 1 Slawi", target: "TPA Penujah", amount: 15, type: "Residu", timestamp: "1 jam lalu" },
  ],
  "Adiwerna": [
    { id: 1, source: "SPPG Penarukan Adiwerna", target: "Biomagg Adiwerna", amount: 35, type: "Organik", timestamp: "15 min lalu" },
    { id: 2, source: "SMPN 3 Adiwerna Tegal", target: "Biomagg Adiwerna", amount: 10, type: "Organik", timestamp: "2 jam lalu" },
  ],
  "Talang": [
    { id: 1, source: "SPPG Pacul Talang", target: "Maggot Center Talang", amount: 30, type: "Organik", timestamp: "10 min lalu" },
    { id: 2, source: "SMPN 1 Kramat", target: "Maggot Center Talang", amount: 12, type: "Organik", timestamp: "1 jam lalu" },
  ],
  "Dukuhturi": [
    { id: 1, source: "SPPG Dukuhturi", target: "Dukuhturi Cattle Farm", amount: 25, type: "Organik", timestamp: "30 min lalu" },
    { id: 2, source: "SMKN 1 Dukuhturi", target: "Dukuhturi Cattle Farm", amount: 18, type: "Organik", timestamp: "1 jam lalu" },
  ]
};

export function getRegionalDashboardData(city: string) {
  const key = MOCK_STATS[city] ? city : "Slawi";
  
  return {
    stats: MOCK_STATS[key],
    chartData: MOCK_GRAPH[key],
    activities: MOCK_ACTIVITIES[key]
  };
}
