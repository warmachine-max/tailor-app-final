// src/components/CustomerCare.jsx

import React from 'react';
import { 
    FaHeadset, FaPhoneAlt, FaEnvelope, FaQuestionCircle, 
    FaCommentDots, FaClock, FaCalendarAlt, FaUserTie 
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

/**
 * Component to display customer care and support options.
 */
export default function CustomerCare() {
    return (
        <div className="max-w-6xl mx-auto p-6 md:p-12 bg-white min-h-screen">
            
            {/* Header */}
            <header className="py-6 mb-8 border-b-4 border-blue-600">
                <h1 className="text-4xl font-extrabold text-gray-900 flex items-center tracking-tight">
                    <FaHeadset className="text-blue-600 mr-4 w-8 h-8" />
                    Customer Care Center
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                    We're here to help you with your orders, tailoring needs, and product inquiries.
                </p>
            </header>

            {/* Contact Options Section */}
            <section className="space-y-8 mb-12">
                <h2 className="text-3xl font-bold text-gray-800 border-b pb-2 mb-6">
                    Direct Contact Methods
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Phone Support */}
                    <ContactCard
                        icon={FaPhoneAlt}
                        title="Premium Phone Support"
                        details="+91 1234 567890 (Toll-Free)"
                        description="For urgent order modifications, complex tailoring questions, or immediate issues."
                        bgColor="bg-blue-50"
                        iconColor="text-blue-600"
                    />
                    
                    {/* Email Support */}
                    <ContactCard
                        icon={FaEnvelope}
                        title="Email Inquiry"
                        details="support@tailorlux.com"
                        description="Best for non-urgent inquiries, documentation, or submitting design specifications."
                        bgColor="bg-green-50"
                        iconColor="text-green-600"
                    />
                </div>
            </section>
            
            <hr className="border-gray-200" />
            
            {/* Business Hours */}
            <div className="my-12 p-6 bg-yellow-50 rounded-xl border-l-4 border-yellow-400 shadow-md">
                <h3 className="text-2xl font-bold text-gray-800 mb-3 flex items-center">
                    <FaClock className="mr-3 w-5 h-5 text-yellow-600" />
                    Our Support Hours
                </h3>
                <p className="text-gray-700 font-semibold">
                    Monday to Saturday: <span className="text-blue-700">9:00 AM - 7:00 PM (IST)</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                    Please note we are closed on Sundays and national holidays. Expect response times of 1-3 hours during business hours.
                </p>
            </div>
            
            {/* Self-Service and Resources */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-800 border-b pb-2 mb-6">
                    Self-Service Resources
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* <ResourceLink
                        icon={FaQuestionCircle}
                        title="Frequently Asked Questions"
                        description="Find immediate answers regarding sizing, fabrics, returns, and delivery tracking."
                        to="/faq"
                        color="text-indigo-600"
                    /> */}
                    <ResourceLink
                        icon={FaCalendarAlt}
                        title="Book a Consultation"
                        description="Schedule a video call with a master tailor for custom measurements or design review."
                        to="/contact"
                        color="text-purple-600"
                    />
                    {/* <ResourceLink
                        icon={FaCommentDots}
                        title="Live Chat Support"
                        description="Instant text chat available during operational hours for quick, guided assistance."
                        to="/live-chat"
                        color="text-red-600"
                    /> */}
                </div>
            </section>

            <footer className="text-sm text-gray-500 pt-8 mt-12 border-t border-gray-300">
                <p className='flex items-center'>
                    <FaUserTie className="inline mr-1 w-3 h-3" /> 
                    All interactions are logged and treated with strict confidentiality.
                </p>
            </footer>
        </div>
    );
}

// Helper Component for Contact Cards
const ContactCard = ({ icon: Icon, title, details, description, bgColor, iconColor }) => (
    <div className={`p-6 rounded-xl shadow-lg border border-gray-200 ${bgColor} transition duration-300 hover:shadow-xl`}>
        <Icon className={`w-8 h-8 mb-3 ${iconColor}`} />
        <h4 className="font-extrabold text-xl text-gray-900 mb-1">{title}</h4>
        <p className="text-blue-800 text-lg font-mono font-bold mb-2">{details}</p>
        <p className="text-gray-700 text-sm">{description}</p>
    </div>
);

// Helper Component for Resource Links
const ResourceLink = ({ icon: Icon, title, description, to, color }) => (
    <Link 
        to={to} 
        className="block p-5 bg-white rounded-xl shadow-md border border-gray-100 transition duration-300 hover:shadow-lg hover:border-blue-400"
    >
        <Icon className={`w-7 h-7 mb-2 ${color}`} />
        <h4 className="font-bold text-lg text-gray-900 mb-1">{title}</h4>
        <p className="text-gray-600 text-sm">{description}</p>
    </Link>
);