import React, { useState } from 'react';
import { Mail, Phone, MapPin, Check, Send } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Order Concierge');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="w-full bg-[#0b0b0d] text-white min-h-screen py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="border-b border-neutral-800/80 pb-6 mb-12">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400 block mb-2">
            CLIENT CONCIERGE // TUNIS STUDIO
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold uppercase text-white tracking-tight">
            Connect with RWYSE
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-neutral-400 max-w-xl font-light">
            Direct communication for order inquiries, size recommendations, showroom appointments, and studio press.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Contact Details Left (5 Cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-6 bg-[#111116] border border-neutral-800 space-y-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-white border-b border-neutral-800 pb-3">
                RWYSE Flagship Studio
              </h2>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block uppercase tracking-wider">Atelier & Showroom</strong>
                    <span className="text-neutral-400">Rue du Lac Victoria, Les Berges du Lac 1, 1053 Tunis, Tunisia</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block uppercase tracking-wider">Concierge Helpline</strong>
                    <span className="text-neutral-300 font-mono">+216 71 890 120 / +216 98 421 890</span>
                    <span className="text-[10px] text-neutral-500 block">Monday to Saturday: 10:00 – 19:30</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block uppercase tracking-wider">Electronic Inquiries</strong>
                    <span className="text-neutral-300 font-mono">concierge@rwyse.tn</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[#111116] border border-neutral-800 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-200">
                Cash On Delivery Assistance
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                If you have an urgent delivery address change or time slot specification for an active order, please call our direct hotline for instantaneous dispatch routing.
              </p>
            </div>
          </div>

          {/* Contact Form Right (7 Cols) */}
          <div className="lg:col-span-7 bg-[#111116] border border-neutral-800 p-6 sm:p-8">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-white mb-6">
              Dispatch a Message
            </h2>

            {submitted ? (
              <div className="p-8 text-center bg-neutral-900 border border-neutral-700 space-y-3">
                <Check className="w-8 h-8 text-emerald-400 mx-auto" />
                <h3 className="text-base font-bold uppercase tracking-wider text-white">
                  Message Transmitted
                </h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  Thank you for reaching out. A RWYSE studio representative will respond within 4 business hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2 bg-white text-black text-xs font-bold uppercase tracking-widest cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-neutral-400 uppercase tracking-wider block mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Karim Trabelsi"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 uppercase tracking-wider block mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. karim@domain.tn"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-neutral-400 uppercase tracking-wider block mb-1.5">
                    Inquiry Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white uppercase tracking-wider focus:outline-none focus:border-neutral-500 cursor-pointer"
                  >
                    <option value="Order Concierge">Order Status & Delivery Logistics</option>
                    <option value="Size Consultation">Sizing & Silhouette Consultation</option>
                    <option value="Press Inquiries">Editorial & Press Inquiries</option>
                    <option value="Wholesale">Private Showroom Appointments</option>
                  </select>
                </div>

                <div>
                  <label className="text-neutral-400 uppercase tracking-wider block mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Type your communication..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-8 py-3.5 bg-white text-black text-xs font-bold uppercase tracking-[0.25em] hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Transmit Inquiry</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
