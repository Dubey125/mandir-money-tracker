import { useMemo } from "react";
import { useAppData } from "../context/AppContext";

export default function RecentDonations() {
  const { donations } = useAppData();

  const recent = useMemo(() => (
    [...donations]
      .sort((a,b) => new Date(b.date) - new Date(a.date))
      .slice(0, 20)
  ), [donations]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🆕 Recent Donations</h1>
      <div className="bg-white rounded-2xl shadow">
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
            {recent.length ? recent.map((d, idx) => (
              <tr key={idx} className="border-t">
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
    </div>
  );
}
