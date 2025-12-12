import React from "react";
import kidsWearImg from "../blogPics/kidsWear.jpg";

const KidsWear = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-purple-900 mb-10 text-center">
        Kids Wear Trends
      </h1>

      {/* Card-style layout */}
      <div className="flex flex-col md:flex-row items-center gap-8 bg-white shadow-lg rounded-xl p-6 md:p-15">
        {/* Image on left */}
        <div className="flex-shrink-0 md:w-1/2">
          <img
            src={kidsWearImg}
            alt="Kids Wear"
            className="w-full h-64 md:h-80 object-cover rounded-lg shadow-md hover:scale-105 transition-transform"
          />
        </div>

        {/* Text on right */}
        <div className="md:w-1/2 space-y-4">
          <h2 className="text-2xl font-semibold text-purple-900">
            Stylish & Comfortable Outfits
          </h2>
          <p className="text-gray-700 text-lg">
            Discover the latest trends in kids’ fashion! From playful casuals to
            cute party outfits, we have ideas and tips for every little trendsetter.
          </p>
          <p className="text-gray-700 text-lg">
            Explore seasonal collections, matching outfits, and creative styling
            ideas that make your kids look stylish while keeping comfort in mind.
          </p>
          <p className="text-gray-700 text-lg">
            Discover the latest trends in kids’ fashion! From playful casuals to
            cute party outfits, we have ideas and tips for every little trendsetter.
          </p>
        </div>
      </div>

      {/* Optional: extra section for smaller articles */}
      <div className="mt-12 grid md:grid-cols-2 gap-8">
        <div className="bg-purple-50 p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <h3 className="text-xl font-semibold mb-2">Casual Everyday Wear</h3>
          <p className="text-gray-700">
            Comfortable clothing for school, playdates, and family outings.
          </p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <h3 className="text-xl font-semibold mb-2">Festive & Party Wear</h3>
          <p className="text-gray-700">
            Dress up your little ones with trendy outfits for weddings, birthdays, and celebrations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default KidsWear;
