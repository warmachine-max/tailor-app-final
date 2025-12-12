import React from "react";
import { Link } from "react-router-dom";

import banner from "./blogPics/banner.jpg"; // 800x400

import fashionTips from "./blogPics/fashionTips.jpg";
import currentTrend from "./blogPics/currentTrend.jpg";
import matchingIdeas from "./blogPics/matchingIdea.jpg";
import bridalFashion from "./blogPics/bridalFashion.jpg";
import mensWear from "./blogPics/mensWear.jpg";
import womensWear from "./blogPics/womensWear.jpg";

import kidsWear from "./blogPics/kidsWear.jpg";
import ethinicWear from "./blogPics/ethinicWear.jpg";

const Blog = () => {
  const categories = [
    { title: "Fashion Tips", image: fashionTips, link: "/blog/fashion-tips" },
    { title: "Current Trends", image: currentTrend, link: "/blog/current-trends" },
    { title: "Matching Ideas", image: matchingIdeas, link: "/blog/matching-ideas" },
    { title: "Bridal Fashion", image: bridalFashion, link: "/blog/bridal-fashion" },
    { title: "Men's Wear", image: mensWear, link: "/blog/mens-wear" },
    { title: "Women's Wear", image: womensWear, link: "/blog/womens-wear" },
    { title: "Kids Wear", image: kidsWear, link: "/blog/kids-wear" },
    { title: "Ethnic Wear", image: ethinicWear, link: "/blog/ethnic-wear" },
  ];

  return (
    <div className="bg-white">

      {/* ✅ Banner */}
      <div className="relative w-full h-[400px]">
        <img
          src={banner}
          alt="Blog Banner"
          className="w-full h-full object-cover"
        />
        <h1 className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-4xl font-bold bg-black/50 px-8 py-2 rounded-xl">
          Our Blog
        </h1>
      </div>

      {/* ✅ Category Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((cat, index) => (
          <Link
            to={cat.link}
            key={index}
            className="group relative h-60 rounded-2xl overflow-hidden shadow-lg"
          >
            <img
              src={cat.image}
              alt={cat.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />

            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 flex items-center justify-center transition">
              <h3 className="text-white text-xl font-semibold">
                {cat.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
};

export default Blog;
