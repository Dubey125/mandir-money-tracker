import React, { useState } from "react";
import { useAppData } from "../context/AppContext";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function Donations() {
  const { addDonation } = useAppData();
  const [username, setUsername] = useState("");
  const [amount, setAmount] = useState("");
  const [success, setSuccess] = useState(null);
  const [loadingMode, setLoadingMode] = useState(null); // 'upi-app' | 'qr' | null
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Check if Razorpay SDK is loaded
  React.useEffect(() => {
    const checkRazorpay = () => {
      if (window.Razorpay) {
        setRazorpayLoaded(true);
      } else {
        // Retry after 2 seconds if not loaded
        setTimeout(checkRazorpay, 2000);
      }
    };
    checkRazorpay();
  }, []);

  const quickAmounts = [101, 501, 1001, 2100];
  const canProceed = username && amount && Number(amount) > 0;

  const startRazorpayPayment = async (mode) => {
    if (!canProceed) {
      alert("Please enter a valid name and amount");
      return;
    }
    
    // Check Razorpay SDK first
    if (!window.Razorpay) {
      alert("❌ Payment SDK not loaded.\n\nRazorpay script failed to load from internet.\nPlease check your internet connection and refresh the page.");
      return;
    }
    
    try {
      setLoadingMode(mode);
      const res = await fetch(`${API_BASE}/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donorName: username || "Anonymous", amount: Number(amount) }),
      });
      if (!res.ok) {
        let bodyText = await res.text().catch(() => "");
        throw new Error(`Backend error ${res.status} ${bodyText}`);
      }
      const data = await res.json();
      if (!data.orderId) throw new Error("Order creation failed");
      const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!key) {
        alert("Razorpay Key ID is not set (VITE_RAZORPAY_KEY_ID). Please configure your frontend .env.");
        return;
      }

      // Razorpay options - simplified to show all payment methods
      const options = {
        key,
        amount: Number(amount) * 100,
        currency: "INR",
        name: "Vishwanath Mandir",
        description: "Donation",
        order_id: data.orderId,
        prefill: { name: username || "Anonymous" },
        theme: { color: "#4f46e5" },
        handler: function (response) {
          addDonation({
            name: username || "Anonymous",
            amount: Number(amount),
            mode: mode,
            date: new Date(),
            paymentId: response.razorpay_payment_id,
          });
          setSuccess({ name: username || "Anonymous", amount: Number(amount) });
        },
        modal: {
          ondismiss: function () {
            // user closed without paying - do nothing
          },
        },
      };

      new window.Razorpay(options).open();
    } catch (e) {
      console.error("startRazorpayPayment error:", e);
      const networkHint = navigator.onLine ? "Backend unreachable or crashed" : "Browser offline";
      const hint = `Check backend at ${API_BASE} (/ping, /health) is running and env keys are set.`;
      alert(`Payment could not start.\n\nError: ${e?.message || e}\n${networkHint}\n${hint}`);
    } finally {
      setLoadingMode(null);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 md:p-5 text-white text-center">
          <h2 className="text-xl md:text-2xl font-bold">Mandir Donation</h2>
        </div>

        <div className="p-4 md:p-6 space-y-4">
          {/* Razorpay SDK status */}
          {!razorpayLoaded && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-3 md:p-4">
              <div className="font-semibold text-sm md:text-base">⏳ Loading Payment System...</div>
              <div className="text-xs md:text-sm">Connecting to Razorpay. Please wait or check your internet connection.</div>
            </div>
          )}

          {/* Success banner (no instructions) */}
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 md:p-4">
              <div className="font-semibold text-sm md:text-base">Donation Successful</div>
              <div className="text-xs md:text-sm">Thank you, {success.name}! You donated ₹{success.amount}.</div>
            </div>
          )}

          {/* Form */}
          <div>
            <label className="block font-medium mb-1 text-sm md:text-base">Your Name</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your full name"
              className="w-full p-2 md:p-3 border rounded-xl mb-3 md:mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm md:text-base"
            />

            <label className="block font-medium mb-1 text-sm md:text-base">Enter Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter donation amount"
              className="w-full p-2 md:p-3 border rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm md:text-base"
            />

            <div className="flex gap-2 md:gap-3 mb-4 md:mb-5 flex-wrap">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt)}
                  className="px-3 md:px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 text-sm md:text-base"
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            {/* Primary actions */}
            <div className="space-y-3">
              <button
                onClick={() => startRazorpayPayment("upi-app")}
                disabled={!canProceed || !!loadingMode || !razorpayLoaded}
                className={`w-full px-4 md:px-5 py-3 rounded-xl text-white text-sm md:text-base ${
                  !canProceed || !!loadingMode || !razorpayLoaded ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {loadingMode === "upi-app" ? "Starting..." : !razorpayLoaded ? "Payment System Loading..." : "Pay with UPI App"}
              </button>

              <button
                onClick={() => startRazorpayPayment("qr")}
                disabled={!canProceed || !!loadingMode || !razorpayLoaded}
                className={`w-full px-4 md:px-5 py-3 rounded-xl text-white text-sm md:text-base ${
                  !canProceed || !!loadingMode || !razorpayLoaded ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {loadingMode === "qr" ? "Starting..." : !razorpayLoaded ? "Payment System Loading..." : "Pay on Scanner (UPI QR)"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
