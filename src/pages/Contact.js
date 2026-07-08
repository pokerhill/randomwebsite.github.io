import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaLinkedinIn } from 'react-icons/fa';
import SEO from '../components/SEO';
import AnimatedSection from '../components/motion/AnimatedSection';
import { CornerBrackets } from '../components/ui';

const FORM_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbzhFEpM8vBZvHhfyjgKBpfg0dPh8e6AXxdLDd2gteKkJUecdh7Ec6S-6754kumDietN/exec';

// Audience chips pre-fill the existing Apps Script `subject` payload field.
const AUDIENCES = [
  { value: 'Sales', label: 'SATELLITE OPERATOR' },
  { value: 'Government', label: 'GOVERNMENT & DEFENSE' },
  { value: 'Investors', label: 'INVESTOR' },
  { value: 'Careers', label: 'CAREERS' },
];

const Field = ({ id, label, children }) => (
  <div>
    <label htmlFor={id} className="block type-mono-label text-text-muted mb-2">
      {label}
    </label>
    {children}
  </div>
);

const inputClass =
  'w-full bg-transparent border-0 border-b hairline px-0 py-3 text-white placeholder:text-text-faint ' +
  'focus:outline-none focus:border-primary transition-colors';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // no-cors: the Apps Script endpoint can't return CORS headers, so the
      // response is opaque — a resolved fetch means the request was delivered.
      await fetch(FORM_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(formData),
      });
      setStatus('sent');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <SEO
        title="First Contact"
        description="Get in touch with Orbital Robotics. Contact our team for sales inquiries, investor relations, or career opportunities."
      />
      <div className="container mx-auto px-6">
        <AnimatedSection className="max-w-3xl mb-16 pt-10">
          <p className="type-mono-label text-primary mb-4">FIRST CONTACT</p>
          <h1 className="type-display text-h1 text-white mb-6">Have a target in orbit?</h1>
          <p className="text-xl text-text-secondary">
            Tell us about your mission. We respond to every transmission.
          </p>
        </AnimatedSection>

        <div className="flex flex-col lg:flex-row gap-12 max-w-6xl">
          {/* Comms panel */}
          <AnimatedSection direction="left" className="lg:w-1/3">
            <div className="relative bg-surface p-8 border hairline">
              <h3 className="type-mono-label text-text-muted mb-6">COMMS PANEL</h3>
              <div className="font-mono text-micro tracking-[0.14em] text-text-secondary space-y-3 uppercase mb-8">
                <p>HQ — SEATTLE, WASHINGTON</p>
                <p>47.6062 N, 122.3321 W</p>
                <p>
                  <a href="mailto:info@orbital-robots.com" className="text-white hover:text-accent transition-colors normal-case">
                    info@orbital-robots.com
                  </a>
                </p>
                <p className="text-accent">RESPONSE &lt; 48 HRS</p>
              </div>
              <div className="border-t hairline pt-6">
                <p className="type-mono-label text-text-muted mb-4">DOWNLINK</p>
                <a
                  href="https://www.linkedin.com/company/orbital-robotics-corp/posts/?feedView=all"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Orbital Robotics on LinkedIn"
                  className="inline-flex w-10 h-10 border hairline items-center justify-center text-text-secondary hover:text-white hover:border-white/[0.16] transition-all"
                >
                  <FaLinkedinIn />
                </a>
              </div>
              <CornerBrackets />
            </div>
          </AnimatedSection>

          {/* Transmission form */}
          <AnimatedSection direction="right" className="lg:w-2/3">
            <form onSubmit={handleSubmit} className="relative bg-surface p-8 md:p-10 border hairline">
              {/* Audience chips */}
              <div className="mb-8">
                <span className="block type-mono-label text-text-muted mb-3">YOU ARE A</span>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Inquiry type">
                  {AUDIENCES.map((a) => (
                    <button
                      key={a.value}
                      type="button"
                      role="radio"
                      aria-checked={formData.subject === a.value}
                      onClick={() => setFormData({ ...formData, subject: a.value })}
                      className={`type-mono-label px-4 py-2 border transition-colors ${
                        formData.subject === a.value
                          ? 'border-primary text-white bg-primary/15'
                          : 'hairline text-text-secondary hover:text-white hover:border-white/[0.16]'
                      }`}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <Field id="name" label="NAME">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="Your name"
                  />
                </Field>
                <Field id="email" label="EMAIL">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="your@email.com"
                  />
                </Field>
              </div>

              <div className="mb-10">
                <Field id="message" label="TRANSMISSION">
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className={`${inputClass} resize-none`}
                    placeholder="Tell us about your mission."
                  />
                </Field>
              </div>

              <motion.button
                type="submit"
                disabled={status === 'sending'}
                whileTap={{ scale: 0.99 }}
                className="w-full bg-primary hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed text-white font-mono uppercase tracking-[0.12em] text-sm py-4 rounded-instrument transition-colors"
              >
                {status === 'sending' ? 'TRANSMITTING…' : 'TRANSMIT'}
              </motion.button>

              {status === 'sent' && (
                <p className="mt-4 type-mono-label text-success" role="status">
                  TRANSMISSION RECEIVED — WE'LL GET BACK TO YOU SOON.
                </p>
              )}
              {status === 'error' && (
                <p className="mt-4 type-mono-label text-danger" role="alert">
                  LINK FAULT — EMAIL US DIRECTLY AT{' '}
                  <a href="mailto:info@orbital-robots.com" className="underline normal-case">info@orbital-robots.com</a>.
                </p>
              )}
              <CornerBrackets />
            </form>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};

export default Contact;
