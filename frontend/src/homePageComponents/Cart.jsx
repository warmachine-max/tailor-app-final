import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import {
    FaSpinner, FaCheckCircle, FaTimesCircle, FaTruck,
    FaChevronDown, FaChevronUp, FaTrashAlt, FaClipboardCheck,
    FaPhoneAlt, FaCalendarAlt, FaDollarSign,
    FaEye, FaEyeSlash, FaUser, FaRegListAlt, FaShieldAlt, FaWarehouse, FaFileContract, FaHistory, FaSearch, FaFilter,
} from "react-icons/fa";

// ======================= 1. STATUS MAPPING (Enterprise-Grade Terminology & Styles) =======================
const STATUS_MAP = {
    // 1. PENDING -> INTAKE / REVIEW (Slate/Gray - The initial stage)
    pending: {
        label: "Order Intake",
        actionLabel: "Verify & Approve",
        icon: FaFileContract,
        color: "text-slate-700",
        bgColor: "bg-slate-50",
        badgeClass: "bg-gradient-to-r from-slate-200 to-slate-100 text-slate-800 border-slate-300 font-semibold",
    },
    // 2. CONFIRMED -> IN PRODUCTION / ACTIVE (Primary Corporate Blue)
    confirmed: {
        label: "In Production",
        actionLabel: "Stage for Shipment",
        icon: FaClipboardCheck,
        color: "text-blue-700",
        bgColor: "bg-blue-50",
        badgeClass: "bg-gradient-to-r from-blue-200 to-blue-100 text-blue-800 border-blue-300 font-semibold",
    },
    // 3. COMPLETED -> READY TO SHIP / STAGED (Deep Purple/Violet - Transition to logistics)
    completed: {
        label: "Staged for Transit",
        actionLabel: "Mark Dispatched",
        icon: FaTruck,
        color: "text-purple-700",
        bgColor: "bg-purple-50",
        badgeClass: "bg-gradient-to-r from-purple-200 to-purple-100 text-purple-800 border-purple-300 font-semibold",
    },
    // 4. DELIVERED -> TRANSACTION CLOSED (Green - Final success)
    delivered: {
        label: "Transaction Closed",
        icon: FaCheckCircle,
        color: "text-emerald-700", // Muted Green
        bgColor: "bg-emerald-50",
        badgeClass: "bg-gradient-to-r from-emerald-200 to-emerald-100 text-emerald-800 border-emerald-300 font-semibold",
    },
    // 5. REJECTED -> VOID / CANCELLATION (Muted Red)
    rejected: {
        label: "Order Voided",
        actionLabel: "Void Order",
        icon: FaTimesCircle,
        color: "text-red-700",
        bgColor: "bg-red-50",
        badgeClass: "bg-gradient-to-r from-red-200 to-red-100 text-red-800 border-red-300 font-semibold",
    },
    // --- NEW RETURN STATUSES ---
    // 6. RETURN PENDING -> REQUEST FILED (Muted Amber/Orange - Attention Required)
    return_pending: {
        label: "Return Requested",
        actionLabel: "Approve Return",
        icon: FaWarehouse,
        color: "text-amber-700",
        bgColor: "bg-amber-50",
        badgeClass: "bg-gradient-to-r from-amber-200 to-amber-100 text-amber-800 border-amber-300 font-semibold",
    },
    // 7. RETURN APPROVED -> PROCESSING/REFUND PENDING (Teal/Cyan - Financial Process)
    return_approved: {
        label: "Refund Processing",
        actionLabel: "Refund Completed",
        icon: FaDollarSign,
        color: "text-teal-700",
        bgColor: "bg-teal-50",
        badgeClass: "bg-gradient-to-r from-teal-200 to-teal-100 text-teal-800 border-teal-300 font-semibold",
    },
    // 8. RETURN REJECTED -> CLOSED (Red - reuse rejected styles)
    return_rejected: {
        label: "Return Rejected",
        actionLabel: "Archive Return",
        icon: FaTimesCircle,
        color: "text-red-700",
        bgColor: "bg-red-50",
        badgeClass: "bg-gradient-to-r from-red-200 to-red-100 text-red-800 border-red-300 font-semibold",
    },
    // 9. RETURN COMPLETED -> CLOSED (Green - reuse delivered styles)
    return_completed: {
        label: "Return Closed/Refunded",
        icon: FaCheckCircle,
        color: "text-emerald-700",
        bgColor: "bg-emerald-50",
        badgeClass: "bg-gradient-to-r from-emerald-200 to-emerald-100 text-emerald-800 border-emerald-300 font-semibold",
    },
};

