import React from "react";
import bridalFashionImg from "../blogPics/bridalFashion.jpg";

const BridalFashion = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-purple-900 mb-10 text-center">
        Bridal Fashion
      </h1>
      <div className="flex flex-col md:flex-row items-center gap-6 bg-white shadow-lg rounded-xl p-6">
        <div className="flex-shrink-0 md:w-1/2">
          <img
            src={bridalFashionImg}
            alt="Bridal Fashion"
            className="w-full h-64 md:h-64 object-cover rounded-lg shadow-md hover:scale-105 transition-transform"
          />
        </div>
        <div className="md:w-1/2 space-y-4">
          <h2 className="text-2xl font-semibold text-purple-900">Wedding Styles</h2>
          <p className="text-gray-700 text-lg">
            Explore stunning bridal outfits, lehengas, sarees, and wedding styling tips.
          </p>
          <p className="text-gray-700 text-lg">
            Ideas for brides, bridesmaids, and even the groom’s wardrobe.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BridalFashion;
