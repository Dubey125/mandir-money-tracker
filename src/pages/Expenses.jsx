import { useState } from "react";
import { useAppData } from "../context/AppContext";

export default function Expenses() {
  const { expenses } = useAppData();
  const [filter, setFilter] = useState("all");

  // newest first
  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

  const now = new Date();
  const filteredExpenses = sortedExpenses.filter((e) => {
    const d = new Date(e.date);
    if (filter === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      return d >= weekAgo;
    }
    if (filter === "month") {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }
    if (filter === "year") {
      return d.getFullYear() === now.getFullYear();
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-red-600">💸 Expenses</h1>

      {/* Filters */}
      <div className="flex gap-3">
        {["week", "month", "year", "all"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded ${filter===f ? "bg-red-600 text-white":"bg-gray-200"}`}
          >
            {f === "week" ? "This Week" : f === "month" ? "This Month" : f === "year" ? "This Year" : "All"}
          </button>
        ))}
      </div>

      {/* Expense Table */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-lg font-semibold text-red-600 mb-3">Expense History</h2>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">Purpose</th>
              <th className="text-left p-3">Description</th>
              <th className="text-right p-3">Amount</th>
              <th className="text-left p-3">Image</th>
              <th className="text-right p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.length ? (
              filteredExpenses.map((e) => (
                <tr key={e.id} className="border-t">
                  <td className="p-3">{e.purpose}</td>
                  <td className="p-3 text-sm text-gray-600 max-w-sm">{e.description || "-"}</td>
                  <td className="p-3 text-right font-semibold text-red-600">₹{e.amount}</td>
                  <td className="p-3">{e.image ? <img src={e.image} alt="expense" className="h-12 w-12 object-cover rounded" /> : "-"}</td>
                  <td className="p-3 text-right text-sm text-gray-500">{new Date(e.date).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">No expenses found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
