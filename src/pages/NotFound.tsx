import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center relative">
    <div className="blur-orb w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
    <div className="text-center relative z-10">
      <h1 className="text-[120px] md:text-[180px] font-serif font-bold leading-none gradient-text">404</h1>
      <p className="text-2xl text-foreground font-serif mb-4">Page Not Found</p>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link to="/" className="btn-primary">
          Go Home <ArrowRight className="w-4 h-4" />
        </Link>
        <Link to="/contact-us" className="btn-outline">
          Contact Us <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  </div>
);

export default NotFound;
