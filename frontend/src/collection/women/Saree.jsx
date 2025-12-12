import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaDollarSign, FaTag, FaSort } from 'react-icons/fa'; // Added FaSort for generic sort icon

export default function Saree() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // --- UPDATED SORTING STATE: Only Price and Default ---
    const [sortOrder, setSortOrder] = useState('default'); // 'default', 'price_asc', 'price_desc'

    const [showAdminForm, setShowAdminForm] = useState(false);
    const [title, setTitle] = useState("");
    const [notes, setNotes] = useState("");
    const [price, setPrice] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);

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

    const PLACEHOLDER = "/mnt/data/saree-placeholder.png";

    /* ------------------ FETCH SAREES ------------------ */
    useEffect(() => {
        let mounted = true;
        const fetchItems = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/women/sarees");
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Failed to fetch sarees");
                if (mounted) setItems(data.sarees || []);
            } catch (err) {
                if (mounted) setError(err.message);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        fetchItems();
        return () => (mounted = false);
    }, []);

    /* ------------------ SORTING LOGIC (useMemo) - UPDATED ------------------ */
    const sortedItems = useMemo(() => {
        if (!items) return [];

        // Create a mutable copy for sorting
        const sortableItems = [...items]; 

        switch (sortOrder) {
            case 'price_asc':
                return sortableItems.sort((a, b) => (a.price || 0) - (b.price || 0));
            case 'price_desc':
                return sortableItems.sort((a, b) => (b.price || 0) - (a.price || 0));
            case 'default':
            default:
                // Sort by creation date (newest first)
                return sortableItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
    }, [items, sortOrder]);


    /* ------------------ ADMIN/BOOKING HANDLERS (Unchanged) ------------------ */
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

            const res = await fetch("http://localhost:5000/api/women/saree/create", {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Create failed");

            setItems((prev) => [data.saree, ...prev]); 
            setTitle(""); setNotes(""); setPrice(""); setImageFile(null); setImagePreview(null); setShowAdminForm(false);
        } catch (err) {
            alert(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!isAdmin) return;
        if (!window.confirm("Delete this saree?")) return;

        try {
            const res = await fetch(`http://localhost:5000/api/women/saree/${id}`, {
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
            const res = await fetch("http://localhost:5000/api/booking/book", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId: bookingProduct._id,
                    productType: "WomenSaree",
                    notes: bookNotes,
                    phone: bookPhone,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            alert("Consultation booked!");
            setShowBookingModal(false);
            if (refreshUser) refreshUser();
        } catch (err) {
            alert(err.message);
        } finally {
            setBookingSubmitting(false);
        }
    };

    if (error) return <div className="max-w-7xl mx-auto px-6 py-16 text-center text-red-600 font-semibold">{error}</div>;

    /* ------------------ UI RENDER ------------------ */

    return (
        <div className="bg-gray-50 py-16 px-4">
            <div className="max-w-7xl mx-auto space-y-12">
                
                {/* Header & Controls */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-4 border-b border-purple-100">
                    <h1 className="text-4xl font-extrabold text-purple-900">Saree Collection 💜</h1>
                    <div className="flex gap-4 items-center">
                        {/* --- SORTING SELECT - CLEANER UI --- */}
                        <div className="flex items-center space-x-2 bg-white p-2 rounded-xl shadow-sm border border-gray-200">
                            <FaSort className="w-4 h-4 text-purple-600 flex-shrink-0" />
                            <select
                                id="sort-order"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="text-sm rounded-lg py-1 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition bg-white cursor-pointer"
                            >
                                <option value="default">Sort: Newest First</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                            </select>
                        </div>
                        {isAdmin && (
                            <button 
                                onClick={() => setShowAdminForm(true)} 
                                className="px-5 py-2.5 bg-purple-900 text-white rounded-xl shadow-lg hover:bg-purple-800 transition text-sm font-semibold"
                            >
                                + Add Saree
                            </button>
                        )}
                    </div>
                </div>

                {/* Items */}
                {loading ? (
                    <p className="text-center text-gray-500 py-10">Loading sarees...</p>
                ) : sortedItems.length === 0 ? (
                    <p className="text-center text-gray-500 py-10">No sarees added yet.</p>
                ) : (
                    <div className="space-y-16">
                        {sortedItems.map((it, idx) => (
                            <section 
                                key={it._id} 
                                // Added `idx % 2 === 1` condition for alternating layout
                                className={`flex flex-col lg:flex-row items-center gap-10 p-8 bg-white rounded-3xl shadow-xl transition hover:shadow-2xl ${idx % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
                            >
                                <div className="w-full lg:w-1/2 space-y-4">
                                    <h2 className="text-3xl font-extrabold text-purple-900 uppercase tracking-wider">{it.title}</h2>
                                    <p className="text-gray-600 leading-relaxed italic">{it.notes || "Elegant sarees crafted for comfort and style."}</p>
                                    
                                    <div className="text-3xl font-extrabold text-green-700 flex items-center pt-2">
                                        <FaDollarSign className="w-6 h-6 mr-2 opacity-80" /> 
                                        {it.price ? `Rs. ${parseFloat(it.price).toFixed(2)}` : 'Price on Request'}
                                    </div>

                                    <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-purple-100">
                                        {user ? (
                                            <button 
                                                onClick={() => openBooking(it)} 
                                                className="px-6 py-2.5 bg-purple-900 text-white rounded-full hover:bg-purple-800 transition shadow-md font-semibold text-sm"
                                            >
                                                Book Consultation
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => navigate("/login")} 
                                                className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition font-semibold text-sm"
                                            >
                                                Login to Book
                                            </button>
                                        )}
                                        {isAdmin && (
                                            <button 
                                                onClick={() => handleDelete(it._id)} 
                                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold text-sm"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="w-full lg:w-1/2 flex justify-center">
                                    <img 
                                        src={it.image?.url || PLACEHOLDER} 
                                        alt={it.title} 
                                        className="rounded-3xl shadow-2xl w-full max-w-md h-96 object-cover transition transform hover:scale-[1.02] border-4 border-white" 
                                    />
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>

            {/* Admin Modal (FIXED UI) */}
            {showAdminForm && isAdmin && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
                    <form onSubmit={handleCreateSection} className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl space-y-6 relative">
                        <div className="flex justify-between items-center border-b pb-3 mb-4">
                            <h3 className="text-2xl font-extrabold text-purple-900">Add New Saree to Stock</h3>
                            <button type="button" onClick={() => setShowAdminForm(false)} className="text-xl text-gray-400 hover:text-gray-700 transition">✕</button>
                        </div>
                        <input type="text" placeholder="Saree Title (e.g., Silk Brocade Saree)" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-gray-300 p-3 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 focus:outline-none transition" required />
                        <textarea placeholder="Detailed Description / Fabric Notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full border border-gray-300 p-3 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 focus:outline-none transition" rows={4} />
                        <div className="flex gap-4 items-center">
                            <FaTag className="text-purple-600 w-5 h-5 flex-shrink-0" />
                            <input type="number" placeholder="Price (e.g., 8500)" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border border-gray-300 p-3 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 focus:outline-none transition" />
                        </div>
                        
                        <div>
                            <label className="inline-flex items-center gap-3 px-6 py-2 bg-purple-700 text-white rounded-full cursor-pointer hover:bg-purple-800 transition shadow-md font-semibold">
                                Upload Product Image
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageSelect(e.target.files?.[0])}
                                    className="hidden"
                                />
                            </label>

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
                            <button type="submit" disabled={uploading} className="px-5 py-2 bg-purple-900 text-white rounded-xl hover:bg-purple-800 transition disabled:opacity-60 font-semibold">
                                {uploading ? "Uploading..." : "Create Saree"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Booking Modal (FIXED UI) */}
            {showBookingModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
                    <form onSubmit={handleBookingSubmit} className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl space-y-6 relative">
                        <div className="flex justify-between items-center border-b pb-3 mb-4">
                            <h3 className="text-2xl font-extrabold text-purple-900">Book Consultation for:</h3>
                            <button type="button" onClick={() => setShowBookingModal(false)} className="text-xl text-gray-400 hover:text-gray-700 transition">✕</button>
                        </div>
                        
                        <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                            <p className="font-semibold text-purple-800">{bookingProduct?.title || 'Selected Saree'}</p>
                            <p className="text-sm text-gray-600 mt-1">Price: {bookingProduct?.price ? `Rs. ${parseFloat(bookingProduct.price).toFixed(2)}` : 'On Request'}</p>
                        </div>

                        <input type="text" placeholder="Your Name" value={bookName} onChange={(e) => setBookName(e.target.value)} className="w-full border border-gray-300 p-3 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 focus:outline-none transition" required />
                        <input type="tel" placeholder="Contact Phone Number" value={bookPhone} onChange={(e) => setBookPhone(e.target.value)} className="w-full border border-gray-300 p-3 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 focus:outline-none transition" required />
                        <textarea placeholder="Specific request or questions (optional)" value={bookNotes} onChange={(e) => setBookNotes(e.target.value)} className="w-full border border-gray-300 p-3 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 focus:outline-none transition" rows={4} />
                        
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <button type="button" onClick={() => setShowBookingModal(false)} className="px-5 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition font-semibold">Cancel</button>
                            <button type="submit" disabled={bookingSubmitting} className="px-5 py-2 bg-purple-900 text-white rounded-xl hover:bg-purple-800 transition disabled:opacity-60 font-semibold">
                                {bookingSubmitting ? "Submitting..." : "Confirm Booking"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}