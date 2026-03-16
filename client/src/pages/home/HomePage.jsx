import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Briefcase, User, Star, TrendingUp, Building2, ShieldCheck } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Button } from '../../components/ui';
import { ListingCard } from '../../components/ui/ListingCard';
import { AppLayout } from '../../components/layout';
import { useCountUp } from '../../hooks/useCountUp';

const AnimatedSection = ({ children, className }) => {
    const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// Mock listings until API is hooked up
const MOCK_LISTINGS = [
    { _id: '1', company: 'Google', jobTitle: 'Senior Frontend Engineer', location: 'Mountain View, CA', workMode: 'hybrid', slotsAvailable: 2, department: 'Search', tags: ['React', 'TypeScript', 'Performance'], views: 124 },
    { _id: '2', company: 'Stripe', jobTitle: 'Backend Product Engineer', location: 'Remote', workMode: 'remote', slotsAvailable: 1, department: 'Payments', tags: ['Ruby', 'Go', 'API Design'], views: 89 },
    { _id: '3', company: 'Meta', jobTitle: 'Software Engineer, AI', location: 'Menlo Park, CA', workMode: 'onsite', slotsAvailable: 3, department: 'FAIR', tags: ['Python', 'PyTorch', 'C++'], views: 245 },
    { _id: '4', company: 'Netflix', jobTitle: 'Senior iOS Engineer', location: 'Los Gatos, CA', workMode: 'hybrid', slotsAvailable: 1, department: 'Mobile', tags: ['Swift', 'UIKit', 'AVFoundation'], views: 56 },
    { _id: '5', company: 'Amazon', jobTitle: 'SDE II', location: 'Seattle, WA', workMode: 'hybrid', slotsAvailable: 5, department: 'AWS Cross-Domain', tags: ['Java', 'Distributed Systems'], views: 112 },
    { _id: '6', company: 'Vercel', jobTitle: 'Developer Advocate', location: 'Remote', workMode: 'remote', slotsAvailable: 1, department: 'Marketing', tags: ['Next.js', 'Content', 'Public Speaking'], views: 430 }
];

export const HomePage = () => {
    const navigate = useNavigate();
    const referralsStat = useCountUp(5200, 2000);
    const companiesStat = useCountUp(840, 2000);

    return (
        <AppLayout>
            {/* HERO SECTION */}
            <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 overflow-hidden border-b border-gray-200">
                <div
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                        backgroundImage: `linear-gradient(to right, #e0e0e0 1px, transparent 1px), linear-gradient(to bottom, #e0e0e0 1px, transparent 1px)`,
                        backgroundSize: `40px 40px`
                    }}
                />
                <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />

                <div className="relative z-20 text-center max-w-4xl mx-auto flex flex-col items-center mt-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm mb-8"
                    >
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-40"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
                        </span>
                        <span className="text-xs font-semibold text-gray-800 tracking-wide uppercase">Now in Beta · Join 2,000+ users</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold tracking-tight text-gray-950 mb-6 leading-tight"
                    >
                        Skip the <span className="italic font-normal">Black Hole</span>.<br />Get Referred Directly.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-gray-500 max-w-2xl mb-10 leading-relaxed"
                    >
                        Connect directly with verified employees at top tech companies.
                        By-pass the automated filters and get your resume directly into the hands of hiring teams.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
                    >
                        <Button size="lg" className="w-full sm:w-auto px-8" onClick={() => navigate('/browse')}>
                            Find a Referral
                        </Button>
                        <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8" onClick={() => navigate('/register')}>
                            Offer Referrals
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-16 pt-8 border-t border-gray-100 flex flex-col items-center"
                    >
                        <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-6 text-center">Referrals from insiders at</p>
                        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60 grayscale">
                            <span className="font-bold text-xl text-gray-900 tracking-tighter">Google</span>
                            <span className="font-bold text-xl text-gray-900 tracking-tighter">Meta</span>
                            <span className="font-bold text-xl text-gray-900 tracking-tighter">Amazon</span>
                            <span className="font-bold text-xl text-gray-900 tracking-tighter">Stripe</span>
                            <span className="font-bold text-xl text-gray-900 tracking-tighter italic">Netflix</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="py-24 bg-gray-50 border-b border-gray-200">
                <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-950 mb-4">Two sides. One goal.</h2>
                        <p className="text-lg text-gray-600">A streamlined process designed to remove friction for both candidates and insiders.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Applicant Flow */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg shadow-gray-200/50">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-6 border border-gray-200">
                                <User className="w-6 h-6 text-black" />
                            </div>
                            <h3 className="text-xl font-semibold mb-6 pb-4 border-b border-gray-100">For Applicants</h3>
                            <ul className="space-y-6">
                                <li className="flex gap-4">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Find opportunities</h4>
                                        <p className="text-sm text-gray-500 mt-1">Browse active listing slots posted by verified employees.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Submit a pitch</h4>
                                        <p className="text-sm text-gray-500 mt-1">Send a concise cover note and your resume directly to the referrer.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Get referred</h4>
                                        <p className="text-sm text-gray-500 mt-1">Receive an internal referral code or link upon acceptance.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Referrer Flow */}
                        <div className="bg-gray-950 text-white rounded-2xl p-8 shadow-xl shadow-black/10">
                            <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-6 border border-gray-700">
                                <Briefcase className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold mb-6 pb-4 border-b border-gray-800 text-white">For Referrers</h3>
                            <ul className="space-y-6">
                                <li className="flex gap-4">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                                    <div>
                                        <h4 className="font-medium text-white">Post listings</h4>
                                        <p className="text-sm text-gray-400 mt-1">Create slots for specific roles open at your company.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                                    <div>
                                        <h4 className="font-medium text-white">Review candidates</h4>
                                        <p className="text-sm text-gray-400 mt-1">Review applicant notes and resumes in a distraction-free dashboard.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                                    <div>
                                        <h4 className="font-medium text-white">Refer top talent</h4>
                                        <p className="text-sm text-gray-400 mt-1">Accept the best candidates and submit them internally.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </AnimatedSection>
            </section>

            {/* FEATURED LISTINGS */}
            <section className="py-24 bg-white border-b border-gray-200">
                <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-gray-950 mb-2">Latest Referral Opportunities</h2>
                            <p className="text-gray-500">Discover active slots from industry insiders.</p>
                        </div>
                        <Link to="/browse" className="text-sm font-semibold text-black hover:text-gray-600 trans-all flex items-center group">
                            View all <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {MOCK_LISTINGS.map((listing) => (
                            <ListingCard key={listing._id} listing={listing} />
                        ))}
                    </div>
                </AnimatedSection>
            </section>

            {/* STATS SECTION */}
            <section className="py-24 bg-black text-white overflow-hidden">
                <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-gray-800">
                        <div className="flex flex-col items-center pt-8 md:pt-0">
                            <TrendingUp className="w-8 h-8 text-white mb-4 opacity-50" />
                            <p className="font-mono text-5xl font-bold tracking-tighter mb-2">{referralsStat.toLocaleString()}+</p>
                            <p className="text-sm text-gray-400 font-medium uppercase tracking-widest">Referrals Given</p>
                        </div>
                        <div className="flex flex-col items-center pt-8 md:pt-0">
                            <Building2 className="w-8 h-8 text-white mb-4 opacity-50" />
                            <p className="font-mono text-5xl font-bold tracking-tighter mb-2">{companiesStat.toLocaleString()}+</p>
                            <p className="text-sm text-gray-400 font-medium uppercase tracking-widest">Companies</p>
                        </div>
                        <div className="flex flex-col items-center pt-8 md:pt-0">
                            <ShieldCheck className="w-8 h-8 text-white mb-4 opacity-50" />
                            <p className="font-mono text-5xl font-bold tracking-tighter mb-2">3.2<span className="text-3xl">×</span></p>
                            <p className="text-sm text-gray-400 font-medium uppercase tracking-widest">Higher Success Rate</p>
                        </div>
                    </div>
                </AnimatedSection>
            </section>
        </AppLayout>
    );
};
