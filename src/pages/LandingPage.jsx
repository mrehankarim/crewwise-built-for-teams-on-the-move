import { useState, useEffect, useRef } from 'react'
import { Icon } from '@iconify/react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import LoginModal from '../components/LoginModal'
import RegisterModal from '../components/RegisterModal'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'

const Counter = ({ end, suffix = '' }) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0
        const dur = 1500
        const step = (ts) => {
          if (!start) start = ts
          const p = Math.min((ts - start) / dur, 1)
          setCount(Math.floor(p * end))
          if (p < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
        observer.disconnect()
      }
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end])
  return <span ref={ref}>{count}{suffix}</span>
}

const LandingPage = () => {
  const [mobileMenu, setMobileMenu] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { toggleTheme, isDark } = useTheme()
  const { user, logout, subscriptionStatus } = useAuth()

  // Redirect if already logged in
  useEffect(() => {
    if (user && user.role) {
      const role = user.role.toLowerCase();
      if (role === 'admin') navigate('/admin/dashboard')
      else if (role === 'manager') {
        if (!user.organization) navigate('/setup/organization')
        else if (subscriptionStatus !== null && !subscriptionStatus?.active) navigate('/setup/subscribe')
        else navigate('/manager/dashboard')
      }
      else if (role === 'submanager') navigate('/submanager/dashboard')
    }
  }, [user, subscriptionStatus, navigate])

  // Open modal from URL param
  useEffect(() => {
    const auth = searchParams.get('auth')
    if (auth === 'login') setLoginOpen(true)
    else if (auth === 'register') setRegisterOpen(true)
  }, [searchParams])

  useEffect(() => {
    const h = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  const features = [
    { icon: 'mdi:clipboard-check-outline', title: 'Work Orders', desc: 'Create, assign & track work orders in real-time with full audit trails.', color: 'var(--feat-violet)' },
    { icon: 'fluent:people-team-16-regular', title: 'Team Management', desc: 'Manage technicians, contractors & sub-managers with role-based access.', color: 'var(--feat-cyan)' },
    { icon: 'mdi:calendar-clock-outline', title: 'Smart Scheduling', desc: 'Drag-and-drop weekly calendar & intelligent job dispatch.', color: 'var(--feat-emerald)' },
    { icon: 'mdi:chart-timeline-variant', title: 'Analytics', desc: 'Actionable insights with live performance data and reports.', color: 'var(--feat-orange)' },
    { icon: 'mdi:package-variant-closed', title: 'Inventory', desc: 'Track parts with SKU, stock alerts & real-time valuation.', color: 'var(--feat-pink)' },
    { icon: 'mdi:account-group-outline', title: 'Client Hub', desc: 'Client profiles with locations, service history & communication.', color: 'var(--feat-amber)' },
  ]

  const openLogin = () => { setRegisterOpen(false); setLoginOpen(true) }
  const openRegister = () => { setLoginOpen(false); setRegisterOpen(true) }

  return (
    <div className="landing-root font-outfit overflow-x-hidden" data-theme-landing>

      {/* ── NAV ── */}
      <nav
        className="landing-nav"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          transition: 'all 0.4s ease',
          background: scrollY > 50 ? 'var(--landing-nav-bg)' : 'transparent',
          borderBottom: scrollY > 50 ? '1px solid var(--landing-nav-border)' : '1px solid transparent',
          backdropFilter: scrollY > 50 ? 'blur(20px)' : 'none',
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
          {/* Logo */}
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ background: 'var(--accent-gradient)', padding: '8px 10px', borderRadius: 12, boxShadow: '0 6px 20px var(--accent-shadow)', transition: 'transform 0.2s' }}>
              <Icon icon="mingcute:suitcase-line" width={20} className="text-white" />
            </div>
            <span style={{ fontSize: 20, fontWeight: 800, fontFamily: 'Space Grotesk', color: 'var(--landing-text)', letterSpacing: '-0.5px' }}>
              Crew<span style={{ color: 'var(--accent)' }}>Wise</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="landing-nav-links">
            <a href="#features" className="landing-nav-link">Features</a>
            <a href="#how" className="landing-nav-link">How It Works</a>
            <a href="#roles" className="landing-nav-link">Roles</a>
            <a href="#stats" className="landing-nav-link">Stats</a>
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="landing-theme-btn"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              id="landing-theme-toggle"
            >
              <Icon icon={isDark ? 'mdi:weather-sunny' : 'mdi:weather-night'} width={18} />
            </button>

            {user ? (
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={async () => {
                    await logout()
                  }}
                  className="landing-ghost-btn hidden-mobile"
                  id="nav-signout-btn"
                >
                  Sign Out
                </button>
                <button
                  onClick={() => {
                    const role = user.role?.toLowerCase();
                    if (role === 'admin') navigate('/admin/dashboard')
                    else if (role === 'manager') {
                      if (!user.organization) navigate('/setup/organization')
                      else navigate('/manager/dashboard')
                    }
                    else if (role === 'submanager') navigate('/submanager/dashboard')
                  }}
                  className="landing-primary-btn hidden-mobile"
                  id="nav-dashboard-btn"
                >
                  Dashboard
                  <Icon icon="mdi:arrow-right" width={16} />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={openLogin}
                  className="landing-ghost-btn hidden-mobile"
                  id="nav-signin-btn"
                >
                  Sign In
                </button>
                <button
                  onClick={openRegister}
                  className="landing-primary-btn hidden-mobile"
                  id="nav-getstarted-btn"
                >
                  Get Started
                  <Icon icon="mdi:arrow-right" width={16} />
                </button>
              </>
            )}

            {/* Mobile Hamburger */}
            <button onClick={() => setMobileMenu(!mobileMenu)} className="landing-hamburger show-mobile" id="mobile-menu-toggle">
              <Icon icon={mobileMenu ? 'mdi:close' : 'gg:menu-round'} width={22} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="landing-mobile-menu animate-slideDown">
            <a href="#features" onClick={() => setMobileMenu(false)} className="landing-mobile-link">Features</a>
            <a href="#how" onClick={() => setMobileMenu(false)} className="landing-mobile-link">How It Works</a>
            <a href="#roles" onClick={() => setMobileMenu(false)} className="landing-mobile-link">Roles</a>
            <a href="#stats" onClick={() => setMobileMenu(false)} className="landing-mobile-link">Stats</a>
              {user ? (
                <div style={{ display: 'flex', gap: 10, paddingTop: 8 }}>
                  <button onClick={async () => { setMobileMenu(false); await logout(); }} className="landing-ghost-btn" style={{ flex: 1 }}>Sign Out</button>
                  <button onClick={() => { 
                    setMobileMenu(false); 
                    const role = user.role?.toLowerCase();
                    if (role === 'admin') navigate('/admin/dashboard');
                    else if (role === 'manager') {
                      if (!user.organization) navigate('/setup/organization');
                      else navigate('/manager/dashboard');
                    }
                    else if (role === 'submanager') navigate('/submanager/dashboard');
                  }} className="landing-primary-btn" style={{ flex: 1 }}>Dashboard</button>
                </div>
              ) : (
                <>
                  <button onClick={() => { setMobileMenu(false); openLogin() }} className="landing-ghost-btn" style={{ flex: 1 }}>Sign In</button>
                  <button onClick={() => { setMobileMenu(false); openRegister() }} className="landing-primary-btn" style={{ flex: 1 }}>Get Started</button>
                </>
              )}
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="landing-hero" style={{ paddingTop: 80 }}>
        {/* Animated gradient blobs */}
        <div className="hero-blobs" aria-hidden>
          <div className="hero-blob" style={{ width: 600, height: 600, background: 'var(--blob-1)', top: -200, left: -180, animationDelay: '0s' }} />
          <div className="hero-blob" style={{ width: 500, height: 500, background: 'var(--blob-2)', top: '30%', right: -160, animationDelay: '2s' }} />
          <div className="hero-blob" style={{ width: 350, height: 350, background: 'var(--blob-3)', bottom: 0, left: '35%', animationDelay: '4s' }} />
          <div className="hero-blob" style={{ width: 250, height: 250, background: 'var(--blob-4)', top: 80, right: '25%', animationDelay: '3s' }} />
          {/* Dot grid */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, var(--landing-dot) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>

        <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto', textAlign: 'center', padding: '0 24px' }}>
          {/* Live badge */}
          <div className="hero-badge animate-slideDown">
            <div className="hero-badge-dot" />
            <span>Live & Ready — Start Managing Today</span>
          </div>

          <h1 className="hero-title animate-slideUp" style={{ animationDelay: '0.05s' }}>
            Manage Your<br />
            <span className="hero-accent">Field Crew</span>
          </h1>

          <p className="hero-sub animate-slideUp" style={{ animationDelay: '0.15s' }}>
            The all-in-one SaaS platform to assign work orders, schedule jobs,<br className="hidden-mobile" /> track your team & grow your field service business.
          </p>

          <div className="hero-cta-row animate-slideUp" style={{ animationDelay: '0.3s' }}>
            {user ? (
              <button onClick={() => {
                const role = user.role?.toLowerCase();
                if (role === 'admin') navigate('/admin/dashboard');
                else if (role === 'manager') {
                  if (!user.organization) navigate('/setup/organization');
                  else navigate('/manager/dashboard');
                }
                else if (role === 'submanager') navigate('/submanager/dashboard');
              }} className="hero-primary-btn" id="hero-cta-dashboard">
                <span>Go to Dashboard</span>
                <Icon icon="mdi:arrow-right" width={18} />
              </button>
            ) : (
              <>
                <button onClick={openRegister} className="hero-primary-btn" id="hero-cta-register">
                  <span>Start Free Trial</span>
                  <Icon icon="mdi:arrow-right" width={18} />
                </button>
                <a href="#how" className="hero-secondary-btn">
                  <Icon icon="mdi:play-circle-outline" width={20} style={{ color: 'var(--accent)' }} />
                  <span>See How It Works</span>
                </a>
              </>
            )}
          </div>

          {/* Dashboard Preview */}
          <div className="dashboard-preview animate-slideUp" style={{ animationDelay: '0.5s' }}>
            <div className="dashboard-glow" aria-hidden />
            <div className="dashboard-window">
              <div className="dashboard-titlebar">
                <div style={{ display: 'flex', gap: 6 }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }} />
                </div>
                <div className="dashboard-url-bar">
                  <span>crewwise.io/manager/dashboard</span>
                </div>
              </div>
              <div style={{ padding: '16px 20px' }}>
                <div className="dashboard-stat-grid">
                  {[
                    { n: 'Active Orders', v: '24', color: 'var(--accent)' },
                    { n: 'Field Workers', v: '18', color: '#10b981' },
                    { n: 'Pending', v: '7', color: '#f59e0b' },
                    { n: 'Completed', v: '156', color: '#06b6d4' },
                  ].map((c, i) => (
                    <div key={i} className="dashboard-stat-card">
                      <p className="dashboard-stat-label">{c.n}</p>
                      <p className="dashboard-stat-val" style={{ color: c.color }}>{c.v}</p>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                  <div className="dashboard-chart-block" style={{ flex: 1 }}>
                    <p className="dashboard-chart-label">Weekly Performance</p>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 56 }}>
                      {[55, 70, 85, 45, 90, 65, 35].map((h, i) => (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                          <div style={{ width: '100%', borderRadius: 3, background: 'var(--accent)', opacity: 0.5 + h / 200, height: `${h * 0.56}px` }} />
                          <span style={{ fontSize: 7, color: 'var(--landing-text-tertiary)' }}>{'MTWTFSS'[i]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="dashboard-chart-block" style={{ width: 120 }}>
                    <p className="dashboard-chart-label">Active Now</p>
                    {['Mike J.', 'Sarah W.', 'David C.'].map((n, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                        <div style={{ width: 22, height: 22, borderRadius: '50%', background: ['var(--accent)', '#ec4899', '#10b981'][i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: '#fff' }}>{n[0]}</div>
                        <span style={{ fontSize: 9, color: 'var(--landing-text-secondary)', flex: 1 }}>{n}</span>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} className="animate-pulse-soft" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section id="stats" className="landing-section">
        <div className="landing-section-inner">
          <div className="stats-grid">
            {[
              { v: 10, s: 'K+', l: 'Work Orders Completed', icon: 'mdi:clipboard-check', color: 'var(--accent)' },
              { v: 500, s: '+', l: 'Active Organizations', icon: 'mdi:office-building', color: '#06b6d4' },
              { v: 98, s: '%', l: 'Customer Satisfaction', icon: 'mdi:star', color: '#10b981' },
              { v: 24, s: '/7', l: 'Support Available', icon: 'mdi:headset', color: '#f59e0b' },
            ].map((s, i) => (
              <div key={i} className="stat-card">
                <div className="stat-icon" style={{ background: s.color + '18', color: s.color }}>
                  <Icon icon={s.icon} width={20} />
                </div>
                <p className="stat-value" style={{ color: s.color }}>
                  <Counter end={s.v} suffix={s.s} />
                </p>
                <p className="stat-label">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="landing-section landing-section-alt">
        <div className="landing-section-inner">
          <div className="section-header">
            <span className="section-eyebrow">Features</span>
            <h2 className="section-title">Powerful Tools for Field Ops</h2>
            <p className="section-sub">Everything your field service team needs, nothing extra.</p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card themed-card" id={`feature-${i}`}>
                <div className="feature-icon" style={{ background: f.color + '18', color: f.color }}>
                  <Icon icon={f.icon} width={22} />
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="landing-section">
        <div className="landing-section-inner">
          <div className="section-header">
            <span className="section-eyebrow" style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>How It Works</span>
            <h2 className="section-title">4 Steps to Success</h2>
          </div>
          <div className="steps-grid">
            {[
              { s: '01', icon: 'mdi:account-plus-outline', t: 'Sign Up', d: 'Register as an organization manager in seconds.', color: 'var(--accent)' },
              { s: '02', icon: 'mdi:credit-card-outline', t: 'Choose Plan', d: 'Pick the subscription that fits your team size.', color: '#06b6d4' },
              { s: '03', icon: 'mdi:office-building-outline', t: 'Setup Org', d: 'Create your organization & invite sub-managers.', color: '#10b981' },
              { s: '04', icon: 'mdi:rocket-launch-outline', t: 'Launch', d: 'Start creating orders & managing your crew.', color: '#f59e0b' },
            ].map((item, i) => (
              <div key={i} className="step-card" id={`step-${i}`}>
                <div className="step-number">{item.s}</div>
                <div className="step-icon-wrap" style={{ background: item.color + '18', color: item.color }}>
                  <Icon icon={item.icon} width={26} />
                </div>
                <h3 className="step-title">{item.t}</h3>
                <p className="step-desc">{item.d}</p>
                {i < 3 && <div className="step-arrow" aria-hidden><Icon icon="mdi:chevron-right" width={22} /></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROLES ── */}
      <section id="roles" className="landing-section landing-section-alt">
        <div className="landing-section-inner">
          <div className="section-header">
            <span className="section-eyebrow" style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Roles</span>
            <h2 className="section-title">Built for Every Role</h2>
            <p className="section-sub">Clear hierarchy, clear access — everyone knows their scope.</p>
          </div>
          <div className="roles-grid">
            {[
              { icon: 'mdi:shield-crown-outline', t: 'Manager', d: 'Organization owner with full control — workers, orders, clients, billing & reports.', badge: 'Web App', badgeColor: 'var(--accent)', canSignUp: true, color: 'var(--accent)' },
              { icon: 'mdi:account-supervisor-outline', t: 'Sub-Manager', d: 'Day-to-day operations with scoped permissions. Created by manager — login only.', badge: 'Web App', badgeColor: '#06b6d4', canSignUp: false, color: '#06b6d4' },
              { icon: 'mdi:tools', t: 'Technician', d: 'View assigned jobs, update status, log time & manage tasks from mobile.', badge: 'Mobile App', badgeColor: '#10b981', canSignUp: false, color: '#10b981' },
              { icon: 'mdi:briefcase-account-outline', t: 'Contractor', d: 'Accept jobs, submit field reports & manage availability on the go.', badge: 'Mobile App', badgeColor: '#f59e0b', canSignUp: false, color: '#f59e0b' },
            ].map((r, i) => (
              <div key={i} className="role-card themed-card" id={`role-${i}`}>
                <div className="role-icon" style={{ background: r.color + '18', color: r.color }}>
                  <Icon icon={r.icon} width={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <h3 className="role-title">{r.t}</h3>
                    <span className="role-badge" style={{ background: r.badgeColor + '15', color: r.badgeColor, border: `1px solid ${r.badgeColor}30` }}>
                      {r.badge}
                    </span>
                  </div>
                  <p className="role-desc">{r.d}</p>
                  {r.canSignUp && (
                    <button onClick={openRegister} className="role-cta-btn" style={{ color: r.color, border: `1px solid ${r.color}40` }} id={`role-signup-${i}`}>
                      Register as Manager <Icon icon="mdi:arrow-right" width={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="landing-section landing-cta-section">
        <div className="cta-blob" style={{ width: 500, height: 500, background: 'var(--blob-1)', top: -200, left: '15%' }} aria-hidden />
        <div className="cta-blob" style={{ width: 350, height: 350, background: 'var(--blob-2)', bottom: -100, right: '20%' }} aria-hidden />
        <div className="landing-section-inner" style={{ position: 'relative' }}>
          <div className="cta-box">
            <div className="cta-icon-wrap">
              <Icon icon="mingcute:suitcase-line" width={28} className="text-white" />
            </div>
            <h2 className="cta-title">Ready to Streamline Your Operations?</h2>
            <p className="cta-sub">Join hundreds of service companies already using CrewWise to run smarter field operations.</p>
            <div className="cta-btn-row">
              {user ? (
                <button onClick={() => {
                  const role = user.role?.toLowerCase();
                  if (role === 'admin') navigate('/admin/dashboard');
                  else if (role === 'manager') {
                    if (!user.organization) navigate('/setup/organization');
                    else navigate('/manager/dashboard');
                  }
                  else if (role === 'submanager') navigate('/submanager/dashboard');
                }} className="hero-primary-btn" id="cta-dashboard-btn">
                  <span>Go to Dashboard</span>
                  <Icon icon="mdi:arrow-right" width={18} />
                </button>
              ) : (
                <>
                  <button onClick={openRegister} className="hero-primary-btn" id="cta-register-btn">
                    <span>Get Started Free</span>
                    <Icon icon="mdi:arrow-right" width={18} />
                  </button>
                  <button onClick={openLogin} className="hero-secondary-btn" id="cta-login-btn">
                    <Icon icon="mdi:login" width={18} style={{ color: 'var(--accent)' }} />
                    <span>Sign In</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ background: 'var(--accent-gradient)', padding: '6px 8px', borderRadius: 8 }}>
              <Icon icon="mingcute:suitcase-line" width={14} className="text-white" />
            </div>
            <span style={{ fontWeight: 800, fontFamily: 'Space Grotesk', fontSize: 15, color: 'var(--landing-text)' }}>
              Crew<span style={{ color: 'var(--accent)' }}>Wise</span>
            </span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--landing-text-tertiary)' }}>
            &copy; {new Date().getFullYear()} CrewWise. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            {['mdi:twitter', 'mdi:linkedin', 'mdi:github'].map((ic, i) => (
              <a key={i} href="#" className="footer-social-link">
                <Icon icon={ic} width={18} />
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* ── MODALS ── */}
      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToRegister={openRegister}
      />
      <RegisterModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSwitchToLogin={openLogin}
      />
    </div>
  )
}

export default LandingPage
