"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="h-screen bg-black text-white overflow-hidden relative">
      {/* Animatsiyali fon shakllari */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-2 border-white/10 rounded-full"
        />
      </div>

      {/* Asosiy kontent (markazda) */}
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-center">
        {/* Yuqori banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <span className="px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full text-sm font-medium border border-white/20 inline-flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            Yangi! CRM tizimi  versiyasi
          </span>
        </motion.div>

        {/* Asosiy sarlavha */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 text-transparent bg-clip-text">
            Mijozlar bilan munosabatlarni
            <br />
            <span className="text-white">mukammal boshqaring</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Kuchli CRM tizimi bilan mijozlar munosabatlarini boshqaring, savdolarni oshiring va vaqtingizni tejang.
          </p>
        </motion.div>

        {/* CTA tugmasi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link
            href="/dashboard"
            className="group relative px-8 py-4 bg-gradient-to-r from-yellow-400 to-pink-500 text-white rounded-full text-lg font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/25 inline-flex items-center gap-2"
          >
            <span className="relative z-10 flex items-center gap-2">
              Dashboardga o‘tish
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-pink-500 to-yellow-400"
              animate={{
                x: ["0%", "100%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ filter: "blur(20px)" }}
            />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}