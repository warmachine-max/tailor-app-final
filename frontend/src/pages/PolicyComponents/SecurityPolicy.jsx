// src/components/SecurityPolicy.jsx

import React from 'react';

import { 
    FaShieldAlt, FaKey, FaUserSecret, FaLock, 
    FaExternalLinkAlt, FaDatabase, FaCreditCard, 
    FaUserCheck, FaClock 
} from 'react-icons/fa';

/**
 * Component to display the company's commitment to customer data security.
 * Includes detailed sections on data handling and an Admin-Only link via RBAC.
 */
export default function SecurityPolicy() {
    return (
        <div className="max-w-6xl mx-auto p-6 md:p-12 bg-white min-h-screen">
            
            {/* Header */}
            <header className="py-6 mb-8 border-b-4 border-indigo-600">
                <h1 className="text-4xl font-extrabold text-gray-900 flex items-center tracking-tight">
                    <FaShieldAlt className="text-indigo-600 mr-4 w-8 h-8" />
                    Our Commitment to Data Security
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                    Transparency and trust are paramount. We protect your information with the highest standards.
                </p>
            </header>

            {/* Core Pillars */}
            <section className="space-y-12">
                <h2 className="text-3xl font-bold text-gray-800 border-b pb-2 mb-6">
                    Core Security Pillars
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <SecurityPillar 
                        icon={FaLock} 
                        title="End-to-End Encryption" 
                        description="All data transmission between your device and our servers uses TLS 1.3 encryption (HTTPS)."
                        color="text-green-600"
                    />
                    <SecurityPillar 
                        icon={FaCreditCard} 
                        title="Payment Data Handling" 
                        description="We do not store full payment card details. Transactions are handled by PCI DSS compliant third-party payment processors."
                        color="text-blue-600"
                    />
                    <SecurityPillar 
                        icon={FaUserSecret} 
                        title="Strict Privacy" 
                        description="Your personal information (name, address, purchase history) is never sold or rented to third parties."
                        color="text-purple-600"
                    />
                </div>
                
                {/* Data Collection Details */}
                <div className="bg-gray-50 p-6 md:p-8 rounded-xl border border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                        <FaDatabase className="mr-3 w-5 h-5 text-indigo-600" />
                        What Data We Collect
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                        <li>**Identity Data:** Name, contact number, and email address (for account and communication).</li>
                        <li>**Transaction Data:** Order reference ID, products purchased, and shipping address (for fulfillment).</li>
                        <li>**Technical Data:** IP address, browser type, and interaction logs (for security and site optimization).</li>
                    </ul>
                </div>
                
                {/* User Rights */}
                <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                        <FaUserCheck className="mr-3 w-5 h-5 text-indigo-600" />
                        Your Data Rights
                    </h3>
                    <p className="text-gray-700">
                        In compliance with global privacy regulations, you have the right to request access to, correction of, or deletion of your personal data. Please contact our Data Protection Officer for these requests.
                    </p>
                </div>
            </section>
            
            <hr className="my-10 border-gray-300" />
            
            {/* RBAC Protected Section (Admin-Only Link)
            <Authorize permission={PERMISSIONS.VIEW_CUSTOMER_CONTACT}>
                <div className="p-6 bg-yellow-100 rounded-xl border-l-8 border-yellow-500 shadow-lg flex justify-between items-center transition duration-300">
                    <div className='flex items-center'>
                        <FaKey className="text-amber-700 mr-4 w-6 h-6 flex-shrink-0" />
                        <h3 className="font-bold text-xl text-amber-700 tracking-tight">
                            Internal System Audit Access (Administrator Privilege)
                        </h3>
                    </div>
                    <a
                        href="/internal-security-audit-policy"
                        className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center transition border-b border-transparent hover:border-blue-600"
                    >
                        Access Sensitive Audit Logs <FaExternalLinkAlt className="ml-2 w-3 h-3" />
                    </a>
                </div>
            </Authorize> */}

            <footer className="text-sm text-gray-500 pt-8 mt-8 border-t border-gray-200 flex items-center justify-between">
                <p>
                    <FaClock className="inline mr-1 w-3 h-3" /> 
                    Last Updated: December 10, 2025 (Reflects current data architecture).
                </p>
                <p>
                    <a href="/contact" className="text-blue-600 hover:underline">Contact Compliance Officer</a>
                </p>
            </footer>
        </div>
    );
}

// Helper Component for Visual Appeal
const SecurityPillar = ({ icon: Icon, title, description, color }) => (
    <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl hover:border-indigo-200">
        <Icon className={`w-8 h-8 mb-3 ${color}`} />
        <h4 className="font-bold text-xl text-gray-900 mb-1">{title}</h4>
        <p className="text-gray-600 text-sm">{description}</p>
    </div>
);