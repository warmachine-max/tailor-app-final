import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
// Imported necessary icons for professional UI and sorting
import { FaDollarSign, FaTag, FaSort, FaAngleDown, FaAngleUp } from 'react-icons/fa'; 

export default function Blouse() {
      const API_URL = import.meta.env.VITE_API_URL;
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- SORTING STATE (NEW) ---
    const [sortOrder, setSortOrder] = useState('default'); // 'default', 'price_asc', 'price_desc'
    const [isSortOpen, setIsSortOpen] = useState(false); // State for custom dropdown visibility

    // --- ADMIN FORM STATE ---
    const [showAdminForm, setShowAdminForm] = useState(false);
    const [title, setTitle] = useState("");
    const [notes, setNotes] = useState("");
    const [price, setPrice] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    // --- BOOKING MODAL STATE ---
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingProduct, setBookingProduct] = useState(null);
    const [bookName, setBookName] = useState("");
    const [bookPhone, setBookPhone] = useState("");
    const [bookNotes, setBookNotes] = useState("");
    const [bookingSubmitting, setBookingSubmitting] = useState(false);

    const { user, refreshUser } = useAuth();
    const isAdmin = user?.role === "admin";
    const isCustomer = user?.role === "customer";
    const navigate = useNavigate();

    // NOTE: Updated PLACEHOLDER for better visibility, please adjust path if needed
    const PLACEHOLDER = "/mnt/data/blouse-placeholder.png"; 

    /* ------------------ FETCH BLOUSES ------------------ */
    useEffect(() => {
        let mounted = true;
        const fetchItems = async () => {
            try {
                // Correct API endpoint for blouses
              const res = await fetch(`${API_URL}/api/women/blouses`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Failed to fetch blouses");
                if (mounted) setItems(data.blouses || []);
            } catch (err) {
                if (mounted) setError(err.message);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        fetchItems();
        return () => (mounted = false);
    }, []);

    /* ------------------ SORTING LOGIC (useMemo) ------------------ */
    const sortedItems = useMemo(() => {
        if (!items) return [];

        const sortableItems = [...items];

        switch (sortOrder) {
            case 'price_asc':
                // Sort ascending by price (lowest first)
                return sortableItems.sort((a, b) => (a.price || 0) - (b.price || 0));
            case 'price_desc':
                // Sort descending by price (highest first)
                return sortableItems.sort((a, b) => (b.price || 0) - (a.price || 0));
            case 'default':
            default:
                // Sort by creation date (newest first)
                return sortableItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
    }, [items, sortOrder]);

    // Function to handle sort selection and close dropdown
    const handleSortChange = (newSortOrder) => {
        setSortOrder(newSortOrder);
        setIsSortOpen(false);
    };

    // Helper to display current sort name
    const getSortLabel = () => {
        switch (sortOrder) {
            case 'price_asc':
                return 'Price: Low to High';
            case 'price_desc':
                return 'Price: High to Low';
            case 'default':
            default:
                return 'Sort: Newest First';
        }
    };
    /* -------------------------------------------------------- */

    /* ------------------ ADMIN FUNCTIONS ------------------ */
    const handleImageSelect = (file) => {
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleCreateSection = async (e) => {
        e.preventDefault();
        if (!isAdmin) return alert("Only admins can create.");
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("notes", notes);
            formData.append("price", price);
            if (imageFile) formData.append("image", imageFile);

            // Correct API endpoint for creating a blouse
            const res = await fetch(`${API_URL}/api/women/blouse/create`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Create failed");
            // Add new item to the start for "Newest First" default sort
            setItems((prev) => [data.blouse, ...prev]); 
            setTitle(""); setNotes(""); setPrice(""); setImageFile(null); setImagePreview(null); setShowAdminForm(false);
        } catch (err) {
            alert(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!isAdmin) return;
        if (!window.confirm("Are you sure you want to delete this blouse?")) return;
        try {
            // Correct API endpoint for deleting a blouse
          const res = await fetch(`${API_URL}/api/women/blouse/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Delete failed");
            setItems((prev) => prev.filter((it) => it._id !== id));
        } catch (err) {
            alert(err.message);
        }
    };

    /* ------------------ BOOKING FUNCTIONS ------------------ */
    const openBooking = (product) => {
        if (!user) return navigate("/login");
        if (!isCustomer) return alert("Only customers can book.");
        setBookingProduct(product);
        setBookName(user?.name || "");
        setBookPhone(""); setBookNotes(""); setShowBookingModal(true);
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        if (!isCustomer) return;
        setBookingSubmitting(true);
        try {
          const res = await fetch(`${API_URL}/api/booking/book`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId: bookingProduct._id,
                    // Correct product type
                    productType: "WomenBlouse", 
                    notes: bookNotes,
                    phone: bookPhone,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Booking failed");
            alert("Consultation booked successfully!");
            setShowBookingModal(false);
            if (refreshUser) refreshUser();
        } catch (err) {
            alert(err.message);
        } finally {
            setBookingSubmitting(false);
        }
    };

    if (error) return <div className="max-w-7xl mx-auto px-6 py-16 text-center text-red-600 font-semibold">{error}</div>;

    return (
        <div className="bg-gray-50 min-h-screen py-16 px-4">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header & Controls - PROFESSIONAL UI */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-purple-200">
                    <h1 className="text-5xl font-extrabold text-purple-900 tracking-tight">
                        Blouse Collection 🧵
                    </h1>
                    <div className="flex gap-4 items-center">

                        {/* --- PROFESSIONAL SORT DROPDOWN --- */}
                        <div className="relative inline-block text-left">
                            <button
                                onClick={() => setIsSortOpen(!isSortOpen)}
                                className="inline-flex justify-center items-center gap-2 w-full rounded-xl border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition"
                            >
                                <FaSort className="w-4 h-4 text-purple-600" />
                                {getSortLabel()}
                                {isSortOpen ? <FaAngleUp className="w-4 h-4 ml-1 -mr-1 text-gray-400" /> : <FaAngleDown className="w-4 h-4 ml-1 -mr-1 text-gray-400" />}
                            </button>

                            {isSortOpen && (
                                <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 transition transform origin-top-right">
                                    <div className="py-1">
                                        <button 
                                            onClick={() => handleSortChange('default')} 
                                            className={`block w-full text-left px-4 py-2 text-sm ${sortOrder === 'default' ? 'bg-purple-100 text-purple-900 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
                                        >
                                            Newest First (Default)
                                        </button>
                                        <button 
                                            onClick={() => handleSortChange('price_asc')} 
                                            className={`block w-full text-left px-4 py-2 text-sm ${sortOrder === 'price_asc' ? 'bg-purple-100 text-purple-900 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
                                        >
                                            Price: Low to High
                                        </button>
                                        <button 
                                            onClick={() => handleSortChange('price_desc')} 
                                            className={`block w-full text-left px-4 py-2 text-sm ${sortOrder === 'price_desc' ? 'bg-purple-100 text-purple-900 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
                                        >
                                            Price: High to Low
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* --- END SORT DROPDOWN --- */}

                        {isAdmin && (
                            <button 
                                onClick={() => setShowAdminForm(true)} 
                                className="px-5 py-2.5 bg-purple-900 text-white rounded-xl shadow-lg hover:bg-purple-800 transition text-sm font-semibold hover:shadow-xl focus:ring-4 focus:ring-purple-300"
                            >
                                + Add New Blouse
                            </button>
                        )}
                    </div>
                </div>

                <hr className="border-purple-100" />

                {/* Items */}
                {loading ? (
                    <p className="text-center text-gray-500 py-10">Loading catalog...</p>
                ) : sortedItems.length === 0 ? (
                    <p className="text-center text-gray-500 py-10">No blouses available in stock.</p>
                ) : (
                    <div className="space-y-16">
                        {sortedItems.map((it, idx) => (
                            <section 
                                key={it._id} 
                                className={`flex flex-col lg:flex-row items-center gap-10 p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition duration-300 ${idx % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
                            >
                                <div className="w-full lg:w-1/2 space-y-4">
                                    <span className="text-xs font-medium uppercase text-purple-500 tracking-widest">Custom Tailoring Collection</span>
                                    <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">{it.title}</h2>
                                    <p className="text-gray-700 leading-relaxed italic border-l-4 border-purple-200 pl-3">{it.notes || "Beautifully stitched blouse with modern design and perfect fit."}</p>

                                    <div className="text-4xl font-extrabold text-green-700 flex items-center pt-4">
                                        <FaDollarSign className="w-6 h-6 mr-2 opacity-80" /> 
                                        {it.price ? `Rs. ${parseFloat(it.price).toFixed(2)}` : 'Enquire for Price'}
                                    </div>

                                    <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-100">
                                        {user && isCustomer ? (
                                            <button 
                                                onClick={() => openBooking(it)} 
                                                className="px-8 py-3 bg-purple-900 text-white rounded-xl hover:bg-purple-800 transition shadow-lg font-semibold text-base hover:shadow-xl focus:ring-4 focus:ring-purple-300"
                                            >
                                                Book Consultation
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => navigate("/login")} 
                                                className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-semibold text-base focus:ring-4 focus:ring-gray-300"
                                            >
                                                Login to Book
                                            </button>
                                        )}
                                        {isAdmin && (
                                            <button 
                                                onClick={() => handleDelete(it._id)} 
                                                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-semibold text-sm focus:ring-4 focus:ring-red-300"
                                            >
                                                Delete Item
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="w-full lg:w-1/2 flex justify-center">
                                    <img 
                                        src={it.image?.url || PLACEHOLDER} 
                                        alt={it.title} 
                                        className="rounded-3xl shadow-2xl w-full max-w-lg h-96 object-cover transition transform hover:scale-[1.02] duration-500 border-4 border-purple-50" 
                                    />
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>

            {/* Admin Modal (Product Creation) - Updated UI */}
            {showAdminForm && isAdmin && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center px-4 z-50">
                    <form onSubmit={handleCreateSection} className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl space-y-6 relative">
                        <div className="flex justify-between items-center border-b pb-3 mb-4">
                            <h3 className="text-2xl font-extrabold text-purple-900">Add New Blouse to Stock</h3>
                            <button type="button" onClick={() => setShowAdminForm(false)} className="text-xl text-gray-500 hover:text-gray-900 transition focus:outline-none">✕</button>
                        </div>
                        <input type="text" placeholder="Blouse Title (e.g., Embroidered Silk Blouse)" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-gray-300 p-3 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 focus:outline-none transition" required />
                        <textarea placeholder="Detailed Description / Design Notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full border border-gray-300 p-3 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 focus:outline-none transition" rows={4} />
                        <div className="flex gap-4 items-center">
                            <FaTag className="text-purple-600 w-5 h-5 flex-shrink-0" />
                            <input type="number" placeholder="Price (e.g., 3500)" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border border-gray-300 p-3 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 focus:outline-none transition" />
                        </div>

                        <div>
                            <label className="inline-flex items-center gap-3 px-6 py-2 bg-purple-700 text-white rounded-full cursor-pointer hover:bg-purple-800 transition shadow-md font-semibold focus:ring-4 focus:ring-purple-300">
                                Upload Product Image
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageSelect(e.target.files?.[0])}
                                    className="hidden"
                                />
                            </label>

                            {/* Consolidated image preview rendering */}
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="mt-4 w-full h-48 object-cover rounded-xl shadow-lg border-2 border-purple-100"
                                />
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <button type="button" onClick={() => setShowAdminForm(false)} className="px-5 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition font-semibold">Cancel</button>
                            <button type="submit" disabled={uploading} className="px-5 py-2 bg-purple-900 text-white rounded-xl hover:bg-purple-800 transition disabled:opacity-60 font-semibold focus:ring-4 focus:ring-purple-300">
                                {uploading ? "Uploading..." : "Create Blouse"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Booking Modal (Customer Consultation) - Updated UI */}
            {showBookingModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center px-4 z-50">
                    <form onSubmit={handleBookingSubmit} className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl space-y-6 relative">
                        <div className="flex justify-between items-center border-b pb-3 mb-4">
                            <h3 className="text-2xl font-extrabold text-purple-900">Request Consultation for:</h3>
                            <button type="button" onClick={() => setShowBookingModal(false)} className="text-xl text-gray-500 hover:text-gray-900 transition focus:outline-none">✕</button>
                        </div>

                        <div className="bg-purple-50 p-3 rounded-xl border border-purple-200">
                            <p className="font-semibold text-purple-800">{bookingProduct?.title || 'Selected Blouse'}</p>
                            <p className="text-sm text-gray-600 mt-1">Price: {bookingProduct?.price ? `Rs. ${parseFloat(bookingProduct.price).toFixed(2)}` : 'On Request'}</p>
                        </div>

                        <input type="text" placeholder="Your Name" value={bookName} onChange={(e) => setBookName(e.target.value)} className="w-full border border-gray-300 p-3 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 focus:outline-none transition" required />
                        <input type="tel" placeholder="Contact Phone Number" value={bookPhone} onChange={(e) => setBookPhone(e.target.value)} className="w-full border border-gray-300 p-3 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 focus:outline-none transition" required />
                        <textarea placeholder="Specific request or questions (optional)" value={bookNotes} onChange={(e) => setBookNotes(e.target.value)} className="w-full border border-gray-300 p-3 rounded-xl focus:ring-4 focus:ring-purple-200 focus:focus:border-purple-500 focus:outline-none transition" rows={4} />

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <button type="button" onClick={() => setShowBookingModal(false)} className="px-5 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition font-semibold">Cancel</button>
                            <button type="submit" disabled={bookingSubmitting} className="px-5 py-2 bg-purple-900 text-white rounded-xl hover:bg-purple-800 transition disabled:opacity-60 font-semibold focus:ring-4 focus:ring-purple-300">
                                {bookingSubmitting ? "Submitting..." : "Confirm Request"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}