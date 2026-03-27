import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import { services } from '@/data/services';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="font-serif text-xl font-semibold tracking-tight text-foreground">
            Avital <span className="gradient-text">Chicago</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/chicago-limo-rental" className="nav-link">Limo Fleet</Link>
          <Link to="/chicago-party-bus-rental" className="nav-link">Party Buses</Link>
          
          <div className="relative group">
            <button className="nav-link flex items-center gap-1">
              Services <ChevronDown className="w-3 h-3" />
            </button>
            <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <div className="glass-card p-3 min-w-[220px]" style={{ background: 'rgba(20,20,24,0.95)' }}>
                {services.slice(0, 7).map((s) => (
                  <Link
                    key={s.slug}
                    to={`/services/${s.slug}`}
                    className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-md transition-colors"
                  >
                    {s.name}
                  </Link>
                ))}
                <Link to="/services" className="block px-4 py-2.5 text-sm text-primary font-medium">
                  All Services →
                </Link>
              </div>
            </div>
          </div>

          <Link to="/areas-we-serve" className="nav-link">Areas</Link>
          <Link to="/blog" className="nav-link">Blog</Link>
          <Link to="/contact-us" className="nav-link">Contact</Link>
        </nav>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <a href="tel:6305506753" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Phone className="w-4 h-4 text-primary" />
            (630) 550-6753
          </a>
          <Link to="/contact-us" className="btn-primary text-[11px] py-2.5 px-5">
            Get a Quote
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-foreground p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 top-20 z-40 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ background: 'rgba(12,12,14,0.98)', backdropFilter: 'blur(20px)' }}
      >
        <nav className="flex flex-col p-8 gap-1">
          <Link to="/" className="py-3 text-lg text-foreground border-b border-border">Home</Link>
          <Link to="/chicago-limo-rental" className="py-3 text-lg text-foreground border-b border-border">Limo Fleet</Link>
          <Link to="/chicago-party-bus-rental" className="py-3 text-lg text-foreground border-b border-border">Party Buses</Link>
          
          <button onClick={() => setServicesOpen(!servicesOpen)} className="py-3 text-lg text-foreground border-b border-border flex justify-between items-center">
            Services <ChevronDown className={`w-4 h-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
          </button>
          {servicesOpen && (
            <div className="pl-4 pb-2">
              {services.map(s => (
                <Link key={s.slug} to={`/services/${s.slug}`} className="block py-2 text-muted-foreground">{s.name}</Link>
              ))}
            </div>
          )}
          
          <Link to="/areas-we-serve" className="py-3 text-lg text-foreground border-b border-border">Areas</Link>
          <Link to="/blog" className="py-3 text-lg text-foreground border-b border-border">Blog</Link>
          <Link to="/contact-us" className="py-3 text-lg text-foreground border-b border-border">Contact</Link>
          
          <div className="mt-6 flex flex-col gap-4">
            <a href="tel:6305506753" className="flex items-center gap-2 text-foreground">
              <Phone className="w-5 h-5 text-primary" /> (630) 550-6753
            </a>
            <Link to="/contact-us" className="btn-primary text-center">Get a Quote</Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
