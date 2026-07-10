'use client';

import { motion } from 'framer-motion';
import { Search, Building2, Layers, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FilterBar } from '@/components/filter/FilterBar';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* ─── HERO SECTION ─── */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-luxury">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-transparent to-charcoal/90" />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(212, 168, 67, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 168, 67, 0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 mb-8"
          >
            <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
            <span className="text-sm text-gold-light font-medium">Nội thất cao cấp - Bespoke Design</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-cream leading-tight mb-6"
          >
            Nghệ thuật
            <span className="gold-gradient"> kiến tạo </span>
            không gian
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-cream/60 max-w-2xl mx-auto mb-12 font-light"
          >
            Tra cứu nội thất căn hộ theo dự án, tòa nhà và mã căn.
            Tìm kiếm không gian sống hoàn hảo cho tổ ấm của bạn.
          </motion.p>

          {/* Quick search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm kiếm mã căn hộ, dự án..."
                className="h-14 pl-12 pr-4 rounded-xl border-border bg-glass-bg text-foreground placeholder:text-muted-foreground text-base backdrop-blur-xl"
              />
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-xs text-muted-foreground">Cuộn để khám phá</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChevronDown className="h-5 w-5 text-gold/60" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── FILTER SECTION ─── */}
      <section className="relative -mt-16 z-20 container mx-auto px-4">
        <FilterBar />
      </section>

      {/* ─── STATS SECTION ─── */}
      <section className="py-24 container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {[
            { value: '15+', label: 'Dự án', icon: Building2 },
            { value: '50+', label: 'Tòa nhà', icon: Layers },
            { value: '200+', label: 'Căn hộ mẫu', icon: Search },
            { value: '10+', label: 'Phong cách', icon: Layers },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <stat.icon className="h-6 w-6 mx-auto mb-3 text-gold/60" />
              <div className="font-heading text-3xl md:text-4xl font-bold text-cream mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── APARTMENT RESULTS ─── */}
      <section className="pb-24 container mx-auto px-4">
        <div id="results" />
        {/* Apartment grid will be rendered by FilterBar */}
      </section>
    </div>
  );
}
