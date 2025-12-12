import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../homePageComponents/Navbar";
import AuthModal from "../components/AuthModal";

import PolicyFooter from "./PolicyFooter";

// --- Icons (Requires react-icons: npm install react-icons) ---
import {
    FaArrowRight,
    FaTag,
    FaShippingFast,
    FaTshirt,
    FaCrown,
    FaRulerCombined,
    FaMoneyBillWave,
    FaChevronRight,
    FaChevronLeft,
    FaTruckLoading, // Added for consistency
    FaLock, FaQuestionCircle, FaMapMarkerAlt // Added for consistency
} from "react-icons/fa";

// Import all required assets
import hero1 from "./homePageImages/hero1.jpg";
import hero2 from "./homePageImages/hero2.jpeg";
import hero3 from "./homePageImages/hero3.jpg";
import hero5 from "./homePageImages/hero5.jpg";
import category_saree from "./homePageImages/category_saree.jpg";
import category_salwar from "./homePageImages/category_salwar.jpg";
import category_kurta from "./homePageImages/category_kurta.jpg";
import category_blouse from "./homePageImages/blouse.jpg";
import category_lehenga from "./homePageImages/lehenga.jpg";
import category_shirt from "./homePageImages/category_shirt.jpg";
import feature_women from "./homePageImages/feature_women.jpg";
import feature_men from "./homePageImages/feature_men.jpg";
import FabricRollextileSewingTheme from "./homePageImages/Fabric rolls, textiles, sewing theme.jpg";


// --- Configuration Data ---
const HERO_IMAGES = [hero1, hero2, hero3, hero5];
const SLIDE_INTERVAL_MS = 6000;

const CATEGORIES = [
    { img: category_saree, title: "Saree", route: "/women/sarees" },
    { img: category_salwar, title: "Salwar", route: "/women/salwars" },
    { img: category_kurta, title: "Kurta", route: "/men/kurtas" },
    { img: category_blouse, title: "Blouse", route: "/women/blouses" },
    { img: category_lehenga, title: "Lehenga", route: "/women/lehengas" },
    { img: category_shirt, title: "Men's Shirts", route: "/men/shirts" },
    { isCTA: true, title: "View All Styles", route: "/products" },
];

const FEATURES = [
    {
        img: feature_women,
        title: "Designer Wear Collection",
        desc: "Explore trending sarees, salwars, blouses, and designer outfits for every occasion.",
        route: "/collection/women",
        icon: FaCrown,
    },
    {
        img: feature_men,
        title: "Gentleman's Tailoring",
        desc: "Premium shirts, trousers, and bespoke customization for a perfect fit.",
        route: "/collection/men",
        icon: FaTshirt,
    },
    {
        img: FabricRollextileSewingTheme,
        title: "Browse Premium Fabrics",
        desc: "High-quality raw materials, handpicked for comfort, durability, and elegance.",
        route: "/fabrics",
        icon: FaTag,
    },
];

const TRENDING_ITEMS = [
    { title: "Elegant Silk Saree", img: category_saree, price: "₹2,500", route: "/products/1" },
    { title: "Classic Kurta Set", img: category_kurta, price: "₹1,800", route: "/products/2" },
    { title: "Party Wear Blouse", img: category_blouse, price: "₹1,200", route: "/products/3" },
    { title: "Slim-Fit Shirt", img: category_shirt, price: "₹950", route: "/products/4" },
];

const ADVANTAGES = [
    { title: "Premium Quality", desc: "Top-notch fabrics & precision stitching.", icon: FaCrown, color: "text-indigo-600", bgColor: "bg-indigo-50" },
    { title: "Best Value Prices", desc: "Luxury fashion accessible to every budget.", icon: FaMoneyBillWave, color: "text-green-600", bgColor: "bg-green-50" },
    { title: "Custom Tailoring", desc: "Guaranteed perfect fit with our tailoring experts.", icon: FaRulerCombined, color: "text-purple-600", bgColor: "bg-purple-50" },
    { title: "Express Delivery", desc: "Tracked and fast shipping for all your orders.", icon: FaShippingFast, color: "text-red-600", bgColor: "bg-red-50" },
];