// --- Filtering Constants ---
const ACTIVE_STATUSES = ["pending", "confirmed", "completed", "return_pending", "return_approved"];
const HISTORY_STATUSES = ["delivered", "rejected", "return_completed", "return_rejected"];


// ======================= 2. GLOBAL UTILITY COMPONENTS (Refined Styling) =======================

/**
 * Masks a phone number unless the provided role is 'admin'.
 */
const maskPhoneNumber = (phone, role) => {
    if (role === "admin") {
        return phone; // Admin sees full number
    }

    if (!phone || phone.length < 4) return "Hidden";

    const visiblePart = phone.slice(-4);
    // Use a non-breaking space for better formatting
    const hiddenPart = phone.slice(0, -4).replace(/[0-9]/g, '•');

    return `${hiddenPart}\u00A0${visiblePart}`;
};

const StatusTag = ({ status }) => {
    const statusInfo = STATUS_MAP[status] || {
        label: status,
        icon: FaWarehouse,
        badgeClass: "bg-gray-100 text-gray-700 border-gray-300 font-semibold",
    };
    const Icon = statusInfo.icon;
    return (
        <span
            className={`inline-flex items-center px-3 py-1 text-xs font-medium tracking-wider rounded-lg border ${statusInfo.badgeClass} transition duration-150 shadow-sm`}
            style={{ letterSpacing: '0.05em' }}
        >
            <Icon className="w-3 h-3 mr-1.5" />
            {statusInfo.label.toUpperCase().split('/')[0]}
        </span>
    );
};

// --- Action Buttons ---
const ActionButton = ({ status, onClick, disabled, isDestructive = false, updating = false }) => {
    const info = STATUS_MAP[status];
    const label = isDestructive ? info.label.split('/')[0] : info.actionLabel || info.label;

    const baseClasses = "px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 shadow-md transform hover:shadow-lg hover:scale-[1.01] active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed tracking-tight cursor-pointer";
    let style = "";

    if (status === "confirmed") style = "bg-blue-600 hover:bg-blue-700 text-white";
    else if (status === "rejected" || status === "return_rejected") style = "bg-red-600 hover:bg-red-700 text-white";
    else if (status === "completed") style = "bg-purple-600 hover:bg-purple-700 text-white";
    else if (status === "delivered" || status === "return_completed") style = "bg-emerald-600 hover:bg-emerald-700 text-white";
    else if (status === "return_pending") style = "bg-amber-600 hover:bg-amber-700 text-white";
    else if (status === "return_approved") style = "bg-teal-600 hover:bg-teal-700 text-white";
    else if (status === "pending") style = "bg-slate-600 hover:bg-slate-700 text-white";

    return (
        <button
            onClick={onClick}
            disabled={disabled || updating}
            className={`${baseClasses} ${style} ${updating ? 'shadow-none' : 'hover:shadow-lg'}`}
        >
            {updating ? (
                <FaSpinner className="animate-spin inline mr-1" />
            ) : (
                label
            )}
        </button>
    );
};

const DeleteButton = ({ onClick }) => (
    <button
        onClick={onClick}
        className="px-4 py-2 text-sm font-semibold rounded-md bg-gray-700 text-white hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.01] active:scale-98 tracking-tight cursor-pointer"
    >
        <FaTrashAlt className="inline mr-1" /> Archive Record
    </button>
);

