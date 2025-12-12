// src/components/ShippingPolicy.jsx

import React from 'react';
import { 
    FaTruck, FaShippingFast, FaMapMarkerAlt, 
    FaCalendarCheck, FaGlobe, FaDollarSign, 
    FaClock, FaWarehouse
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

/**
 * Component to display the company's clear and detailed Shipping Policy.
 */
export default function ShippingPolicy() {
    // Current date for versioning
    const effectiveDate = "December 10, 2025";

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-12 bg-white min-h-screen">
            
            {/* Header */}
            <header className="py-6 mb-8 border-b-4 border-purple-600">
                <h1 className="text-4xl font-extrabold text-gray-900 flex items-center tracking-tight">
                    <FaTruck className="text-purple-600 mr-4 w-8 h-8" />
                    Global Shipping & Delivery Policy
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                    We ensure fast, secure, and reliable delivery for all custom and ready-to-wear orders worldwide.
                </p>
            </header>

            {/* Processing and Fulfillment */}
            <section className="space-y-6 mb-12">
                <h2 className="text-3xl font-bold text-gray-800 border-b pb-2 mb-6">
                    1. Order Processing & Fulfillment
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <PolicyDetail
                        icon={FaWarehouse}
                        title="Processing Time"
                        description="Ready-to-wear items ship within **1-2 business days**. Custom/tailored orders require **7-14 days** for production before shipping."
                        color="text-red-600"
                    />
                    <PolicyDetail
                        icon={FaCalendarCheck}
                        title="Order Cut-Off"
                        description="The daily cut-off time for processing ready-to-wear orders is **1:00 PM IST** (Monday - Friday)."
                        color="text-blue-600"
                    />
                </div>
            </section>
            
            <hr className="border-gray-200" />
            
            {/* Shipping Types and Times */}
            <section className="space-y-6 my-12">
                <h2 className="text-3xl font-bold text-gray-800 border-b pb-2 mb-6">
                    2. Estimated Shipping Times & Rates
                </h2>

                <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-100">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    Region
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    Service Level
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    Estimated Transit Time
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    Cost (Varies by Weight)
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            <ShippingRow region="Domestic (India)" service="Standard" time="3-5 Business Days" cost="Free over ₹5,000 / Flat ₹150" timeColor="text-blue-700" />
                            <ShippingRow region="Domestic (India)" service="Express" time="1-2 Business Days" cost="Calculated at Checkout" timeColor="text-red-700" />
                            <ShippingRow region="International (US, EU)" service="Standard Tracked" time="7-14 Business Days" cost="Calculated at Checkout" timeColor="text-green-700" />
                            <ShippingRow region="International (ROW)" service="Priority Air" time="10-21 Business Days" cost="Calculated at Checkout" timeColor="text-orange-700" />
                        </tbody>
                    </table>
                </div>
            </section>
            
            <hr className="border-gray-200" />

            {/* Tracking and Customs */}
            <section className="space-y-6 my-12">
                <h2 className="text-3xl font-bold text-gray-800 border-b pb-2 mb-6">
                    3. Tracking and Customs Information
                </h2>

                {/* <PolicyDetail
                    icon={FaMapMarkerAlt}
                    title="Tracking Your Order"
                    description="A tracking number will be emailed to you immediately after your order is shipped. You can track its journey via the carrier's website or our 'Track Order' page."
                    color="text-purple-600"
                /> */}
                
                <PolicyDetail
                    icon={FaGlobe}
                    title="Customs, Duties, and Taxes"
                    description="International customers are responsible for any **customs duties, taxes, or import fees** levied by their country. These charges are collected by the shipping carrier upon delivery and are not included in your order total."
                    color="text-indigo-600"
                />
                
                <p className="p-4 text-sm bg-red-50 border-l-4 border-red-400 text-red-800 font-medium rounded-lg">
                    **Important:** Transit times are estimates. **TailorLux Enterprise** is not responsible for delays caused by customs clearance procedures or extreme weather events.
                </p>
            </section>
            
            <footer className="text-sm text-gray-500 pt-8 mt-12 border-t border-gray-300 flex items-center justify-between">
                <p>
                    <FaClock className="inline mr-1 w-3 h-3" /> 
                    Last Updated: **{effectiveDate}**
                </p>
                <p>
                    <Link to="/customer-care" className="text-purple-600 hover:underline">Contact Logistics Support</Link>
                </p>
            </footer>
        </div>
    );
}

// Helper Component for Visual Appeal and Structure
const PolicyDetail = ({ icon: Icon, title, description, color }) => (
    <div className="p-5 bg-gray-50 rounded-xl shadow-md border-l-4 border-purple-300 transition duration-300 hover:shadow-lg">
        <h4 className="font-bold text-xl text-gray-900 mb-2 flex items-center">
            <Icon className={`w-5 h-5 mr-3 ${color}`} />
            {title}
        </h4>
        <p className="text-gray-700 text-base">{description}</p>
    </div>
);

// Helper Component for Table Rows
const ShippingRow = ({ region, service, time, cost, timeColor }) => (
    <tr className="hover:bg-gray-50 transition duration-150">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            {region}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
            <span className="font-semibold">{service}</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
            <span className={`font-bold ${timeColor}`}>{time}</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 flex items-center">
            <FaDollarSign className="w-3 h-3 mr-1 text-green-600" /> {cost}
        </td>
    </tr>
);