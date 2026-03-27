import { Link } from 'react-router-dom';
import { Facebook, Phone, Mail, MapPin } from 'lucide-react';
import { services } from '@/data/services';

const Footer = () => {
  return (
    <footer className="relative pt-20 pb-8" style={{ background: '#0a0a0c' }}>
      <div className="gradient-divider mb-16" />
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-xl font-semibold mb-4 text-foreground">
              Avital <span className="gradient-text">Chicago</span>
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Chicago's premier luxury limousine and party bus rental service. Making every journey unforgettable since day one.
            </p>
            <a
              href="https://www.facebook.com/avitallimo/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Facebook className="w-4 h-4" /> Follow us on Facebook
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm uppercase tracking-widest text-foreground font-semibold mb-6">Quick Links</h4>
            <nav className="flex flex-col gap-3">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
              <Link to="/chicago-limo-rental" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Limo Fleet</Link>
              <Link to="/chicago-party-bus-rental" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Party Bus Fleet</Link>
              <Link to="/charter-buses" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Charter Buses</Link>
              <Link to="/areas-we-serve" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Areas We Serve</Link>
              <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
              <Link to="/contact-us" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact Us</Link>
            </nav>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm uppercase tracking-widest text-foreground font-semibold mb-6">Services</h4>
            <nav className="flex flex-col gap-3">
              {services.map(s => (
                <Link key={s.slug} to={`/services/${s.slug}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {s.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm uppercase tracking-widest text-foreground font-semibold mb-6">Contact</h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">1431 Harmony Ct, Itasca, IL 60143</span>
              </div>
              <a href="tel:6305506753" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                (630) 550-6753
              </a>
              <a href="mailto:info@avitalchicagolimousine.com" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                info@avitalchicagolimousine.com
              </a>
              <p className="text-sm text-muted-foreground">Mon–Sat: 9AM – 10PM</p>
            </div>
          </div>
        </div>

        <div className="gradient-divider mb-6" />
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Avital Chicago Limousine And Party Bus. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
