import React from "react";
import womensWearImg from "../blogPics/womensWear.jpg";

const WomensWear = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-purple-900 mb-10 text-center">
        Women’s Wear
      </h1>
      <div className="flex flex-col md:flex-row items-center gap-6 bg-white shadow-lg rounded-xl p-6">
        <div className="flex-shrink-0 md:w-1/2">
          <img
            src={womensWearImg}
            alt="Women's Wear"
            className="w-full h-64 md:h-64 object-cover rounded-lg shadow-md hover:scale-105 transition-transform"
          />
        </div>
        <div className="md:w-1/2 space-y-4">
          <h2 className="text-2xl font-semibold text-purple-900">Latest Trends</h2>
          <p className="text-gray-700 text-lg">
            Fashion inspiration for women – casuals, office, and party outfits.
          </p>
          <p className="text-gray-700 text-lg">
            Ideas for mixing colors, accessories, and statement pieces.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WomensWear;
