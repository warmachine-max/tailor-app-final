import React from "react";
import currentTrendImg from "../blogPics/currentTrend.jpg";

const CurrentTrend = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-purple-900 mb-10 text-center">
        Current Trends
      </h1>
      <div className="flex flex-col md:flex-row items-center gap-6 bg-white shadow-lg rounded-xl p-6">
        <div className="flex-shrink-0 md:w-1/2">
          <img
            src={currentTrendImg}
            alt="Current Trends"
            className="w-full h-64 md:h-64 object-cover rounded-lg shadow-md hover:scale-105 transition-transform"
          />
        </div>
        <div className="md:w-1/2 space-y-4">
          <h2 className="text-2xl font-semibold text-purple-900">Latest Styles</h2>
          <p className="text-gray-700 text-lg">
            Stay updated with the hottest fashion trends of the season and see what’s in every wardrobe.
          </p>
          <p className="text-gray-700 text-lg">
            Tips on how to incorporate trending pieces while keeping your unique style.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CurrentTrend;
