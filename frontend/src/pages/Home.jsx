import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, ArrowRight, ArrowUpRight, Github, Linkedin, Twitter, Zap, Smartphone, Palette, BarChart3, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

/* ─── animation variants ─────────────────────────────────────────────────── */
const fadeUp   = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const fadeLeft = { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7 } } };
const fadeRight= { hidden: { opacity: 0, x: 40 },  visible: { opacity: 1, x: 0, transition: { duration: 0.7 } } };
const stagger  = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };

const services = [
  { title: 'Web Development',  desc: 'Modern, responsive web applications using the latest technologies and best practices.', icon: Zap,         num: '01' },
  { title: 'Mobile Apps',      desc: 'Native and cross-platform mobile solutions for iOS and Android that users love.', icon: Smartphone,    num: '02' },
  { title: 'UI/UX Design',     desc: 'Beautiful, intuitive interfaces crafted with precision and user-centered design thinking.', icon: Palette, num: '03' },
  { title: 'Digital Strategy', desc: 'Strategic consulting and roadmapping to guide your digital transformation journey.', icon: BarChart3,   num: '04' },
];

const stats = [
  { value: '50+',  label: 'Projects Delivered' },
  { value: '30+',  label: 'Happy Clients' },
  { value: '2',    label: 'Years of Experience' },
  { value: '100%', label: 'Client Satisfaction' },
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portfolio, setPortfolio] = useState([]);
  const [contact, setContact] = useState({ name: '', email: '', message: '' });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    axios.get('/api/portfolio').then(r => setPortfolio(r.data)).catch(() => {});
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleContact = async e => {
    e.preventDefault();
    setContactLoading(true);
    try {
      await axios.post('/api/messages', contact);
      setContactSuccess('Message sent! We\'ll get back to you soon.');
      setContact({ name: '', email: '', message: '' });
      setTimeout(() => setContactSuccess(''), 5000);
    } catch { alert('Failed to send. Please try again.'); }
    finally { setContactLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#050810] text-[#e8eeff] overflow-x-hidden">

      {/* ── Dot-grid background ──────────────────────────────────────────── */}
      <div className="fixed inset-0 -z-20"
        style={{ backgroundImage: 'radial-gradient(rgba(26,36,68,0.8) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      {/* ── Ambient blobs ────────────────────────────────────────────────── */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div animate={{ y: [0,40,0], x:[0,20,0] }} transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px]" />
        <motion.div animate={{ y: [0,-40,0], x:[0,-20,0] }} transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/2 -right-32 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />
        <motion.div animate={{ y: [0,30,0] }} transition={{ duration: 12, repeat: Infinity }}
          className="absolute -bottom-32 left-1/3 w-[400px] h-[400px] bg-cyan-400/5 rounded-full blur-[100px]" />
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* NAVBAR                                                            */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <motion.nav initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#050810]/90 backdrop-blur-xl border-b border-[#1a2444]/80 shadow-lg shadow-black/20'
                   : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/30 rounded-lg blur-md group-hover:blur-lg transition-all" />
              <img src="/logo.png" alt="Spectra" className="relative h-9 w-9 rounded-lg" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight">Spectra</span>
              <span className="block text-[10px] text-[#06b6d4] leading-none tracking-widest uppercase">by Yanova</span>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-1">
            {['Services', 'Portfolio', 'About', 'Contact'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`}
                className="px-4 py-2 text-sm text-[#8b94c4] hover:text-white rounded-lg hover:bg-white/5 transition-all">
                {item}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a href="#contact"
              className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-[#06b6d4] to-[#a855f7] text-[#050810] rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-105 transition-all">
              Start a Project
            </a>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-[#06b6d4]">
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#0a1020]/95 backdrop-blur-xl border-t border-[#1a2444] px-6 py-4 space-y-1">
            {['Services', 'Portfolio', 'About', 'Contact'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-[#8b94c4] hover:text-white hover:bg-white/5 rounded-lg transition-all">
                {item}
              </a>
            ))}
            <a href="#contact" onClick={() => setMobileMenuOpen(false)}
              className="block mt-2 px-4 py-3 bg-gradient-to-r from-[#06b6d4] to-[#a855f7] text-[#050810] rounded-xl font-semibold text-center">
              Start a Project
            </a>
          </motion.div>
        )}
      </motion.nav>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* HERO                                                              */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-24 pb-16">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            {/* Badge */}
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 bg-[#06b6d4]/10 border border-[#06b6d4]/30 rounded-full text-sm text-[#06b6d4] mb-8">
              <span className="w-2 h-2 bg-[#06b6d4] rounded-full animate-pulse" />
              Available for new projects
            </motion.div>

            {/* Heading */}
            <motion.h1 variants={fadeUp} className="text-5xl md:text-6xl xl:text-7xl font-bold leading-[1.05] mb-6">
              We Build{' '}
              <span className="relative inline-block">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#06b6d4] via-[#a855f7] to-[#06b6d4] bg-[length:200%]"
                  style={{ WebkitBackgroundClip: 'text' }}>
                  Digital
                </span>
                <motion.span className="absolute -bottom-1 left-0 h-[3px] w-full bg-gradient-to-r from-[#06b6d4] to-[#a855f7] rounded-full"
                  initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.8, duration: 0.6 }} />
              </span>
              <br />
              That Converts
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg text-[#7a8ab8] mb-10 leading-relaxed max-w-lg">
              Spectra is a cutting-edge digital agency crafting web apps, mobile experiences, and design systems that help ambitious brands scale.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-14">
              <a href="#contact"
                className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#06b6d4] to-[#a855f7] text-[#050810] rounded-xl font-bold text-sm hover:shadow-xl hover:shadow-cyan-500/30 hover:scale-105 transition-all">
                Start Your Project
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#portfolio"
                className="flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-semibold text-sm hover:bg-white/10 hover:border-[#06b6d4]/50 transition-all">
                View Our Work
              </a>
            </motion.div>

            {/* Inline stats */}
            <motion.div variants={fadeUp} className="grid grid-cols-4 gap-6 pt-8 border-t border-[#1a2444]">
              {stats.map(s => (
                <div key={s.label}>
                  <div className="text-2xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-[#7a8ab8] leading-tight mt-0.5">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — visual */}
          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }} className="relative flex justify-center items-center">

            {/* Glow ring */}
            <div className="absolute w-80 h-80 rounded-full border border-[#06b6d4]/20 animate-spin" style={{ animationDuration: '20s' }} />
            <div className="absolute w-96 h-96 rounded-full border border-[#a855f7]/10 animate-spin" style={{ animationDuration: '30s', animationDirection: 'reverse' }} />

            {/* Logo with glow */}
            <motion.div className="relative z-10" animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-purple-500/20 rounded-full blur-3xl scale-150" />
              <img src="/logo.png" alt="Spectra" className="relative w-56 h-56 object-contain drop-shadow-2xl" />
            </motion.div>

            {/* Floating cards */}
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              className="absolute top-4 right-4 md:right-0 bg-[#0f1528]/90 backdrop-blur-xl border border-[#1a2444] rounded-2xl px-4 py-3 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <CheckCircle2 size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-white text-xs font-semibold">Project Delivered</p>
                  <p className="text-[#7a8ab8] text-[10px]">On time, every time</p>
                </div>
              </div>
            </motion.div>

            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
              className="absolute bottom-8 left-4 md:left-0 bg-[#0f1528]/90 backdrop-blur-xl border border-[#1a2444] rounded-2xl px-4 py-3 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Zap size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-white text-xs font-semibold">50+ Projects</p>
                  <p className="text-[#7a8ab8] text-[10px]">Successfully launched</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Section divider ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-[#1a2444] to-transparent" />
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SERVICES                                                          */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section id="services" className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="mb-16">
            <motion.p variants={fadeUp} className="text-[#06b6d4] text-sm font-semibold tracking-widest uppercase mb-4">
              What We Do
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold mb-4">
              Our Services
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#7a8ab8] text-lg max-w-xl">
              End-to-end digital solutions tailored to drive growth and deliver results.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid md:grid-cols-2 gap-5">
            {services.map(({ title, desc, icon: Icon, num }) => (
              <motion.div key={title} variants={fadeUp}
                className="group relative bg-[#0a1020]/60 border border-[#1a2444] rounded-2xl p-8 overflow-hidden hover:border-[#06b6d4]/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/5">
                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#06b6d4]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                <div className="relative z-10 flex items-start justify-between mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#06b6d4]/20 to-[#a855f7]/20 border border-[#06b6d4]/20 rounded-xl flex items-center justify-center group-hover:from-[#06b6d4]/30 group-hover:to-[#a855f7]/30 transition-all">
                    <Icon size={22} className="text-[#06b6d4]" />
                  </div>
                  <span className="text-4xl font-black text-[#1a2444] group-hover:text-[#1e2d50] transition-colors select-none">
                    {num}
                  </span>
                </div>
                <h3 className="relative z-10 text-xl font-bold text-white mb-3 group-hover:text-[#06b6d4] transition-colors">
                  {title}
                </h3>
                <p className="relative z-10 text-[#7a8ab8] text-sm leading-relaxed">{desc}</p>

                <div className="relative z-10 mt-6 flex items-center gap-2 text-xs text-[#06b6d4] opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ArrowRight size={12} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* PORTFOLIO                                                         */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section id="portfolio" className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <motion.p variants={fadeUp} className="text-[#a855f7] text-sm font-semibold tracking-widest uppercase mb-4">
                Case Studies
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold">
                Our Portfolio
              </motion.h2>
            </div>
            <motion.p variants={fadeUp} className="text-[#7a8ab8] max-w-sm text-sm leading-relaxed">
              A selection of our most impactful projects across various industries.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.map((project, i) => (
              <motion.div key={project.id} variants={fadeUp}
                className="group relative rounded-2xl overflow-hidden cursor-pointer"
                style={{ minHeight: '280px' }}>
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${project.color || 'from-cyan-600 to-blue-500'}`} />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-[#050810]/50 group-hover:bg-[#050810]/30 transition-all duration-500" />
                {/* Grid texture overlay */}
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                <div className="relative z-10 p-7 h-full flex flex-col justify-between">
                  <div>
                    {/* Index */}
                    <span className="text-white/30 text-xs font-mono mb-4 block">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-1">{project.name}</h3>
                    <p className="text-white/70 text-sm mb-3">{project.client}</p>
                    <p className="text-white/60 text-sm leading-relaxed">{project.description}</p>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-2 mb-5 mt-4">
                      {(project.tags || []).map(tag => (
                        <span key={tag}
                          className="text-[11px] bg-white/10 backdrop-blur-sm text-white/90 px-3 py-1 rounded-full border border-white/10">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {project.url ? (
                      <a href={project.url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-white font-semibold group/link">
                        <span className="border-b border-white/40 group-hover/link:border-white transition-colors">
                          View Project
                        </span>
                        <ArrowUpRight size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                      </a>
                    ) : (
                      <span className="text-xs text-white/30 italic">Coming soon</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* ABOUT                                                             */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section id="about" className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">

            {/* Left */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.p variants={fadeUp} className="text-[#06b6d4] text-sm font-semibold tracking-widest uppercase mb-4">
                About Us
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                A Studio Built for{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#06b6d4] to-[#a855f7]">
                  Results
                </span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-[#7a8ab8] text-lg leading-relaxed mb-8">
                Since our founding, we've helped businesses transform their digital presence and achieve remarkable growth through focused, innovative solutions.
              </motion.p>

              {/* Value props */}
              <motion.div variants={stagger} className="space-y-4">
                {[
                  { title: 'Innovation First', desc: 'Cutting-edge solutions using the latest technologies' },
                  { title: 'Quality Obsessed', desc: 'Meticulous attention to detail in every deliverable' },
                  { title: 'True Partnership', desc: 'We grow alongside our clients, not just deliver and leave' },
                ].map(item => (
                  <motion.div key={item.title} variants={fadeUp}
                    className="flex items-start gap-4 p-4 rounded-xl bg-[#0a1020]/60 border border-[#1a2444] hover:border-[#06b6d4]/30 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#06b6d4]/20 to-[#a855f7]/20 border border-[#06b6d4]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 size={14} className="text-[#06b6d4]" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{item.title}</p>
                      <p className="text-[#7a8ab8] text-sm mt-0.5">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right — stat grid */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
              className="grid grid-cols-2 gap-4">
              {stats.map((s, i) => (
                <motion.div key={s.label} variants={fadeUp}
                  className={`relative p-7 rounded-2xl border overflow-hidden ${
                    i === 0
                      ? 'bg-gradient-to-br from-[#06b6d4]/15 to-[#a855f7]/10 border-[#06b6d4]/30'
                      : 'bg-[#0a1020]/60 border-[#1a2444] hover:border-[#1a2444]/80'
                  } transition-all`}>
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-[#06b6d4]/10 to-transparent rounded-full blur-xl" />
                  <div className="relative z-10">
                    <div className={`text-4xl font-black mb-2 ${
                      i === 0 ? 'text-[#06b6d4]' : 'text-white'
                    }`}>
                      {s.value}
                    </div>
                    <div className="text-[#7a8ab8] text-sm leading-tight">{s.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Section divider ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-[#1a2444] to-transparent" />
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* CONTACT                                                           */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section id="contact" className="py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="text-center mb-14">
            <motion.p variants={fadeUp} className="text-[#06b6d4] text-sm font-semibold tracking-widest uppercase mb-4">
              Get In Touch
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold mb-4">
              Ready to Build Something{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#06b6d4] to-[#a855f7]">
                Great?
              </span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#7a8ab8] text-lg">
              Tell us about your project and we'll get back to you within 24 hours.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="relative">
            {/* Glow behind form */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#06b6d4]/5 to-[#a855f7]/5 rounded-3xl blur-xl scale-105" />

            <form onSubmit={handleContact}
              className="relative bg-[#0a1020]/80 backdrop-blur-xl border border-[#1a2444] rounded-3xl p-8 md:p-10 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { field: 'name',  type: 'text',  label: 'Your Name',  placeholder: 'John Doe' },
                  { field: 'email', type: 'email', label: 'Your Email', placeholder: 'john@example.com' },
                ].map(({ field, type, label, placeholder }) => (
                  <div key={field} className="group">
                    <label className="block text-xs font-semibold text-[#7a8ab8] uppercase tracking-wider mb-2">
                      {label}
                    </label>
                    <input type={type} value={contact[field]}
                      onChange={e => setContact(p => ({ ...p, [field]: e.target.value }))}
                      placeholder={placeholder} required
                      className="w-full px-4 py-3.5 bg-[#050810]/60 border border-[#1a2444] rounded-xl text-white placeholder-[#3a4464] focus:outline-none focus:border-[#06b6d4]/60 focus:ring-2 focus:ring-[#06b6d4]/10 transition-all text-sm" />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7a8ab8] uppercase tracking-wider mb-2">
                  Message
                </label>
                <textarea value={contact.message}
                  onChange={e => setContact(p => ({ ...p, message: e.target.value }))}
                  placeholder="Tell us about your project, timeline, and budget..." required rows={5}
                  className="w-full px-4 py-3.5 bg-[#050810]/60 border border-[#1a2444] rounded-xl text-white placeholder-[#3a4464] focus:outline-none focus:border-[#06b6d4]/60 focus:ring-2 focus:ring-[#06b6d4]/10 transition-all resize-none text-sm" />
              </div>

              {contactSuccess && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">
                  <CheckCircle2 size={16} />
                  {contactSuccess}
                </motion.div>
              )}

              <button type="submit" disabled={contactLoading}
                className="w-full py-4 bg-gradient-to-r from-[#06b6d4] to-[#a855f7] text-[#050810] font-bold rounded-xl hover:shadow-xl hover:shadow-cyan-500/25 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all text-sm tracking-wide">
                {contactLoading ? 'Sending...' : 'Send Message →'}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* FOOTER                                                            */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-[#1a2444]/60 pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-10 mb-14">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-500/20 rounded-lg blur-md" />
                  <img src="/logo.png" alt="Spectra" className="relative h-9 w-9 rounded-lg" />
                </div>
                <div>
                  <span className="text-lg font-bold text-white tracking-tight">Spectra</span>
                  <span className="block text-[10px] text-[#06b6d4] tracking-widest uppercase leading-none">by Yanova</span>
                </div>
              </div>
              <p className="text-[#7a8ab8] text-sm leading-relaxed max-w-xs">
                A digital agency building remarkable products for ambitious brands worldwide.
              </p>
              <div className="flex gap-3 mt-6">
                {[Github, Linkedin, Twitter].map(Icon => (
                  <a key={Icon.displayName} href="#"
                    className="w-9 h-9 flex items-center justify-center bg-[#0f1528] border border-[#1a2444] rounded-lg text-[#7a8ab8] hover:text-[#06b6d4] hover:border-[#06b6d4]/40 transition-all">
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              { title: 'Company',   links: ['About', 'Services', 'Portfolio', 'Contact'] },
              { title: 'Resources', links: ['Blog', 'Documentation', 'Support', 'FAQ'] },
              { title: 'Legal',     links: ['Privacy', 'Terms', 'Cookies', 'License'] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="text-white font-semibold text-sm mb-4">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map(link => (
                    <li key={link}>
                      <a href={`#${link.toLowerCase()}`}
                        className="text-[#7a8ab8] text-sm hover:text-white transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-[#1a2444]/60">
            <p className="text-[#7a8ab8] text-sm">
              &copy; {new Date().getFullYear()} Spectra. All rights reserved by Yanova.
            </p>
            <p className="text-[#3a4464] text-xs">Crafted with precision · Built to scale</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
