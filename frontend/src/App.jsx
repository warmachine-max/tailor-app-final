import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"

import Kurta from "./collection/men/Kurta"
import Shirt from "./collection/men/Shirt"
import Suits from "./collection/men/Suits"

import Blouse from "./collection/women/Blouse"
import Saree from "./collection/women/Saree"
import Lehenga from "./collection/women/Lehenga"
import Salwar from "./collection/women/Salwar"
import Cart from "./homePageComponents/Cart"

import About from "./homePageComponents/navBarComponents/About"
import Blog from "./homePageComponents/navBarComponents/Blog"

import KidsWear from "./homePageComponents/navBarComponents/blogCategories/KidsWear"
import EthnicWear from "./homePageComponents/navBarComponents/blogCategories/EthnicWear"
import WomensWear from "./homePageComponents/navBarComponents/blogCategories/WomensWear"
import MensWear from "./homePageComponents/navBarComponents/blogCategories/MensWear"
import BridalFashion from "./homePageComponents/navBarComponents/blogCategories/BridalFashion"
import MatchingIdeas from "./homePageComponents/navBarComponents/blogCategories/MatchingIdeas"
import CurrentTrend from "./homePageComponents/navBarComponents/blogCategories/CurrentTrend"
import FashionTips from "./homePageComponents/navBarComponents/blogCategories/FashionTips"

import Contact from "./pages/Contact"

import CollectionWomen from "./pages/CollectionWomen"
import CollectionMen from "./pages/CollectionMen"

import SecurityPolicy from "./pages/PolicyComponents/SecurityPolicy"
import TermsOfUse from "./pages/PolicyComponents/TermsOfUse"
import CustomerCare from "./pages/PolicyComponents/CustomerCare"
import ShippingPolicy from "./pages/PolicyComponents/ShippingPolicy"
import ReturnPolicy from "./pages/PolicyComponents/ReturnPolicy"
import WorkOrderSteps from "./pages/PolicyComponents/WorkOrderSteps"

import ConsultationBookingPage from "./pages/ConsultationBookingPage"
import ConsultationBookingHistoryPage from "./pages/ConsultationBookingHistoryPage"

import AnalyticsDashboardTailwind from "../summa"

import { AuthProvider } from "./context/AuthContext"

function App() {
  return (
    <AuthProvider>
      <Routes>

        <Route path="/" element={<HomePage />} />
      
        {/* ---------------------- MEN ---------------------- */}
        <Route path="/men/kurtas" element={<Kurta />} />
        <Route path="/men/shirts" element={<Shirt />} />
        <Route path="/men/suits" element={<Suits />} />

        
        {/* ---------------------- WOMEN ---------------------- */}

        <Route path="/women/blouses" element={<Blouse />} />
        <Route path="/women/sarees" element={<Saree />} />
        <Route path="/women/lehengas" element={<Lehenga />} />
        <Route path="/women/salwars" element={<Salwar />} />

        {/* ---------------------- CART ---------------------- */}
        <Route path="/cart" element={<Cart />} />

        {/* ---------------------- OTHERS ---------------------- */}
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />

        {/* ---------------------- BLOG CATEGORIES ---------------------- */}
        <Route path="/blog/kids-wear" element={<KidsWear />} />
        <Route path="/blog/ethnic-wear" element={<EthnicWear />} />
        <Route path="/blog/womens-wear" element={<WomensWear />} />
        <Route path="/blog/mens-wear" element={<MensWear />} />
        <Route path="/blog/bridal-fashion" element={<BridalFashion />} />
        <Route path="/blog/matching-ideas" element={<MatchingIdeas />} />
        <Route path="/blog/current-trends" element={<CurrentTrend />} />
        <Route path="/blog/fashion-tips" element={<FashionTips />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/collection/women" element={<CollectionWomen />} />
        <Route path="/collection/men" element={<CollectionMen />} />

        <Route path="/security-policy" element={<SecurityPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="/customer-care" element={<CustomerCare />} />
        <Route path="/shipping-policy" element ={<ShippingPolicy />} />
        <Route path="/return-policy" element={<ReturnPolicy />} />
        <Route path="/work-order-steps" element={<WorkOrderSteps />} />

        <Route path="/consultation-booking" element={<ConsultationBookingPage />} />
        <Route path="/admin/consultations/history" element={<ConsultationBookingHistoryPage />} />

        {/* summa */}
        <Route path="/analytics" element={<AnalyticsDashboardTailwind />} />

      </Routes>
    </AuthProvider>
  )
}

export default App
