import React from "react";
import { Link } from "react-router-dom";
import {
  FaRegLightbulb,
  FaHandsHelping,
  FaMagic,
  FaCut,
  FaRulerCombined,
  FaShippingFast,
  FaCheckCircle,
} from "react-icons/fa"; // Added icons for visual appeal

const About = () => {
  // Define core values with icons
  const corePillars = [
    {
      icon: FaRulerCombined,
      title: "Precision Tailoring",
      desc: "Combining traditional craftsmanship with digital measurement tools to ensure an impeccable fit, every time.",
      color: "text-indigo-600",
    },
    {
      icon: FaMagic,
      title: "Design Innovation",
      desc: "Curated, trend-setting designs for men and women, bridging the gap between bespoke style and accessibility.",
      color: "text-purple-600",
    },
    {
      icon: FaHandsHelping,
      title: "Transparent Process",
      desc: "Track your order from fabric selection to final stitching and delivery, backed by responsive, customer-first service.",
      color: "text-red-600",
    },
  ];

  // Define the core service steps/timeline
  const serviceSteps = [
    { icon: FaRegLightbulb, title: "1. Select & Design", desc: "Choose your product or fabric and customize your design digitally." },
    { icon: FaRulerCombined, title: "2. Precision Measurement", desc: "Use our guides or upload your measurements for the perfect fit." },
    { icon: FaCut, title: "3. Master Crafting", desc: "Our skilled tailors hand-cut and stitch your garment with attention to detail." },
    { icon: FaShippingFast, title: "4. Quality Check & Ship", desc: "Final quality inspection before fast, secure delivery to your doorstep." },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pt-20">
      
      {/* ========================================================= */}
      {/* 1. HERO SECTION (Elevated) */}
      {/* ========================================================= */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 py-24 px-6 text-white shadow-2xl">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-lg font-medium opacity-80 mb-2 uppercase tracking-widest">
            A New Era of Bespoke Fashion
          </p>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">
            About <span className="text-yellow-300">Churps</span>
          </h1>
          <p className="text-gray-200 text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light">
            We are **Churps**: blending **centuries of craftsmanship** with **cutting-edge digital convenience** to deliver personalized, perfectly fitted attire for the modern world.
          </p>
        </div>
      </section>
      
      {/* ========================================================= */}
      {/* 2. CORE PILLARS / VALUE PROPOSITION */}
      {/* ========================================================= */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-12">
                Our Foundation: The Churps Promise
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {corePillars.map((pillar, index) => {
                const Icon = pillar.icon;
                return (
                    <div 
                        key={index} 
                        className="p-8 bg-white rounded-2xl shadow-xl border border-gray-100 text-center transition duration-300 hover:shadow-2xl hover:scale-[1.03] transform"
                    >
                        <Icon className={`w-12 h-12 mx-auto mb-4 ${pillar.color}`} />
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">{pillar.title}</h3>
                        <p className="text-gray-600 leading-relaxed text-md">{pillar.desc}</p>
                    </div>
                );
            })}
            </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. OUR PROCESS (Timeline/Steps) */}
      {/* ========================================================= */}
      <section className="py-20 bg-white px-6">
        <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-16">
                How We Deliver Your Perfect Fit
            </h2>
            
            <div className="relative flex justify-between items-center">
                {/* Horizontal Line for Timeline */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-indigo-200 hidden md:block" />

                {serviceSteps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                        <div key={index} className="flex flex-col items-center text-center w-1/4 relative z-10">
                            {/* Icon Circle */}
                            <div className="p-4 bg-indigo-600 rounded-full shadow-lg border-4 border-white mb-4 transition-transform duration-300 hover:scale-110">
                                <Icon className="w-8 h-8 text-white" />
                            </div>
                            {/* Step Content */}
                            <h3 className="text-xl font-bold text-indigo-700 mt-2">{step.title}</h3>
                            <p className="text-gray-600 text-sm mt-1 hidden md:block">{step.desc}</p>
                        </div>
                    );
                })}
            </div>
        </div>
      </section>
      
      {/* ========================================================= */}
      {/* 4. MISSION, VISION & STORY (Combined) */}
      {/* ========================================================= */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Mission & Vision Column */}
          <div className="lg:col-span-2 space-y-10">
            <div className="p-8 bg-white rounded-3xl shadow-xl border-t-4 border-indigo-500">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Our Mission & Vision</h2>
                <p className="text-gray-600 leading-relaxed border-l-4 border-indigo-200 pl-4 py-2">
                    To **redefine tailoring** by offering a digital platform where customers can explore designs, order custom outfits, and get precise fittings — all with **trust and transparency**. We aim to be India’s most reliable tailoring partner.
                </p>
            </div>
            
            <div className="p-8 bg-white rounded-3xl shadow-xl border-t-4 border-purple-500">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Our Story</h2>
                <p className="text-gray-600 leading-relaxed">
                    Churps began with a simple idea: making bespoke clothing **modern, reliable, and accessible**. Observing the gap between traditional tailor shops and modern e-commerce, we built a platform that allows you to explore designs, choose premium fabrics, upload measurements, and receive your personalized, perfectly-stitched outfit with unmatched quality.
                </p>
            </div>
          </div>
          
          {/* Why We're Different Sidebar */}
          <div className="lg:col-span-1 p-8 bg-indigo-50 rounded-3xl shadow-xl flex flex-col justify-center">
             <h3 className="text-2xl font-extrabold text-indigo-800 mb-6">Why Choose Churps?</h3>
             <ul className="space-y-4">
                 {[
                    "Digital Measurement Sync",
                    "Premium Fabric Sourcing",
                    "Guaranteed Fit Promise",
                    "Trackable Order Flow",
                    "Sustainable Practices",
                 ].map((item, idx) => (
                    <li key={idx} className="flex items-start text-gray-700">
                        <FaCheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-1 mr-3" />
                        <span className="font-medium">{item}</span>
                    </li>
                 ))}
             </ul>
          </div>
          
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. FINAL CTA SECTION */}
      {/* ========================================================= */}
      <section className="py-20 bg-indigo-700 text-white text-center px-6">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
          Ready to Wear Your Perfect Fit?
        </h2>
        <p className="text-lg max-w-3xl mx-auto mb-8 font-light">
          Stop compromising on fit. Start your custom clothing journey with Churps today.
        </p>
        <Link
          to="/" // Assuming this links to the main shopping/customization page
          className="inline-block bg-yellow-400 text-indigo-900 px-10 py-4 rounded-full text-xl font-bold shadow-2xl hover:bg-yellow-500 transition duration-300 transform hover:scale-105"
        >
          Start Customizing
        </Link>
      </section>
    </div>
  );
};

export default About;