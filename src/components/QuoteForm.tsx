import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface QuoteFormProps {
  className?: string;
  compact?: boolean;
}

const eventTypes = ['Wedding', 'Bachelor(ette)', 'Night Party', 'Concerts', 'Quinceañera', 'Prom', 'Birthday', 'Other'];
const serviceTypes = ['Hourly', 'Round Trip'];
const vehicleTypes = ['Limousine', 'Party Bus'];

const QuoteForm = ({ className = '', compact = false }: QuoteFormProps) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', pickUp: '', dropOff: '',
    passengers: '', date: '', eventType: '', serviceType: '', vehicleType: '',
  });

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    // Simulate submission
    await new Promise(r => setTimeout(r, 1000));
    toast.success('Quote request submitted! We\'ll contact you shortly.');
    setForm({ name: '', email: '', phone: '', pickUp: '', dropOff: '', passengers: '', date: '', eventType: '', serviceType: '', vehicleType: '' });
    setLoading(false);
  };

  const inputClass = "w-full bg-muted/30 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all";
  const selectClass = `${inputClass} appearance-none`;

  return (
    <div className={`glass-card-glow p-6 md:p-8 ${className}`}>
      <h3 className="font-serif text-2xl font-semibold text-foreground mb-1">Get a Free Quote</h3>
      <p className="text-sm text-muted-foreground mb-6">Fill in your details and we'll get back to you shortly.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input type="text" placeholder="Full Name *" value={form.name} onChange={e => update('name', e.target.value)} className={inputClass} required />
        <div className={`grid ${compact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'} gap-3`}>
          <input type="email" placeholder="Email *" value={form.email} onChange={e => update('email', e.target.value)} className={inputClass} required />
          <input type="tel" placeholder="Phone *" value={form.phone} onChange={e => update('phone', e.target.value)} className={inputClass} required />
        </div>
        <div className={`grid ${compact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'} gap-3`}>
          <input type="text" placeholder="Pick up Location" value={form.pickUp} onChange={e => update('pickUp', e.target.value)} className={inputClass} />
          <input type="text" placeholder="Drop off Location" value={form.dropOff} onChange={e => update('dropOff', e.target.value)} className={inputClass} />
        </div>
        <div className={`grid ${compact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'} gap-3`}>
          <input type="number" placeholder="# Passengers" value={form.passengers} onChange={e => update('passengers', e.target.value)} className={inputClass} min="1" />
          <input type="date" value={form.date} onChange={e => update('date', e.target.value)} className={inputClass} />
        </div>
        <select value={form.eventType} onChange={e => update('eventType', e.target.value)} className={selectClass}>
          <option value="">Event Type</option>
          {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <div className="grid grid-cols-2 gap-3">
          <select value={form.serviceType} onChange={e => update('serviceType', e.target.value)} className={selectClass}>
            <option value="">Service Type</option>
            {serviceTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={form.vehicleType} onChange={e => update('vehicleType', e.target.value)} className={selectClass}>
            <option value="">Vehicle</option>
            {vehicleTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center mt-2 animate-pulse-glow disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Request Quote'} <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default QuoteForm;
