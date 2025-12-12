import React from 'react';
import { Link } from 'react-router-dom';
import { FaAngleRight, FaArrowRight, FaTshirt, FaSuitcase, FaUserTie } from 'react-icons/fa';

// --- Imported Category Images ---
// Assuming you have specific images for each category, using placeholders if not explicitly provided.
import category_shirt from "./homePageImages/category_shirt.jpg";
import feature_men from "./homePageImages/feature_men.jpg"; 
// Assuming these are also available or using a placeholder:
const category_kurta = "./homePageImages/category_kurta.jpg"; 
const category_suits = feature_men; // Using feature_men as a fallback for suits

// ======================= CATEGORY DATA MAPPING =======================
const CATEGORIES = [
    { 
        name: "Kurtas & Sherwanis", 
        description: "Classic ethnic wear for festive occasions and celebrations.", 
        image: category_kurta, 
        path: "/men/kurtas",
        icon: FaUserTie
    },
    { 
        name: "Shirts", 
        description: "From crisp formal shirts to casual linen designs.", 
        image: category_shirt, 
        path: "/men/shirts",
        icon: FaTshirt
    },
    { 
        name: "Suits & Blazers", 
        description: "Impeccably tailored ensembles for business and black-tie events.", 
        image: category_suits, 
        path: "/men/suits",
        icon: FaSuitcase
    },
];

// --- Helper Component: Category Card ---
const CategoryCard = ({ category }) => {
    const Icon = category.icon;
    return (
        <Link 
            to={category.path} 
            className="group relative block rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
        >
            {/* Background Image */}
            <img
                src={category.image}
                alt={category.name}
                className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105 filter brightness-75"
            />
            
            {/* Overlay Content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <h2 className="text-3xl font-extrabold text-white mb-1 tracking-tight flex items-center">
                    <Icon className="mr-3 w-6 h-6 text-indigo-400" /> {category.name}
                </h2>
                <p className="text-sm text-gray-200 mb-4">{category.description}</p>
                
                <span className="inline-flex items-center text-sm font-semibold text-white bg-indigo-600 px-4 py-2 rounded-full transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 w-fit">
                    View Collection <FaArrowRight className="ml-2 w-3 h-3" />
                </span>
            </div>
        </Link>
    );
};

// ======================= MAIN COMPONENT =======================

const CollectionMen = () => {
    return (
        <div className="bg-gray-50 min-h-screen pt-20">
            
            {/* 1. Collection Header & Breadcrumb */}
            <header className="bg-white shadow-md px-6 py-12">
                <div className="max-w-7xl mx-auto">
                    <nav className="text-sm text-gray-500 mb-2 flex items-center">
                        <Link to="/" className="hover:text-indigo-600">Home</Link>
                        <FaAngleRight className="w-3 h-3 mx-2" />
                        <span className="font-bold text-gray-800">Men's Collection</span>
                    </nav>
                    <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
                        The Gentleman's Wardrobe
                    </h1>
                    <p className="mt-3 text-lg text-gray-600 max-w-4xl">
                        Explore our distinguished selection of men's wear, featuring premium tailoring, modern fit shirts, and traditional ethnic attire.
                    </p>
                </div>
            </header>

            {/* 2. Category Grid */}
            <main className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {CATEGORIES.map(category => (
                        <CategoryCard key={category.name} category={category} />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default CollectionMen;