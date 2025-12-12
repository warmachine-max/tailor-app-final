import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaTag, FaPlus, FaTrashAlt, FaTshirt, FaSort } from 'react-icons/fa'; 

export default function Shirt() {
     const API_URL = import.meta.env.VITE_API_URL;
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // State for sorting
    const [sortKey, setSortKey] = useState('none'); 

    // Admin create form
    const [showAdminForm, setShowAdminForm] = useState(false);
    const [title, setTitle] = useState("");
    const [notes, setNotes] = useState("");
    const [price, setPrice] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Booking modal
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingProduct, setBookingProduct] = useState(null);
    const [bookName, setBookName] = useState("");
    const [bookPhone, setBookPhone] = useState("");
    const [bookNotes, setBookNotes] = useState("");
    const [bookingSubmitting, setBookingSubmitting] = useState(false);

    // Ensure refreshUser is imported if available
    const { user, refreshUser } = useAuth(); 
    const isAdmin = user?.role === "admin";
    const isCustomer = user?.role === "customer";
    const navigate = useNavigate();

    const PLACEHOLDER = "/mnt/data/Screenshot 2025-11-22 111052.png"; 

    /* ------------------ FETCH SHIRTS ------------------ */
    useEffect(() => {
        let mounted = true;
        const fetchItems = async () => {
            try {
                const res = await fetch(`${API_URL}/api/men/shirts`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Failed to fetch shirts");
                if (mounted) setItems(data.shirts || []);
            } catch (err) {
                if (mounted) setError(err.message || "Something went wrong");
            } finally {
                if (mounted) setLoading(false);
            }
        };
        fetchItems();
        return () => (mounted = false);
    }, []);

    /* ------------------ SORTING LOGIC (useMemo) ------------------ */
    const sortedItems = useMemo(() => {
        let sorted = [...items]; 

        switch (sortKey) {
            case 'price-asc':
                // Sort ascending by price (lowest first)
                sorted.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
                break;
            case 'price-desc':
                // Sort descending by price (highest first)
                sorted.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
                break;
            // NOTE: 'title-asc' case removed as requested
            case 'none':
            default:
                // No sort applied
                break;
        }
        return sorted;
    }, [items, sortKey]); 

    /* ------------------ IMAGE UPLOAD ------------------ */
    const handleImageSelect = (file) => {
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    /* ------------------ CREATE SHIRT ------------------ */
    const handleCreateSection = async (e) => {
        e.preventDefault();
        if (!isAdmin) return alert("Only admins can create items.");
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("title", title || "");
            formData.append("notes", notes || "");
            formData.append("price", price || "");
            if (imageFile) formData.append("image", imageFile);

            const res = await fetch(`${API_URL}/api/men/shirt/create`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Create failed");

            // Add new item to the start of the list
            setItems((prev) => [data.shirt, ...prev]);

            // reset
            setTitle("");
            setNotes("");
            setPrice("");
            setImageFile(null);
            setImagePreview(null);
            setShowAdminForm(false);
        } catch (err) {
            alert(err.message || "Failed to create");
        } finally {
            setUploading(false);
        }
    };

    /* ------------------ DELETE SHIRT ------------------ */
    const handleDelete = async (id) => {
        if (!isAdmin) return;
        if (!window.confirm("Are you sure you want to delete this shirt?")) return;
        try {
            const res = await fetch(`${API_URL}/api/men/shirt/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Delete failed");
            setItems((prev) => prev.filter((it) => it._id !== id));
        } catch (err) {
            alert(err.message || "Could not delete");
        }
    };

    /* ------------------ BOOKING ------------------ */
    const openBooking = (product) => {
        if (!user) return navigate("/login");
        if (!isCustomer) return alert("Only customers can book consultations.");

        setBookingProduct(product);
        setBookName(user?.name || "");
        setBookPhone("");
        setBookNotes("");
        setShowBookingModal(true);
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
                    productType: "MenShirt", 
                    notes: bookNotes,
                    phone: bookPhone,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Booking failed");

            alert("Consultation booked successfully!");
            setShowBookingModal(false);
            if (refreshUser) await refreshUser(); 
        } catch (err) {
            alert(err.message);
        } finally {
            setBookingSubmitting(false);
        }
    };

    /* ------------------ RENDER ------------------ */
    if (error)
        return (
            <div className="max-w-7xl mx-auto px-6 py-16">
                <p className="text-center text-red-600 font-semibold text-lg border border-red-300 p-4 rounded-xl bg-red-50">⚠️ Error: {error}</p>
            </div>
        );

    return (
        <div className="bg-gray-50 min-h-screen py-16 px-4">
            <div className="max-w-7xl mx-auto space-y-16">
                
                {/* Header and Controls */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-purple-200">
                    <h1 className="text-4xl font-extrabold text-purple-900 tracking-tight">
                        <FaTshirt className="inline mr-3 text-purple-600" /> Men's Shirt Collection
                    </h1>

                    {/* Sort Control & Admin Button Group */}
                    <div className="flex items-center gap-4 flex-wrap justify-end">
                        
                        {/* Sort Dropdown - Improved UI */}
                        {items.length > 1 && (
                            <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
                                <FaSort className="text-purple-600 w-4 h-4" />
                                <select
                                    id="shirt-sort"
                                    value={sortKey}
                                    onChange={(e) => setSortKey(e.target.value)}
                                    className="bg-white text-gray-700 font-medium text-sm focus:outline-none focus:ring-0 appearance-none cursor-pointer"
                                >
                                    <option value="none">Default Order</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                    {/* Removed 'title-asc' option */}
                                </select>
                            </div>
                        )}

                        {/* Admin Button */}
                        {isAdmin && (
                            <button
                                onClick={() => setShowAdminForm(true)}
                                className="px-6 py-3 bg-purple-900 text-white rounded-xl shadow-lg hover:bg-purple-800 transition font-semibold text-base hover:shadow-xl focus:ring-4 focus:ring-purple-300 flex items-center gap-2"
                            >
                                <FaPlus /> Add New Shirt
                            </button>
                        )}
                    </div>
                </div>

                {/* Loading / Empty / Main Content */}
                {loading ? (
                    <p className="text-center text-gray-600 py-10">Loading shirts...</p>
                ) : items.length === 0 ? (
                    <p className="text-center text-gray-500 py-10 text-xl">No shirts available in the collection.</p>
                ) : (
                    <div className="space-y-16">
                        {sortedItems.map((it, idx) => ( 
                            <section
                                key={it._id}
                                className={`flex flex-col lg:flex-row items-center gap-12 p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition duration-300 ${
                                    idx % 2 === 1 ? "lg:flex-row-reverse" : ""
                                }`}
                            >
                                {/* Text */}
                                <div className="w-full lg:w-1/2 space-y-5">
                                    <span className="text-sm font-medium uppercase text-purple-500 tracking-widest">Men's Apparel</span>
                                    <h2 className="text-3xl font-bold text-gray-900">{it.title}</h2>
                                    <p className="text-gray-700 leading-relaxed border-l-4 border-purple-200 pl-4 italic">
                                        {it.notes || "A timeless piece offering comfort and sharp style, perfect for casual or business wear."}
                                    </p>
                                    
                                    <div className="text-3xl font-extrabold text-green-700 pt-4">
                                        {it.price ? `Rs. ${parseFloat(it.price).toLocaleString('en-IN')}` : 'Price On Request'}
                                    </div>

                                    <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-100">
                                        {user && isCustomer ? (
                                            <button
                                                onClick={() => openBooking(it)}
                                                className="px-8 py-3 bg-purple-900 text-white rounded-xl hover:bg-purple-800 transition shadow-lg font-semibold text-base focus:ring-4 focus:ring-purple-300"
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
                                                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-semibold text-sm focus:ring-4 focus:ring-red-300 flex items-center gap-1"
                                            >
                                                <FaTrashAlt className="w-3 h-3" /> Delete
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Image */}
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

            {/* ---------------- Admin Modal (Create Shirt) ---------------- */}
            {showAdminForm && isAdmin && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center px-4 z-50">
                    <form className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl space-y-6 relative" onSubmit={handleCreateSection}>
                        <div className="flex justify-between items-center border-b pb-3 mb-4">
                            <h3 className="text-2xl font-extrabold text-purple-900">Add New Shirt</h3>
                            <button type="button" onClick={() => setShowAdminForm(false)} className="text-xl text-gray-500 hover:text-gray-900 transition focus:outline-none">✕</button>
                        </div>
                        
                        <input type="text" placeholder="Shirt Title (e.g., Casual Linen Shirt)" value={title} onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 focus:outline-none transition" required />
                        <textarea placeholder="Notes / Description" value={notes} onChange={(e) => setNotes(e.target.value)}
                            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 focus:outline-none transition" rows={4} />
                        
                        <div className="flex gap-4 items-center">
                            <FaTag className="text-purple-600 w-5 h-5 flex-shrink-0" />
                            <input type="number" placeholder="Price (e.g., 2999)" value={price} onChange={(e) => setPrice(e.target.value)}
                                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 focus:outline-none transition" />
                        </div>

                        <div>
                            <label className="inline-flex items-center gap-3 px-6 py-2 bg-purple-700 text-white rounded-full cursor-pointer hover:bg-purple-800 transition shadow-md font-semibold focus:ring-4 focus:ring-purple-300">
                                Upload Image
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageSelect(e.target.files?.[0])}
                                    className="hidden"
                                />
                            </label>

                            {/* Consolidated Image Preview */}
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="mt-4 w-full h-48 object-cover rounded-xl shadow-lg border-2 border-purple-100"
                                />
                            )}
                        </div>
                        
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <button type="button" onClick={() => setShowAdminForm(false)}
                                className="px-5 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition font-semibold">Cancel</button>
                            <button type="submit" disabled={uploading}
                                className="px-5 py-2 bg-purple-900 text-white rounded-xl hover:bg-purple-800 transition disabled:opacity-60 font-semibold focus:ring-4 focus:ring-purple-300">
                                {uploading ? "Uploading..." : "Create Shirt"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* ---------------- Booking Modal ---------------- */}
            {showBookingModal && bookingProduct && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center px-4 z-50">
                    <form className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl space-y-6 relative" onSubmit={handleBookingSubmit}>
                        <div className="flex justify-between items-center border-b pb-3 mb-4">
                            <h3 className="text-2xl font-extrabold text-purple-900">Book Consultation for Shirt</h3>
                            <button type="button" onClick={() => setShowBookingModal(false)} className="text-xl text-gray-500 hover:text-gray-900 transition focus:outline-none">✕</button>
                        </div>

                        <div className="bg-purple-50 p-3 rounded-xl border border-purple-200">
                            <p className="font-semibold text-purple-800">Product: {bookingProduct.title}</p>
                            <p className="text-sm text-gray-600 mt-1">Price: {bookingProduct.price ? `Rs. ${parseFloat(bookingProduct.price).toLocaleString('en-IN')}` : 'On Request'}</p>
                        </div>
                        
                        <input type="text" placeholder="Your Name" value={bookName} onChange={(e) => setBookName(e.target.value)}
                            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 focus:outline-none transition" required />
                        <input type="tel" placeholder="Phone Number" value={bookPhone} onChange={(e) => setBookPhone(e.target.value)}
                            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 focus:outline-none transition" required />
                        <textarea placeholder="Specific notes or custom requirements (optional)" value={bookNotes} onChange={(e) => setBookNotes(e.target.value)}
                            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 focus:outline-none transition" rows={4} />
                        
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <button type="button" onClick={() => setShowBookingModal(false)}
                                className="px-5 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition font-semibold">Cancel</button>
                            <button type="submit" disabled={bookingSubmitting}
                                className="px-5 py-2 bg-purple-900 text-white rounded-xl hover:bg-purple-800 transition disabled:opacity-60 font-semibold focus:ring-4 focus:ring-purple-300">
                                {bookingSubmitting ? "Submitting..." : "Confirm Booking"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}