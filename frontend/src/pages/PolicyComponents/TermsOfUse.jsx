// src/components/TermsOfUse.jsx

import React from 'react';
import { 
    FaFileContract, FaRegHandshake, FaUserShield, 
    FaGavel, FaLightbulb, FaExchangeAlt, FaClock,
    FaRegLightbulb,FaCopyright
} from 'react-icons/fa';

/**
 * Component to display the comprehensive Terms of Use for the application.
 */
export default function TermsOfUse() {
    // Current date for versioning
    const effectiveDate = "December 10, 2025";

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-12 bg-white min-h-screen">
            
            {/* Header */}
            <header className="py-6 mb-8 border-b-4 border-purple-600">
                <h1 className="text-4xl font-extrabold text-gray-900 flex items-center tracking-tight">
                    <FaFileContract className="text-purple-600 mr-4 w-8 h-8" />
                    Platform Terms of Use
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                    Please read these terms carefully. By accessing or using our services, you agree to be bound by these terms.
                </p>
            </header>

            {/* Acceptance Section */}
            <section className="space-y-6">
                <TermSection
                    icon={FaRegHandshake}
                    title="1. Acceptance of Terms"
                    content={
                        <>
                            <p>These Terms of Use ("Terms") constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you"), and **Churps Enterprise** concerning your access to and use of the platform and related services (collectively, the "Service").</p>
                            <p className="font-semibold text-purple-700 mt-2">
                                If you do not agree with all these Terms, then you are expressly prohibited from using the Service and must discontinue use immediately.
                            </p>
                        </>
                    }
                    color="text-green-600"
                />

                {/* User Obligations Section */}
                <TermSection
                    icon={FaUserShield}
                    title="2. User Obligations and Conduct"
                    content={
                        <>
                            <p>You agree to use the Service only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the Service.</p>
                            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mt-2">
                                <li>You must maintain the security of your account and password.</li>
                                <li>You must not use automated scripts to collect information from or otherwise interact with the Service.</li>
                                
                                <li>All billing and registration information provided must be truthful and accurate.</li>
                            </ul>
                        </>
                    }
                    color="text-blue-600"
                />

                {/* Intellectual Property Rights Section */}
                <TermSection
                    icon={FaLightbulb}
                    title="3. Intellectual Property Rights"
                    content={
                        <>
                            <p>All intellectual property rights in the Service (including the content, design, text, graphics, software, and underlying source code) are owned by or licensed to **TailorLux Enterprise**.</p>
                            <p>You are granted a non-exclusive, non-transferable, revocable license to access and use the Service strictly in accordance with these Terms.</p>
                        </>
                    }
                    color="text-yellow-600"
                />

                {/* Dispute Resolution Section */}
                <TermSection
                    icon={FaGavel}
                    title="4. Governing Law and Dispute Resolution"
                    content={
                        <>
                            <p>These Terms and your use of the Service are governed by and construed in accordance with the laws of **[Specify Jurisdiction, e.g., the State of New York]** without regard to its conflict of law principles.</p>
                            <p className="font-medium text-red-700 mt-2">
                                Any legal action or proceeding related to the Service shall be instituted in the federal or state courts located in **[Specify Jurisdiction, e.g., New York County]**.
                            </p>
                        </>
                    }
                    color="text-red-600"
                />
                
                {/* Amendments Section */}
                <TermSection
                    icon={FaExchangeAlt}
                    title="5. Modifications and Interruptions"
                    content={
                        <>
                            <p>We reserve the right to change, modify, or remove the contents of the Service at any time or for any reason at our sole discretion without notice.</p>
                            <p>We may amend these Terms at any time. The updated version of these Terms will be effective immediately upon posting on the Service, and your continued use after such changes constitutes acceptance of the modified Terms.</p>
                        </>
                    }
                    color="text-orange-600"
                />
            </section>
            
            <footer className="text-sm text-gray-500 pt-8 mt-12 border-t border-gray-300 flex items-center justify-between">
                <p>
                    <FaClock className="inline mr-1 w-3 h-3" /> 
                    Effective Date: **{effectiveDate}**
                </p>
                <p>
                    <FaCopyright className="inline mr-1 w-3 h-3" /> 
                    2025 Churps Enterprise. All rights reserved.
                </p>
            </footer>
        </div>
    );
}

// Helper Component for Visual Appeal and Structure
const TermSection = ({ icon: Icon, title, content, color }) => (
    <div className="p-6 bg-gray-50 rounded-xl shadow-md border-l-4 border-purple-300 transition duration-300 hover:shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center">
            <Icon className={`w-6 h-6 mr-3 ${color}`} />
            {title}
        </h2>
        <div className="text-gray-700 space-y-3 pl-1">
            {content}
        </div>
    </div>
);