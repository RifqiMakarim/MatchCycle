"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Recycle, Leaf, TrendingUp, Zap, Smartphone, CheckCircle2, ArrowDown, Play } from "lucide-react";
import { LandingNavbar } from "@/components/LandingNavbar";
import { motion } from "framer-motion";

export default function LandingPage() {
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as const }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden font-sans">
      <LandingNavbar />
      
      {/* 1. HERO SECTION */}
      <section className="relative h-screen w-full flex items-center justify-center text-white overflow-hidden">
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 bg-slate-700">
             <div className="w-full h-full bg-[url('/bg-mbg.jpg')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
             <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30"></div>
        </div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 container mx-auto px-4 text-center space-y-6"
        >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-sm font-medium mb-4 mx-auto">
                Sistem Matchmaking Sisa Pangan Berkelanjutan
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
                Ubah Sisa Pangan MBG <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-300">Menjadi Ekonomi Sirkular</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="max-w-2xl mx-auto text-lg md:text-xl text-slate-200">
                SIRCLE menghubungkan penyedia sisa pangan hasil <strong>Makanan Bergizi Gratis (MBG)</strong>, peternak maggot, peternak hewan dan industri energi untuk menciptakan ekonomi sirkular yang berkelanjutan.
            </motion.p>
            <motion.div variants={fadeInUp} className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/login">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 h-12 text-base shadow-lg hover:shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 duration-200">
                        Mulai Sekarang
                    </Button>
                </Link>
                <Link href="#flow">
                    <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-base border-white text-white hover:bg-white hover:text-slate-900 bg-transparent transition-all hover:scale-105 active:scale-95 duration-200">
                        Pelajari Alur
                    </Button>
                </Link>
            </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 1, duration: 1 } }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/50"
        >
            <ArrowDown className="h-6 w-6" />
        </motion.div>
      </section>

      {/* 2. GOALS & SDGs SECTION */}
      <section id="manfaat" className="py-20 md:py-32 bg-slate-50">
          <div className="container mx-auto px-8 md:px-24">
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="grid md:grid-cols-2 gap-12 items-center"
              >
                  <motion.div variants={fadeInUp} className="space-y-6">
                      <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                          Mencapai Target <span className="text-blue-600">SDGs 2030</span>
                      </h2>
                      <p className="text-lg text-slate-600 leading-relaxed">
                          Sistem ini dirancang untuk mendukung program Makan Bergizi Gratis (MBG) dengan memastikan 
                          bahwa setiap sisa pangan terkelola dengan bijak, tidak berakhir di TPA, melainkan kembali menjadi sumber daya.
                      </p>
                      
                      <div className="space-y-4 pt-4">
                          <div className="flex gap-4">
                              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                                  <Recycle className="h-6 w-6 text-blue-600" />
                              </div>
                              <div>
                                  <h3 className="font-bold text-lg">Zero Waste to Landfill</h3>
                                  <p className="text-slate-600 text-sm">Mengurangi beban TPA dengan mengolah sisa organik.</p>
                              </div>
                          </div>
                          <div className="flex gap-4">
                              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                                  <TrendingUp className="h-6 w-6 text-blue-600" />
                              </div>
                              <div>
                                  <h3 className="font-bold text-lg">Circular Economy</h3>
                                  <p className="text-slate-600 text-sm">Menciptakan nilai ekonomi baru dari limbah.</p>
                              </div>
                          </div>
                      </div>
                  </motion.div>

                  {/* SDGs Grid Placeholders */}
                  <div className="grid grid-cols-2 gap-4 sm:gap-6">
                        {[
                            "/SDGs2.png",
                            "/SDGs7.png",
                            "/SDGs12.png",
                            "/SDGs13.png"
                        ].map((item) => (
                        <motion.div 
                          key={item}
                          variants={fadeInUp} 
                          className="bg-white rounded-2xl shadow-md border border-slate-100 flex items-center justify-center p-8 md:p-10 hover:shadow-lg transition-all"
                        >
                            <div className="w-full aspect-square relative">
                                <img src={item} alt="sdg" className="w-full h-full object-contain" />
                            </div>
                        </motion.div>
                      ))}
                  </div>
              </motion.div>
          </div>
      </section>

      {/* 3. CIRCULAR ECONOMY FLOW SECTION */}
      <section id="flow" className="py-20 md:py-32 bg-white relative overflow-hidden">

          <div className="absolute inset-0 z-0">
                  <div className="absolute inset-0 bg-[url('/bg-peternakmanggot.jpeg')] bg-cover bg-center opacity-50"></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70"></div>
          </div>
          
          {/* Top Divider (Transition from Goals) */}
          <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10 rotate-180">
              <svg className="relative block w-[calc(100%+1.3px)] h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                  <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-slate-50"></path>
              </svg>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="text-center max-w-3xl mx-auto mb-16"
              >
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ekosistem Sirkular SIRCLE</h2>
                  <p className="text-white">Integrasi SIRCLE dalam menjaga keberlanjutan siklus pangan program makanan bergizi gratis.</p>
              </motion.div>

              {/* FLOW DIAGRAM 2x2 Grid */}
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
                className="max-w-4xl mx-auto"
              >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                       
                       {/* NODE 1: SOURCE */}
                       <motion.div variants={fadeInUp} className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:border-blue-500 transition-all hover:shadow-xl group h-full flex flex-col items-center text-center">
                           <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                               <Recycle className="h-8 w-8 text-blue-600" />
                           </div>
                           <h3 className="font-bold text-lg mb-2">1. Sumber Limbah</h3>
                           <div className="text-sm font-medium text-slate-500 mb-1">Mitra Sisa Pangan</div>
                           <p className="text-xs text-slate-400">Bersumber dari sekolah dan SPPG yang melayani Makanan Bergizi Gratis</p>
                           <div className="mt-4 px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">Sisa Makanan</div>
                       </motion.div>

                       {/* NODE 2: PROCESSOR */}
                       <motion.div variants={fadeInUp} className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:border-orange-500 transition-all hover:shadow-xl group h-full flex flex-col items-center text-center">
                           <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-4 group-hover:bg-orange-100 transition-colors">
                               <Leaf className="h-8 w-8 text-orange-600" />
                           </div>
                           <h3 className="font-bold text-lg mb-2">2. Pengolahan Organik</h3>
                           <div className="text-sm font-medium text-slate-500 mb-1">Peternak Maggot</div>
                           <p className="text-xs text-slate-400">Biokonversi Black Soldier Fly dan dapat melakukan jual beli manggot dari peternak</p>
                           <div className="mt-4 px-3 py-1 bg-orange-50 text-orange-700 text-xs rounded-full">Maggot Fresh</div>
                       </motion.div>

                       {/* NODE 3: CONSUMER */}
                       <motion.div variants={fadeInUp} className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:border-blue-500 transition-all hover:shadow-xl group h-full flex flex-col items-center text-center">
                           <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                               <TrendingUp className="h-8 w-8 text-blue-600" />
                           </div>
                           <h3 className="font-bold text-lg mb-2">3. Pemanfaatan</h3>
                           <div className="text-sm font-medium text-slate-500 mb-1">Peternak Hewan</div>
                           <p className="text-xs text-slate-400">Manggot sebagai pakan ternak berkualitas dan menjual hasil peternakan kepada mitra lainnya</p>
                           <div className="mt-4 px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">Produk Ternak</div>
                       </motion.div>

                       {/* NODE 4: ENERGY (Now Light Theme) */}
                       <motion.div variants={fadeInUp} className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:border-yellow-500 transition-all hover:shadow-xl group h-full flex flex-col items-center text-center">
                           <div className="w-16 h-16 rounded-full bg-yellow-50 flex items-center justify-center mb-4 group-hover:bg-yellow-100 transition-colors">
                               <Zap className="h-8 w-8 text-yellow-500" />
                           </div>
                           <h3 className="font-bold text-lg mb-2 text-slate-900">4. Waste to Energy</h3>
                           <div className="text-sm font-medium text-slate-500 mb-1">Energi Terbarukan</div>
                           <p className="text-xs text-slate-400">Mengolah limbah sisa pangan dan hasil mitra peternakan menjadi energi, yang dapat disalurkan kembali</p>
                           <div className="mt-4 px-3 py-1 bg-yellow-50 text-yellow-700 text-xs rounded-full">Energi Bersih</div>
                       </motion.div>
                  </div>
              </motion.div>
          </div>
          
          {/* Aesthetic Divider */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
              <svg className="relative block w-[calc(100%+1.3px)] h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                  <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-slate-900"></path>
              </svg>
          </div>
      </section>

      {/* 4. MOBILE APP SECTION */}
      <section id="aplikasi" className="py-20 md:py-32 bg-slate-900 text-white overflow-hidden">
          <div className="container mx-auto px-4">
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="flex flex-col md:flex-row items-center gap-16"
              >
                   {/* Phone Graphic Placeholder */}
                   <motion.div variants={fadeInUp} className="flex-1 relative flex justify-center">
                       <div className="relative w-[300px] h-[625px] bg-slate-800 rounded-[3rem] border-8 border-slate-700 shadow-2xl overflow-hidden">
                            <img src="/BerandaManggot.png" alt="BerandaManggot" />
                       </div>
                       {/* Decorative blobs */}
                       <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
                       <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
                   </motion.div>

                   {/* Features List */}
                   <motion.div variants={fadeInUp} className="flex-1 space-y-8">
                       <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                           Kelola Limbah <br/>
                           <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-400">Dalam Genggaman</span>
                       </h2>
                       <p className="text-slate-400 text-lg">
                           Pantau, jemput, dan kelola transaksi limbah organik Anda secara real-time hanya melalui satu aplikasi mobile SIRCLE.
                       </p>
                       
                       <ul className="space-y-4">
                           {[
                               "Sistem Matchmaking Cerdas",
                               "Pantau Data Real-Time",
                               "Antamuka Intuitif & User Friendly",
                               "Transaksi Aman di Tempat"
                           ].map((item, i) => (
                               <li key={i} className="flex items-center gap-3">
                                   <CheckCircle2 className="h-6 w-6 text-blue-500 shrink-0" />
                                   <span className="text-lg">{item}</span>
                               </li>
                           ))}
                       </ul>

                       <div className="pt-4 flex flex-col sm:flex-row gap-4 sm:gap-6 items-center md:items-start">
                           <img src="/download-playstore.png" alt="download-playstore" className="h-16 sm:h-20 hover:scale-105 active:scale-95 duration-200 cursor-pointer" />
                              
                              <Button size="lg" className="w-full sm:w-auto bg-blue-500 text-white hover:bg-blue-600 rounded-xl h-14 px-6 transition-all hover:scale-105 active:scale-95 duration-200">
                                  <a href="https://www.figma.com/proto/dcrgDBdLXAPYbg3MhTBFgL/MATCHGATE?page-id=0%3A1&node-id=1-3&p=f&viewport=185%2C165%2C0.13&t=HQzmShFQFxwa80uX-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=153%3A2" target="_blank" className="flex items-center justify-center w-full">
                                  <Play className="mr-2 h-5 w-5 fill-current" /> Demo Aplikasi
                                  </a>
                            </Button>
                       </div>
                   </motion.div>
              </motion.div>
          </div>
      </section>

      {/* 4.5 INNOVATION / WHY US SECTION */}
      <section className="py-20 md:py-32 bg-slate-50">
          <div className="container mx-auto px-4">
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="text-center max-w-3xl mx-auto mb-16"
              >
                  <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold mb-6 text-slate-900">
                      Mengapa Ini Adalah <span className="text-blue-600">Solusi?</span>
                  </motion.h2>
                  <motion.p variants={fadeInUp} className="text-lg text-slate-600">
                      Inovasi SIRCLE menjawab tantangan global dengan pendekatan lokal yang berdampak nyata.
                  </motion.p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8">
                  {/* Card 1: Food Waste */}
                  <motion.div 
                    variants={fadeInUp} 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 hover:shadow-2xl transition-all hover:-translate-y-2 group"
                  >
                      <div className="h-48 overflow-hidden bg-blue-50 relative">
                          <img src="/food_waste_pile.png" alt="Tantangan Food Waste" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
                      </div>
                      <div className="p-8">
                          <h3 className="text-xl font-bold mb-3 text-slate-900">Menjawab Tantangan Food Waste</h3>
                          <p className="text-slate-600 leading-relaxed text-sm">
                              Setiap tahun ton sisa pangan terbuang. Kami menyediakan sistem berbasis matchmaking yang efisien untuk mengelola sampah organik di lingkungan kita.
                          </p>
                      </div>
                  </motion.div>

                  {/* Card 2: Maggot */}
                  <motion.div 
                    variants={fadeInUp} 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 hover:shadow-2xl transition-all hover:-translate-y-2 group"
                  >
                      <div className="h-48 overflow-hidden bg-orange-50 relative">
                          <img src="/manggot_farming.png" alt="Budidaya Maggot" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                             <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
                      </div>
                      <div className="p-8">
                          <h3 className="text-xl font-bold mb-3 text-slate-900">Dukungan Budidaya Maggot</h3>
                          <p className="text-slate-600 leading-relaxed text-sm">
                              Memberdayakan peternak maggot (Black Soldier Fly) sebagai agen biokonversi utama, mengubah masalah sampah menjadi peluang pakan ternak berprotein tinggi.
                          </p>
                      </div>
                  </motion.div>

                  {/* Card 3: Economy */}
                  <motion.div 
                    variants={fadeInUp} 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 hover:shadow-2xl transition-all hover:-translate-y-2 group"
                  >
                      <div className="h-48 overflow-hidden bg-blue-50 relative">
                          <img src="/people_transacting.png" alt="Ekonomi Sirkular" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                             <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
                      </div>
                      <div className="p-8">
                          <h3 className="text-xl font-bold mb-3 text-slate-900">Menciptakan Ekonomi Sirkular</h3>
                          <p className="text-slate-600 leading-relaxed text-sm">
                              Membangun ekosistem ekonomi baru dimana sampah memiliki nilai tukar. Transaksi transparan yang menguntungkan sekolah, peternak, dan lingkungan.
                          </p>
                      </div>
                  </motion.div>
              </div>
          </div>
      </section>

      {/* 5. CTA SECTION */}
      <section className="py-24 bg-gradient-to-b from-white to-blue-50">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="container mx-auto px-4 text-center max-w-3xl"
          >
              <h2 className="text-4xl font-bold mb-6 text-slate-900">Siap Berkontribusi?</h2>
              <p className="text-xl text-slate-600 mb-10">
                  Bergabunglah dengan ratusan sekolah dan mitra lainnya dalam mewujudkan Indonesia bebas sampah pangan.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link href="/login">
                      <Button size="lg" className="w-full sm:w-auto px-10 h-14 text-lg rounded-full shadow-xl shadow-blue-600/20 transition-all hover:scale-105 active:scale-95 duration-200">
                          Masuk Dashboard
                      </Button>
                  </Link>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto px-10 h-14 text-lg rounded-full transition-all hover:scale-105 active:scale-95 duration-200">
                      Hubungi Kami
                  </Button>
              </div>
          </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 bg-white border-t text-center text-slate-500 text-sm">
          <div className="container mx-auto px-4">
              <p>&copy; {new Date().getFullYear()} SIRCLE System. Hak Cipta Dilindungi.</p>
              <p className="mt-2"></p>
          </div>
      </footer>
    </div>
  );
}
