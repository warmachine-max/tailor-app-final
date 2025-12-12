import React, { useState, useCallback } from 'react';
import axios from 'axios'; 
import { 
    FaRulerHorizontal, FaPalette, FaSuitcase, 
    FaSpinner, FaCheckCircle, FaPhone, FaArrowLeft, FaArrowRight, FaTimesCircle, FaExclamationTriangle
} from 'react-icons/fa';

// 🚨 IMPORTANT: CONFIGURE YOUR API ENDPOINT HERE 🚨
const API_BASE_URL = 'http://localhost:5000'; // Replace with your domain in production
const API_ENDPOINT = `${API_BASE_URL}/api/consultations/book`; 

// --- Tailwind Utility Class Definitions (Previously in non-working <style> block) ---
// Note: We define these as JS strings here for reference, but use them directly in JSX below.

const INPUT_FIELD_BASE_CLASSES = "w-full p-3 border-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition placeholder-gray-400 text-gray-700 bg-white shadow-sm";
const INPUT_ERROR_CLASSES = "border-red-500 ring-red-500";
const INPUT_LABEL_CLASSES = "absolute left-3 top-0 text-xs text-gray-500 pt-1 font-medium";

const BUTTON_BASE_CLASSES = "px-6 py-3 font-bold rounded-lg transition duration-200 shadow-md flex items-center justify-center";
const NEXT_SUBMIT_ACTIVE_CLASSES = "bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer transform hover:scale-[1.02]";
const INCOMPLETE_BUTTON_CLASSES = "bg-gray-400 text-gray-700 hover:bg-gray-500 cursor-pointer transform hover:scale-[1.02]";
const BACK_BUTTON_CLASSES = "bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed";

