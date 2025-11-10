import { useState } from "react";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Signup request: " + JSON.stringify(form));
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-r from-indigo-50 to-purple-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-indigo-600">
          Create Account
        </h2>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
          Signup
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account? <a href="/login" className="text-indigo-600 hover:underline">Login</a>
        </p>
      </form>
    </div>
  );
}