const ReturnButton = ({ bookingId, initiateReturn }) => (
    <button
        onClick={() => initiateReturn(bookingId)}
        className="px-4 py-2 text-sm font-semibold rounded-md bg-amber-600 text-white hover:bg-amber-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.01] active:scale-98 tracking-tight cursor-pointer"
    >
        <FaTruck className="inline mr-1 rotate-180" /> Request Return
    </button>
);


// ======================= 3. REUSABLE BOOKING CARD COMPONENT =======================

const BookingCard = ({ item, role, getStatusButton, deleteBooking, updating, initiateReturn }) => {
    const [showAdminDetails, setShowAdminDetails] = useState(false);

    const createdAt = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A';
    const totalPrice = item.totalPrice ? `$${parseFloat(item.totalPrice).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}` : 'N/A';

    const isUserTerminal = role !== "admin" &&
                                (item.status === "delivered" || item.status === "rejected" ||
                                 item.status === "return_completed" || item.status === "return_rejected");

    const isReturning = item.status === "return_pending" || item.status === "return_approved";

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-lg flex flex-col md:flex-row transition duration-300 hover:shadow-xl">

            {/* Panel 1: Status & Product Info (Refined Sidebar) */}
            <div className="p-4 flex-shrink-0 w-full md:w-56 bg-gray-50 border-r border-gray-100 flex flex-col items-center justify-between md:rounded-l-xl md:rounded-r-none rounded-t-xl rounded-b-none">
                <img
                    src={item.productImage || "/placeholder.png"}
                    alt={item.productTitle}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200 mb-3 shadow-inner"
                />
                <div className="text-center w-full">
                    <StatusTag status={item.status} />
                    {/* CRITICAL FIX: Ensure _id exists before calling substring */}
                    <span className="text-xs font-mono text-gray-500 mt-2 block tracking-wider">REF: **{item._id ? item._id.substring(0, 8) : 'N/A'}**</span>
                </div>
            </div>

            {/* Panel 2: Details & Actions (Main Column) */}
            <div className="flex-1 p-5 space-y-4">

                {/* Top Row: Title, Date, Cost */}
                <div className="flex justify-between items-start border-b border-gray-200 pb-3">
                    <h3 className="text-xl font-bold text-gray-900 leading-snug tracking-tight">
                        {item.productTitle}
                    </h3>
                    <div className="text-right flex-shrink-0">
                        <span className="text-2xl font-extrabold text-blue-700 flex items-center justify-end tracking-tight">
                            <FaDollarSign className="w-4 h-4 mr-1.5" />{totalPrice}
                        </span>
                        <span className="text-xs text-gray-500 mt-1 block font-medium">
                            <FaCalendarAlt className="inline mr-1 w-2.5 h-2.5" />Date: **{createdAt}**
                        </span>
                    </div>
                </div>

                {/* Messages & Admin Toggle */}
                <div className="space-y-3">

                    {/* Admin Sensitive Details Toggle (ADMIN ONLY) */}
                    {role === "admin" && (
                        <div className="space-y-1">
                            <button
                                onClick={() => setShowAdminDetails(!showAdminDetails)}
                                className="text-xs font-medium text-blue-700 hover:text-blue-900 flex items-center transition bg-blue-50 px-3 py-1.5 rounded-full shadow-sm border border-blue-200 cursor-pointer"
                            >
                                {showAdminDetails ? <FaEyeSlash className="mr-1.5" /> : <FaEye className="mr-1.5" />}
                                {showAdminDetails ? 'Hide Sensitive Data' : 'View Customer Contact'}
                            </button>
                            {showAdminDetails && (
                                <div className="bg-blue-50 p-3 rounded-md border border-blue-200 text-sm space-y-1 animate-fade-in font-medium">
                                    <p className="flex items-center text-gray-800"><FaUser className="mr-2 text-blue-600 w-3.5 h-3.5" /> **Customer:** <span className="font-semibold ml-1">{item.name || 'N/A'}</span></p>
                                    <p className="flex items-center text-gray-800"><FaPhoneAlt className="mr-2 text-blue-600 w-3.5 h-3.5" /> **Phone:** <span className="font-semibold ml-1">{maskPhoneNumber(item.phone, role) || 'N/A'}</span></p>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* User-specific masked details */}
                    {role !== "admin" && (
                         <div className="bg-gray-50 p-3 rounded-md border border-gray-200 text-sm space-y-1 font-medium">
                            <p className="flex items-center text-gray-800"><FaUser className="mr-2 text-gray-600 w-3.5 h-3.5" /> **Customer:** <span className="font-semibold ml-1">{item.name || 'N/A'}</span></p>
                            <p className="flex items-center text-gray-800"><FaPhoneAlt className="mr-2 text-gray-600 w-3.5 h-3.5" /> **Phone:** <span className="font-semibold ml-1">{maskPhoneNumber(item.phone, role) || 'N/A'}</span></p>
                         </div>
                    )}

                    {/* Notes/Messages */}
                    <div className="space-y-2">
                        {item.notes && (
                            <p className="text-sm text-gray-700 border-l-4 border-slate-300 pl-3 italic bg-slate-50 p-2 rounded-sm">
                                <span className="font-bold text-gray-800">Customer Note:</span> {item.notes}
                            </p>
                        )}

                        {item.adminMessage && (
                            <blockquote className={`text-sm text-gray-800 ${isReturning ? 'bg-amber-50 border-amber-400' : 'bg-purple-50 border-purple-400'} p-3 rounded-md border-l-4 font-medium`}>
                                <span className="font-bold mr-1">Admin System Note:</span> {item.adminMessage}
                            </blockquote>
                        )}
                    </div>
                </div>


                {/* Action Buttons */}
                <div className="pt-4 border-t border-gray-200 flex flex-wrap gap-3">
                    {role === "admin"
                        ? getStatusButton(item.status, item._id)
                        : item.status === "delivered"
                            ? (
                                <>
                                    <ReturnButton bookingId={item._id} initiateReturn={initiateReturn} />
                                    <DeleteButton onClick={() => deleteBooking(item._id)} />
                                </>
                            )
                            : isUserTerminal && deleteBooking ? (
                                <DeleteButton onClick={() => deleteBooking(item._id)} />
                            )
                            : null}

                    {/* Show a message if return is pending or approved */}
                    {role !== "admin" && isReturning && (
                        <p className="text-sm font-semibold text-amber-700 p-3 border border-amber-300 bg-amber-50 rounded-lg">
                            Your return request is currently **{item.status === 'return_pending' ? 'under formal review' : 'approved and processing'}**.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

// ======================= 4. FILTER COMPONENT (NEW) =======================

const AdminFilterBar = React.memo(({ filters, setFilters, statusOptions, totalRecords }) => {

    const handleSearchChange = (e) => {
        // CRITICAL FIX: Ensure the search term is trimmed to prevent issues with whitespace
        setFilters(prev => ({ ...prev, searchTerm: e.target.value.trim() }));
    };

    const handleStatusChange = (e) => {
        setFilters(prev => ({ ...prev, filterStatus: e.target.value }));
    };

    const handleDateChange = (e) => {
        setFilters(prev => ({ ...prev, dateRange: e.target.value }));
    };

    // Reset all filters except viewMode
    const handleReset = () => {
        setFilters(prev => ({ 
            ...prev, 
            searchTerm: '', 
            filterStatus: 'all', 
            dateRange: 'all' 
        }));
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 space-y-3">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <FaFilter className="mr-2 text-blue-600" /> Advanced Filtering
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                
                {/* 1. Search Bar */}
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Search Keyword (Name, Ref ID, Product)</label>
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="e.g., John Doe, 62d9e8, Blue Watch"
                            // Pass the state value directly (no trim here, as we trim on change)
                            value={filters.searchTerm} 
                            onChange={handleSearchChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150"
                        />
                    </div>
                </div>
                
                {/* 2. Status Filter */}
                <div>
                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Filter by Status</label>
                    <select
                        value={filters.filterStatus}
                        onChange={handleStatusChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150 appearance-none"
                    >
                        <option value="all">-- All Statuses --</option>
                        {statusOptions.map(status => (
                            <option key={status} value={status}>{STATUS_MAP[status].label}</option>
                        ))}
                    </select>
                </div>
                
                {/* 3. Date Filter (Simple) */}
                <div>
                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Filter by Date</label>
                    <select
                        value={filters.dateRange}
                        onChange={handleDateChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150 appearance-none"
                    >
                        <option value="all">-- All Time --</option>
                        <option value="last7">Last 7 Days</option>
                        <option value="last30">Last 30 Days</option>
                        <option value="last90">Last 90 Days (Quarter)</option>
                    </select>
                </div>

            </div>

            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <span className="text-sm font-semibold text-gray-700">
                    Showing **{totalRecords}** matching records.
                </span>
                <button
                    onClick={handleReset}
                    className="px-4 py-1.5 text-sm font-semibold rounded-lg text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 transition cursor-pointer"
                >
                    Clear Filters
                </button>
            </div>
        </div>
    );
});


// ======================= 5. MAIN COMPONENT =======================

export default function Cart() {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    // Use an object to track status per item for better granular control
    const [updating, setUpdating] = useState({}); 
    const [openCustomer, setOpenCustomer] = useState(null);

    // NEW STATES for Filtering
    const [viewMode, setViewMode] = useState('active'); // 'active' or 'history'
    const [filters, setFilters] = useState({
        searchTerm: '',
        filterStatus: 'all', // status key or 'all'
        dateRange: 'all',    // 'all', 'last7', 'last30', 'last90'
    });


    // --- Core Data Fetching ---
    const fetchCart = async () => {
        const API_URL = import.meta.env.VITE_API_URL;
        if (!user) return;
        try {
            setLoading(true);
            const endpoint =
                user.role === "admin"
                     ? `${API_URL}/api/booking/all`
                     : `${API_URL}/api/booking/user`;
            const res = await fetch(endpoint, { credentials: "include" });
            const data = await res.json();
            if (res.ok) setCartItems(data);
            else console.error("Fetch failed", data.message);
        } catch (err) {
            console.error("Error fetching cart:", err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [user]);

    // --- APPLY FILTERS (CORE LOGIC - OPTIMIZED WITH useMemo) ---
    const filteredItems = useMemo(() => {
        let items = cartItems;
        const { searchTerm, filterStatus, dateRange } = filters;

        // 1. Filter by View Mode (Active vs. History)
        items = items.filter(item => {
            const statusList = viewMode === 'active' ? ACTIVE_STATUSES : HISTORY_STATUSES;
            return statusList.includes(item.status);
        });

        // 2. Filter by Status (Dropdown)
        if (filterStatus !== 'all') {
            items = items.filter(item => item.status === filterStatus);
        }

        // 3. Filter by Search Term (Robust Null/Undefined Handling)
        if (searchTerm) {
            const query = searchTerm.toLowerCase();
            items = items.filter(item => {
                // Safely access properties and coalesce null/undefined
                const refIdMatch = item._id?.substring(0, 8).toLowerCase().includes(query) ?? false;
                const titleMatch = item.productTitle?.toLowerCase().includes(query) ?? false;
                const nameMatch = item.name?.toLowerCase().includes(query) ?? false;
                const phoneMatch = item.phone?.toLowerCase().includes(query) ?? false;
                
                return refIdMatch || titleMatch || nameMatch || phoneMatch;
            });
        }

        // 4. Filter by Date Range
        if (dateRange !== 'all') {
            const now = new Date();
            let dateThreshold = new Date();

            if (dateRange === 'last7') dateThreshold.setDate(now.getDate() - 7);
            else if (dateRange === 'last30') dateThreshold.setDate(now.getDate() - 30);
            else if (dateRange === 'last90') dateThreshold.setDate(now.getDate() - 90);

            items = items.filter(item => {
                const itemDate = item.createdAt ? new Date(item.createdAt) : null;
                return itemDate && itemDate >= dateThreshold;
            });
        }

        return items;
    }, [cartItems, filters, viewMode]);


    // --- Grouping (Admin View) ---
    const groupedItems = useMemo(() => {
        if (user.role !== "admin") return {};

        return filteredItems.reduce((acc, item) => {
            // Group by name for clearer identification in the admin panel
            const key = item.name || "Unknown Customer"; 
            if (!acc[key]) acc[key] = [];
            acc[key].push(item);
            return acc;
        }, {});
    }, [filteredItems, user.role]);
    
    // --- Status Counts (Admin) ---
    const statusCounts = useMemo(() => {
        return cartItems.reduce(
            (acc, item) => {
                if (STATUS_MAP[item.status]) {
                    acc[item.status] = (acc[item.status] || 0) + 1;
                }
                return acc;
            },
            {
                pending: 0, confirmed: 0, completed: 0, delivered: 0, rejected: 0,
                return_pending: 0, return_approved: 0, return_rejected: 0, return_completed: 0
            }
        );
    }, [cartItems]);


    // --- Status Update / Delete / Return Handlers ---

    const initiateReturn = async (id) => {
        const API_URL = import.meta.env.VITE_API_URL;
        const returnReason = prompt(`Please provide a brief reason for returning booking ID ${id.substring(0, 8)}:`, "Wrong size/Product damaged/Changed mind");

        if (!returnReason) return;

        if (!window.confirm("CONFIRMATION REQUIRED: Request a return for this delivered item? This initiates a formal review process.")) return;

        try {
            setUpdating(prev => ({ ...prev, [id]: true }));
            const res = await fetch(`${API_URL}/api/booking/${id}/return`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason: returnReason }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Return request failed");
            }

            setCartItems((prev) =>
                prev.map((item) =>
                    item._id === id
                        ? data.booking 
                        : item
                )
            );

            alert(`Return request for booking ${id.substring(0, 8)} submitted successfully. Status is now 'Return Requested'.`);
        } catch (err) {
            alert(err.message || "Failed to submit return request");
        } finally {
            setUpdating(prev => ({ ...prev, [id]: false }));
        }
    };


    const updateStatus = async (id, status) => {
        const API_URL = import.meta.env.VITE_API_URL;
        const statusInfo = STATUS_MAP[status]?.label || status;
        const adminMessage =
            status === "rejected" || status === "confirmed" || status === "return_rejected" || status === "return_approved"
                ? prompt(`Enter a mandatory internal note for the customer regarding the status change to '${statusInfo}':`, "")
                : "";

        if (
            !window.confirm(
                `ADMIN CONFIRMATION: Set booking ID ${id.substring(0, 8)} status to ${statusInfo}?`
            )
        )
            return;

        try {
            setUpdating(prev => ({ ...prev, [id]: true }));
            const res = await fetch(`${API_URL}/api/booking/${id}/status`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status, adminMessage }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Status update failed");

            if (data.deleted) {
                setCartItems((prev) => prev.filter((item) => item._id !== id));
                alert(`Booking ${statusInfo} and archived.`);
                return;
            }

            setCartItems((prev) =>
                prev.map((item) => (item._id === id ? data.booking : item))
            );
            alert(`Booking status successfully updated to ${statusInfo}`);
        } catch (err) {
            alert(err.message || "Failed to update booking status");
        } finally {
            setUpdating(prev => ({ ...prev, [id]: false }));
        }
    };

    const deleteBooking = async (id) => {
        const API_URL = import.meta.env.VITE_API_URL;
        if (!window.confirm("SYSTEM WARNING: Are you sure you want to permanently delete this booking record? This action is irreversible.")) return;

        try {
            setUpdating(prev => ({ ...prev, [id]: true }));
         const res = await fetch(`${API_URL}/api/booking/${id}/delete`, {
                method: "DELETE",
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Deletion failed");

            setCartItems((prev) => prev.filter((item) => item._id !== id));
            alert("Booking record permanently deleted from the system.");
        } catch (err) {
            alert(err.message || "Failed to delete booking record");
        } finally {
            setUpdating(prev => ({ ...prev, [id]: false }));
        }
    };

    const getStatusButton = (currentStatus, itemId) => {
        const isItemUpdating = updating[itemId];
        
        switch (currentStatus) {
            case "pending":
                return (
                    <>
                        <ActionButton status="confirmed" onClick={() => updateStatus(itemId, "confirmed")} updating={isItemUpdating} />
                        <ActionButton status="rejected" onClick={() => updateStatus(itemId, "rejected")} updating={isItemUpdating} isDestructive={true} />
                    </>
                );
            case "confirmed":
                return (
                    <ActionButton status="completed" onClick={() => updateStatus(itemId, "completed")} updating={isItemUpdating} />
                );
            case "completed":
                return (
                    <ActionButton status="delivered" onClick={() => updateStatus(itemId, "delivered")} updating={isItemUpdating} />
                );
            case "delivered":
                return (<DeleteButton onClick={() => deleteBooking(itemId)} />);

            case "return_pending":
                return (
                    <>
                        <ActionButton status="return_approved" onClick={() => updateStatus(itemId, "return_approved")} updating={isItemUpdating} />
                        <ActionButton status="return_rejected" onClick={() => updateStatus(itemId, "return_rejected")} updating={isItemUpdating} isDestructive={true} />
                    </>
                );
            case "return_approved":
                return (
                    <ActionButton status="return_completed" onClick={() => updateStatus(itemId, "return_completed")} updating={isItemUpdating} />
                );

            case "return_completed":
            case "return_rejected":
            case "rejected":
                return (<DeleteButton onClick={() => deleteBooking(itemId)} />);

            default:
                return null;
        }
    };

    const MessageCard = ({ icon, text, color }) => (
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
            <div className={`text-xl font-medium p-12 bg-white rounded-xl shadow-2xl border-l-4 ${color} text-gray-700`}>
                <span className="text-3xl block mb-4">{icon}</span>
                {text}
            </div>
        </div>
    );
    
    // --- UI Variables ---
    const currentTitle = viewMode === 'active' ? "Active Operations" : "Order History (Archived)";
    const currentIcon = viewMode === 'active' ? <FaRegListAlt className="text-blue-600" /> : <FaHistory className="text-blue-600" />;
    const currentCount = filteredItems.length;

    if (!user)
        return <MessageCard icon="🔑" text="Authentication required to access enterprise order data." color="border-blue-600" />;

    if (loading)
        return (
            <MessageCard
                icon={<FaSpinner className="animate-spin inline mr-2 text-blue-600" />}
                text="Establishing secure data pipeline. Loading records..."
                color="border-blue-600"
            />
        );
        
    // ================= UI RENDER =================
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-gray-50 min-h-screen">
            
            <h1 className="text-4xl font-extrabold text-center text-gray-900 pb-4 border-b-4 border-blue-600 tracking-tight">
                <span className="text-blue-600">Enterprise</span> Operations Dashboard
            </h1>

            {/* Admin Status Summary (using cartItems for overall view) */}
            {user.role === "admin" && (
                <AdminStatusSummary statusCounts={statusCounts} />
            )}

            {/* View Mode Selector & Main Title */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-md border border-gray-100">
                <h2 className="text-2xl font-extrabold text-gray-800 flex items-center">
                    {currentIcon} 
                    <span className="ml-3">{currentTitle}</span>
                    <span className="ml-3 text-lg font-semibold text-blue-600">({currentCount} Records)</span>
                </h2>
                
                {/* View Mode Toggle */}
                <div className="flex space-x-2">
                    <button
                        onClick={() => setViewMode('active')}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${viewMode === 'active' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} cursor-pointer`}
                    >
                        <FaRegListAlt className="inline mr-2" /> Active Orders
                    </button>
                    <button
                        onClick={() => setViewMode('history')}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${viewMode === 'history' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} cursor-pointer`}
                    >
                        <FaHistory className="inline mr-2" /> History
                    </button>
                </div>
            </div>

            {/* Admin Filters */}
            {user.role === "admin" && (
                <AdminFilterBar 
                    filters={filters}
                    setFilters={setFilters}
                    statusOptions={Object.keys(STATUS_MAP)}
                    totalRecords={filteredItems.length}
                />
            )}

            {/* Render Cards - Grouped for Admin, Flat for User */}
            {filteredItems.length === 0 ? (
                <MessageCard 
                    icon={<FaRegListAlt className="text-gray-500"/>} 
                    text={`No ${currentTitle.toLowerCase()} match your current filters.`} 
                    color="border-gray-400" 
                />
            ) : user.role === "admin" ? (
                // ADMIN GROUPED VIEW
                <div className="space-y-6">
                    {Object.entries(groupedItems).map(([customerName, items]) => (
                        <AdminCustomerGroup 
                            key={customerName}
                            customerName={customerName}
                            items={items}
                            getStatusButton={getStatusButton}
                            deleteBooking={deleteBooking}
                            updating={updating}
                            initiateReturn={initiateReturn}
                        />
                    ))}
                </div>
            ) : (
                // USER FLAT VIEW
                <div className="space-y-6">
                    {filteredItems.map(item => (
                        <BookingCard
                            key={item._id}
                            item={item}
                            role={user.role}
                            getStatusButton={getStatusButton}
                            deleteBooking={deleteBooking}
                            updating={updating}
                            initiateReturn={initiateReturn}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// ======================= 6. ADMIN SPECIFIC SUB-COMPONENTS =======================

const AdminStatusSummary = React.memo(({ statusCounts }) => (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
        {Object.entries(statusCounts).map(([status, count]) => {
            const info = STATUS_MAP[status];
            if (!info) return null;
            const Icon = info.icon;

            return (
                <div
                    key={status}
                    className={`p-4 rounded-xl shadow-lg border-l-4 ${info.color} ${info.bgColor} flex items-center justify-between transition duration-300 hover:shadow-xl`}
                >
                    <div>
                        <p className="text-xs font-bold uppercase text-gray-500 tracking-wider mb-1">{info.label.split('/')[0]}</p>
                        <p className="text-2xl font-extrabold text-gray-900">{count}</p>
                    </div>
                    <Icon className={`w-8 h-8 opacity-70 ${info.color}`} />
                </div>
            );
        })}
    </div>
));

const AdminCustomerGroup = ({ customerName, items, getStatusButton, deleteBooking, updating, initiateReturn }) => {
    const [isOpen, setIsOpen] = useState(true);
    const totalOrders = items.length;

    // Use the first item's name/phone as the main contact info for the group header
    const sampleItem = items[0] || {};
    const maskedPhone = maskPhoneNumber(sampleItem.phone, 'admin');

    return (
        <div className="bg-white rounded-xl shadow-2xl border border-blue-200">
            {/* Group Header */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-5 bg-blue-50 hover:bg-blue-100 transition rounded-t-xl border-b border-blue-200 cursor-pointer"
            >
                <div className="flex items-center space-x-4">
                    <span className="text-2xl font-extrabold text-blue-700 flex items-center">
                        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                    <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">
                        <FaUser className="inline mr-2 text-blue-600"/> {customerName} 
                        <span className="ml-3 text-sm font-semibold text-gray-600">({totalOrders} Orders)</span>
                    </h3>
                </div>
                <p className="text-sm font-semibold text-gray-700 flex items-center">
                    <FaPhoneAlt className="mr-2 text-blue-500"/> Contact: {maskedPhone}
                </p>
            </button>

            {/* Group Content */}
            {isOpen && (
                <div className="p-4 space-y-4">
                    {items.map(item => (
                        <BookingCard
                            key={item._id}
                            item={item}
                            role="admin"
                            getStatusButton={getStatusButton}
                            deleteBooking={deleteBooking}
                            updating={updating}
                            initiateReturn={initiateReturn}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};