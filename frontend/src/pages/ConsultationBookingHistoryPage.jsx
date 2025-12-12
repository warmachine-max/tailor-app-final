import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    FaCalendarAlt, FaUserTie, FaCheckCircle, FaTimesCircle, 
    FaSpinner, FaFilter, FaSearch, FaEye, FaPhoneAlt, FaSyncAlt,
    FaRegClock, FaMapMarkerAlt, FaCommentDots, FaLink, FaEnvelope,
    FaClipboardList, FaArrowAltCircleUp, FaTrashAlt 
} from 'react-icons/fa';

// 🚨 IMPORTANT: CONFIGURE YOUR API ENDPOINTS 🚨
// Ensure your backend is running on this port and endpoint structure
const API_URL = import.meta.env.VITE_API_URL;
const FETCH_URL = `${API_URL}/api/consultations`;
const STATUS_UPDATE_URL = (id) => `${API_URL}/api/consultations/${id}/status`;
const DELETE_URL = (id) => `${API_URL}/api/consultations/${id}`;

// --- MAIN COMPONENT ---
const ConsultationBookingHistoryPage = () => {
    // --- State Management ---
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({ status: 'ALL', serviceType: 'ALL' });
    const [selectedBooking, setSelectedBooking] = useState(null); 
    const [searchTerm, setSearchTerm] = useState('');

    // --- Data Fetching Effect & Function ---
    useEffect(() => {
        fetchBookings();
    }, []); 

    const fetchBookings = async () => {
        setLoading(true);
        setError(null);
        try {
            // NOTE: Replace with your actual token/auth logic if needed
            const response = await axios.get(FETCH_URL, { 
                withCredentials: true 
            });
            
            // Map data and ensure required nested objects exist
            const fetchedData = response.data.map(booking => ({
                ...booking,
                client: booking.client || {},
                appointment: booking.appointment || {},
                profile: booking.profile || {},
                _id: booking._id 
            }));

            setBookings(fetchedData); 
            
        } catch (err) {
            console.error("Failed to fetch bookings:", err.response ? err.response.data : err.message);
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                setError("Access Denied. You must be logged in as an administrator to view this page.");
            } else {
                setError("Failed to load consultation history. Please check your network or backend connection.");
            }
        } finally {
            setLoading(false);
        }
    };

    // --- Dynamic Status Update Handler ---
    const handleStatusUpdate = async (bookingId, newStatus) => {
        const bookingToUpdate = bookings.find(b => b._id === bookingId);
        
        if (bookingToUpdate.status === newStatus || bookingToUpdate.isUpdating || bookingToUpdate.isDeleting) return; 
        
        const statusLabel = newStatus.replace('_', ' ');
        if (!window.confirm(`Confirm status change for client ${bookingToUpdate.client.name} to: ${statusLabel}?`)) {
            return;
        }

        const originalBookings = bookings;
        
        // Optimistic UI Update
        setBookings(prev => prev.map(b => 
            b._id === bookingId ? { ...b, status: newStatus, isUpdating: true } : b
        ));

        try {
            await axios.put(STATUS_UPDATE_URL(bookingId), { status: newStatus }, {
                withCredentials: true 
            });
            
            // Final success state
            setBookings(prev => prev.map(b => 
                b._id === bookingId ? { ...b, status: newStatus, isUpdating: false } : b
            ));
            
        } catch (err) {
            console.error("Status update failed:", err.response ? err.response.data : err.message);
            setError(`Failed to update booking status: ${err.response?.data?.message || 'Server error'}`);
            // Revert on failure
            setBookings(originalBookings.map(b => 
                b._id === bookingId ? { ...b, isUpdating: false } : b
            ));
        }
    };
    
    // --- DELETE HANDLER FUNCTION ---
    const handleDeleteBooking = async (bookingId, clientName) => {
        if (!window.confirm(`WARNING: Are you sure you want to permanently delete the booking for ${clientName}? This action cannot be undone.`)) {
            return;
        }
        
        const originalBookings = bookings;
        
        // Optimistic deletion from UI 
        setBookings(prev => prev.map(b => 
            b._id === bookingId ? { ...b, isDeleting: true } : b
        ));

        try {
            await axios.delete(DELETE_URL(bookingId), {
                withCredentials: true
            });

            // Final removal from UI on success
            setBookings(prev => prev.filter(b => b._id !== bookingId));

        } catch (err) {
            console.error("Booking deletion failed:", err.response ? err.response.data : err.message);
            setError(`Failed to delete booking: ${err.response?.data?.message || 'Server error'}`);
            
            // Revert UI on failure
            setBookings(originalBookings.map(b => 
                b._id === bookingId ? { ...b, isDeleting: false } : b
            ));
        }
    };


    // --- Filtering Logic ---
    const filterAndSearchBookings = bookings.filter(booking => {
        const statusMatch = filters.status === 'ALL' || booking.status === filters.status;
        const serviceMatch = filters.serviceType === 'ALL' || booking.appointment.serviceType === filters.serviceType;
        const searchLower = searchTerm.toLowerCase();
        
        const clientName = booking.client.name?.toLowerCase() || '';
        const clientEmail = booking.client.email?.toLowerCase() || '';
        const clientPhone = booking.client.phone || '';
        const appointmentAddress = booking.appointment.address?.toLowerCase() || '';
        
        const searchMatch = !searchTerm || 
            clientName.includes(searchLower) ||
            clientEmail.includes(searchLower) ||
            clientPhone.includes(searchLower) ||
            appointmentAddress.includes(searchLower);

        return statusMatch && serviceMatch && searchMatch;
    });
    
    // --- Helper Functions ---
    const getStatusColor = (status) => {
        switch (status) {
            case 'CONFIRMED': return 'text-green-800 bg-green-100 border-green-500';
            case 'PENDING_CONFIRMATION': return 'text-yellow-800 bg-yellow-100 border-yellow-500';
            case 'CANCELLED': return 'text-red-800 bg-red-100 border-red-500';
            case 'COMPLETED': return 'text-blue-800 bg-blue-100 border-blue-500';
            default: return 'text-gray-700 bg-gray-100 border-gray-400';
        }
    };

    const formatDate = (dateString, timeString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            const datePart = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            return `${datePart} at ${timeString}`;
        } catch {
            return dateString; 
        }
    };

    // --- JSX Rendering ---

    if (loading && bookings.length === 0) return (
        <div className="text-center py-20 bg-gray-50 min-h-screen">
            <FaSpinner className="animate-spin w-10 h-10 mx-auto mb-4 text-indigo-600" />
            <p className="text-xl font-semibold text-gray-700">Loading Consultation Requests...</p>
        </div>
    );

    if (error && bookings.length === 0) return (
        <div className="text-center py-20 text-red-700 bg-red-50 border-2 border-red-400 m-8 rounded-xl shadow-2xl">
            <FaTimesCircle className='w-10 h-10 mx-auto mb-4 text-red-500'/>
            <p className='font-bold text-2xl mb-2'>Error Loading Data</p>
            <p className="text-lg px-4">{error}</p>
        </div>
    );

    return (
        <div className="p-4 md:p-10 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b-4 border-indigo-200 bg-gradient-to-r from-white via-indigo-50 to-white sticky top-0 z-10">
                <h1 className="text-3xl font-extrabold text-gray-900 flex items-center mb-4 sm:mb-0">
                    <FaClipboardList className="mr-3 text-indigo-600 w-8 h-8"/> Tailoring Consultation Dashboard
                </h1>
                <button 
                    onClick={fetchBookings} 
                    className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition flex items-center text-sm shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50"
                    title="Refresh Data"
                    disabled={loading}
                >
                    <FaSyncAlt className={`mr-2 ${loading ? 'animate-spin' : ''}`}/> {loading ? 'Refreshing...' : 'Refresh Data'}
                </button>
            </div>
            
            <p className="text-gray-600 mb-8 text-lg">
                Manage all customer consultation requests. Total bookings: <span className="font-extrabold text-indigo-600">{bookings.length}</span>.
            </p>

            {/* Error Display */}
            {error && (
                 <div className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50" role="alert">
                    <FaTimesCircle className='w-4 h-4 mr-2'/>
                    <span className="font-medium">Update Error:</span> {error}
                </div>
            )}

            <div className="space-y-10">
                {/* --- Filtering & Search Controls Card --- */}
                <div className="bg-white p-7 rounded-2xl shadow-2xl border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center">
                        <FaFilter className="mr-3 text-indigo-500"/> Advanced Filters & Search
                    </h2>
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Search Input */}
                        <div className="flex items-center w-full md:w-1/3 border-2 border-gray-300 rounded-xl p-3 bg-gray-50 focus-within:ring-2 focus-within:ring-indigo-500 transition shadow-inner">
                            <FaSearch className="text-gray-500 mr-3" />
                            <input
                                type="text"
                                placeholder="Search Client (Name, Email, Phone, Address...)"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
                            />
                        </div>
                        
                        {/* Status Filter */}
                        <div className="w-full md:w-1/3">
                            <label className="text-sm font-semibold text-gray-700 block mb-2">Filter by Status</label>
                            <select 
                                value={filters.status} 
                                onChange={(e) => setFilters({...filters, status: e.target.value})}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 bg-white shadow-md transition cursor-pointer"
                            >
                                <option value="ALL">All Statuses</option>
                                <option value="PENDING_CONFIRMATION">Pending Confirmation</option>
                                <option value="CONFIRMED">Confirmed</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>
                        
                        {/* Service Type Filter */}
                        <div className="w-full md:w-1/3">
                            <label className="text-sm font-semibold text-gray-700 block mb-2">Filter by Service Type</label>
                            <select 
                                value={filters.serviceType} 
                                onChange={(e) => setFilters({...filters, serviceType: e.target.value})}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 bg-white shadow-md transition cursor-pointer"
                            >
                                <option value="ALL">All Services</option>
                                <option value="Remote Call (Phone/Video)">Remote Call</option>
                                <option value="Doorstep Visit (Tailor comes to you)">Doorstep Visit</option>
                                <option value="In-Studio Appointment">In-Studio Appointment</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* --- Bookings Table Card --- */}
                <div className="bg-white p-7 rounded-2xl shadow-2xl border border-gray-100 overflow-x-auto">
                    <h2 className="text-2xl font-bold text-gray-800 mb-5">Bookings List ({filterAndSearchBookings.length})</h2>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-indigo-50">
                            <tr>
                                {/* Explicit Tailwind classes for table headers */}
                                <th className="px-6 py-4 text-left text-xs font-extrabold text-indigo-800 uppercase tracking-wider w-1/5">Client</th>
                                <th className="px-6 py-4 text-left text-xs font-extrabold text-indigo-800 uppercase tracking-wider w-1/4">Appointment Details</th>
                                <th className="px-6 py-4 text-left text-xs font-extrabold text-indigo-800 uppercase tracking-wider w-1/6">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-extrabold text-indigo-800 uppercase tracking-wider w-1/3">Actions</th>
                                <th className="px-6 py-4 text-left text-xs font-extrabold text-indigo-800 uppercase tracking-wider w-1/12 text-center">Details</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {filterAndSearchBookings.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 text-xl">
                                        <FaFilter className="w-8 h-8 mx-auto mb-3"/> 
                                        <p>No consultation requests match your current filters.</p>
                                    </td>
                                </tr>
                            ) : (
                                filterAndSearchBookings.map((booking, index) => (
                                    <tr 
                                        key={booking._id} 
                                        className={index % 2 === 0 ? 'bg-white hover:bg-gray-100 transition duration-150' : 'bg-gray-50 hover:bg-gray-100 transition duration-150'}
                                    >
                                        {/* Client Details */}
                                        <td className="px-6 py-4 text-sm text-gray-800">
                                            <div className="font-extrabold text-gray-900">{booking.client.name}</div>
                                            <div className="text-xs text-gray-600 flex items-center mt-1">
                                                <FaEnvelope className='mr-1 w-3 h-3 text-indigo-400'/> {booking.client.email}
                                            </div>
                                            <div className="text-xs text-gray-600 flex items-center">
                                                <FaPhoneAlt className='mr-1 w-3 h-3 text-indigo-400'/> {booking.client.phone}
                                            </div>
                                        </td>
                                        
                                        {/* Appointment Details */}
                                        <td className="px-6 py-4 text-sm text-gray-800 text-sm text-gray-700">
                                            <div className="font-bold text-indigo-800">{booking.appointment.serviceType}</div>
                                            <div className="flex items-center mt-1 text-xs">
                                                <FaCalendarAlt className='mr-1 w-3 h-3 text-gray-500'/> 
                                                <span className='font-medium'>{formatDate(booking.appointment.preferredDate, booking.appointment.preferredTime)}</span>
                                            </div>
                                        </td>

                                        {/* Status Pill */}
                                        <td className="px-6 py-4 text-sm text-gray-800">
                                            <span 
                                                className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border-2 shadow-sm ${getStatusColor(booking.status)}`}
                                            >
                                                {booking.status.replace('_', ' ')}
                                                {(booking.isUpdating || booking.isDeleting) && <FaSpinner className="animate-spin ml-2" />} 
                                            </span>
                                        </td>

                                        {/* Actions: Status + Delete Buttons */}
                                        <td className="px-6 py-4 text-sm text-gray-800 flex items-center justify-between">
                                            
                                            {/* Status Action Group */}
                                            <div className="flex flex-wrap gap-2">
                                                
                                                {/* PENDING ACTIONS */}
                                                {booking.status === 'PENDING_CONFIRMATION' && (
                                                    <>
                                                        <button 
                                                            onClick={() => handleStatusUpdate(booking._id, 'CONFIRMED')}
                                                            className="font-bold py-2 px-3 rounded-lg text-xs inline-flex items-center gap-1 transition duration-200 shadow-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:scale-[1.02] hover:shadow-xl"
                                                            disabled={booking.isUpdating || booking.isDeleting}
                                                            title="Confirm Appointment"
                                                        >
                                                            <FaCheckCircle /> Approve
                                                        </button>
                                                        <button 
                                                            onClick={() => handleStatusUpdate(booking._id, 'CANCELLED')}
                                                            className="font-bold py-2 px-3 rounded-lg text-xs inline-flex items-center gap-1 transition duration-200 shadow-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:scale-[1.02] hover:shadow-xl"
                                                            disabled={booking.isUpdating || booking.isDeleting}
                                                            title="Reject/Cancel Appointment"
                                                        >
                                                            <FaTimesCircle /> Reject
                                                        </button>
                                                    </>
                                                )}
                                                
                                                {/* CONFIRMED ACTIONS */}
                                                {booking.status === 'CONFIRMED' && (
                                                    <>
                                                        <button 
                                                            onClick={() => handleStatusUpdate(booking._id, 'COMPLETED')}
                                                            className="font-bold py-2 px-3 rounded-lg text-xs inline-flex items-center gap-1 transition duration-200 shadow-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:scale-[1.02] hover:shadow-xl"
                                                            disabled={booking.isUpdating || booking.isDeleting}
                                                            title="Mark as Completed"
                                                        >
                                                            <FaArrowAltCircleUp /> Complete
                                                        </button>
                                                        <button 
                                                            onClick={() => handleStatusUpdate(booking._id, 'CANCELLED')}
                                                            className="font-bold py-2 px-3 rounded-lg text-xs inline-flex items-center gap-1 transition duration-200 shadow-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:scale-[1.02] hover:shadow-xl"
                                                            disabled={booking.isUpdating || booking.isDeleting}
                                                            title="Cancel Appointment"
                                                        >
                                                            <FaTimesCircle /> Cancel
                                                        </button>
                                                    </>
                                                )}
                                                
                                                {/* Final Status Indicator & Delete Button */}
                                                {(booking.status === 'COMPLETED' || booking.status === 'CANCELLED') && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-500 text-sm font-medium">Archived.</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Delete Button (Only render for Archived states: COMPLETED or CANCELLED) */}
                                            {(booking.status === 'COMPLETED' || booking.status === 'CANCELLED') && (
                                                <button 
                                                    onClick={() => handleDeleteBooking(booking._id, booking.client.name)}
                                                    className="font-bold py-2 px-3 rounded-lg text-xs inline-flex items-center gap-1 transition duration-200 shadow-md bg-gray-500 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:scale-[1.02] hover:shadow-xl ml-2" 
                                                    disabled={booking.isUpdating || booking.isDeleting}
                                                    title="Permanently Delete Booking"
                                                >
                                                    <FaTrashAlt /> Delete
                                                </button>
                                            )}
                                        </td>
                                        
                                        {/* View Detail Button */}
                                        <td className="px-6 py-4 text-sm text-gray-800 text-center">
                                            <button 
                                                onClick={() => setSelectedBooking(booking)}
                                                className="text-indigo-600 hover:text-white hover:bg-indigo-600 p-2 rounded-full transition duration-150 border border-indigo-600 hover:shadow-lg cursor-pointer"
                                                title="View Full Details"
                                            >
                                                <FaEye className='w-5 h-5'/>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* --- Modal for Detailed View --- */}
            {selectedBooking && (
                <BookingDetailModal 
                    booking={selectedBooking} 
                    onClose={() => setSelectedBooking(null)}
                />
            )}
            
        </div>
    );
};

// --- Modal Component ---
const BookingDetailModal = ({ booking, onClose }) => {
    const formatDateModal = (dateString, timeString) => {
        try {
            const date = new Date(dateString);
            const datePart = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            return `${datePart} at ${timeString}`;
        } catch {
            return 'N/A';
        }
    };

    const getStatusColorClass = (status) => {
        switch (status) {
            case 'CONFIRMED': return 'text-green-700 border-green-500 bg-green-50';
            case 'PENDING_CONFIRMATION': return 'text-yellow-700 border-yellow-500 bg-yellow-50';
            case 'CANCELLED': return 'text-red-700 border-red-500 bg-red-50';
            case 'COMPLETED': return 'text-blue-700 border-blue-500 bg-blue-50';
            default: return 'text-gray-700 border-gray-400 bg-gray-50';
        }
    };
    
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-3xl w-full max-w-4xl max-h-[95vh] overflow-y-auto transform transition-all duration-300 scale-100 border-4 border-indigo-300/50">
                
                {/* Modal Header */}
                <div className="sticky top-0 p-6 border-b-2 border-indigo-100 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-white z-10 shadow-md">
                    <h3 className="text-2xl font-extrabold text-indigo-800">
                        <FaEye className='inline mr-2'/> Booking Details: {booking.client.name}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-white bg-white hover:bg-indigo-600 p-3 rounded-full transition duration-150 shadow-lg cursor-pointer">
                        <FaTimesCircle className='w-6 h-6'/>
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-8 space-y-8">
                    
                    {/* Status Badge at Top */}
                    <div className="text-center">
                        <span className={`px-5 py-2 text-md font-extrabold uppercase rounded-full border-2 ${getStatusColorClass(booking.status)} shadow-lg`}>
                            CURRENT STATUS: {booking.status.replace('_', ' ')}
                        </span>
                    </div>

                    {/* Content Grid */}
                    <div className='grid md:grid-cols-2 gap-8'>
                        {/* Appointment Info Card (Column 1) */}
                        <div className="p-6 border border-indigo-300 rounded-xl bg-indigo-50 shadow-lg">
                            <h4 className="text-xl font-bold mb-4 text-indigo-800 flex items-center border-b pb-2 border-indigo-200">
                                <FaCalendarAlt className='mr-3'/> Appointment Schedule
                            </h4>
                            <DetailItemModal label="Service Type" value={booking.appointment.serviceType} icon={<FaRegClock />}/>
                            <DetailItemModal label="Scheduled Time" value={formatDateModal(booking.appointment.preferredDate, booking.appointment.preferredTime)} icon={<FaCalendarAlt />}/>
                            {booking.appointment.address && <DetailItemModal label="Location/Address" value={booking.appointment.address} icon={<FaMapMarkerAlt />} isBlock={true}/>}
                        </div>
                        
                        {/* Client Info Card (Column 2) */}
                        <div className="p-6 border border-gray-300 rounded-xl bg-white shadow-lg">
                            <h4 className="text-xl font-bold mb-4 text-gray-800 flex items-center border-b pb-2 border-gray-200">
                                <FaUserTie className='mr-3'/> Client Contact Details
                            </h4>
                            <DetailItemModal label="Name" value={booking.client.name} icon={<FaUserTie />}/>
                            <DetailItemModal label="Email" value={<a href={`mailto:${booking.client.email}`} className="text-indigo-600 hover:underline">{booking.client.email}</a>} icon={<FaEnvelope />}/>
                            <DetailItemModal label="Phone" value={<a href={`tel:${booking.client.phone}`} className="text-indigo-600 hover:underline">{booking.client.phone}</a>} icon={<FaPhoneAlt />}/>
                        </div>
                    </div>
                    
                    {/* Style Profile Card (Full Width) */}
                    <div className="p-6 border border-gray-300 rounded-xl bg-white shadow-lg">
                        <h4 className="text-xl font-bold mb-4 text-gray-800 flex items-center border-b pb-2 border-gray-200">
                            <FaCommentDots className='mr-3'/> Style & Requirements Profile
                        </h4>
                        <div className='grid md:grid-cols-2 gap-x-6'>
                            <DetailItemModal label="Occasion" value={booking.profile.occasion || 'N/A'}/>
                            <DetailItemModal label="Style Archetype" value={booking.profile.styleArchetype || 'N/A'}/>
                            {booking.profile.bodyShape && <DetailItemModal label="Body Shape" value={booking.profile.bodyShape}/>}
                            <DetailItemModal label="Comfort Preference" value={booking.profile.comfortPreference || 'N/A'}/>
                            {booking.profile.inspirationLink && 
                                <DetailItemModal 
                                    label="Inspiration Link" 
                                    value={<a href={booking.profile.inspirationLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1 font-semibold">View Link <FaLink/></a>} 
                                />
                            }
                        </div>
                        <DetailItemModal label="Notes" value={booking.profile.notes || 'No specific notes provided.'} isBlock={true}/>
                    </div>

                </div>
            </div>
        </div>
    );
};

// --- Detail Item Component for Modal ---
const DetailItemModal = ({ label, value, icon, isBlock = false }) => (
    <div className={`flex ${isBlock ? 'flex-col' : 'justify-between'} border-b border-gray-100 py-3 last:border-b-0`}>
        <span className="font-semibold text-gray-600 flex items-center gap-2 mb-1 md:mb-0 text-sm">
            {icon} {label}:
        </span>
        <span className={`${isBlock ? 'mt-2 p-3 border border-gray-200 rounded text-sm text-gray-800 whitespace-pre-wrap font-medium leading-relaxed' : 'text-gray-900 md:text-right font-bold'}`}>
            {value}
        </span>
    </div>
);


export default ConsultationBookingHistoryPage;