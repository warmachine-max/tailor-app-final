import React from 'react';
import { Link } from 'react-router-dom'; // *** MUST BE IMPORTED TO USE INTERNAL LINKS ***
import { FaFilter, FaChevronDown, FaTh, FaList, FaAngleRight, FaArrowRight } from 'react-icons/fa';

// --- Imported Category Images ---
import category_saree from "./homePageImages/category_saree.jpg";
import category_salwar from "./homePageImages/category_salwar.jpg";
import category_kurta from "./homePageImages/category_kurta.jpg"; // Keeping for variety, though not explicitly a route yet
import category_blouse from "./homePageImages/blouse.jpg";
import category_lehenga from "./homePageImages/lehenga.jpg";

// ======================= CATEGORY DATA MAPPING =======================
const CATEGORIES = [
    { 
        name: "Blouses", 
        description: "The perfect companion pieces for sarees and skirts.", 
        image: category_blouse, 
        path: "/women/blouses" 
    },
    { 
        name: "Sarees", 
        description: "Traditional drapes and contemporary styles for every occasion.", 
        image: category_saree, 
        path: "/women/sarees" 
    },
    { 
        name: "Lehengas", 
        description: "Exquisite bridal and festive lehenga choli collections.", 
        image: category_lehenga, 
        path: "/women/lehengas" 
    },
    { 
        name: "Salwar Suits", 
        description: "Comfortable and elegant ethnic wear sets and churidars.", 
        image: category_salwar, 
        path: "/women/salwars" 
    },
    // Adding Kurtas as an example of a future category, using the image imported
   
];

// --- Helper Component: Category Card ---
const CategoryCard = ({ category }) => (
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
            <h2 className="text-3xl font-extrabold text-white mb-1 tracking-tight">
                {category.name}
            </h2>
            <p className="text-sm text-gray-200 mb-4">{category.description}</p>
            
            <span className="inline-flex items-center text-sm font-semibold text-white bg-indigo-600 px-4 py-2 rounded-full transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 w-fit">
                Shop Collection <FaArrowRight className="ml-2 w-3 h-3" />
            </span>
        </div>
    </Link>
);

// ======================= MAIN COMPONENT =======================

const CollectionWomen = () => {
    return (
        <div className="bg-gray-50 min-h-screen pt-20">
            
            {/* 1. Collection Header & Breadcrumb */}
            <header className="bg-white shadow-md px-6 py-12">
                <div className="max-w-7xl mx-auto">
                    <nav className="text-sm text-gray-500 mb-2 flex items-center">
                        <Link to="/" className="hover:text-indigo-600">Home</Link>
                        <FaAngleRight className="w-3 h-3 mx-2" />
                        <span className="font-bold text-gray-800">Women's Collection</span>
                    </nav>
                    <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
                        Explore Our Collections
                    </h1>
                    <p className="mt-3 text-lg text-gray-600 max-w-4xl">
                        Select a category below to dive into our curated range of Blouses, Sarees, Lehengas, and Salwar Suits, tailored for elegance and tradition.
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

export default CollectionWomen;