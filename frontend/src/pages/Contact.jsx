// src/components/Contact.jsx - Enhanced for Consultation CTA

import React, { useState } from "react";
import { 
    FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaComments, FaClock, 
    FaPaperPlane, FaSpinner, FaCheckCircle, FaUserTie 
} from "react-icons/fa";
import { Link } from "react-router-dom"; // Assuming Link is available

// --- Hero Image/Pattern Placeholder ---
const ContactHeroPattern = () => (
    <div className="absolute inset-0 bg-gray-900 opacity-90"></div>
);

// --- Helper component for cleaner Contact Info Cards ---
const ContactInfoCard = ({ icon: Icon, title, value, link }) => (
    <a 
        href={link} 
        className={`flex items-start p-5 bg-white rounded-xl shadow-lg border border-gray-100 transition duration-300 ${link ? 'hover:shadow-xl hover:border-indigo-500 transform hover:-translate-y-0.5' : ''}`}
        target={link && (link.startsWith('http') || link.startsWith('mailto') || link.startsWith('tel')) ? '_blank' : '_self'}
        rel={link && (link.startsWith('http') || link.startsWith('mailto') || link.startsWith('tel')) ? 'noopener noreferrer' : undefined}
    >
        <div className="p-3 bg-indigo-50 rounded-full flex-shrink-0">
            <Icon className="w-5 h-5 text-indigo-700" />
        </div>
        <div className="ml-4">
            <h3 className="font-extrabold text-gray-900 tracking-tight">{title}</h3>
            <p className="text-gray-600 text-sm font-medium">{value}</p>
        </div>
    </a>
);

