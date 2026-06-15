import { useState, useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink: #0a0a0f;
    --paper: #f5f3ee;
    --accent: #ff4d00;
    --accent2: #0057ff;
    --muted: #6b6b72;
    --border: rgba(10,10,15,0.12);
    --card-bg: #ffffff;
    --font-display: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }

  body { background: var(--paper); color: var(--ink); font-family: var(--font-body); overflow-x: hidden; }

  /* NAV */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.1rem 4rem;
    background: rgba(245,243,238,0.85);
    backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--border);
    transition: all 0.3s;
  }
  .nav.scrolled { padding: 0.75rem 4rem; box-shadow: 0 2px 24px rgba(0,0,0,0.07); }
  .nav-logo {
    font-family: var(--font-display); font-weight: 800; font-size: 1.45rem;
    letter-spacing: -0.03em; color: var(--ink); text-decoration: none;
    display: flex; align-items: center; gap: 0.4rem;
  }
  .nav-logo span { color: var(--accent); }
  .nav-links { display: flex; gap: 2.2rem; list-style: none; }
  .nav-links a {
    font-size: 0.875rem; font-weight: 500; color: var(--ink);
    text-decoration: none; letter-spacing: 0.01em;
    opacity: 0.75; transition: opacity 0.2s;
  }
  .nav-links a:hover { opacity: 1; }
  .nav-cta {
    background: var(--ink); color: var(--paper);
    padding: 0.55rem 1.4rem; border-radius: 100px;
    font-size: 0.85rem; font-weight: 600; text-decoration: none;
    transition: background 0.2s, transform 0.15s;
    font-family: var(--font-display);
  }
  .nav-cta:hover { background: var(--accent); transform: translateY(-1px); }
  .nav-mobile-btn { display: none; background: none; border: none; font-size: 1.5rem; cursor: pointer; }
  .mobile-menu {
    display: none; position: fixed; inset: 0; z-index: 200;
    background: var(--ink); flex-direction: column; align-items: center;
    justify-content: center; gap: 2rem;
  }
  .mobile-menu.open { display: flex; }
  .mobile-menu a {
    font-family: var(--font-display); font-size: 2rem; font-weight: 700;
    color: var(--paper); text-decoration: none;
  }
  .mobile-close {
    position: absolute; top: 1.5rem; right: 2rem; background: none;
    border: none; color: var(--paper); font-size: 2rem; cursor: pointer;
  }

  /* HERO */
  .hero {
    min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr;
    align-items: center; padding: 8rem 4rem 4rem;
    position: relative; overflow: hidden;
    gap: 2rem;
  }
  .hero-bg {
    position: absolute; inset: 0; z-index: 0;
    background: radial-gradient(ellipse 80% 60% at 70% 50%, rgba(0,87,255,0.06) 0%, transparent 70%),
                radial-gradient(ellipse 40% 40% at 20% 80%, rgba(255,77,0,0.05) 0%, transparent 60%);
  }
  .hero-grain {
    position: absolute; inset: 0; z-index: 1;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none;
  }
  .hero-left { position: relative; z-index: 2; }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: rgba(255,77,0,0.08); border: 1px solid rgba(255,77,0,0.2);
    padding: 0.35rem 0.9rem; border-radius: 100px; font-size: 0.78rem;
    font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 1.5rem;
  }
  .hero-badge::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  .hero-title {
    font-family: var(--font-display); font-size: clamp(2.8rem, 5vw, 4.5rem);
    font-weight: 800; line-height: 1.05; letter-spacing: -0.04em;
    color: var(--ink); margin-bottom: 1.5rem;
  }
  .hero-title .highlight { color: var(--accent); position: relative; }
  .hero-title .highlight2 { color: var(--accent2); }
  .hero-sub {
    font-size: 1.1rem; color: var(--muted); line-height: 1.7;
    max-width: 480px; margin-bottom: 2.5rem; font-weight: 300;
  }
  .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
  .btn-primary {
    background: var(--ink); color: var(--paper);
    padding: 0.85rem 2rem; border-radius: 100px;
    font-family: var(--font-display); font-weight: 700; font-size: 0.95rem;
    text-decoration: none; transition: all 0.2s; display: inline-flex; align-items: center; gap: 0.5rem;
  }
  .btn-primary:hover { background: var(--accent); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,77,0,0.3); }
  .btn-secondary {
    background: transparent; color: var(--ink);
    padding: 0.85rem 2rem; border-radius: 100px;
    border: 1.5px solid var(--border);
    font-family: var(--font-display); font-weight: 600; font-size: 0.95rem;
    text-decoration: none; transition: all 0.2s;
  }
  .btn-secondary:hover { border-color: var(--ink); transform: translateY(-2px); }
  .hero-stats {
    display: flex; gap: 2.5rem; margin-top: 3rem;
    padding-top: 2rem; border-top: 1px solid var(--border);
  }
  .stat-num {
    font-family: var(--font-display); font-size: 2rem; font-weight: 800;
    color: var(--ink); letter-spacing: -0.03em;
  }
  .stat-num span { color: var(--accent); }
  .stat-label { font-size: 0.8rem; color: var(--muted); margin-top: 0.15rem; font-weight: 500; }

  .hero-right { position: relative; z-index: 2; display: flex; justify-content: center; align-items: center; }
  .hero-visual {
    width: 100%; max-width: 480px; aspect-ratio: 1;
    position: relative;
  }
  .hero-orbit {
    position: absolute; inset: 0;
    border: 1px dashed rgba(10,10,15,0.1); border-radius: 50%;
    animation: spin 20s linear infinite;
  }
  .hero-orbit:nth-child(2) { inset: 15%; animation-duration: 14s; animation-direction: reverse; border-color: rgba(255,77,0,0.15); }
  .hero-orbit:nth-child(3) { inset: 30%; animation-duration: 9s; border-color: rgba(0,87,255,0.15); }
  @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
  .orbit-dot {
    position: absolute; width: 10px; height: 10px;
    border-radius: 50%; background: var(--accent);
    top: -5px; left: 50%; transform: translateX(-50%);
  }
  .orbit-dot2 { background: var(--accent2); top: auto; bottom: -5px; }
  .hero-center-card {
    position: absolute; inset: 35%;
    background: var(--ink); border-radius: 24px;
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 0.3rem;
    box-shadow: 0 20px 60px rgba(10,10,15,0.3);
  }
  .hero-center-icon { font-size: 2rem; }
  .hero-center-text { font-family: var(--font-display); font-size: 0.7rem; font-weight: 700; color: var(--paper); letter-spacing: 0.05em; }

  .floating-card {
    position: absolute; background: white; border-radius: 16px;
    padding: 0.9rem 1.2rem; box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    font-size: 0.8rem; font-weight: 600;
    display: flex; align-items: center; gap: 0.6rem;
    animation: float 4s ease-in-out infinite;
  }
  .floating-card:nth-child(5) { top: 8%; left: -5%; animation-delay: -2s; }
  .floating-card:nth-child(6) { bottom: 10%; right: -5%; animation-delay: -1s; }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  .fc-icon { font-size: 1.2rem; }

  /* TICKER */
  .ticker {
    background: var(--ink); color: var(--paper);
    padding: 0.9rem 0; overflow: hidden;
    border-top: 1px solid rgba(255,255,255,0.05);
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .ticker-track {
    display: flex; gap: 3rem; animation: ticker 20s linear infinite;
    white-space: nowrap;
  }
  .ticker-item {
    font-family: var(--font-display); font-size: 0.85rem;
    font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
    display: flex; align-items: center; gap: 1rem; flex-shrink: 0;
  }
  .ticker-dot { color: var(--accent); font-size: 1.2rem; }
  @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }

  /* SECTION SHARED */
  .section { padding: 6rem 4rem; }
  .section-label {
    font-size: 0.75rem; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--accent); margin-bottom: 0.8rem;
    display: flex; align-items: center; gap: 0.6rem;
  }
  .section-label::before { content: ''; flex: 0 0 24px; height: 2px; background: var(--accent); }
  .section-title {
    font-family: var(--font-display); font-size: clamp(2rem, 3.5vw, 3rem);
    font-weight: 800; letter-spacing: -0.03em; line-height: 1.1;
    max-width: 640px;
  }
  .section-sub {
    color: var(--muted); font-size: 1rem; line-height: 1.7;
    max-width: 560px; margin-top: 1rem; font-weight: 300;
  }

  /* WHY US */
  .why-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 3rem; margin-top: 4rem; align-items: start;
  }
  .why-features {
    display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;
  }
  .feature-card {
    background: var(--card-bg); border: 1px solid var(--border);
    border-radius: 20px; padding: 1.8rem; position: relative; overflow: hidden;
    transition: transform 0.3s, box-shadow 0.3s;
  }
  .feature-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(0,0,0,0.08); }
  .feature-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    transform: scaleX(0); transform-origin: left; transition: transform 0.3s;
  }
  .feature-card:hover::before { transform: scaleX(1); }
  .feature-icon { font-size: 1.8rem; margin-bottom: 0.8rem; }
  .feature-title { font-family: var(--font-display); font-size: 0.95rem; font-weight: 700; margin-bottom: 0.4rem; }
  .feature-desc { font-size: 0.82rem; color: var(--muted); line-height: 1.6; }
  .why-image {
    border-radius: 24px; overflow: hidden; position: relative;
    background: var(--ink); aspect-ratio: 4/5;
    display: flex; align-items: flex-end;
  }
  .why-img-inner {
    width: 100%; height: 100%;
    background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 40%, #16213e 100%);
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 1rem; padding: 2rem; position: relative;
  }
  .why-big-text {
    font-family: var(--font-display); font-size: 5rem; font-weight: 800;
    color: rgba(255,255,255,0.04); line-height: 1; position: absolute;
    top: 1rem; left: 1.5rem; user-select: none;
  }
  .why-quote {
    font-family: var(--font-display); font-size: 1.4rem; font-weight: 700;
    color: var(--paper); line-height: 1.3; text-align: center; position: relative; z-index: 1;
  }
  .why-quote span { color: var(--accent); }
  .why-counter {
    display: flex; gap: 2rem; position: relative; z-index: 1;
  }
  .wc-item { text-align: center; }
  .wc-num { font-family: var(--font-display); font-size: 1.8rem; font-weight: 800; color: var(--paper); }
  .wc-num span { color: var(--accent); }
  .wc-label { font-size: 0.7rem; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.08em; }

  /* EXPERTISE */
  .expertise { background: var(--ink); color: var(--paper); }
  .expertise .section-label { color: var(--accent); }
  .expertise .section-label::before { background: var(--accent); }
  .expertise .section-title { color: var(--paper); }
  .expertise .section-sub { color: rgba(255,255,255,0.5); }
  .expertise-cards {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem; margin-top: 3.5rem;
  }
  .exp-card {
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px; padding: 2rem; transition: all 0.3s; cursor: default;
  }
  .exp-card:hover { background: rgba(255,77,0,0.1); border-color: rgba(255,77,0,0.3); transform: translateY(-4px); }
  .exp-num { font-family: var(--font-display); font-size: 3rem; font-weight: 800; color: rgba(255,255,255,0.06); line-height: 1; }
  .exp-icon { font-size: 2rem; margin: 0.5rem 0; }
  .exp-title { font-family: var(--font-display); font-size: 1rem; font-weight: 700; color: var(--paper); margin-bottom: 0.5rem; }
  .exp-desc { font-size: 0.82rem; color: rgba(255,255,255,0.45); line-height: 1.65; }

  /* HOW IT WORKS */
  .steps-wrapper {
    display: flex; flex-direction: column; gap: 0; margin-top: 4rem;
    position: relative;
  }
  .steps-line {
    position: absolute; left: 24px; top: 24px; bottom: 24px; width: 2px;
    background: linear-gradient(to bottom, var(--accent), var(--accent2));
  }
  .step-row {
    display: flex; gap: 2rem; padding: 1.5rem 0; padding-left: 0;
    border-bottom: 1px solid var(--border); transition: all 0.2s;
    position: relative;
  }
  .step-row:last-child { border-bottom: none; }
  .step-row:hover .step-content { transform: translateX(4px); }
  .step-num {
    flex: 0 0 48px; height: 48px; border-radius: 50%;
    background: var(--ink); color: var(--paper);
    font-family: var(--font-display); font-weight: 800; font-size: 0.9rem;
    display: flex; align-items: center; justify-content: center; z-index: 1;
    box-shadow: 0 0 0 4px var(--paper);
  }
  .step-content { transition: transform 0.2s; }
  .step-title { font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; margin-bottom: 0.3rem; }
  .step-desc { font-size: 0.88rem; color: var(--muted); line-height: 1.65; max-width: 500px; }

  .how-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: start; }

  /* IMPACT */
  .impact { background: #f0ede6; }
  .impact-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-top: 3rem;
  }
  .impact-card {
    background: var(--card-bg); border-radius: 20px; padding: 2rem;
    border: 1px solid var(--border); position: relative; overflow: hidden;
  }
  .impact-card::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 4px;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
  }
  .impact-icon { font-size: 2rem; margin-bottom: 1rem; }
  .impact-title { font-family: var(--font-display); font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; }
  .impact-desc { font-size: 0.82rem; color: var(--muted); line-height: 1.65; }

  /* GET STARTED */
  .get-started { background: var(--ink); }
  .gs-header { display: flex; justify-content: space-between; align-items: flex-end; }
  .gs-header .section-title { color: var(--paper); }
  .gs-header .section-label { color: var(--accent); }
  .gs-header .section-label::before { background: var(--accent); }
  .gs-steps {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem;
    margin-top: 3.5rem;
  }
  .gs-step {
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px; padding: 2rem; position: relative; overflow: hidden;
    transition: all 0.3s;
  }
  .gs-step:hover { background: rgba(255,255,255,0.07); transform: translateY(-4px); }
  .gs-step-num {
    font-family: var(--font-display); font-weight: 800; font-size: 4rem;
    color: rgba(255,255,255,0.05); line-height: 1; position: absolute; top: 0.5rem; right: 1rem;
  }
  .gs-step-title { font-family: var(--font-display); font-size: 1rem; font-weight: 700; color: var(--paper); margin-bottom: 0.5rem; margin-top: 1.5rem; }
  .gs-step-desc { font-size: 0.82rem; color: rgba(255,255,255,0.45); line-height: 1.65; }
  .gs-step-icon { font-size: 1.8rem; }

  /* CTA BANNER */
  .cta-banner {
    background: var(--accent); padding: 4rem;
    display: flex; align-items: center; justify-content: space-between;
    gap: 2rem; flex-wrap: wrap;
  }
  .cta-text { font-family: var(--font-display); font-size: clamp(1.5rem, 3vw, 2.5rem); font-weight: 800; color: var(--paper); max-width: 600px; line-height: 1.15; }
  .btn-white {
    background: var(--paper); color: var(--accent);
    padding: 1rem 2.5rem; border-radius: 100px;
    font-family: var(--font-display); font-weight: 800; font-size: 1rem;
    text-decoration: none; transition: all 0.2s; white-space: nowrap;
    flex-shrink: 0;
  }
  .btn-white:hover { transform: scale(1.04); box-shadow: 0 8px 32px rgba(0,0,0,0.2); }

  /* FOOTER */
  .footer { background: #050508; color: rgba(255,255,255,0.6); padding: 4rem 4rem 2rem; }
  .footer-top {
    display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 4rem; padding-bottom: 3rem; border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .footer-brand-name {
    font-family: var(--font-display); font-weight: 800; font-size: 1.6rem;
    color: var(--paper); letter-spacing: -0.03em; margin-bottom: 0.6rem;
  }
  .footer-brand-name span { color: var(--accent); }
  .footer-tagline { font-size: 0.82rem; line-height: 1.7; max-width: 260px; margin-bottom: 1.5rem; }
  .footer-social { display: flex; gap: 0.75rem; }
  .social-btn {
    width: 36px; height: 36px; border-radius: 50%;
    background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.9rem; text-decoration: none; transition: all 0.2s;
  }
  .social-btn:hover { background: var(--accent); border-color: var(--accent); }
  .footer-col-title { font-family: var(--font-display); font-weight: 700; font-size: 0.85rem; color: var(--paper); margin-bottom: 1.2rem; }
  .footer-links { list-style: none; display: flex; flex-direction: column; gap: 0.65rem; }
  .footer-links a { font-size: 0.82rem; color: rgba(255,255,255,0.5); text-decoration: none; transition: color 0.2s; }
  .footer-links a:hover { color: var(--paper); }
  .footer-bottom {
    display: flex; justify-content: space-between; align-items: center;
    padding-top: 2rem; font-size: 0.78rem;
  }
  .footer-legal { display: flex; gap: 1.5rem; }
  .footer-legal a { color: rgba(255,255,255,0.35); text-decoration: none; }
  .footer-legal a:hover { color: var(--paper); }

  /* RESPONSIVE */
  @media (max-width: 1024px) {
    .hero { grid-template-columns: 1fr; padding: 8rem 2rem 4rem; }
    .hero-right { display: none; }
    .why-grid { grid-template-columns: 1fr; }
    .expertise-cards { grid-template-columns: 1fr 1fr; }
    .impact-grid { grid-template-columns: 1fr 1fr; }
    .gs-steps { grid-template-columns: 1fr 1fr; }
    .footer-top { grid-template-columns: 1fr 1fr; gap: 2.5rem; }
    .how-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 768px) {
    .nav { padding: 1rem 1.5rem; }
    .nav.scrolled { padding: 0.65rem 1.5rem; }
    .nav-links, .nav-cta { display: none; }
    .nav-mobile-btn { display: block; }
    .hero { padding: 6rem 1.5rem 3rem; }
    .section { padding: 4rem 1.5rem; }
    .why-features { grid-template-columns: 1fr; }
    .expertise-cards { grid-template-columns: 1fr; }
    .impact-grid { grid-template-columns: 1fr 1fr; }
    .gs-steps { grid-template-columns: 1fr; }
    .cta-banner { padding: 2.5rem 1.5rem; flex-direction: column; }
    .footer { padding: 3rem 1.5rem 1.5rem; }
    .footer-top { grid-template-columns: 1fr; gap: 2rem; }
    .footer-bottom { flex-direction: column; gap: 1rem; text-align: center; }
    .gs-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
  }
`;

const NAV_ITEMS = ["About", "Services", "Programs", "Impact", "Contact"];

const EXPERTISE = [
  { num: "01", icon: "🎓", title: "Education Empowerment", desc: "Developing problem-solving and innovation mindset through structured curricula and real-world challenges." },
  { num: "02", icon: "💡", title: "Innovation Enabling", desc: "Supporting idea validation and structured execution so concepts move from whiteboard to reality." },
  { num: "03", icon: "🛠️", title: "Product Building", desc: "Turning concepts into functional real-world solutions with agile mentorship at every stage." },
  { num: "04", icon: "🚀", title: "Venture Creation", desc: "Helping ideas grow into scalable ventures with investment access and ecosystem partnerships." },
];

const STEPS = [
  { n: "01", title: "Learn", desc: "Master core concepts, explore problem spaces, and develop the innovation mindset through guided courses." },
  { n: "02", title: "Ideate", desc: "Transform observations into actionable ideas through structured brainstorming frameworks." },
  { n: "03", title: "Build", desc: "Turn validated ideas into working prototypes with expert mentorship and rapid iteration cycles." },
  { n: "04", title: "Scale", desc: "Develop prototypes into scalable solutions with business modeling and go-to-market strategy." },
  { n: "05", title: "Launch", desc: "Deploy your innovation with full ecosystem support, growth acceleration, and investor introductions." },
];

const IMPACT = [
  { icon: "🏆", title: "Beyond Theory", desc: "Empowering innovators to apply knowledge to real-world challenges, not just textbooks." },
  { icon: "🔍", title: "Problem Solving", desc: "Enabling structured innovation frameworks that guide from observation to solution." },
  { icon: "⚡", title: "Idea to Execution", desc: "Supporting the full journey from spark to shipped product with no steps left behind." },
  { icon: "📈", title: "Growth Catalyst", desc: "Creating sustained opportunities for growth, funding, and industry connections." },
];

const GS_STEPS = [
  { icon: "🏛️", title: "Start the Club", desc: "Launch our Innovation Club in your institution and rally fellow innovators to join the movement." },
  { icon: "💭", title: "Share Your Idea", desc: "Present your concept, pitch your vision, or express interest in club activities and programs." },
  { icon: "🤝", title: "Collaborate & Learn", desc: "Work with mentors, peers, and industry experts to refine and validate your innovation." },
  { icon: "🏗️", title: "Build Your Innovation", desc: "Start building, iterating, and scaling your innovation into a real-world solution." },
];

const TICKER_ITEMS = ["Innovation", "Ideation", "Community", "Growth", "Mentorship", "Prototyping", "Venture", "Impact"];

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{styles}</style>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
        <button className="mobile-close" onClick={() => setMobileOpen(false)}>✕</button>
        {NAV_ITEMS.map(i => <a key={i} href="#" onClick={() => setMobileOpen(false)}>{i}</a>)}
        <a href="#" className="btn-primary" onClick={() => setMobileOpen(false)}>Get Started →</a>
      </div>

      {/* NAV */}
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <a className="nav-logo" href="#">Innova<span>.</span></a>
        <ul className="nav-links">
          {NAV_ITEMS.map(i => <li key={i}><a href="#">{i}</a></li>)}
        </ul>
        <a className="nav-cta" href="#">Get Started →</a>
        <button className="nav-mobile-btn" onClick={() => setMobileOpen(true)}>☰</button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grain" />
        <div className="hero-left">
          <div className="hero-badge">🔥 Innovation Platform</div>
          <h1 className="hero-title">
            Empowering<br />
            <span className="highlight">Innovators.</span><br />
            <span className="highlight2">Building</span> Impact.
          </h1>
          <p className="hero-sub">
            An innovation platform that fuels creativity, supports problem solvers, and creates real-world impact — from idea to launch.
          </p>
          <div className="hero-actions">
            <a href="#" className="btn-primary">Explore Programs →</a>
            <a href="#" className="btn-secondary">Collaborate With Us</a>
          </div>
          <div className="hero-stats">
            <div>
              <div className="stat-num">200<span>+</span></div>
              <div className="stat-label">Innovators Mentored</div>
            </div>
            <div>
              <div className="stat-num">50<span>+</span></div>
              <div className="stat-label">Projects Launched</div>
            </div>
            <div>
              <div className="stat-num">30<span>+</span></div>
              <div className="stat-label">Partner Institutions</div>
            </div>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-visual">
            <div className="hero-orbit"><div className="orbit-dot" /></div>
            <div className="hero-orbit"><div className="orbit-dot orbit-dot2" /></div>
            <div className="hero-orbit" />
            <div className="hero-center-card">
              <div className="hero-center-icon">💡</div>
              <div className="hero-center-text">INNOVA</div>
            </div>
            <div className="floating-card">
              <span className="fc-icon">🚀</span>
              <div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"0.78rem"}}>5 Ideas Launched</div>
                <div style={{fontSize:"0.7rem",color:"#6b6b72",fontWeight:400}}>This week</div>
              </div>
            </div>
            <div className="floating-card">
              <span className="fc-icon">🏆</span>
              <div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"0.78rem"}}>Top Innovator</div>
                <div style={{fontSize:"0.7rem",color:"#6b6b72",fontWeight:400}}>Award 2024</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <div key={i} className="ticker-item">
              {item} <span className="ticker-dot">★</span>
            </div>
          ))}
        </div>
      </div>

      {/* WHY US */}
      <section className="section">
        <div className="why-grid">
          <div className="why-image">
            <div className="why-img-inner">
              <div className="why-big-text">WHY</div>
              <div className="why-quote">
                Most ideas never move<br />beyond <span>imagination.</span><br />We bridge that gap.
              </div>
              <div className="why-counter">
                <div className="wc-item">
                  <div className="wc-num">98<span>%</span></div>
                  <div className="wc-label">Completion Rate</div>
                </div>
                <div className="wc-item">
                  <div className="wc-num">4.9<span>★</span></div>
                  <div className="wc-label">Mentor Rating</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="section-label">Why Choose Us</div>
            <h2 className="section-title">The Ecosystem Ideas Have Been Waiting For</h2>
            <p className="section-sub">We provide the right ecosystem — mentorship, resources, and opportunities — to turn ideas into impactful innovations.</p>
            <div className="why-features" style={{marginTop:"2rem"}}>
              {[
                {icon:"🧠", t:"Expert Mentorship", d:"Direct guidance from industry veterans and serial entrepreneurs."},
                {icon:"⚙️", t:"Rapid Prototyping", d:"Go from concept to working prototype in record time."},
                {icon:"💰", t:"Investment Access", d:"Connect with angels, VCs, and grant opportunities."},
                {icon:"🌍", t:"Global Ecosystem", d:"Network spanning 30+ institutions and 100+ mentors."},
              ].map(f => (
                <div key={f.t} className="feature-card">
                  <div className="feature-icon">{f.icon}</div>
                  <div className="feature-title">{f.t}</div>
                  <div className="feature-desc">{f.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* EXPERTISE */}
      <section className="section expertise">
        <div className="section-label">Core Expertise</div>
        <h2 className="section-title">What We Do Best</h2>
        <p className="section-sub">Four pillars that take you from curious learner to successful venture founder.</p>
        <div className="expertise-cards">
          {EXPERTISE.map(e => (
            <div key={e.num} className="exp-card">
              <div className="exp-num">{e.num}</div>
              <div className="exp-icon">{e.icon}</div>
              <div className="exp-title">{e.title}</div>
              <div className="exp-desc">{e.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section">
        <div className="how-grid">
          <div>
            <div className="section-label">How It Works</div>
            <h2 className="section-title">Your Innovation Journey in 5 Steps</h2>
            <p className="section-sub">A structured, mentorship-driven path from idea to impact. Every step is designed to build on the last.</p>
          </div>
          <div className="steps-wrapper">
            <div className="steps-line" />
            {STEPS.map(s => (
              <div key={s.n} className="step-row">
                <div className="step-num">{s.n}</div>
                <div className="step-content">
                  <div className="step-title">{s.title}</div>
                  <div className="step-desc">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section className="section impact">
        <div className="section-label">Our Impact</div>
        <h2 className="section-title">Building the Next Generation of Creators</h2>
        <p className="section-sub">We measure success in real outcomes — products shipped, ventures funded, and innovators empowered.</p>
        <div className="impact-grid">
          {IMPACT.map(i => (
            <div key={i.title} className="impact-card">
              <div className="impact-icon">{i.icon}</div>
              <div className="impact-title">{i.title}</div>
              <div className="impact-desc">{i.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* GET STARTED */}
      <section className="section get-started">
        <div className="gs-header">
          <div>
            <div className="section-label">Get Started</div>
            <h2 className="section-title" style={{color:"var(--paper)"}}>Start Your Innovation Journey</h2>
          </div>
          <a href="#" className="btn-primary" style={{flexShrink:0}}>Join Now →</a>
        </div>
        <div className="gs-steps">
          {GS_STEPS.map((s, i) => (
            <div key={s.title} className="gs-step">
              <div className="gs-step-num">{String(i+1).padStart(2,"0")}</div>
              <div className="gs-step-icon">{s.icon}</div>
              <div className="gs-step-title">{s.title}</div>
              <div className="gs-step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <div className="cta-banner">
        <div className="cta-text">Ready to turn your idea into reality? Let's build together.</div>
        <a href="#" className="btn-white">Contact Us Today →</a>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-top">
          <div>
            <div className="footer-brand-name">Innova<span>.</span></div>
            <p className="footer-tagline">Where evolution starts. Learn. Build. Grow. We are the ecosystem your ideas have been waiting for.</p>
            <div className="footer-social">
              {["𝕏","in","f","▶"].map(s => <a key={s} href="#" className="social-btn">{s}</a>)}
            </div>
          </div>
          <div>
            <div className="footer-col-title">Explore</div>
            <ul className="footer-links">
              {["About Us","What We Do","Programs","Collaboration","Innovation Awards","Blog"].map(l => <li key={l}><a href="#">{l}</a></li>)}
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Programs</div>
            <ul className="footer-links">
              {["Innovation Club","Bootcamp","Mentorship","Hackathons","Incubation","Awards"].map(l => <li key={l}><a href="#">{l}</a></li>)}
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Contact</div>
            <ul className="footer-links">
              <li><a href="#">info@innova.studio</a></li>
              <li><a href="#">+91 98765 43210</a></li>
              <li><a href="#">Chennai, India</a></li>
              <li style={{marginTop:"1rem"}}><a href="#" className="btn-primary" style={{display:"inline-block",padding:"0.5rem 1.2rem",fontSize:"0.82rem"}}>Connect With Us →</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© 2026 Innova Innovation Studio. All rights reserved.</div>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </footer>
    </>
  );
}
