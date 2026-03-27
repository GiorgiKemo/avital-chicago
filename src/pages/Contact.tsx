import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import QuoteForm from '@/components/QuoteForm';
import PageHeader from '@/components/PageHeader';

const contactInfo = [
  { icon: MapPin, title: 'Address', value: '1431 Harmony Ct, Itasca, IL 60143' },
  { icon: Phone, title: 'Phone', value: '(630) 550-6753', href: 'tel:6305506753' },
  { icon: Mail, title: 'Email', value: 'info@avitalchicagolimousine.com', href: 'mailto:info@avitalchicagolimousine.com' },
  { icon: Clock, title: 'Hours', value: 'Mon–Sat: 9AM – 10PM' },
];

const Contact = () => (
  <>
    <PageHeader
      label="Contact Us"
      title={<>Get in <span className="gradient-text font-semibold">Touch</span></>}
      subtitle="We'd love to hear from you. Reach out for a free quote or any questions."
    />

    <section className="pb-24">
      <div className="container mx-auto px-6">
        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {contactInfo.map((c) => (
            <div key={c.title} className="glass-card p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <c.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-foreground font-medium mb-1">{c.title}</h3>
              {c.href ? (
                <a href={c.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{c.value}</a>
              ) : (
                <p className="text-sm text-muted-foreground">{c.value}</p>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Map */}
          <div className="glass-card overflow-hidden rounded-xl h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2962.5!2d-88.0087!3d41.9743!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDU4JzI3LjUiTiA4OMKwMDAnMzEuMyJX!5e0!3m2!1sen!2sus!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Avital Chicago Limousine Location"
            />
          </div>

          {/* Quote Form */}
          <QuoteForm />
        </div>
      </div>
    </section>
  </>
);

export default Contact;
