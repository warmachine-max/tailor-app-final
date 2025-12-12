import { useState, useEffect, useRef } from "react";
import {
    FaUserCircle,
    FaCaretDown,
    FaShoppingCart,
    FaSignOutAlt,
    FaSignInAlt,
    FaUserPlus,
    FaSeedling,
    FaHistory, // Icon for Consultations Dashboard
    FaClipboardList
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

// --- Custom Component for Category Dropdown Items ---
const CategoryDropdownItem = ({ to, title, subtitle, onClick }) => (
    <Link
        to={to}
        className="group block p-3 rounded-lg hover:bg-indigo-50 transition duration-200 transform hover:translate-x-1"
        onClick={onClick}
    >
        <p className="font-semibold text-gray-800 group-hover:text-indigo-600 transition">
            {title}
        </p>
        <p className="text-sm text-gray-500 group-hover:text-indigo-400">{subtitle}</p>
    </Link>
);

export default function Navbar({ setAuthModal }) {
    const [openUser, setOpenUser] = useState(false);
    const [openMen, setOpenMen] = useState(false);
    const [openWomen, setOpenWomen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [consultationCount, setConsultationCount] = useState(0); 
    const [isScrolled, setIsScrolled] = useState(false); 

    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();

    const menRef = useRef(null);
    const womenRef = useRef(null);
    const userRef = useRef(null);

    // --- Scroll Effect (Sticky Navbar) ---
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // --- Fetch Counts Effect ---
    useEffect(() => {
        if (!user) {
            setCartCount(0);
            setConsultationCount(0);
            return;
        }
        
        const fetchCartCount = async () => {
            try {
                const endpoint =
                    user.role === "admin"
                        ? "http://localhost:5000/api/booking/all"
                        : "http://localhost:5000/api/booking/user";

                const res = await fetch(endpoint, { credentials: "include" });
                const data = await res.json();
                if (res.ok) {
                    setCartCount(data.filter(item => item.status !== 'delivered' && item.status !== 'rejected').length || 0); 
                }
            } catch (err) {
                console.error("Cart fetch failed:", err.message);
            }
        };

        const fetchConsultationCount = async () => {
            if (user.role !== 'admin') {
                setConsultationCount(0);
                return;
            }
            try {
                const CONSULTATION_URL = "http://localhost:5000/api/consultations";
                const res = await fetch(CONSULTATION_URL, { credentials: "include" });
                const data = await res.json();

                if (res.ok) {
                    // Filter for only 'PENDING_CONFIRMATION'
                    const pendingCount = data.filter(c => c.status === 'PENDING_CONFIRMATION').length;
                    setConsultationCount(pendingCount);
                } else {
                    console.error("Failed to fetch admin consultations list.");
                }
            } catch (err) {
                console.error("Consultation count fetch failed:", err.message);
            }
        };

        fetchCartCount();
        fetchConsultationCount(); 
    }, [user]);

    // --- Close dropdowns on outside click (Unchanged) ---
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menRef.current && !menRef.current.contains(event.target))
                setOpenMen(false);
            if (womenRef.current && !womenRef.current.contains(event.target))
                setOpenWomen(false);
            if (userRef.current && !userRef.current.contains(event.target))
                setOpenUser(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // --- Utility functions ---
    const linkClass = "hover:text-indigo-600 transition duration-200 py-1 border-b-2 border-transparent hover:border-indigo-600";
    const navStyle = `w-full fixed top-0 left-0 z-50 transition-all duration-300 py-3 md:py-4 ${
        isScrolled ? "bg-white shadow-xl" : "bg-white/95 backdrop-blur-sm shadow-md"
    }`;

    const handleLogout = () => {
        logout();
        setOpenUser(false);
        navigate("/"); 
    };

    const handleAuth = (type) => {
        setAuthModal(type);
        setOpenUser(false);
    };

    const closeAllDropdowns = () => {
        setOpenMen(false);
        setOpenWomen(false);
        setOpenUser(false);
    };


    return (
        <nav className={navStyle}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                
                {/* LOGO */}
                <Link
                    to="/"
                    className="text-3xl font-extrabold text-indigo-700 hover:text-indigo-800 transition tracking-wider"
                    onClick={closeAllDropdowns}
                >
                    CHRUPS
                </Link>

                {/* LINKS (MAIN NAVIGATION AREA) */}
                <ul className="hidden lg:flex items-center gap-6 font-medium text-gray-700">
                    
                    {/* ... Men, Women, Fabrics links ... (Keep these) */}
                    <li className="relative group" ref={menRef} onMouseEnter={() => setOpenMen(true)} onMouseLeave={() => setOpenMen(false)}>
                        <p className={`cursor-pointer flex items-center gap-1 px-2 ${linkClass} ${openMen ? 'text-indigo-600 border-indigo-600' : ''}`}>
                            Men <FaCaretDown className={`transition-transform duration-200 ${openMen ? 'rotate-180' : 'rotate-0'}`} />
                        </p>
                        {openMen && (
                            <div className="absolute left-1/2 transform -translate-x-1/2 top-full pt-4 w-64">
                                <div className="bg-white shadow-2xl rounded-xl p-4 space-y-1 border border-gray-100 animate-fadeIn">
                                    <CategoryDropdownItem onClick={closeAllDropdowns} to="/men/kurtas" title="Kurta Sets" subtitle="Traditional & Modern Designs" />
                                    <CategoryDropdownItem onClick={closeAllDropdowns} to="/men/shirts" title="Shirts & Trousers" subtitle="Formal and Casual Wear" />
                                    <CategoryDropdownItem onClick={closeAllDropdowns} to="/men/suits" title="Bespoke Suits" subtitle="Custom Tailoring Services" />
                                </div>
                            </div>
                        )}
                    </li>

                    <li className="relative group" ref={womenRef} onMouseEnter={() => setOpenWomen(true)} onMouseLeave={() => setOpenWomen(false)}>
                        <p className={`cursor-pointer flex items-center gap-1 px-2 ${linkClass} ${openWomen ? 'text-indigo-600 border-indigo-600' : ''}`}>
                            Women <FaCaretDown className={`transition-transform duration-200 ${openWomen ? 'rotate-180' : 'rotate-0'}`} />
                        </p>
                        {openWomen && (
                            <div className="absolute left-1/2 transform -translate-x-1/2 top-full pt-4 w-64">
                                <div className="bg-white shadow-2xl rounded-xl p-4 space-y-1 border border-gray-100 animate-fadeIn">
                                    <CategoryDropdownItem onClick={closeAllDropdowns} to="/women/sarees" title="Designer Sarees" subtitle="Silk, Cotton, and Embroidered" />
                                    <CategoryDropdownItem onClick={closeAllDropdowns} to="/women/blouses" title="Blouse Tailoring" subtitle="Custom fit and trendy patterns" />
                                    <CategoryDropdownItem onClick={closeAllDropdowns} to="/women/lehengas" title="Lehenga Cholis" subtitle="Bridal and Party Wear" />
                                    <CategoryDropdownItem onClick={closeAllDropdowns} to="/women/salwars" title="Salwar Kameez" subtitle="Everyday and Formal Sets" />
                                </div>
                            </div>
                        )}
                    </li>

                    <li>
                        <Link to="/fabric" className={`flex items-center gap-1 ${linkClass}`} onClick={closeAllDropdowns}>
                            <FaSeedling size={16} /> Fabrics
                        </Link>
                    </li>
                    
                    {/* **NEW LOCATION FOR ADMIN CONSULTATION LINK** */}
                    {user && user.role === 'admin' && (
                        <li>
                            <Link 
                                to="/admin/consultations/history" 
                                className={`flex items-center gap-1 ${linkClass} relative px-3 py-2 rounded-lg bg-yellow-50 text-yellow-800 font-bold hover:bg-yellow-100`} 
                                onClick={closeAllDropdowns}
                            >
                                <FaHistory size={16} /> Consult Dashboard
                                {/* Display the count badge here */}
                                {consultationCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold shadow-lg ring-2 ring-white">
                                        {consultationCount > 9 ? "9+" : consultationCount}
                                    </span>
                                )}
                            </Link>
                        </li>
                    )}
                    {/* END NEW LOCATION */}

                    <li>
                        <Link to="/about" className={linkClass} onClick={closeAllDropdowns}>About Us</Link>
                    </li>
                    <li>
                        <Link to="/contact" className={linkClass} onClick={closeAllDropdowns}>Contact</Link>
                    </li>
                </ul>

                {/* RIGHT SIDE: CART + USER */}
                <div className="flex items-center gap-5 md:gap-6">
                    
                    {/* CART ICON */}
                    {user && (
                        <div
                            className="relative cursor-pointer text-gray-700 hover:text-indigo-600 transition"
                            onClick={() => { navigate("/cart"); closeAllDropdowns(); }}
                        >
                            {user && user.role === 'admin' ? (
                                <FaClipboardList size={26} />
                            ) : (
                                <FaShoppingCart size={26} />
                            )}
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold animate-ping-once shadow-lg">
                                    {cartCount > 9 ? "9+" : cartCount}
                                </span>
                            )}
                        </div>
                    )}

                    {/* USER MENU */}
                    <div className="relative" ref={userRef}>
                        <button
                            className="flex items-center gap-2 cursor-pointer p-2 rounded-full transition duration-200 bg-indigo-100 hover:bg-indigo-200 text-indigo-800"
                            onClick={() => setOpenUser(!openUser)}
                        >
                            <FaUserCircle size={24} />
                            <span className="hidden sm:inline font-semibold text-sm">
                                {loading ? "Loading..." : user ? user.name.split(" ")[0] : "Account"}
                            </span>
                            <FaCaretDown className={`transition-transform duration-200 ${openUser ? 'rotate-180' : 'rotate-0'}`} />
                        </button>

                        {openUser && (
                            <div className="absolute right-0 top-full mt-3 bg-white shadow-2xl rounded-xl w-56 p-3 space-y-1 border border-gray-100 animate-fadeIn">
                                {user ? (
                                    <>
                                        <p className="font-bold text-gray-800 px-3 py-1 border-b mb-1">
                                            {user.name} ({user.role.toUpperCase()})
                                        </p>
                                        
                                        {/* Standard User Profile Link */}
                                        {/* <Link to="/profile" 
                                            className={`flex items-center gap-2 p-3 rounded-lg hover:bg-indigo-50 text-gray-700 transition ${user.role !== 'admin' ? 'font-semibold' : ''}`}
                                            onClick={() => setOpenUser(false)}
                                        >
                                            <FaUserCircle className="w-5 h-5" /> My Profile
                                        </Link> */}
                                        
                                        {/* ADMIN LINK REMOVED FROM HERE */}

                                        {/* Logout Link */}
                                        <button
                                            className="flex items-center gap-2 p-3 rounded-lg hover:bg-red-50 text-red-600 w-full text-left transition"
                                            onClick={handleLogout}
                                        >
                                            <FaSignOutAlt className="w-5 h-5" /> Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        {/* Login / Sign Up */}
                                        <button
                                            className="flex items-center gap-2 p-3 rounded-lg hover:bg-indigo-50 text-indigo-600 w-full text-left transition font-semibold"
                                            onClick={() => handleAuth("login")}
                                        >
                                            <FaSignInAlt className="w-5 h-5" /> Login
                                        </button>
                                        <button
                                            className="flex items-center gap-2 p-3 rounded-lg hover:bg-indigo-50 text-indigo-600 w-full text-left transition font-semibold"
                                            onClick={() => handleAuth("signup")}
                                        >
                                            <FaUserPlus className="w-5 h-5" /> Sign Up
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* CSS Animation (Inline for component portability) */}
            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(-10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fadeIn {
                        animation: fadeIn 0.3s ease-out forwards;
                    }
                    .animate-ping-once {
                        animation: pulse-ping 1.5s ease-out 1;
                    }
                    @keyframes pulse-ping {
                        0%, 100% { transform: scale(1); opacity: 1; }
                        50% { transform: scale(1.15); opacity: 0.8; }
                    }
                `}
            </style>
        </nav>
    );
}