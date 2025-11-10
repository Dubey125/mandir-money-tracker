import { useState } from "react";
import { useAppData } from "../context/AppContext";

export default function AdminDashboard() {
  const { donations, expenses, addExpense, addNotification } = useAppData();
  const [form, setForm] = useState({ purpose: "", description: "", amount: "", imageFile: null, imagePreview: "" });
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationSent, setNotificationSent] = useState(false);

  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const balance = totalDonations - totalExpenses;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.purpose || !form.amount) return;

    // read image as base64 if provided
    const readAsDataURL = (file) => new Promise((resolve) => {
      if (!file) return resolve("");
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });

    const imageDataUrl = await readAsDataURL(form.imageFile);

    addExpense({
      purpose: form.purpose,
      description: form.description || "",
      amount: Number(form.amount),
      image: imageDataUrl,
    });

    setForm({ purpose: "", description: "", amount: "", imageFile: null, imagePreview: "" });
  };

  const handleSendNotification = (e) => {
    e.preventDefault();
    if (!notificationMessage.trim()) return;
    
    addNotification(notificationMessage);
    setNotificationMessage("");
    setNotificationSent(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => setNotificationSent(false), 3000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-indigo-600">⚙️ Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-100 p-4 rounded-lg">
          <p className="text-lg font-semibold">Total Donations</p>
          <p className="text-2xl font-bold text-green-700">₹{totalDonations}</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg">
          <p className="text-lg font-semibold">Total Expenses</p>
          <p className="text-2xl font-bold text-red-700">₹{totalExpenses}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded-lg">
          <p className="text-lg font-semibold">Balance</p>
          <p className="text-2xl font-bold text-blue-700">₹{balance}</p>
        </div>
      </div>

      {/* Send Notification Form */}
      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 shadow-lg p-5 rounded-lg border-2 border-orange-200">
        <h2 className="text-xl font-semibold text-orange-700 mb-3 flex items-center gap-2">
          🔔 Send Notification to All Users
        </h2>
        <form onSubmit={handleSendNotification} className="space-y-4">
          <textarea
            placeholder="Enter notification message..."
            value={notificationMessage}
            onChange={(e) => setNotificationMessage(e.target.value)}
            className="w-full border-2 border-orange-200 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-400"
            rows={3}
            required
          />
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 font-semibold shadow-md"
            >
              Send Notification
            </button>
            {notificationSent && (
              <span className="text-green-600 font-semibold flex items-center gap-1">
                ✓ Notification sent successfully!
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Add Expense Form */}
      <div className="bg-white shadow p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-indigo-600 mb-3">Add New Expense</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Purpose"
            value={form.purpose}
            onChange={(e) => setForm({ ...form, purpose: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
          <textarea
            placeholder="Description (what was purchased)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border rounded px-3 py-2"
            rows={3}
          />
          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
          <div>
            <label className="text-sm text-gray-600">Upload image (bill/item)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setForm((f) => ({ ...f, imageFile: file }));
                if (file) {
                  const r = new FileReader();
                  r.onloadend = () => setForm((f) => ({ ...f, imagePreview: r.result }));
                  r.readAsDataURL(file);
                } else {
                  setForm((f) => ({ ...f, imagePreview: "" }));
                }
              }}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {form.imagePreview && (
            <div className="mt-2">
              <img src={form.imagePreview} alt="preview" className="h-24 rounded border" />
            </div>
          )}
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Add Expense
          </button>
        </form>
      </div>

      {/* Admin Expense List */}
      <div className="bg-white shadow p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-indigo-600 mb-3">All Expenses</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Purpose</th>
              <th className="p-2 text-right">Amount</th>
              <th className="p-2 text-left">Image</th>
              <th className="p-2 text-right">Date</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e.id} className="border-t">
                <td className="p-2">{e.purpose}</td>
                <td className="p-2 text-right text-red-600">₹{e.amount}</td>
                <td className="p-2">
                  {e.image ? <img src={e.image} alt="expense" className="h-12 w-12 object-cover rounded" /> : "-"}
                </td>
                <td className="p-2 text-right text-sm text-gray-500">
                  {new Date(e.date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