// =========================================================
// --- CUSTOM HERO SLIDER COMPONENT (Kept as is - Excellent Code) ---
// =========================================================
const HeroSlider = ({ images, interval, scrollToCategory }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-slide logic
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % images.length);
        }, interval);
        return () => clearInterval(timer);
    }, [images.length, interval]);

    const goToNext = () => setCurrentSlide((prev) => (prev + 1) % images.length);
    const goToPrev = () => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    const goToSlide = (index) => setCurrentSlide(index);

    return (
        <div className="relative w-full aspect-[16/9] lg:aspect-[2.5/1] rounded-3xl overflow-hidden shadow-2xl">
            {/* Image Slides */}
            {images.map((img, index) => (
                <img
                    key={index}
                    src={img}
                    alt={`Hero Slide ${index + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                        index === currentSlide ? "opacity-100" : "opacity-0"
                    }`}
                />
            ))}
            
            {/* Content Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex flex-col justify-center items-start px-6 md:px-24 text-white space-y-5">
                <p className="text-md md:text-xl font-medium tracking-widest uppercase text-yellow-300">
                    The Art of Fine Wear
                </p>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold drop-shadow-lg leading-tight">
                    Discover <span className="text-white">Your Perfect Fit</span>
                </h1>
                <p className="text-lg md:text-xl max-w-xl font-light">
                    Premium fabrics, bespoke tailoring, and trending outfits—style made easy.
                </p>
                <button
                    onClick={scrollToCategory}
                    className="bg-yellow-400 text-indigo-900 hover:bg-yellow-500 transition duration-300 px-8 py-3 mt-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl flex items-center transform hover:scale-[1.03]"
                >
                    Shop Collections <FaArrowRight className="ml-2 w-4 h-4" />
                </button>
            </div>

            {/* Slider Controls */}
            <button
                className="absolute left-6 top-1/2 transform -translate-y-1/2 p-4 bg-black/30 hover:bg-black/50 text-white rounded-full transition hidden md:block"
                onClick={goToPrev}
                aria-label="Previous Slide"
            >
                <FaChevronLeft className="w-5 h-5" />
            </button>
            <button
                className="absolute right-6 top-1/2 transform -translate-y-1/2 p-4 bg-black/30 hover:bg-black/50 text-white rounded-full transition hidden md:block"
                onClick={goToNext}
                aria-label="Next Slide"
            >
                <FaChevronRight className="w-5 h-5" />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition duration-300 ${
                            index === currentSlide ? "bg-white scale-125" : "bg-gray-400 hover:bg-white/70"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};


// =========================================================
// --- MAIN HOMEPAGE COMPONENT ---
// =========================================================

const HomePage = () => {
    const [authModal, setAuthModal] = useState(null);
    const categoryRef = useRef(null);

    // Smooth scroll function
    const scrollToCategory = () => {
        if (categoryRef.current) {
            const yOffset = -80; // Account for fixed navbar height
            const y = categoryRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    };

    return (
        <>
            <Navbar setAuthModal={setAuthModal} />

            <main className="bg-white min-h-screen"> 
                {/* 1. HERO SLIDER */}
                <div className="w-full pt-20 max-w-8xl mx-auto px-4 relative pb-12 bg-gray-50 border-b border-gray-200"> {/* Added bg-gray-50 for subtle depth */}
                    <HeroSlider
                        images={HERO_IMAGES}
                        interval={SLIDE_INTERVAL_MS}
                        scrollToCategory={scrollToCategory}
                    />
                </div>

                {/* 2. WHY CHOOSE US */}
                <div className="max-w-7xl mx-auto px-6 py-16"> {/* Increased padding for better separation */}
                    <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-12 tracking-tight border-b-2 border-indigo-100 pb-3">
                        Why Choose Our Tailoring?
                    </h2>
                    <div className="grid md:grid-cols-4 gap-8"> {/* Increased gap */}
                        {ADVANTAGES.map((adv, i) => {
                            const Icon = adv.icon;
                            return (
                                <div
                                    key={i}
                                    className={`bg-white p-7 rounded-2xl shadow-xl border-t-4 ${adv.color.replace('text', 'border')} hover:shadow-2xl transition duration-500 transform hover:-translate-y-2`}
                                >
                                    <div className={`p-3 rounded-full inline-block mb-4 ${adv.bgColor}`}>
                                        <Icon className={`w-6 h-6 ${adv.color}`} />
                                    </div>
                                    <h3 className="font-extrabold text-xl mb-1 text-gray-900">
                                        {adv.title}
                                    </h3>
                                    <p className="text-gray-600 text-base">{adv.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                <hr className="max-w-7xl mx-auto border-gray-100" />

                {/* 3. CATEGORY GRID */}
                <div ref={categoryRef} className="max-w-7xl mx-auto px-6 py-16">
                    <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-16">
                        Shop By <span className="text-indigo-600">Fine Wear Category</span>
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-6">
                        {CATEGORIES.map((cat, i) =>
                            cat.isCTA ? (
                                // CTA Tile
                                <Link
                                    key={i}
                                    to={cat.route}
                                    className="lg:col-span-1 col-span-2 sm:col-span-1 flex items-center justify-center p-6 rounded-3xl bg-indigo-700 text-white font-extrabold text-lg hover:bg-indigo-800 transition duration-300 transform hover:scale-105 shadow-2xl"
                                >
                                    <div className="text-center">
                                        <FaChevronRight className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                                        {cat.title}
                                    </div>
                                </Link>
                            ) : (
                                // Image Category Tile
                                <Link
                                    key={i}
                                    to={cat.route}
                                    className="group block rounded-3xl shadow-xl border border-gray-200 transition duration-300 transform hover:-translate-y-2 overflow-hidden relative"
                                >
                                    <div className="w-full aspect-square overflow-hidden">
                                        <img
                                            src={cat.img}
                                            alt={cat.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition duration-500 flex items-end">
                                        <p className="text-xl font-bold text-white p-4 w-full text-center bg-black/50 backdrop-blur-sm">
                                            {cat.title}
                                        </p>
                                    </div>
                                </Link>
                            )
                        )}
                    </div>
                </div>

                {/* 4. FEATURED COLLECTION */}
                <div className="max-w-7xl mx-auto px-6 py-16 bg-gray-50 rounded-xl shadow-inner border border-gray-100 my-16"> {/* New background for separation */}
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-12 text-center">
                        Our Signature <span className="text-purple-600">Bespoke Collections</span>
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {FEATURES.map((feature, i) => {
                            const Icon = feature.icon;
                            return (
                                <Link
                                    key={i}
                                    to={feature.route}
                                    className="group relative rounded-3xl bg-white shadow-xl transition overflow-hidden transform hover:-translate-y-2 hover:shadow-purple-400/50 duration-500"
                                >
                                    <div className="relative w-full h-72 overflow-hidden">
                                        <img 
                                            src={feature.img} 
                                            alt={feature.title} 
                                            className="w-full h-full object-cover transition duration-500 group-hover:scale-110" 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                    </div>
                                    
                                    <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                                        <Icon className="w-7 h-7 mb-2 text-yellow-400" />
                                        <h3 className="text-2xl font-extrabold">{feature.title}</h3>
                                        <p className="text-sm font-light mt-1 max-w-sm opacity-90">{feature.desc}</p>
                                        <span className="mt-3 inline-flex items-center text-md font-bold text-yellow-400 border-b-2 border-yellow-400/50 hover:border-yellow-400 transition">
                                            Discover More <FaChevronRight className="ml-1 w-3 h-3" />
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* 5. TRENDING NOW */}
                <div className="max-w-7xl mx-auto px-6 py-16">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-12 text-center">
                        Hot Trends This <span className="text-red-600">Week 🔥</span>
                    </h2>
                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {TRENDING_ITEMS.map((item, i) => (
                            <Link
                                key={i}
                                to={item.route}
                                className="bg-white rounded-3xl shadow-xl overflow-hidden group border border-gray-200 hover:shadow-2xl transition duration-300 transform hover:scale-[1.05]"
                            >
                                <div className="relative overflow-hidden">
                                    <img
                                        src={item.img}
                                        alt={item.title}
                                        className="w-full h-72 object-cover transition duration-500 group-hover:scale-110"
                                    />
                                    <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-white/50">
                                        TRENDING
                                    </span>
                                </div>
                                <div className="p-5 text-center">
                                    <h3 className="font-extrabold text-xl text-gray-900 mb-1">
                                        {item.title}
                                    </h3>
                                    <p className="text-indigo-600 text-2xl font-extrabold">
                                        {item.price}
                                    </p>
                                    <button className="mt-4 w-full py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg hover:shadow-xl">
                                        View Details
                                    </button>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* 6. FINAL CTA BANNER */}
              <div className="max-w-7xl mx-auto px-6 py-16 mb-0">
                    <div className="bg-gradient-to-r from-indigo-800 to-purple-700 p-12 rounded-3xl shadow-2xl flex flex-col md:flex-row justify-between items-center text-white space-y-6 md:space-y-0 border-b-4 border-yellow-400">
                        
                        {/* 1. Main Text and Charge Disclaimer Container */}
                        <div className="text-center md:text-left max-w-3xl space-y-4">
                            
                            {/* Headline */}
                            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                                Expert Tailoring Guidance, No Purchase Required
                            </h3>
                            
                            {/* Subtext */}
                            <p className="text-lg font-light opacity-90">
                                Whether you purchase from us or shop elsewhere, our master tailor provides **personalized, perfect-match style counseling** to ensure your fit is flawless.
                            </p>
                            
                            {/* Consultation Charge Notice (Styled for prominence and clarity) */}
                            <div className="pt-2">
                                <p className="text-sm font-semibold text-yellow-300 italic border-t border-yellow-400/50 pt-2 inline-block">
                                    <span className="bg-indigo-900 px-2 py-0.5 rounded-full mr-1 text-xs">⚠️</span>
                                    Please note: Consultation charges apply when you book an appointment at your Doorstep.
                                </p>
                            </div>
                        </div>
                        
                        {/* 2. Action Button */}
                        <Link 
                            to="/consultation-booking"
                            className="bg-yellow-400 text-indigo-900 font-extrabold px-8 py-4 rounded-full text-lg shadow-xl hover:bg-yellow-500 transition duration-300 transform hover:scale-105 flex-shrink-0"
                        >
                            Book Consultation
                        </Link>
                        
                    </div>
            </div>
            </main>
            
            {/* 7. POLICY FOOTER (The requested addition) */}
            <PolicyFooter /> 
            
            {/* Modal */}
            {authModal && <AuthModal type={authModal} close={() => setAuthModal(null)} />}
        </>
    );
};

export default HomePage;