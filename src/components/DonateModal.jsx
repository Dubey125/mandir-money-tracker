// src/components/DonateModal.jsx
import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useAppData } from "../context/AppContext";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function DonateModal({ open, onClose, upiId = "8957513334@ptaxis", cashInfo = {} }) {
  const { addDonation } = useAppData();
  const [tab, setTab] = useState("upi");
  const [form, setForm] = useState({ name: "", amount: "", message: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) setForm({ name: "", amount: "", message: "" });
  }, [open]);

  if (!open) return null;

  const startRazorpayPayment = async () => {
    if (!form.amount || Number(form.amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donorName: form.name || "Anonymous", amount: Number(form.amount) }),
      });

      if (!res.ok) throw new Error("Backend error");
      const data = await res.json();
      if (!data.orderId) throw new Error("Order creation failed");

      if (!window.Razorpay) {
        alert("❌ Razorpay SDK not loaded. Please refresh the page.");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: Number(form.amount) * 100,
        currency: "INR",
        name: "Mandir Donation",
        description: form.message || "Donation",
        order_id: data.orderId,
        prefill: { name: form.name || "Anonymous" },
        theme: { color: "#4f46e5" },
        handler: function (response) {
          addDonation({
            name: form.name || "Anonymous",
            amount: Number(form.amount),
            mode: tab,
            date: new Date(),
            paymentId: response.razorpay_payment_id,
            message: form.message,
          });
          alert("✅ Payment successful!");
          onClose?.();
        },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("❌ Payment failed. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const handleCashPledge = () => {
    if (!form.amount || Number(form.amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    addDonation({
      name: form.name || "Anonymous",
      amount: Number(form.amount),
      mode: "cash",
      date: new Date(),
      message: form.message,
    });

    alert("🙏 Cash/In-kind pledge noted. Committee will contact you.");
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">🙏 Donate to Mandir</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">✕</button>
        </div>

        {/* Body */}
        <div className="p-4 md:p-6 grid md:grid-cols-3 gap-4">
          {/* Tabs */}
          <div className="md:col-span-1 space-y-3">
            <button
              className={`w-full text-left p-3 rounded ${tab === "upi" ? "bg-indigo-50 border" : "hover:bg-gray-50"}`}
              onClick={() => setTab("upi")}
            >UPI / QR (via Razorpay)</button>
            <button
              className={`w-full text-left p-3 rounded ${tab === "card" ? "bg-indigo-50 border" : "hover:bg-gray-50"}`}
              onClick={() => setTab("card")}
            >Card / Netbanking</button>
            <button
              className={`w-full text-left p-3 rounded ${tab === "cash" ? "bg-indigo-50 border" : "hover:bg-gray-50"}`}
              onClick={() => setTab("cash")}
            >Cash / In-kind</button>
          </div>

          {/* Content */}
          <div className="md:col-span-2 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name (optional)"
                className="border p-2 rounded"
              />
              <input
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                type="number"
                min="0"
                placeholder="Amount (₹)"
                className="border p-2 rounded"
              />
            </div>

            {/* Tab Contents */}
            {tab === "upi" && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">Pay securely via UPI apps. You will be redirected to Razorpay.</p>
                <div className="flex justify-center p-4">
                  <QRCodeCanvas
                    value={`upi://pay?pa=${upiId}&pn=Mandir&am=${form.amount || ""}&cu=INR`}
                    size={160} bgColor="#ffffff" fgColor="#111827" includeMargin={true}
                  />
                </div>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Message (optional)"
                  className="w-full border p-2 rounded"
                />
                <div className="flex justify-end space-x-3">
                  <button onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
                  <button
                    disabled={!form.amount || loading}
                    onClick={startRazorpayPayment}
                    className="px-4 py-2 rounded bg-indigo-600 text-white disabled:opacity-50"
                  >{loading ? "Processing..." : "Pay via Razorpay"}</button>
                </div>
              </div>
            )}

            {tab === "card" && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">Pay by Card / Netbanking via Razorpay secure checkout.</p>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Message (optional)"
                  className="w-full border p-2 rounded"
                />
                <div className="flex justify-end space-x-3">
                  <button onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
                  <button
                    disabled={!form.amount || loading}
                    onClick={startRazorpayPayment}
                    className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-50"
                  >{loading ? "Processing..." : `Pay ₹${form.amount}`}</button>
                </div>
              </div>
            )}

            {tab === "cash" && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Donate cash or goods. Committee will contact you to arrange pickup/drop-off.
                </p>
                <div className="p-3 border rounded">
                  <div className="font-semibold">{cashInfo.contactName || "Mandir Committee"}</div>
                  <div className="text-sm">{cashInfo.address || "Mandir Address"}</div>
                  <div className="text-sm">
                    Phone: <a className="text-indigo-600" href={`tel:${cashInfo.contactPhone || ""}`}>{cashInfo.contactPhone || "N/A"}</a>
                  </div>
                  {cashInfo.note && <div className="text-xs text-gray-500 mt-2">{cashInfo.note}</div>}
                </div>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Mention items, preferred pickup date/time or instructions"
                  className="w-full border p-2 rounded"
                />
                <div className="flex justify-end space-x-3">
                  <button onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
                  <button
                    disabled={loading}
                    onClick={handleCashPledge}
                    className="px-4 py-2 rounded bg-yellow-600 text-white"
                  >{loading ? "Saving..." : "Pledge Cash / Items"}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
