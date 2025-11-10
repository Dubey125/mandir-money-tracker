// src/pages/PublicDashboard.jsx
import { useMemo, useState } from "react";
import { useAppData } from "../context/AppContext";
import DonateModal from "../components/DonateModal";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function monthLabel(key) {
  const [y, m] = key.split("-");
  const mm = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${mm[+m - 1]} ${y}`;
}

export default function PublicDashboard() {
  const { donations, expenses } = useAppData();
  const [showDonate, setShowDonate] = useState(false);

  // totals
  const totalCollected = useMemo(
    () => donations.reduce((s, d) => s + Number(d.amount || 0), 0),
    [donations]
  );
  const totalExpenses = useMemo(
    () => expenses.reduce((s, e) => s + Number(e.amount || 0), 0),
    [expenses]
  );
  const balance = totalCollected - totalExpenses;

  // this month total
  const thisMonthCollected = useMemo(() => {
    const now = new Date();
    return donations
      .filter((d) => {
        const dt = new Date(d.date);
        return (
          dt.getFullYear() === now.getFullYear() &&
          dt.getMonth() === now.getMonth()
        );
      })
      .reduce((s, d) => s + Number(d.amount || 0), 0);
  }, [donations]);

  // prepare monthly chart data
  const grouped = useMemo(() => {
    const map = {};
    donations.forEach((d) => {
      const dt = new Date(d.date);
      const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2,"0")}`;
      map[key] = map[key] || { month: key, collected: 0, spent: 0 };
      map[key].collected += Number(d.amount || 0);
    });
    expenses.forEach((e) => {
      const dt = new Date(e.date);
      const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2,"0")}`;
      map[key] = map[key] || { month: key, collected: 0, spent: 0 };
      map[key].spent += Number(e.amount || 0);
    });
    const arr = Object.values(map).sort((a, b) => a.month.localeCompare(b.month));
    return arr.map((x) => ({ ...x, label: monthLabel(x.month) }));
  }, [donations, expenses]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-indigo-700">
            🙏 Welcome to Mandir Transparency
          </h1>
          <p className="mt-2 text-gray-600 max-w-xl">
            Transparent tracking of donations and expenses. See where funds go
            and donate securely.
          </p>
        </div>

        <div className="flex flex-col items-end gap-3">
          <button
            onClick={() => setShowDonate(true)}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg shadow"
          >
            Donate Now
          </button>
          <div className="text-sm text-gray-500">This is public view</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow">
          <div className="text-sm text-gray-500">This month</div>
          <div className="text-xl font-bold text-green-600">
            ₹{thisMonthCollected}
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow">
          <div className="text-sm text-gray-500">Total collected</div>
          <div className="text-xl font-bold text-indigo-700">
            ₹{totalCollected}
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow">
          <div className="text-sm text-gray-500">Total spent</div>
          <div className="text-xl font-bold text-red-600">₹{totalExpenses}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow">
          <div className="text-sm text-gray-500">Balance</div>
          <div className="text-xl font-bold text-emerald-600">₹{balance}</div>
        </div>
      </div>

  {/* Chart + Latest */}
  <div className="grid lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Monthly trend</h3>
            <div className="text-xs text-gray-500">collection vs spent</div>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={grouped}>
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="collected" name="Collected" fill="#4f46e5" />
                <Bar dataKey="spent" name="Spent" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

  {/* Latest donations */}
  <div className="bg-white p-4 rounded-2xl shadow">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Latest donations</h3>
            <div className="text-xs text-gray-500">{donations.length} total</div>
          </div>
          <ul className="divide-y">
            {donations.slice(0, 6).map((d) => (
              <li
                key={d.id}
                className="py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center"
              >
                <div className="flex flex-col">
                  <div className="font-medium">{d.donorName || "Anonymous"}</div>
                  <div className="text-xs text-gray-500">
                    Txn ID: {d.txnId || "N/A"} • {d.mode || "UPI/QR"}<br />
                    {new Date(d.date).toLocaleString()}
                  </div>
                </div>
                <div className="font-semibold text-green-600 mt-2 sm:mt-0">
                  ₹{d.amount}
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* Latest expenses (public view) */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Latest expenses</h3>
            <div className="text-xs text-gray-500">{expenses.length} total</div>
          </div>
          <ul className="divide-y">
            {[...expenses]
              .sort((a,b) => new Date(b.date) - new Date(a.date))
              .slice(0,6)
              .map((e) => (
              <li key={e.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {e.image ? (
                    <img src={e.image} alt="exp" className="h-10 w-10 rounded object-cover" />
                  ) : (
                    <div className="h-10 w-10 rounded bg-red-100 text-red-600 flex items-center justify-center text-sm">₹</div>
                  )}
                  <div>
                    <div className="font-medium">{e.purpose}</div>
                    <div className="text-xs text-gray-500">{new Date(e.date).toLocaleString()}</div>
                  </div>
                </div>
                <div className="font-semibold text-red-600">₹{e.amount}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <DonateModal
        open={showDonate}
        onClose={() => setShowDonate(false)}
        upiId={"mandir@upi"}
        cashInfo={{
          address: "Temple Rd, Village",
          contactName: "Mandir Committee",
          contactPhone: "9876543210",
        }}
      />
    </div>
  );
}
