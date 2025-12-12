// src/components/WorkOrderSteps.jsx

import React from 'react';
import { 
    FaClipboardList,   // 1. Order Placed
    FaHome,            // 2. Fitting/Home Visit
    FaTshirt,          // 3. Bespoke Crafting
    FaTruckLoading,    // 4. Ready & Delivery/Pickup
    FaMoneyBillWave    // 5. Final Payment & Collection
} from 'react-icons/fa';

/**
 * A component to visually display the specific 5-step custom work order 
 * for Churps, including fitting and staggered payment points.
 */
export default function WorkOrderSteps() {
    // Define the steps of the work order based on your description
    const steps = [
        {
            icon: FaClipboardList,
            title: "1. Order & Confirmation",
            description: "You place your order. Our team calls to confirm details and schedule a **Fitting Appointment**.",
            iconColor: "text-indigo-400",
        },
        {
            icon: FaHome,
            title: "2. Fitting & First Payment (50%)",
            description: "We visit your home (or you visit our store) to take precise measurements. **50% of the total amount** is due upon completion of the fitting.",
            iconColor: "text-yellow-400",
        },
        {
            icon: FaTshirt,
            title: "3. Bespoke Crafting",
            description: "Our master tailors begin the meticulous process of cutting, sewing, and crafting your custom outfit.",
            iconColor: "text-green-400",
        },
        {
            icon: FaTruckLoading,
            title: "4. Order Ready & Notification",
            description: "Your order is complete! We notify you via the website and call to schedule **Home Delivery** or **Store Pickup**.",
            iconColor: "text-red-400",
        },
        {
            icon: FaMoneyBillWave,
            title: "5. Final Fit, Payment (50%) & Collection",
            description: "If satisfied with the final fit, you make the **remaining 50% payment** and take home your bespoke outfit.",
            iconColor: "text-purple-400",
        },
    ];

    return (
        <section className="bg-white py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                        Your Bespoke Journey: 5 Simple Steps
                    </h2>
                    <p className="mt-4 text-xl text-gray-600">
                        A transparent and personalized process from measurement to delivery.
                    </p>
                </div>

                {/* Steps Grid - Adjusted for 5 steps */}
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow-lg transition duration-300 hover:shadow-xl hover:bg-white border-t-4 border-b-4 border-transparent hover:border-indigo-600">
                            
                            {/* Icon */}
                            <div className={`p-4 rounded-full ${step.iconColor} bg-gray-900 mb-4`}>
                                <step.icon className="w-8 h-8" />
                            </div>

                            {/* Step Content */}
                            <h3 className="text-xl font-bold mb-2 text-gray-900">
                                {step.title}
                            </h3>
                            <p className="text-sm text-gray-700">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
                
                <div className="mt-12 text-center text-gray-600">
                    <p className="italic">
                        *Note: If corrections are required at the final fitting (Step 5), we will not begin the final payment transaction until you are fully satisfied.
                    </p>
                </div>
                
                {/* Image Trigger for visualization */}
                
                
            </div>
        </section>
    );
}