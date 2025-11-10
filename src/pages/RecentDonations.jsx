import { useMemo, useState } from "react";
import { useAppData } from "../context/AppContext";

export default function RecentDonations() {
  const { donations } = useAppData();
  const [filter, setFilter] = useState("all");

  const filteredDonations = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisYearStart = new Date(now.getFullYear(), 0, 1);

    let filtered = [...donations];

    switch (filter) {
      case "today":
        filtered = filtered.filter(d => new Date(d.date) >= today);
        break;
      case "yesterday":
        filtered = filtered.filter(d => {
          const date = new Date(d.date);
          return date >= yesterday && date < today;
        });
        break;
      case "highest":
        filtered = filtered.sort((a, b) => b.amount - a.amount);
        break;
      case "thisMonth":
        filtered = filtered.filter(d => new Date(d.date) >= thisMonthStart);
        break;
      case "thisYear":
        filtered = filtered.filter(d => new Date(d.date) >= thisYearStart);
        break;
      default:
        break;
    }

    // Sort by date (newest first) except for "highest" filter
    if (filter !== "highest") {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return filtered.slice(0, 20);
  }, [donations, filter]);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-4">🆕 Recent Donations</h1>
      
      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 md:px-4 py-2 rounded-lg text-sm md:text-base ${
            filter === "all" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("today")}
          className={`px-3 md:px-4 py-2 rounded-lg text-sm md:text-base ${
            filter === "today" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Today
        </button>
        <button
          onClick={() => setFilter("yesterday")}
          className={`px-3 md:px-4 py-2 rounded-lg text-sm md:text-base ${
            filter === "yesterday" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Yesterday
        </button>
        <button
          onClick={() => setFilter("highest")}
          className={`px-3 md:px-4 py-2 rounded-lg text-sm md:text-base ${
            filter === "highest" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Highest
        </button>
        <button
          onClick={() => setFilter("thisMonth")}
          className={`px-3 md:px-4 py-2 rounded-lg text-sm md:text-base ${
            filter === "thisMonth" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          This Month
        </button>
        <button
          onClick={() => setFilter("thisYear")}
          className={`px-3 md:px-4 py-2 rounded-lg text-sm md:text-base ${
            filter === "thisYear" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          This Year
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-right p-3">Amount</th>
              <th className="text-left p-3">Mode</th>
              <th className="text-left p-3">Txn ID</th>
              <th className="text-right p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredDonations.length ? filteredDonations.map((d, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                <td className="p-3">{d.name || d.donorName || "Anonymous"}</td>
                <td className="p-3 text-right text-green-600 font-semibold">₹{d.amount}</td>
                <td className="p-3">{d.mode || "UPI/QR"}</td>
                <td className="p-3 text-sm text-gray-600">{d.paymentId || d.txnId || "-"}</td>
                <td className="p-3 text-right text-sm text-gray-500">{new Date(d.date).toLocaleString()}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">No donations found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {filteredDonations.length ? filteredDonations.map((d, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="font-semibold text-gray-800">{d.name || d.donorName || "Anonymous"}</div>
              <div className="text-lg font-bold text-green-600">₹{d.amount}</div>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <div><span className="font-medium">Mode:</span> {d.mode || "UPI/QR"}</div>
              <div><span className="font-medium">Txn ID:</span> {d.paymentId || d.txnId || "-"}</div>
              <div><span className="font-medium">Date:</span> {new Date(d.date).toLocaleString()}</div>
            </div>
          </div>
        )) : (
          <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
            No donations found
          </div>
        )}
      </div>
    </div>
  );
}
