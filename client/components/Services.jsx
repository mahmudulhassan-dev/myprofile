import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Shield, Zap, Globe, Code, Cpu, BarChart, Check, Calendar, ArrowRight, Loader2 } from 'lucide-react';

const Services = () => {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [bookingData, setBookingData] = useState({
        clientName: '',
        clientEmail: '',
        scheduledDate: '',
        requirements: ''
    });
    const [isBooking, setIsBooking] = useState(false);
    const [bookingStatus, setBookingStatus] = useState(null);

    useEffect(() => {
        // Fetch services
        const fetchServices = async () => {
            try {
                // For now, use mock but with proper structure
                setServices([
                    {
                        id: 1,
                        title: "Enterprise Web Systems",
                        description: "Scalable, high-performance web applications built with React & Node.js.",
                        icon: <Globe size={32} />,
                        price: "2500",
                        features: ["Custom UI/UX", "SEO Optimized", "CMS Integration", "24/7 Support"]
                    },
                    {
                        id: 2,
                        title: "AI & Automation Hub",
                        description: "Intelligent workflows and custom AI models to scale your business.",
                        icon: <Zap size={32} />,
                        price: "3500",
                        features: ["GPT/LLM Integration", "Workflow Automation", "Data Analysis", "API Security"]
                    },
                    {
                        id: 3,
                        title: "SaaS Product Design",
                        description: "End-to-end product development from prototype to enterprise launch.",
                        icon: <Shield size={32} />,
                        price: "5000",
                        features: ["Full Documentation", "Cloud Deployment", "User Analytics", "Market Integration"]
                    }
                ]);
            } catch {
                console.error("Failed to load services");
            }
        };
        fetchServices();
    }, []);

    const handleBooking = async (e) => {
        e.preventDefault();
        setIsBooking(true);
        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    serviceId: selectedService.id,
                    ...bookingData
                })
            });
            if (res.ok) {
                setBookingStatus('success');
                setTimeout(() => {
                    setSelectedService(null);
                    setBookingStatus(null);
                    setBookingData({ clientName: '', clientEmail: '', scheduledDate: '', requirements: '' });
                }, 3000);
            } else {
                setBookingStatus('error');
            }
        } catch {
            setBookingStatus('error');
        } finally {
            setIsBooking(false);
        }
    };

    return (
        <section className="py-32 bg-slate-50 dark:bg-slate-900 overflow-hidden px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-xs font-black uppercase tracking-[0.3em] text-indigo-600 mb-4 block"
                    >
                        Solutions & Services
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight"
                    >
                        Scale with <span className="text-indigo-600">Elite</span> Precision
                    </motion.h2>
                </div>

                <div className="grid md:grid-cols-3 gap-10">
                    {services.map((service, index) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            index={index}
                            onBook={() => setSelectedService(service)}
                        />
                    ))}
                </div>
            </div>

            {/* Booking Modal */}
            <AnimatePresence>
                {selectedService && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedService(null)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-white/20 p-8 md:p-12 overflow-hidden"
                        >
                            {bookingStatus === 'success' ? (
                                <div className="text-center py-10">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Check size={40} className="text-green-600" />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Booking Requested!</h3>
                                    <p className="text-slate-500">I'll get back to you within 24 hours to confirm the schedule.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-600">
                                            {selectedService.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{selectedService.title}</h3>
                                            <p className="text-indigo-600 font-bold tracking-widest uppercase text-xs">Starts at ${selectedService.price}</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleBooking} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <FormInput
                                                label="FullName"
                                                value={bookingData.clientName}
                                                onChange={(e) => setBookingData({ ...bookingData, clientName: e.target.value })}
                                                placeholder="Mahmudul Hassan"
                                                required
                                            />
                                            <FormInput
                                                label="Email"
                                                type="email"
                                                value={bookingData.clientEmail}
                                                onChange={(e) => setBookingData({ ...bookingData, clientEmail: e.target.value })}
                                                placeholder="hello@amanaflow.com"
                                                required
                                            />
                                        </div>
                                        <FormInput
                                            label="Preferred Date"
                                            type="date"
                                            value={bookingData.scheduledDate}
                                            onChange={(e) => setBookingData({ ...bookingData, scheduledDate: e.target.value })}
                                            required
                                        />
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Project Brief</label>
                                            <textarea
                                                value={bookingData.requirements}
                                                onChange={(e) => setBookingData({ ...bookingData, requirements: e.target.value })}
                                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-600 transition-all outline-none resize-none h-32"
                                                placeholder="Tell me more about your project goals..."
                                            />
                                        </div>
                                        <button
                                            disabled={isBooking}
                                            className="w-full py-5 bg-indigo-600 hover:bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                        >
                                            {isBooking ? <Loader2 className="animate-spin" size={20} /> : "Initialize Project"}
                                        </button>
                                    </form>
                                </>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
};

const ServiceCard = ({ service, index, onBook }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="group relative bg-white dark:bg-slate-800 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl hover:shadow-[0_40px_100px_rgba(0,0,0,0.1)] transition-all duration-700 hover:-translate-y-4"
    >
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            {service.icon}
        </div>

        <div className="mb-8 w-16 h-16 bg-slate-50 dark:bg-slate-700/50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
            {service.icon}
        </div>

        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight group-hover:text-indigo-600 transition-colors">{service.title}</h3>
        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8">{service.description}</p>

        <ul className="space-y-4 mb-10">
            {service.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-300">
                    <div className="w-5 h-5 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600">
                        <Check size={12} />
                    </div>
                    {feature}
                </li>
            ))}
        </ul>

        <div className="flex items-center justify-between mt-auto">
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">From</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">${service.price}</p>
            </div>
            <button
                onClick={onBook}
                className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-indigo-600 transition-all shadow-lg"
            >
                <ArrowRight size={20} />
            </button>
        </div>
    </motion.div>
);

const FormInput = ({ label, type = "text", ...props }) => (
    <div>
        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{label}</label>
        <input
            type={type}
            {...props}
            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-600 transition-all outline-none"
        />
    </div>
);

export default Services;
