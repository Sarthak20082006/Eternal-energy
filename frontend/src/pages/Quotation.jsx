import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ChevronRight, Check, User, MapPin, Phone, Mail, Gauge, Sun, Battery, ArrowLeft } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const panelOptions = [
  { name: 'Adani 540W Mono PERC', price: 28, efficiency: '21.3%', warranty: '25 years' },
  { name: 'Tata 530W Premium', price: 27, efficiency: '20.8%', warranty: '25 years' },
  { name: 'Waaree 550W TOPCon', price: 30, efficiency: '22.1%', warranty: '30 years' },
];
const inverterOptions = [
  { name: 'Growatt 5kW', price: 45000, type: 'String' },
  { name: 'Sungrow 5kW', price: 52000, type: 'Hybrid' },
  { name: 'GoodWe 5kW', price: 50000, type: 'String' },
];
const structureOptions = [
  { name: 'HDGI Elevated Structure', price: 40000, material: 'Galvanized Steel' },
  { name: 'Aluminium Premium Structure', price: 55000, material: 'Aluminium Alloy' },
];

const GST_RATE = 0.18;
const INSTALLATION_COST = 20000;

export default function Quotation() {
  const [step, setStep] = useState(0);
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '', city: '', monthlyUnits: '' });
  const [systemSize, setSystemSize] = useState(5);
  const [panel, setPanel] = useState(panelOptions[0]);
  const [inverter, setInverter] = useState(inverterOptions[0]);
  const [structure, setStructure] = useState(structureOptions[0]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const panelCost = systemSize * 1000 * panel.price;
  const subtotal = panelCost + inverter.price + structure.price + INSTALLATION_COST;
  const gst = Math.round(subtotal * GST_RATE);
  const total = subtotal + gst;

  const steps = ['Customer Details', 'System Configuration', 'Review & Generate'];

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await api.post('/leads', {
        ...customer,
        monthlyUnits: parseFloat(customer.monthlyUnits),
        systemSize,
        panelName: panel.name,
        panelPricePerWatt: panel.price,
        inverterName: inverter.name,
        inverterPrice: inverter.price,
        structureName: structure.name,
        structurePrice: structure.price,
      });
      setResult(res.data);
      toast.success('Quotation generated & saved!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate quotation');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 0) return customer.name && customer.phone && customer.city && customer.monthlyUnits;
    return true;
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Generate Quotation</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Create professional solar installation quotations</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${i <= step ? 'text-white' : ''}`}
              style={{
                background: i < step ? '#10b981' : i === step ? 'linear-gradient(135deg, #10b981, #059669)' : 'var(--bg-secondary)',
                color: i > step ? 'var(--text-muted)' : 'white',
                boxShadow: i === step ? '0 4px 15px rgba(16,185,129,0.3)' : 'none',
              }}
            >
              {i < step ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className="text-xs font-medium hidden sm:block" style={{ color: i <= step ? 'var(--text-primary)' : 'var(--text-muted)' }}>{s}</span>
            {i < steps.length - 1 && <div className="flex-1 h-0.5 rounded" style={{ background: i < step ? '#10b981' : 'var(--border)' }} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Main Form Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Card>
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <User className="w-5 h-5 text-emerald-500" /> Customer Information
                  </h2>
                  <div className="space-y-3">
                    {[
                      { key: 'name', label: 'Full Name', icon: User, type: 'text' },
                      { key: 'phone', label: 'Phone Number', icon: Phone, type: 'tel' },
                      { key: 'email', label: 'Email Address', icon: Mail, type: 'email' },
                      { key: 'city', label: 'City', icon: MapPin, type: 'text' },
                      { key: 'monthlyUnits', label: 'Monthly Electricity Units (kWh)', icon: Gauge, type: 'number' },
                    ].map((field) => (
                      <div key={field.key} className="relative">
                        <field.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                        <input
                          type={field.type}
                          placeholder={field.label}
                          value={customer[field.key]}
                          onChange={(e) => setCustomer({ ...customer, [field.key]: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-emerald-500/30"
                          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                        />
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                {/* System Size */}
                <Card>
                  <h2 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <Zap className="w-5 h-5 text-emerald-500" /> System Size
                  </h2>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={systemSize}
                    onChange={(e) => setSystemSize(Number(e.target.value))}
                    className="w-full accent-emerald-500 h-2 rounded-full"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>1 kW</span>
                    <span className="text-xl font-bold text-emerald-500">{systemSize} kW</span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>50 kW</span>
                  </div>
                </Card>

                {/* Panel Selection */}
                <Card>
                  <h3 className="text-base font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <Sun className="w-4 h-4 text-amber-500" /> Solar Panel
                  </h3>
                  <div className="space-y-2">
                    {panelOptions.map((opt) => (
                      <div
                        key={opt.name}
                        onClick={() => setPanel(opt)}
                        className="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200"
                        style={{
                          background: panel.name === opt.name ? 'rgba(16,185,129,0.08)' : 'var(--bg-secondary)',
                          border: `2px solid ${panel.name === opt.name ? '#10b981' : 'transparent'}`,
                        }}
                      >
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{opt.name}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Efficiency: {opt.efficiency} · {opt.warranty}</p>
                        </div>
                        <span className="text-sm font-bold text-emerald-500">₹{opt.price}/W</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Inverter Selection */}
                <Card>
                  <h3 className="text-base font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <Battery className="w-4 h-4 text-blue-500" /> Inverter
                  </h3>
                  <div className="space-y-2">
                    {inverterOptions.map((opt) => (
                      <div
                        key={opt.name}
                        onClick={() => setInverter(opt)}
                        className="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200"
                        style={{
                          background: inverter.name === opt.name ? 'rgba(16,185,129,0.08)' : 'var(--bg-secondary)',
                          border: `2px solid ${inverter.name === opt.name ? '#10b981' : 'transparent'}`,
                        }}
                      >
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{opt.name}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Type: {opt.type}</p>
                        </div>
                        <span className="text-sm font-bold text-emerald-500">₹{opt.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Structure Selection */}
                <Card>
                  <h3 className="text-base font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Mounting Structure</h3>
                  <div className="space-y-2">
                    {structureOptions.map((opt) => (
                      <div
                        key={opt.name}
                        onClick={() => setStructure(opt)}
                        className="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200"
                        style={{
                          background: structure.name === opt.name ? 'rgba(16,185,129,0.08)' : 'var(--bg-secondary)',
                          border: `2px solid ${structure.name === opt.name ? '#10b981' : 'transparent'}`,
                        }}
                      >
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{opt.name}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{opt.material}</p>
                        </div>
                        <span className="text-sm font-bold text-emerald-500">₹{opt.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Card>
                  <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Review Quotation</h2>

                  <div className="space-y-3 mb-6">
                    <div className="p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                      <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Customer</p>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{customer.name} · {customer.city}</p>
                    </div>
                    <div className="p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                      <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Configuration</p>
                      <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{systemSize} kW · {panel.name}</p>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{inverter.name} · {structure.name}</p>
                    </div>
                  </div>

                  {result ? (
                    <div className="p-4 rounded-xl border-2 border-emerald-500/30" style={{ background: 'rgba(16,185,129,0.05)' }}>
                      <p className="text-sm font-medium text-emerald-500 mb-2">✅ Quotation Saved Successfully!</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Lead ID: {result.data?.id}</p>
                    </div>
                  ) : (
                    <Button onClick={handleGenerate} loading={loading} icon={Zap} className="w-full">
                      Generate & Save Quotation
                    </Button>
                  )}
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-4">
            <Button
              variant="secondary"
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              icon={ArrowLeft}
            >
              Back
            </Button>
            {step < 2 && (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                icon={ChevronRight}
              >
                Continue
              </Button>
            )}
          </div>
        </div>

        {/* Live Price Summary Sidebar */}
        <div className="lg:col-span-2">
          <div className="sticky top-24">
            <Card className="!p-0 overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                <h3 className="text-base font-bold">Price Summary</h3>
                <p className="text-xs opacity-80">Live calculation</p>
              </div>
              <div className="p-4 space-y-3">
                {[
                  { label: 'Panel Cost', value: panelCost },
                  { label: 'Inverter', value: inverter.price },
                  { label: 'Structure', value: structure.price },
                  { label: 'Installation', value: INSTALLATION_COST },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>₹{value.toLocaleString()}</span>
                  </div>
                ))}
                <hr style={{ borderColor: 'var(--border)' }} />
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-secondary)' }}>GST (18%)</span>
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>₹{gst.toLocaleString()}</span>
                </div>
                <hr style={{ borderColor: 'var(--border)' }} />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Total</span>
                  <motion.span
                    key={total}
                    initial={{ scale: 1.2, color: '#10b981' }}
                    animate={{ scale: 1 }}
                    className="text-2xl font-bold text-emerald-500"
                  >
                    ₹{total.toLocaleString()}
                  </motion.span>
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-4">
              <h4 className="text-xs font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>ESTIMATED BENEFITS</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-secondary)' }}>Annual Generation</span>
                  <span className="font-semibold text-emerald-500">{(systemSize * 1400).toLocaleString()} kWh</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-secondary)' }}>Monthly Savings</span>
                  <span className="font-semibold text-emerald-500">₹{Math.round(systemSize * 1400 * 8 / 12).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-secondary)' }}>Payback Period</span>
                  <span className="font-semibold text-amber-500">{Math.round(total / (systemSize * 1400 * 8) * 10) / 10} years</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-secondary)' }}>CO₂ Offset/Year</span>
                  <span className="font-semibold text-emerald-500">{(systemSize * 1400 * 0.82 / 1000).toFixed(1)} tons</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
