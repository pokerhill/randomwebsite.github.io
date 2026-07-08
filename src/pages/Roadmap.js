import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import AnimatedSection from '../components/motion/AnimatedSection';
import useInView from '../components/motion/useInView';

const TimelineDot = ({ status, className }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <motion.div
            ref={ref}
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ delay: 0.2, duration: 0.4, type: 'spring' }}
            className={className}
        />
    );
};

const RoadmapItem = ({ year, quarter, title, description, status, index }) => {
    const isLeftCard = index % 2 === 0;
    const direction = isLeftCard ? 'left' : 'right';

    const dotClass = status === 'completed'
        ? 'bg-primary border-primary shadow-[0_0_10px_rgba(14,165,233,0.5)]'
        : status === 'current'
            ? 'bg-white border-white animate-pulse'
            : 'bg-background border-white/30';

    return (
        <AnimatedSection direction={direction} className="relative flex flex-col md:flex-row items-center md:items-stretch group is-odd">
            {/* Mobile: Timeline Line (Left) */}
            <div className="md:hidden absolute left-8 top-0 h-full w-px bg-white/10" />
            <TimelineDot
                status={status}
                className={`md:hidden absolute left-8 top-8 w-4 h-4 rounded-full border-2 transform -translate-x-1/2 ${dotClass} z-10`}
            />

            {/* Desktop: Spacer for Alternating Layout */}
            <div className="hidden md:block md:w-1/2 md:group-odd:order-2" />

            {/* Desktop: Center Line & Dot */}
            <div className="hidden md:flex absolute left-1/2 h-full w-8 flex-col items-center justify-start -translate-x-1/2 z-20">
                <div className="h-full w-0.5 bg-gradient-to-b from-primary/50 to-secondary/50 group-last:bg-gradient-to-b group-last:from-primary/50 group-last:to-transparent" />
                <TimelineDot
                    status={status}
                    className={`absolute top-10 w-4 h-4 rounded-full border-2 ${dotClass} box-content`}
                />
            </div>

            {/* Content Card Wrapper */}
            <div className="relative w-full pl-16 md:pl-0 md:w-1/2 md:group-odd:order-1 md:group-odd:pr-16 md:group-even:order-3 md:group-even:pl-16 py-4">
                {isLeftCard && (
                    <div className="hidden md:block absolute top-12 right-0 h-0.5 w-16 bg-white/20 -translate-y-1/2" />
                )}
                {!isLeftCard && (
                    <div className="hidden md:block absolute top-12 left-0 h-0.5 w-16 bg-white/20 -translate-y-1/2" />
                )}

                <div className={`relative p-6 rounded-2xl border transition-all duration-300 ${status === 'completed' ? 'bg-surface/50 border-primary/30 hover:border-primary hover:shadow-[0_0_20px_rgba(14,165,233,0.1)]' : 'bg-surface border-white/10 hover:border-white/20'}`}>
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${status === 'completed' ? 'bg-primary/20 text-primary' : status === 'current' ? 'bg-white/10 text-white' : 'bg-white/5 text-text-muted'}`}>
                        {year} {quarter}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{title}</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
                </div>
            </div>
        </AnimatedSection>
    );
};

const Roadmap = () => {
    const milestones = [
        {
            year: "2024",
            quarter: "Q4",
            title: "Company Founded",
            description: "Orbital Robotics established with a mission to build the infrastructure for the space economy.",
            status: "completed"
        },
        {
            year: "2025",
            quarter: "Aug",
            title: "Out of Stealth",
            description: "Public launch of Orbital Robotics, unveiling our vision for autonomous in-space servicing and assembly.",
            status: "completed"
        },
        {
            year: "2025",
            quarter: "Sep",
            title: "First Customer Secured",
            description: "Signed first commercial contract for in-orbit servicing mission.",
            status: "completed"
        },
        {
            year: "2025",
            quarter: "Q4",
            title: "Pre-Seed Funding",
            description: "Secured initial capital to accelerate R&D of core robotic arm technology and ORBtos.",
            status: "completed"
        },
        {
            year: "2026",
            quarter: "Q2",
            title: "Alpha Prototype",
            description: "Robotic arm prototype that is on Earth, fully controlled by our proprietary AI-powered software stack.",
            status: "upcoming"
        },
        {
            year: "2026",
            quarter: "Q3",
            title: "ORBtos & First Mission",
            description: "First in-space mission using our robotic arm and AI-powered software to perform autonomous operations on a customer satellite.",
            status: "upcoming"
        },
        {
            year: "2026",
            quarter: "Q4",
            title: "Space Station Assembly Demo",
            description: "Demonstration of autonomous assembly capabilities for large-scale space structures.",
            status: "upcoming"
        },
        {
            year: "2027",
            quarter: "Q1",
            title: "RPOC Demo",
            description: "Dual-arm cooperation for Rendezvous, Proximity Operations, and Capture (RPOC).",
            status: "upcoming"
        },
        {
            year: "2027",
            quarter: "Q1",
            title: "RPO Swarm Demo",
            description: "Demonstration of coordinated swarm behavior for proximity operations.",
            status: "upcoming"
        }
    ];

    return (
        <div className="min-h-screen bg-background pt-20 pb-20">
            <SEO
                title="Roadmap"
                description="Follow Orbital Robotics' journey and future milestones as we build the infrastructure for the space economy."
            />
            <div className="container mx-auto px-6">
                <AnimatedSection className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-heading font-bold text-white mb-6">Strategic Roadmap</h1>
                    <p className="text-xl text-text-secondary max-w-3xl mx-auto">
                        Our path to building the essential infrastructure for the orbital economy.
                    </p>
                </AnimatedSection>

                {/* Compact horizontal milestone strip: scannable summary above the detailed timeline */}
                <AnimatedSection className="max-w-5xl mx-auto mb-20">
                    <div className="bg-surface/40 border border-white/5 rounded-2xl px-6 py-6">
                        <div className="text-xs uppercase tracking-widest text-text-secondary text-center mb-6">At a Glance</div>
                        <div className="relative">
                            <div className="absolute top-[7px] left-2 right-2 h-px bg-gradient-to-r from-primary/40 via-white/10 to-white/5" />
                            <div className="relative flex items-start justify-between gap-3 overflow-x-auto pb-2">
                                {milestones.map((m, i) => {
                                    const dot = m.status === 'completed'
                                        ? 'bg-primary shadow-[0_0_8px_rgba(14,165,233,0.6)]'
                                        : m.status === 'current'
                                            ? 'bg-white animate-pulse'
                                            : 'bg-white/30';
                                    return (
                                        <div key={i} className="flex flex-col items-center text-center min-w-[88px] flex-shrink-0">
                                            <div className={`w-3 h-3 rounded-full border border-white/20 ${dot}`} />
                                            <div className="text-[10px] font-bold tracking-wider text-text-muted uppercase mt-3 whitespace-nowrap">{m.year} {m.quarter}</div>
                                            <div className="text-xs text-white mt-1 max-w-[100px] leading-tight">{m.title}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </AnimatedSection>

                <div className="relative max-w-5xl mx-auto space-y-0">
                    {milestones.map((milestone, index) => (
                        <RoadmapItem key={index} {...milestone} index={index} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Roadmap;
