import React from "react";
import matchingIdeasImg from "../blogPics/matchingIdea.jpg";

const MatchingIdeas = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-purple-900 mb-10 text-center">
        Matching Ideas
      </h1>
      <div className="flex flex-col md:flex-row items-center gap-6 bg-white shadow-lg rounded-xl p-6">
        <div className="flex-shrink-0 md:w-1/2">
          <img
            src={matchingIdeasImg}
            alt="Matching Ideas"
            className="w-full h-64 md:h-64 object-cover rounded-lg shadow-md hover:scale-105 transition-transform"
          />
        </div>
        <div className="md:w-1/2 space-y-4">
          <h2 className="text-2xl font-semibold text-purple-900">Perfect Combos</h2>
          <p className="text-gray-700 text-lg">
            Learn how to pair outfits, colors, and accessories for a flawless look.
          </p>
          <p className="text-gray-700 text-lg">
            Step-by-step ideas for matching clothes for every occasion.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MatchingIdeas;