const Contact = () => {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // --- PSEUDO BACKEND FUNCTIONALITY ---
        console.log("Submitting general inquiry:", form);
        // NOTE: In a real app, this would hit your POST /api/inquiries route/controller
        
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
            setTimeout(() => setForm({ name: "", email: "", subject: "", message: "" }), 100);
            setTimeout(() => setSubmitted(false), 5000); 
        }, 1500);
    };

    return (
        <div className="bg-gray-50 min-h-screen pt-20">
            
            {/* ========================================================= */}
            {/* 1. HERO / HEADER SECTION */}
            {/* ========================================================= */}
            <section className="relative bg-gray-900 py-20 px-6 overflow-hidden">
                <ContactHeroPattern /> 
                <div className="relative max-w-6xl mx-auto text-center z-10">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
                        Connect with the Studio
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
                        Our team is ready to assist you with general inquiries, order status, and customer support.
                    </p>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* ========================================================= */}
                    {/* 2. CONTACT INFORMATION & CONSULTATION CTA */}
                    {/* ========================================================= */}
                    
                    <div className="lg:col-span-1 space-y-8">
                        <h2 className="text-3xl font-extrabold text-gray-800 border-b-2 border-indigo-500 pb-3 tracking-tight">
                            Our Studio Details
                        </h2>

                        {/* Contact Cards */}
                        <div className="space-y-4">
                            <ContactInfoCard 
                                icon={FaPhoneAlt} 
                                title="Direct Line" 
                                value="+91 98765 43210 (Mon-Sat)" 
                                link="tel:+919876543210"
                            />
                            <ContactInfoCard 
                                icon={FaEnvelope} 
                                title="Dedicated Support" 
                                value="support@bespokestudio.com" 
                                link="mailto:support@bespokestudio.com"
                            />
                            <ContactInfoCard 
                                icon={FaClock} 
                                title="Operating Hours" 
                                value="Mon - Sat: 10:00 AM - 7:00 PM IST" 
                            />
                        </div>
                        
                        {/* 🌟 Personalized Consultation CTA Box */}
                        {/* <div className="p-6 bg-indigo-50 rounded-xl shadow-xl border-t-4 border-indigo-600 transition duration-300 hover:shadow-2xl">
                            <div className="flex items-center mb-3">
                                <FaUserTie className="w-8 h-8 text-indigo-700 mr-3 flex-shrink-0" />
                                <h3 className="text-xl font-extrabold text-indigo-900 tracking-tight">
                                    Book a Tailor Consultation
                                </h3>
                            </div> */}
                            {/* <p className="text-gray-700 mb-4 text-sm">
                                Get personalized style guidance, perfect fit analysis, and fabric selection advice directly from our Master Tailors.
                            </p> */}
                            {/* <Link 
                                to="/consultation-booking" // 👈 Route to the detailed booking page
                                className="w-full inline-flex items-center justify-center bg-yellow-500 text-indigo-900 font-extrabold px-6 py-3 rounded-lg text-md shadow-md hover:bg-yellow-400 transition transform hover:scale-[1.01]"
                            >
                                <FaComments className="mr-2" /> Book Your Personal Session
                            </Link> */}
                        {/* </div> */}

                        {/* Address & Map */}
                        <div className="p-5 bg-white rounded-xl shadow-xl border border-gray-100">
                             <ContactInfoCard 
                                icon={FaMapMarkerAlt} 
                                title="Studio Address" 
                                value="123 Tailor St, Bespoke Towers, Chennai, India 600001" 
                                // link="https://maps.app.goo.gl/YourStudioLocation" 
                            />
                            {/* Map Placeholder (Stylized) */}
                            <div className="rounded-lg mt-5 overflow-hidden border-4 border-gray-200 aspect-[4/3] bg-gray-200">
                                <div className="text-center p-4 text-gray-700 bg-white/50 h-full flex items-center justify-center text-sm font-semibold">
                                    [Interactive Map Placeholder]
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* ========================================================= */}
                    {/* 3. GENERAL CONTACT FORM */}
                    {/* ========================================================= */}
                    
                    <div className="lg:col-span-2 p-10 bg-white rounded-2xl shadow-2xl border border-indigo-100">
                        <h2 className="text-3xl font-extrabold text-gray-800 mb-8 flex items-center">
                            <FaPaperPlane className="text-indigo-600 mr-3" /> Submit General Inquiry
                        </h2>

                        {/* Submission Success Message */}
                        {submitted && (
                            <div className="mb-8 p-6 bg-green-50 border-l-4 border-green-500 text-green-700 font-bold rounded-lg shadow-md transition duration-500">
                                <FaCheckCircle className="inline mr-2 text-green-600"/> Thank you! Your message has been securely sent. We will respond to your query within 24 hours.
                            </div>
                        )}
                        
                        {/* Form */}
                        <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2" key={submitted ? 'submitted' : 'not-submitted'}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={form.name}
                                onChange={handleChange}
                                className="border border-gray-300 px-4 py-3 rounded-lg w-full focus:ring-indigo-600 focus:border-indigo-600 transition shadow-sm"
                                required
                                disabled={loading || submitted}
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Professional Email"
                                value={form.email}
                                onChange={handleChange}
                                className="border border-gray-300 px-4 py-3 rounded-lg w-full focus:ring-indigo-600 focus:border-indigo-600 transition shadow-sm"
                                required
                                disabled={loading || submitted}
                            />
                            <input
                                type="text"
                                name="subject"
                                placeholder="Subject (e.g., Order #123 Inquiry, Fabric Question)"
                                value={form.subject}
                                onChange={handleChange}
                                className="border border-gray-300 px-4 py-3 rounded-lg w-full md:col-span-2 focus:ring-indigo-600 focus:border-indigo-600 transition shadow-sm"
                                required
                                disabled={loading || submitted}
                            />
                            <textarea
                                name="message"
                                placeholder="Your detailed request or message (For consultation, please use the button on the left)..."
                                value={form.message}
                                onChange={handleChange}
                                className="border border-gray-300 px-4 py-3 rounded-lg w-full md:col-span-2 focus:ring-indigo-600 focus:border-indigo-600 transition shadow-sm"
                                rows={8}
                                required
                                disabled={loading || submitted}
                            />
                            <button
                                type="submit"
                                className="md:col-span-2 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-extrabold text-lg shadow-xl transition transform hover:scale-[1.005] disabled:bg-gray-400 disabled:shadow-none"
                                disabled={loading || submitted}
                            >
                                {loading ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-3" /> Sending Request...
                                    </>
                                ) : submitted ? (
                                    <>
                                        <FaCheckCircle className="mr-3" /> Sent!
                                    </>
                                ) : (
                                    <>
                                        <FaPaperPlane className="mr-3" /> Submit Enquiry
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;