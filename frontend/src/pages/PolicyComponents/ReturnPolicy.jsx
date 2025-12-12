// src/components/ReturnPolicy.jsx - REVISED FOR DOORSTEP SERVICE

import React from 'react';
import { 
    FaTruckLoading, FaHandsHelping, FaCalendarAlt, 
    FaUserCheck, FaMapMarkerAlt, FaCommentDots, 
    FaClock, FaClipboardList, FaArrowLeft, FaSuitcase 
} from 'react-icons/fa';

/**
 * Component to display the Return and Refund Policy focused on the Tailor Doorstep 
 * Inspection and Retrieval Service.
 */
export default function ReturnPolicy() {
    const effectiveDate = "December 10, 2025";

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-12 bg-white min-h-screen">
            
            {/* Header */}
            <header className="py-6 mb-8 border-b-4 border-teal-600">
                <h1 className="text-4xl font-extrabold text-gray-900 flex items-center tracking-tight">
                    <FaSuitcase className="text-teal-600 mr-4 w-8 h-8" />
                    Premium Doorstep Inspection & Return Policy
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                    We offer a personalized return experience where our Tailor Team handles inspection and retrieval at your location.
                </p>
            </header>

            {/* Policy Highlights */}
            <section className="space-y-6 mb-12">
                <h2 className="text-3xl font-bold text-gray-800 border-b pb-2 mb-6">
                    Key Policy Terms
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <PolicyHighlight 
                        icon={FaCalendarAlt} 
                        title="Return Window" 
                        text="30 calendar days from delivery date for scheduling the doorstep inspection." 
                        color="text-teal-700"
                    />
                    <PolicyHighlight 
                        icon={FaHandsHelping} 
                        title="Return Method" 
                        text="Doorstep inspection and pickup service by a Tailor Team member (No self-shipping required)." 
                        color="text-indigo-700"
                    />
                    <PolicyHighlight 
                        icon={FaUserCheck} 
                        title="Eligibility" 
                        text="Applies primarily to tailoring discrepancies, fit issues, or verified material defects." 
                        color="text-green-700"
                    />
                </div>
            </section>
            
            <hr className="border-gray-200" />
            
            {/* Steps to Return - Tailor Service Focus */}
            <section className="space-y-8 my-12">
                <h2 className="text-3xl font-bold text-gray-800 border-b pb-2 mb-6 flex items-center">
                    <FaClipboardList className="mr-3 w-6 h-6 text-teal-600" />
                    Doorstep Return Process
                </h2>

                <ol className="space-y-6">
                    <ReturnStep 
                        number="1" 
                        title="Initiate Doorstep Request on Dashboard" 
                        description="Log in, navigate to 'All Personal Transactions', find the delivered item, and click the **'Request Tailor Visit'** button. State the issue (e.g., fit, defect) clearly."
                        color="bg-teal-100"
                    />
                    <ReturnStep 
                        number="2" 
                        title="Schedule Appointment" 
                        description="Our Customer Care team will contact you within **48 hours** via phone to schedule a specific date and time for the Tailor Team's visit to your registered address."
                        color="bg-teal-50"
                    />
                    <ReturnStep 
                        number="3" 
                        title="Tailor Team Inspection & Pickup" 
                        description="A qualified Tailor will visit to **inspect the fault** (fit, stitching, material). If the fault is confirmed, they will retrieve the garment on the spot. No repackaging needed by you."
                        color="bg-gray-100"
                    />
                    <ReturnStep 
                        number="4" 
                        title="Resolution & Refund/Remake" 
                        description="Following inspection confirmation, we will initiate either a **full refund** (processed within 5 days) or offer a **complimentary remake/alteration**, based on your preference."
                        color="bg-green-50"
                    />
                </ol>
            </section>
            
            <hr className="border-gray-200" />
            
            {/* Exclusions and Important Note */}
            <section className="my-12 p-6 bg-yellow-50 rounded-xl border-l-4 border-yellow-400 shadow-md">
                <h3 className="text-2xl font-bold text-yellow-800 mb-3 flex items-center">
                    <FaMapMarkerAlt className="mr-3 w-5 h-5" />
                    Important Note on Service Area
                </h3>
                <p className="text-yellow-700 font-medium">
                    The **Doorstep Inspection & Retrieval Service** is currently available only in major metropolitan areas, including **[List Key Cities, e.g., Mumbai, Delhi, Bengaluru, Chennai]**. If your address is outside our service area, we will arrange for a special expedited shipping pickup at our cost.
                </p>
            </section>

            <footer className="text-sm text-gray-500 pt-8 mt-12 border-t border-gray-300 flex items-center justify-between">
                <p>
                    <FaClock className="inline mr-1 w-3 h-3" /> 
                    Last Updated: **{effectiveDate}**
                </p>
                <p>
                    For scheduling questions: <a href="/customer-care" className="text-teal-600 hover:underline">Contact Customer Care</a>
                </p>
            </footer>
        </div>
    );
}

// Helper Component for Policy Highlights
const PolicyHighlight = ({ icon: Icon, title, text, color }) => (
    <div className="p-5 bg-white rounded-xl shadow-lg border-t-4 border-teal-300 transition duration-300 hover:shadow-2xl">
        <Icon className={`w-7 h-7 mx-auto mb-3 ${color}`} />
        <h4 className="font-bold text-xl text-gray-900 text-center">{title}</h4>
        <p className="text-gray-600 text-sm mt-1 text-center">{text}</p>
    </div>
);

// Helper Component for Return Steps
const ReturnStep = ({ number, title, description, color }) => (
    <li className={`flex items-start p-5 rounded-xl border-l-8 border-teal-400 ${color} shadow-sm`}>
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-600 text-white font-extrabold flex items-center justify-center text-lg mr-4">
            {number}
        </div>
        <div>
            <h4 className="font-bold text-lg text-gray-900 mb-1">{title}</h4>
            <p className="text-gray-700 text-base">{description}</p>
        </div>
    </li>
);