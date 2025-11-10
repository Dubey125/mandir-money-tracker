import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";
import Razorpay from "razorpay";
import { db } from "../firebase.js";

dotenv.config();
const app = express();
app.use(cors());

// capture raw body for signature verification
app.use(express.json({
  verify: (req, res, buf) => { req.rawBody = buf; }
}));

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const razorpay = (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET)
  ? new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET })
  : null;

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "mywebhooksecret";

// health route with Firestore check
app.get("/health", async (req, res) => {
  const env = {
    hasKey: Boolean(RAZORPAY_KEY_ID),
    hasSecret: Boolean(RAZORPAY_KEY_SECRET),
    webhookSecretSet: Boolean(WEBHOOK_SECRET),
  };
  let firestoreOk = false;
  let firestoreError = null;
  if (db) {
    try {
      await db.collection("__health").limit(1).get();
      firestoreOk = true;
    } catch (e) {
      firestoreOk = false;
      firestoreError = e?.message || String(e);
    }
  } else {
    firestoreError = "db-not-initialized";
  }
  return res.json({ ok: true, env, firestoreOk, firestoreError });
});

// create-order route
app.post("/create-order", async (req, res) => {
  try {
    const { donorName, amount } = req.body || {};
    console.log("/create-order", { donorName, amount, hasKeys: Boolean(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) });
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }
    if (!razorpay) {
      return res.status(503).json({ error: "Razorpay keys not configured on server" });
    }
    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
      notes: { donorName: donorName || "Anonymous" },
    };
    const order = await razorpay.orders.create(options).catch(err => {
      console.error("Razorpay order creation failed:", err?.message || err);
      throw err;
    });
    console.log("Order created", order.id, "amount", options.amount);
    return res.json({ orderId: order.id, amount: options.amount });
  } catch (err) {
    console.error("Create order error:", err?.message || err, err?.stack || "");
    return res.status(500).json({ error: "Order creation failed" });
  }
});

// Common webhook handler
async function handleRazorpayWebhook(req, res) {
  const signature = req.headers["x-razorpay-signature"];
  const shasum = crypto.createHmac("sha256", WEBHOOK_SECRET);
  shasum.update(req.rawBody);
  const digest = shasum.digest("hex");

  if (digest !== signature) {
    console.log("❌ Invalid signature");
    return res.status(400).json({ error: "Invalid signature" });
  }

  const event = req.body.event;
  try {
    if (event === "payment.captured" && db) {
      const payment = req.body.payload.payment.entity;
      console.log("✅ Payment Captured:", payment.id, payment.amount);
      // Save to Firestore using payment id as document id to ensure idempotency
      const amountRupees = Math.round(Number(payment.amount) / 100);
      const donorName = (payment.notes && (payment.notes.donorName || payment.notes.name)) || "Anonymous";
      try {
        const docRef = db.collection("donations").doc(payment.id);
        await docRef.set({
          name: donorName,
          amount: amountRupees,
          mode: payment.method || "upi",
          paymentId: payment.id,
          orderId: payment.order_id,
          status: payment.status,
          date: new Date().toISOString(),
        }, { merge: true });
      } catch (dbErr) {
        console.error("Failed to persist payment to Firestore (non-fatal):", dbErr?.message || dbErr);
      }
    }
  } catch (e) {
    console.error("Firestore save failed:", e);
  }

  return res.json({ status: "ok" });
}

// webhook routes (support both paths)
app.post("/razorpay-webhook", handleRazorpayWebhook);
app.post("/webhook", handleRazorpayWebhook);

// legacy payments router removed; webhook handled at /razorpay-webhook

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Allow network access for phone testing

app.get('/ping', (req,res)=>res.json({pong:true, time:new Date().toISOString()}));

const server = app.listen(PORT, HOST, () => {
  console.log(`✅ Server READY => http://${HOST}:${PORT}`);
  console.log('Env summary:', {
    RAZORPAY_KEY_ID: !!RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: !!RAZORPAY_KEY_SECRET,
    WEBHOOK_SECRET_SET: !!WEBHOOK_SECRET,
  });
  console.log('Test with: curl http://localhost:5000/ping');
});

server.on('error',(err)=>{
  console.error('❌ Server listen error:', err.message, err.code);
  process.exit(1);
});

server.on('listening', () => {
  console.log('✅ Listening event confirmed');
});
