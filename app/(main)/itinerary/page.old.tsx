import Link from "next/link";

export default function ItineraryPage() {
  return (
    <div className="snap-container">
      {/* Hero */}
      <header className="snap-section bg-background flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          alt="Aspen mountain panorama"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkD1arSttLzCnhYmCD9nBPXpX2cdyWI6IxiXgxDzGH8wknxkCPDnwsJHJehISdA2OADiCiGqCPk1rEaRkPmU8_t7udNFpeYB7Yy7Cbs3u96WuTylKVXXwN8U8vjLRy3sQ3qCVZjahYp6NogcxARlGr7lGpANsaBO2jQCNj6Uo1k3J7NbJkLOJjMVz3nrQ-uin9X3mLBPX8a-wW39BbXzXcyr_gB6U5hTvjQJDyRezZDnm4wo6S1XWXSeF7il0QnMTfDmfInHyOt4c"
        />
        <div className="relative z-10 text-center px-6">
          <span className="font-label text-xs uppercase tracking-[0.4em] text-white/90 mb-8 block">
            The Celebration
          </span>
          <h1 className="font-headline text-6xl md:text-9xl font-bold text-white tracking-tighter leading-[0.9] mb-8">
            A Weekend In <br /> The Rocky Mountains
          </h1>
          <p className="font-headline text-lg md:text-2xl text-white/80 italic max-w-2xl mx-auto">
            Join us where the forest meets the sky as we celebrate our beginning
            amidst the peaks of Aspen.
          </p>
          <div className="mt-16 flex flex-col items-center gap-4 text-white/60">
            <span className="text-[10px] uppercase tracking-[0.3em]">
              Scroll to begin
            </span>
            <span className="material-symbols-outlined animate-bounce">
              expand_more
            </span>
          </div>
        </div>
      </header>

      {/* Friday — Welcome Drinks */}
      <section className="snap-section flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="absolute inset-0 w-full h-full object-cover"
          alt="Evening mountain lodge"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBt3upXv-wCKZcx4DeYZPh0bU2FA5ad6KNVQIBQBRNwPd1p1S7xi_tg93wC8EBLLcsFIS_AfiuXFkFQClcSp8gpGmI726N_BXd28MSWxTZB7gTLffLmNSoZY9b9aGUohjiMxFAzO4UWyxjKMqN1OZdKQsVEYJFtVEtMtNgPak-BGjG3Bz-YWQDP60y5iwqC0S8wzJqtc4m1Gr3VpnaBCgGbzGSdhjQANpt3lxNGXukhuSRglxFIQNMN93Dcorzs8yyEMYQwn6TNpCw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="relative z-10 w-full max-w-4xl mx-auto px-12 text-white">
          <div className="mb-12">
            <h2 className="font-headline text-5xl md:text-7xl mb-2">Friday</h2>
            <p className="font-label text-sm uppercase tracking-widest opacity-80">
              The Welcome
            </p>
          </div>
          <div className="backdrop-blur-md bg-white/10 p-10 md:p-16 border border-white/20 rounded-sm">
            <div className="flex items-center gap-4 mb-8">
              <span className="font-headline text-4xl">7:00 PM</span>
              <span className="w-16 h-px bg-white/40" />
              <span className="font-label text-[10px] uppercase tracking-[0.2em]">
                Evening
              </span>
            </div>
            <h3 className="font-headline text-4xl md:text-5xl mb-6">
              Welcome Drinks
            </h3>
            <p className="font-label text-xl mb-4 text-primary">
              Hotel Jerome
            </p>
            <p className="text-white/90 text-lg leading-relaxed max-w-xl">
              Casual attire. Join us for cocktails to kick off the weekend in
              one of Aspen&apos;s most historic landmarks.
            </p>
          </div>
        </div>
      </section>

      {/* Saturday — Ceremony */}
      <section className="snap-section flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="absolute inset-0 w-full h-full object-cover"
          alt="Mountain ceremony setting"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCycODteAUdKf2PYCWLiDQx3BuKCcja1uI1rHAnzcheBAQ1wwTo7qbW_AUyC8pRXansQoYUhSDxdXXhXZjhR_7GT8xFKXaaXdMI5r8nYSwmmOSQOl4Ja_cMH_V8RZxUyTR4lWyBirOu4p7M4IPSJMt9AWbKp_kcSZVPOHhZaCjNNOaNv0JAI7gzGJtYYEVhhqGNGWAOpsWPzHBviMjr56-gRPjEZpJNz5nBlYBevEPImx3_aGQMlLxFY-rj4OWLGkecN4iGF1ABj4M"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 w-full max-w-4xl mx-auto px-12 text-white">
          <div className="mb-12">
            <h2 className="font-headline text-5xl md:text-7xl mb-2">
              Saturday
            </h2>
            <p className="font-label text-sm uppercase tracking-widest opacity-80">
              The Vows
            </p>
          </div>
          <div className="backdrop-blur-md bg-black/30 p-10 md:p-16 border border-white/10 rounded-sm">
            <div className="flex items-center gap-4 mb-8">
              <span className="font-headline text-4xl">4:30 PM</span>
              <span className="w-16 h-px bg-white/40" />
              <span className="font-label text-[10px] uppercase tracking-[0.2em]">
                Ceremony
              </span>
            </div>
            <h3 className="font-headline text-4xl md:text-5xl mb-6">
              The Ceremony
            </h3>
            <p className="font-label text-xl mb-6 text-primary">
              Aspen Mountain Club
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <p className="text-white/90 text-lg leading-relaxed">
                Formal Alpine Attire. Shuttles depart from The Little Nell at
                3:45 PM for the mountain summit.
              </p>
              <div className="border-l border-white/30 pl-8 italic text-white/70">
                &ldquo;A union at ten thousand feet, surrounded by the silence
                of the peaks.&rdquo;
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Saturday — Reception */}
      <section className="snap-section flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="absolute inset-0 w-full h-full object-cover"
          alt="Evening reception dinner"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUbJV70bqgZFXtMsfc2jHgjJzEwh_NRglSBFbB-iKTrUISQqtzuenqFlIRBtUpb5ljfPTmj9snUODvmS2PACsWZ6e4cCvqM4OFeVx5kxMqdjv6sVStr4aMLKSiFaEmk3kjc5e5diZDwtmjO2ZWmYxdyyMbZn8AP4ubyAWHo2qOzs_X_TEQ25kBTsosQOF3r6800Vi0IPT-xPp3nnA2JBxgnnK-xFL62IP5yD8Vo0EOmqOANOMwfgW64DgCTCVk2HgWjnTArVg1CRM"
        />
        <div className="absolute inset-0 bg-emerald-950/60 mix-blend-multiply" />
        <div className="relative z-10 w-full max-w-4xl mx-auto px-12 text-white">
          <div className="backdrop-blur-md bg-background/80 p-10 md:p-16 border border-white/10 rounded-sm">
            <div className="flex items-center gap-4 mb-8">
              <span className="font-headline text-4xl text-primary">
                6:00 PM
              </span>
              <span className="w-16 h-px bg-white/20" />
              <span className="font-label text-[10px] uppercase tracking-[0.2em]">
                Reception
              </span>
            </div>
            <h3 className="font-headline text-4xl md:text-5xl mb-6">
              Dinner &amp; Dancing
            </h3>
            <p className="font-label text-xl mb-6 text-primary/80">
              The Terrace Garden
            </p>
            <p className="text-white/80 text-lg leading-relaxed max-w-2xl">
              Followed by a night of celebration under the stars. We will dine
              and dance until the mountain air cools and the moon is high.
            </p>
          </div>
        </div>
      </section>

      {/* Sunday — Farewell Brunch */}
      <section className="snap-section flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="absolute inset-0 w-full h-full object-cover"
          alt="Sunny mountain morning"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAY5vnewEs-XeyzX02ow_KOZqGhPnvPP4y5sh8hCXxHP0eZJdzemwJNEfT1eqpYhU_zDfB_vYRWmgjZj3-wjRqlSYBW6IYjfBfmeaq-m722O7X6LrTMAYF4Ne-isWIUWnrHhZdCmpudF1Fh3Zn3hOmnibO88QnGTxXfnP2vcwowlYOyuDoAjDtFKSbQq9KQwoBRbjC-5dE_PxynjpdiHt9c_9QFcmYIIdkHvP8NhvbGdjxnqF57b9feCmHvxVq_LuJGAAgmZTzu0yU"
        />
        <div className="absolute inset-0 bg-white/20" />
        <div className="relative z-10 w-full max-w-4xl mx-auto px-12">
          <div className="mb-12">
            <h2 className="font-headline text-5xl md:text-7xl text-background mb-2">
              Sunday
            </h2>
            <p className="font-label text-sm uppercase tracking-widest text-background/70">
              The Farewell
            </p>
          </div>
          <div className="bg-white/90 p-10 md:p-16 border border-background/10 rounded-sm shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
              <span className="font-headline text-4xl text-background">
                10:00 AM
              </span>
              <span className="w-16 h-px bg-background/20" />
              <span className="font-label text-[10px] uppercase tracking-[0.2em] text-background/60">
                Morning
              </span>
            </div>
            <h3 className="font-headline text-4xl md:text-5xl text-background mb-6">
              Farewell Brunch
            </h3>
            <p className="font-label text-xl mb-4 text-background/60">
              The Little Nell
            </p>
            <p className="text-background/70 text-lg leading-relaxed max-w-xl">
              A light send-off before your travels. We&apos;d love to say one
              last goodbye and share stories of the night before heading home.
            </p>
          </div>
        </div>
      </section>

      {/* Closing Footer Section */}
      <footer className="snap-section bg-background flex flex-col items-center justify-center text-center px-12">
        <div className="max-w-2xl mx-auto space-y-12">
          <h4 className="font-headline text-4xl md:text-5xl text-on-surface italic mb-12">
            We can&apos;t wait to see you there.
          </h4>
          <p className="font-label text-xs uppercase tracking-[0.3em] text-on-surface-variant/60 mb-24">
            Please check the Travel &amp; Stay page for shuttle details.
          </p>
          <div className="pt-24 border-t border-on-surface/10">
            <span className="font-headline text-2xl font-light text-on-surface uppercase tracking-[0.5em] block mb-8">
              EMILY &amp; TYLER
            </span>
            <div className="flex justify-center gap-12 font-headline text-[10px] tracking-[0.3em] uppercase mb-8">
              <Link
                href="mailto:hello@emilyandtyler.com"
                className="text-on-surface-variant/50 hover:text-on-surface transition-all"
              >
                Contact
              </Link>
              <Link
                href="/rsvp"
                className="text-on-surface-variant/50 hover:text-on-surface transition-all"
              >
                RSVP
              </Link>
            </div>
            <div className="text-on-surface-variant/30 font-headline text-[9px] tracking-[0.2em] uppercase">
              &copy; 2026 Emily &amp; Tyler &bull; Aspen, Colorado
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
