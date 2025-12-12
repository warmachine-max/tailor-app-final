// src/components/PolicyFooter.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { 
    FaShieldAlt, FaHeadset, FaFileContract, 
    FaTruck, FaStore, FaRulerCombined, FaEnvelope,
    FaHeart,FaMoneyBillWave
} from 'react-icons/fa';
 import { FaLock, FaQuestionCircle, FaMapMarkerAlt, FaTruckLoading } from "react-icons/fa";

 import SecurityPolicy from './PolicyComponents/SecurityPolicy';

export default function PolicyFooter() {
    return (
        <footer className="bg-gray-900 text-white p-10 md:p-12 border-t-8 border-indigo-600">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
                
                {/* Column 1: Brand & Commitment */}
                <div className="col-span-2 md:col-span-2 space-y-4">
                    <h3 className="text-2xl font-extrabold mb-2 text-yellow-400 flex items-center">
                        <FaRulerCombined className="mr-2 w-5 h-5"/> Churps
                    </h3>
                    <p className="text-sm text-gray-400 max-w-sm">
                        Committed to bespoke quality, transparency, and superior service. Your satisfaction is our signature.
                    </p>
                    <div className="text-xs text-gray-500 flex items-center pt-2">
                         Crafted with <FaHeart className="w-3 h-3 mx-1 text-red-500" /> in India.
                    </div>
                </div>

                {/* Column 2: Legal & Security */}
                <div>
                    <h3 className="text-lg font-bold mb-4 text-gray-200 tracking-wider uppercase">Legal & Security</h3>
                    <ul className="space-y-3">
                        <li>
                            <Link to="/security-policy" className="text-sm text-gray-400 hover:text-yellow-400 transition flex items-center">
                                <FaShieldAlt className="mr-2 text-green-400 w-4 h-4" />
                                Security and Privacy 
                            </Link>
                        </li>
                        <li>
                            <Link to="/terms-of-use" className="text-sm text-gray-400 hover:text-yellow-400 transition flex items-center">
                                <FaFileContract className="mr-2 w-4 h-4" />
                                Terms of Use
                            </Link>
                        </li>
                       
                    </ul>
                </div>

                {/* Column 3: Customer Care */}
                <div>
                    <h3 className="text-lg font-bold mb-4 text-gray-200 tracking-wider uppercase">Support</h3>
                    <ul className="space-y-3">
                        <li>
                            <Link to="/customer-care" className="text-sm text-gray-400 hover:text-yellow-400 transition flex items-center">
                                <FaHeadset className="mr-2 text-blue-400 w-4 h-4" />
                                Customer Care Center
                            </Link>
                        </li>
                        <li>
                            {/* <Link to="/faq" className="text-sm text-gray-400 hover:text-yellow-400 transition flex items-center">
                                <FaQuestionCircle className="mr-2 w-4 h-4" />
                                FAQ & Help
                            </Link> */}
                        </li>
                        <li>
                            {/* <a href="mailto:support@tailorlux.com" className="text-sm text-gray-400 hover:text-yellow-400 transition flex items-center">
                                <FaEnvelope className="mr-2 w-4 h-4" />
                                Email Support
                            </a> */}
                        </li>
                    </ul>
                </div>

                {/* Column 4: Orders & Logistics */}
                <div>
                    <h3 className="text-lg font-bold mb-4 text-gray-200 tracking-wider uppercase">Orders</h3>
                    <ul className="space-y-3">
                        <li>
                            <Link to="/shipping-policy" className="text-sm text-gray-400 hover:text-yellow-400 transition flex items-center">
                                <FaTruck className="mr-2 text-purple-400 w-4 h-4" />
                                Shipping Policy
                            </Link>
                        </li>
                        <li>
                            <Link to="/return-policy" className="text-sm text-gray-400 hover:text-yellow-400 transition flex items-center">
                                <FaTruckLoading className="mr-2 text-amber-400 w-4 h-4" />
                                Return Policy
                            </Link>
                        </li>
                        <li>
                                <Link to="/work-order-steps" className="text-sm text-gray-400 hover:text-yellow-400 transition flex items-center">
                                    <FaMoneyBillWave className="mr-2 w-5 h-5" />
                                    WorkOrderSteps
                                </Link>
                        </li>
                    </ul>
                </div>
                
            </div>
            
            {/* Copyright */}
            <div className="mt-10 pt-6 border-t border-gray-700 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Churps Enterprise. All Rights Reserved.
            </div>
        </footer>
    );
}

// NOTE: Ensure you install these additional icons:
// import { FaLock, FaQuestionCircle, FaMapMarkerAlt } from "react-icons/fa";