const ConsultationBookingPage = () => {
    // ------------------- State Management -------------------
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        name: '', email: '', phone: '',
        serviceType: 'Remote Call (Phone/Video)', 
        preferredDate: '', preferredTime: '', address: '',
        occasion: '', styleArchetype: '', bodyShape: '', 
        comfortPreference: '', inspirationLink: '', notes: '',
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [missingFieldLabels, setMissingFieldLabels] = useState([]);

    // ------------------- Handlers -------------------
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        
        // Clear error for the current field as the user types
        if (validationErrors[name]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
             if (missingFieldLabels.length === 1) { 
                 setError(null);
                 setMissingFieldLabels([]); 
             }
        }
    };
    
    // Helper function to map field names to user-friendly labels
    const getFieldLabel = (fieldName) => {
        const labels = {
            name: 'Full Name', email: 'Email Address', phone: 'Phone Number',
            preferredDate: 'Preferred Date', preferredTime: 'Preferred Time', 
            address: 'Service Address', occasion: 'Primary Occasion', styleArchetype: 'Style Archetype',
        };
        return labels[fieldName] || fieldName;
    };

    // Validation Logic for Step 1
    const validateStepOne = useCallback(() => {
        const isDoorstep = form.serviceType === 'Doorstep Visit (Tailor comes to you)';
        const errors = {};

        if (!form.name) errors.name = true;
        if (!form.email) errors.email = true;
        if (!form.phone) errors.phone = true;
        if (!form.preferredDate) errors.preferredDate = true;
        if (!form.preferredTime) errors.preferredTime = true;
        if (isDoorstep && !form.address) errors.address = true;

        setValidationErrors(errors);
        
        const missing = Object.keys(errors).map(getFieldLabel);
        setMissingFieldLabels(missing);
        
        return Object.keys(errors).length === 0;
    }, [form.name, form.email, form.phone, form.preferredDate, form.preferredTime, form.serviceType, form.address]);

    // Validation Logic for Step 2
    const validateStepTwo = useCallback(() => {
        const errors = {};
        if (!form.occasion || form.occasion === "") errors.occasion = true; 
        if (!form.styleArchetype || form.styleArchetype === "") errors.styleArchetype = true;

        setValidationErrors(errors);
        
        const missing = Object.keys(errors).map(getFieldLabel);
        setMissingFieldLabels(missing);
        
        return Object.keys(errors).length === 0;
    }, [form.occasion, form.styleArchetype]);

    const handleNext = () => {
        if (validateStepOne()) {
            setStep(2);
            setError(null);
            setMissingFieldLabels([]);
        } else {
            setError("Please correct the highlighted required fields.");
        }
    };

    const handlePrev = () => {
        setStep(1);
        setError(null); 
        setValidationErrors({});
        setMissingFieldLabels([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateStepTwo()) {
            setError("Please correct the highlighted required fields.");
            return;
        }

        setLoading(true);
        setError(null);
        setMissingFieldLabels([]);
        
        console.log(`Attempting POST to ${API_ENDPOINT}`);
        
        try {
            // 🚀 LIVE API CALL USING AXIOS 🚀
            const response = await axios.post(API_ENDPOINT, form);

            if (response.status === 201) {
                setSubmitted(true);
            }

        } catch (err) {
            console.error("Submission failed:", err);
            
            const apiError = err.response?.data?.errors?.join(' ') 
                || err.response?.data?.message 
                || "Booking failed. Please ensure your backend server is running and CORS is configured.";
                
            setError(apiError);
            setSubmitted(false);

        } finally {
            setLoading(false);
        }
    };

    // ------------------- UI Components (Logic & Rendering) -------------------

    const ProgressIndicator = () => (
        <div className="flex justify-between items-center mb-10 w-full max-w-md mx-auto">
            {[1, 2].map(s => (
                <div key={s} className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors duration-300 
                        ${s <= step ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-200 text-gray-500'}`}>
                        {s}
                    </div>
                    <span className={`text-xs mt-2 ${s <= step ? 'text-indigo-600 font-semibold' : 'text-gray-500'}`}>
                        {s === 1 ? 'Schedule' : 'Style Profile'}
                    </span>
                </div>
            ))}
        </div>
    );
    
    const renderStep = () => {
        if (submitted) return <SubmissionSuccess form={form} />;
        
        return step === 1 ? (
            <StepOne 
                form={form} 
                handleChange={handleChange} 
                handleNext={handleNext} 
                validationErrors={validationErrors} 
            />
        ) : (
            <StepTwo 
                form={form} 
                handleChange={handleChange} 
                handlePrev={handlePrev} 
                handleSubmit={handleSubmit} 
                loading={loading} 
                validationErrors={validationErrors} 
            />
        );
    };

    // ------------------- Component Structure (Main Return) -------------------

    return (
        <div className="bg-gray-50 min-h-screen pt-20">
            <div className="max-w-6xl mx-auto px-6 py-16">
                
                {/* Header */}
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 flex items-center justify-center tracking-tight mb-3">
                        <FaPhone className="text-indigo-600 mr-3 w-7 h-7" />
                        Book Your Bespoke Consultation
                    </h1>
                    <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                        This personalized session ensures the perfect fit and style for your custom garment.
                    </p>
                </header>

                {/* Main Form Container */}
                <form onSubmit={(e) => { e.preventDefault(); if (step === 2) handleSubmit(e); }}>
                    <div className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl border border-indigo-100">
                        <ProgressIndicator />
                        
                        {/* 🚨 Validation Alert (Toast-like) Component */}
                        {missingFieldLabels.length > 0 && (
                            <ValidationAlert 
                                labels={missingFieldLabels} 
                                onClose={() => setMissingFieldLabels([])}
                            />
                        )}
                        
                        {/* Generic API Error Display */}
                        {error && missingFieldLabels.length === 0 && (
                             <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 font-medium rounded-lg flex items-center">
                                 <FaTimesCircle className='mr-2 w-5 h-5'/> <strong>Error:</strong> {error}
                             </div>
                        )}
                        
                        <div className="relative">
                            {renderStep()}
                        </div>
                    </div>
                </form>

                {/* Value Proposition Grid (Visual Aids) */}
                <section className="mt-16">
                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
                        The Consultation Difference
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <ValuePropCard 
                            icon={FaRulerHorizontal} 
                            title="Perfect Fit Analysis" 
                            description="Go beyond standard measurements. We analyze your posture and unique body structure to draft a custom pattern."
                            imageTag=""
                        />
                        <ValuePropCard 
                            icon={FaPalette} 
                            title="Personal Brand Matching" 
                            description="Define your style archetype (Classic, Minimalist, Bold). We select colors and silhouettes that project your intended image."
                            imageTag=""
                        />
                        <ValuePropCard 
                            icon={FaSuitcase} 
                            title="Fabric & Function Strategy" 
                            description="Select the optimal fabric weight, durability, and texture based on your climate and the garment's specific purpose."
                            imageTag=""
                        />
                    </div>
                </section>
                
                {/* 🛑 REMOVED THE NON-FUNCTIONAL <style jsx="true"> BLOCK */}
                
            </div>
        </div>
    );
};

// ------------------- Validation Alert Component -------------------
const ValidationAlert = ({ labels, onClose }) => {
    return (
        <div className="sticky top-0 z-20 mx-auto w-full max-w-lg transition-all duration-300 transform -mt-4 mb-4"> 
            <div className="p-4 bg-red-600 text-white font-medium rounded-lg shadow-xl border-2 border-red-800 flex flex-col items-start">
                <h1 className="text-xl font-bold text-center w-full mb-3 pb-2 border-b border-red-400">
                    Please Fill All Details to Proceed
                </h1>
                <div className="flex items-start w-full">
                    <FaExclamationTriangle className='mr-3 w-5 h-5 mt-0.5 flex-shrink-0' />
                    <div className="flex-grow">
                        <strong className="block text-lg mb-1">Missing Required Fields:</strong>
                        <ul className="list-disc list-inside text-sm font-normal ml-4 space-y-0.5">
                            {labels.map((label, index) => (
                                <li key={index}>Please fill in the **{label}** field.</li>
                            ))}
                        </ul>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="ml-4 text-red-100 hover:text-white transition duration-150 p-1 -mt-1 -mr-1 flex-shrink-0"
                        aria-label="Close Alert"
                    >
                        <FaTimesCircle className='w-5 h-5' />
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Step 1 Component ---
const StepOne = ({ form, handleChange, handleNext, validationErrors }) => {
    const isDoorstep = form.serviceType === 'Doorstep Visit (Tailor comes to you)';
    const hasMissingFields = !(form.name && form.email && form.phone && form.preferredDate && form.preferredTime && 
                             (!isDoorstep || form.address));

    const getFieldClass = (fieldName) => 
        `${INPUT_FIELD_BASE_CLASSES} ${validationErrors[fieldName] ? INPUT_ERROR_CLASSES : 'border-gray-300'}`;
    
    const handleNextClick = () => {
        handleNext(); 
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <h3 className="md:col-span-2 text-2xl font-bold text-indigo-700 mb-4">1. Contact & Schedule</h3>
            
            <input name="name" type="text" placeholder="Full Name *" value={form.name} onChange={handleChange} required className={getFieldClass('name')} />
            <input name="email" type="email" placeholder="Email Address *" value={form.email} onChange={handleChange} required className={getFieldClass('email')} />
            <input name="phone" type="tel" placeholder="Phone Number *" value={form.phone} onChange={handleChange} required className={getFieldClass('phone')} />

            <select name="serviceType" value={form.serviceType} onChange={handleChange} required className={getFieldClass('serviceType')}>
                <option value="Remote Call (Phone/Video)">Remote Call (Phone/Video)</option>
                <option value="Doorstep Visit (Tailor comes to you)">Doorstep Visit (Tailor comes to you)</option>
                <option value="In-Studio Appointment">In-Studio Appointment</option>
            </select>
            
            <div className='relative'>
                <label className={INPUT_LABEL_CLASSES}>Preferred Date *</label>
                <input name="preferredDate" type="date" value={form.preferredDate} onChange={handleChange} required className={getFieldClass('preferredDate') + ' pt-5'} />
            </div>
            <div className='relative'>
                <label className={INPUT_LABEL_CLASSES}>Preferred Time *</label>
                <input name="preferredTime" type="time" value={form.preferredTime} onChange={handleChange} required className={getFieldClass('preferredTime') + ' pt-5'} />
            </div>

            {isDoorstep && (
                <textarea 
                    name="address" 
                    placeholder="Full Service Address (Required for Doorstep Visit) *" 
                    value={form.address} 
                    onChange={handleChange} 
                    required={isDoorstep} 
                    className={getFieldClass('address') + ' md:col-span-2'}
                    rows={2} 
                />
            )}
            
            <div className="md:col-span-2 flex justify-end pt-4">
                <button 
                    type='button' 
                    onClick={handleNextClick} 
                    className={`${BUTTON_BASE_CLASSES} ${hasMissingFields ? INCOMPLETE_BUTTON_CLASSES : NEXT_SUBMIT_ACTIVE_CLASSES}`}
                >
                    Next: Style Profile <FaArrowRight className='ml-2'/>
                </button>
            </div>
        </div>
    );
};

// --- Step 2 Component ---
const StepTwo = ({ form, handleChange, handlePrev, loading, handleSubmit, validationErrors }) => {
    
    const hasMissingFields = !form.occasion || form.occasion === "" || !form.styleArchetype || form.styleArchetype === "";
    const isSubmissionDisabled = loading;

    const getFieldClass = (fieldName) => 
        `${INPUT_FIELD_BASE_CLASSES} ${validationErrors[fieldName] ? INPUT_ERROR_CLASSES : 'border-gray-300'}`;
        
    const handleSubmitClick = (e) => {
        e.preventDefault();
        handleSubmit(e);
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <h3 className="md:col-span-2 text-2xl font-bold text-indigo-700 mb-4">2. Style Profile & Notes</h3>

            <select name="occasion" value={form.occasion} onChange={handleChange} required className={getFieldClass('occasion')}>
                <option value="" disabled>Primary Occasion *</option>
                <option value="Professional/Office">Professional / Office Wear</option>
                <option value="Wedding/Formal">Wedding / Formal Event</option>
                <option value="Casual/Weekend">Casual / Weekend Attire</option>
                <option value="Travel">Travel Wardrobe</option>
                <option value="Other">Other</option>
            </select>
            
            <select name="styleArchetype" value={form.styleArchetype} onChange={handleChange} required className={getFieldClass('styleArchetype')}>
                <option value="" disabled>Preferred Style Archetype *</option>
                <option value="Classic">Classic/Elegant (Structured, Timeless)</option>
                <option value="Minimalist">Modern/Minimalist (Clean Lines, Neutral)</option>
                <option value="Bold">Creative/Bold (Unique Patterns, Textures)</option>
                <option value="Comfort">Casual/Comfort (Soft, Unstructured)</option>
                <option value="Other">Other (Describe in notes)</option>
            </select>

            <select name="bodyShape" value={form.bodyShape} onChange={handleChange} className={getFieldClass('bodyShape')}>
                <option value="">Best describes your Body Shape (Optional)</option>
                <option value="Rectangle">Rectangle</option>
                <option value="Triangle">Triangle</option>
                <option value="Inverted Triangle">Inverted Triangle</option>
                <option value="Hourglass">Hourglass</option>
                <option value="Other">I prefer not to say</option>
            </select>
            
            <select name="comfortPreference" value={form.comfortPreference} onChange={handleChange} className={getFieldClass('comfortPreference')}>
                <option value="">Comfort vs. Structure (Optional)</option>
                <option value="Structure">High Structure (Sharp lines)</option>
                <option value="Fluid">Soft Drape (Fluid, Relaxed)</option>
                <option value="Hybrid">Hybrid (Balanced)</option>
            </select>
            
            <input name="inspirationLink" type="url" placeholder="Inspiration Link (Pinterest, Instagram) - Optional" value={form.inspirationLink} onChange={handleChange} className={getFieldClass('inspirationLink') + ' md:col-span-2'} />

            <textarea
                name="notes"
                placeholder="Any specific questions or details for the tailor to prepare..."
                value={form.notes}
                onChange={handleChange}
                className={getFieldClass('notes') + ' md:col-span-2'}
                rows={4}
                disabled={loading}
            />


            <div className="md:col-span-2 flex justify-between pt-4">
                <button 
                    type='button' 
                    onClick={handlePrev} 
                    className={`${BUTTON_BASE_CLASSES} ${BACK_BUTTON_CLASSES}`} 
                    disabled={loading}
                >
                    <FaArrowLeft className='mr-2'/> Back to Schedule
                </button>
                <button 
                    type="submit" 
                    onClick={handleSubmitClick} 
                    disabled={isSubmissionDisabled} 
                    className={`${BUTTON_BASE_CLASSES} ${hasMissingFields && !loading ? INCOMPLETE_BUTTON_CLASSES : NEXT_SUBMIT_ACTIVE_CLASSES} ${loading ? 'bg-gray-400 cursor-not-allowed transform none' : ''}`}
                > 
                    {loading ? (
                        <><FaSpinner className="animate-spin mr-3" /> Submitting...</>
                    ) : (
                        'Confirm & Book Consultation'
                    )}
                </button>
            </div>
        </div>
    );
};

// --- Submission Success Message ---
const SubmissionSuccess = ({ form }) => (
    <div className="p-8 text-center bg-green-50 rounded-xl border-4 border-green-400">
        <FaCheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h4 className="text-2xl font-bold text-green-800">Booking Confirmed!</h4>
        <p className="text-gray-700 mt-2">
            Thank you for booking your personalized style consultation. Our team has received your request.
        </p>
        <div className="mt-4 p-4 bg-white rounded-lg inline-block text-left shadow-inner">
            <p className="text-sm font-semibold text-gray-800">Requested Appointment Details:</p>
            <p className="text-sm text-indigo-700">**Date:** {form.preferredDate} | **Time:** {form.preferredTime}</p>
            <p className="text-sm text-indigo-700">**Service:** {form.serviceType}</p>
        </div>
        <p className="text-sm text-gray-600 mt-4">
            We will review your detailed style profile and confirm the slot within **4 business hours** via email.
        </p>
    </div>
);

// --- Helper Components ---
const ValuePropCard = ({ icon: Icon, title, description, imageTag }) => (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition duration-300">
        <Icon className="w-8 h-8 text-indigo-600 mb-3" />
        <h4 className="font-bold text-xl text-gray-900 mb-2">{title}</h4>
        <p className="text-gray-600 text-sm">{description}</p>
        {imageTag && <p className="text-sm text-indigo-500 mt-3">{imageTag}</p>} 
    </div>
);


export default ConsultationBookingPage;