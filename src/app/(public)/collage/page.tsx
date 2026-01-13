'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import Image from 'next/image'

export default function CollageHomepage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  })

  // Create smooth spring animations for parallax
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 }

  // Different parallax speeds for different layers
  const backgroundY = useSpring(useTransform(scrollYProgress, [0, 1], [0, -200]), springConfig)
  const middleY = useSpring(useTransform(scrollYProgress, [0, 1], [0, -400]), springConfig)
  const foregroundY = useSpring(useTransform(scrollYProgress, [0, 1], [0, -600]), springConfig)
  const slowY = useSpring(useTransform(scrollYProgress, [0, 1], [0, -100]), springConfig)

  // Rotation transforms
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 360])
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -360])

  // Scale transforms
  const scale1 = useTransform(scrollYProgress, [0, 0.5], [1, 1.2])

  // Countdown calculation
  const [daysUntil, setDaysUntil] = useState(0)

  useEffect(() => {
    const calculateDays = () => {
      const wedding = new Date('2026-09-19')
      const now = new Date()
      const diff = wedding.getTime() - now.getTime()
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
      setDaysUntil(days)
    }
    calculateDays()
    const interval = setInterval(calculateDays, 1000 * 60 * 60)
    return () => clearInterval(interval)
  }, [])

  return (
    <div ref={containerRef} className="relative min-h-[300vh] overflow-hidden bg-[#F5F5DC]">
      {/* Hero Section - Fixed viewport */}
      <div className="sticky top-0 h-screen overflow-hidden">
        
        {/* Background Layer - Slowest movement */}
        <motion.div 
          style={{ y: backgroundY }}
          className="absolute inset-0 z-0"
        >
          {/* Sky/Mountain Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB] via-[#F5DEB3] to-[#F5F5DC]" />
          
          {/* Background decorative elements */}
          <motion.div
            className="absolute top-[15%] left-[8%] w-32 h-32 "
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            <Image src="/images/collage/aspen-hotel-jerome.jpeg" alt="" fill className="object-contain" />
          </motion.div>

          <motion.div
            className="absolute top-[60%] right-[10%] w-40 h-40 opacity-15"
            animate={{ rotate: -360 }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          >
            <Image src="/images/collage/aspen-leaf-1.png" alt="" fill className="object-contain" />
          </motion.div>
        </motion.div>

        {/* Middle Layer - Medium movement */}
        <motion.div 
          style={{ y: middleY }}
          className="absolute inset-0 z-10 pointer-events-none"
        >
          {/* Top Left - Champagne Bottle */}
          <motion.div
            className="absolute top-[10%] left-[5%] w-48 h-48"
            style={{ rotate: -15 }}
            whileHover={{ scale: 1.1, rotate: -10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Image src="/images/collage/champagne-bottle.png" alt="" fill className="object-contain drop-shadow-2xl" />
          </motion.div>

          {/* Top Right - Wedding Rings */}
          <motion.div
            className="absolute top-[8%] right-[12%] w-36 h-36"
            style={{ rotate: 25 }}
            animate={{ 
              y: [0, -20, 0],
              rotate: [25, 30, 25]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.15 }}
          >
            <Image src="/images/collage/wedding-rings.png" alt="" fill className="object-contain drop-shadow-2xl" />
          </motion.div>

          {/* Left Side - Vinyl Record (for DJ theme) */}
          <motion.div
            className="absolute top-[35%] left-[3%] w-56 h-56"
            style={{ rotate: rotate1 }}
            whileHover={{ scale: 1.1 }}
          >
            <Image src="/images/collage/vinyl-record.png" alt="" fill className="object-contain drop-shadow-2xl" />
          </motion.div>

          {/* Right Side - Ski Equipment */}
          <motion.div
            className="absolute top-[40%] right-[5%] w-44 h-44"
            style={{ rotate: -8 }}
            animate={{ 
              y: [0, 15, 0],
              rotate: [-8, -12, -8]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.1 }}
          >
            <Image src="/images/collage/ski-equipment.png" alt="" fill className="object-contain drop-shadow-2xl" />
          </motion.div>

          {/* Bottom Left - Aspen Leaves */}
          <motion.div
            className="absolute bottom-[15%] left-[10%] w-52 h-52"
            style={{ rotate: 12 }}
            animate={{ 
              rotate: [12, 18, 12],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.15 }}
          >
            <Image src="/images/collage/aspen-leaves-bunch.png" alt="" fill className="object-contain drop-shadow-2xl" />
          </motion.div>

          {/* Bottom Right - Hiking Boots */}
          <motion.div
            className="absolute bottom-[20%] right-[15%] w-48 h-48"
            style={{ rotate: -20 }}
            whileHover={{ scale: 1.1, rotate: -15 }}
          >
            <Image src="/images/collage/hiking-boots.png" alt="" fill className="object-contain drop-shadow-2xl" />
          </motion.div>
        </motion.div>

        {/* Foreground Layer - Fastest movement */}
        <motion.div 
          style={{ y: foregroundY }}
          className="absolute inset-0 z-20 pointer-events-none"
        >
          {/* Decorative tape pieces */}
          <motion.div
            className="absolute top-[25%] left-[15%] w-32 h-16"
            style={{ rotate: 45 }}
          >
            <Image src="/images/collage/tape-piece-1.png" alt="" fill className="object-contain opacity-80" />
          </motion.div>

          <motion.div
            className="absolute top-[55%] right-[20%] w-28 h-14"
            style={{ rotate: -35 }}
          >
            <Image src="/images/collage/tape-piece-2.png" alt="" fill className="object-contain opacity-80" />
          </motion.div>

          {/* Polaroid Photos */}
          <motion.div
            className="absolute top-[18%] right-[8%] w-40 h-48"
            style={{ rotate: 8 }}
            whileHover={{ scale: 1.1, rotate: 12, zIndex: 50 }}
            className="cursor-pointer"
          >
            <Image src="/images/collage/polaroid-photo-1.png" alt="" fill className="object-contain drop-shadow-2xl" />
          </motion.div>

          <motion.div
            className="absolute bottom-[25%] left-[8%] w-40 h-48"
            style={{ rotate: -12 }}
            whileHover={{ scale: 1.1, rotate: -8, zIndex: 50 }}
            className="cursor-pointer-2"
          >
            <Image src="/images/collage/polaroid-photo-2.png" alt="" fill className="object-contain drop-shadow-2xl" />
          </motion.div>

          {/* DJ Headphones */}
          <motion.div
            className="absolute bottom-[35%] right-[8%] w-44 h-44"
            style={{ rotate: 15 }}
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.15, rotate: 20 }}
          >
            <Image src="/images/collage/dj-headphones.png" alt="" fill className="object-contain drop-shadow-2xl" />
          </motion.div>

          {/* Pine Trees */}
          <motion.div
            className="absolute top-[45%] left-[12%] w-36 h-36"
            style={{ rotate: -5 }}
            whileHover={{ scale: 1.1 }}
          >
            <Image src="/images/collage/pine-trees.png" alt="" fill className="object-contain drop-shadow-2xl" />
          </motion.div>

          {/* Sticker elements */}
          <motion.div
            className="absolute top-[70%] right-[25%] w-24 h-24"
            style={{ rotate: -25 }}
            whileHover={{ scale: 1.2, rotate: -20 }}
          >
            <Image src="/images/collage/heart-sticker.png" alt="" fill className="object-contain drop-shadow-xl" />
          </motion.div>
        </motion.div>

        {/* Main Content - Always centered */}
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center px-6 pointer-events-auto"
          >
            {/* Hero Content Card */}
            <motion.div 
              className="bg-white/60 backdrop-blur-xl rounded-[40px] p-8 md:p-12 lg:p-16 shadow-2xl border-4 border-white/80 max-w-4xl mx-auto"
              style={{ rotate: -1 }}
              whileHover={{ rotate: 0, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Names */}
              <motion.h1 
                className="font-black text-5xl md:text-7xl lg:text-8xl text-[#01411C] mb-2 leading-none tracking-tight"
                style={{ fontFamily: "'Epilogue', sans-serif" }}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                TYLER
              </motion.h1>
              
              <motion.div 
                className="text-4xl md:text-5xl lg:text-6xl text-[#B87333] my-4 italic font-serif"
                initial={{ rotate: -10, opacity: 0 }}
                animate={{ rotate: -5, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                &
              </motion.div>
              
              <motion.h1 
                className="font-black text-5xl md:text-7xl lg:text-8xl text-[#01411C] mb-8 leading-none tracking-tight"
                style={{ fontFamily: "'Epilogue', sans-serif" }}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                [PARTNER]
              </motion.h1>

              {/* Date Badge */}
              <motion.div 
                className="inline-block bg-white py-5 px-10 rounded-full shadow-xl mb-6 relative"
                style={{ rotate: 2, boxShadow: '0 0 0 6px #D4A373' }}
                whileHover={{ rotate: -2, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="absolute -top-4 -right-4 text-4xl">✨</div>
                <p className="font-bold text-xl md:text-2xl text-[#01411C] tracking-wider" style={{ fontFamily: "'Epilogue', sans-serif" }}>
                  SEPTEMBER 19, 2026
                </p>
                <p className="text-lg md:text-xl text-[#2D5016] font-semibold mt-1">
                  Aspen, Colorado
                </p>
              </motion.div>

              {/* Countdown */}
              <motion.div 
                className="inline-block bg-[#800020] text-white py-8 px-12 rounded-2xl shadow-2xl mb-8 relative overflow-hidden"
                style={{ rotate: -2 }}
                whileHover={{ rotate: 2, scale: 1.05 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                <p className="font-black text-5xl md:text-6xl mb-2" style={{ fontFamily: "'Epilogue', sans-serif" }}>
                  {daysUntil}
                </p>
                <p className="text-sm md:text-base uppercase tracking-widest opacity-90">
                  Days Until We Say "I Do"
                </p>
              </motion.div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.a
                  href="/login"
                  className="bg-[#B87333] text-white font-bold py-4 px-10 rounded-full shadow-xl hover:shadow-2xl transition-all"
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ fontFamily: "'Epilogue', sans-serif" }}
                >
                  LOGIN & RSVP 💌
                </motion.a>
                <motion.a
                  href="/our-story"
                  className="bg-white text-[#01411C] font-bold py-4 px-10 rounded-full shadow-xl hover:shadow-2xl border-3 border-[#9CAF88] transition-all"
                  whileHover={{ scale: 1.05, rotate: 2, backgroundColor: '#9CAF88', color: 'white' }}
                  whileTap={{ scale: 0.95 }}
                  style={{ fontFamily: "'Epilogue', sans-serif" }}
                >
                  OUR STORY 📖
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg className="w-8 h-12 stroke-[#B87333]" fill="none" strokeWidth="3">
            <rect x="4" y="4" rx="12" ry="12" width="16" height="32" />
            <motion.circle 
              cx="12" 
              cy="12" 
              r="3"
              fill="#B87333"
              animate={{ cy: [12, 28, 12] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </motion.div>
      </div>

      {/* Quick Links - Fixed position */}
      <motion.div 
        className="fixed bottom-8 right-8 z-50 flex flex-col gap-3 hidden md:flex"
        initial={{ x: 200 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, delay: 2, staggerChildren: 0.1 }}
      >
        {[
          { label: '📅 DETAILS', href: '/details' },
          { label: '✈️ TRAVEL', href: '/travel' },
          { label: '📸 GALLERY', href: '/gallery' },
          { label: '🎁 REGISTRY', href: '/registry' },
        ].map((link, i) => (
          <motion.a
            key={link.href}
            href={link.href}
            className="bg-white text-[#01411C] font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all"
            initial={{ x: 200 }}
            animate={{ x: 0 }}
            transition={{ delay: 2 + i * 0.1 }}
            whileHover={{ x: -10, scale: 1.05, backgroundColor: '#F4A460', color: 'white' }}
            style={{ fontFamily: "'Epilogue', sans-serif", fontSize: '14px' }}
          >
            {link.label}
          </motion.a>
        ))}
      </motion.div>
    </div>
  )
}
