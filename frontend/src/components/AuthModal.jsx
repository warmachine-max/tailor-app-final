import React from "react";
import Login from "../pages/authPages/Login";
import Signup from "../pages/authPages/Signup";

export default function AuthModal({ type, close }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-96 relative shadow-2xl">
        <button
          className="absolute top-3 right-3 text-xl font-bold"
          onClick={close}
        >
          ✖
        </button>

        {type === "login" && <Login closeModal={close} />}
        {type === "signup" && <Signup closeModal={close} />}
      </div>
    </div>
  );
}
