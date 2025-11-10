// src/context/AppContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";

// Create context
const AppContext = createContext();

// Provider component
export function AppProvider({ children }) {
  const [donations, setDonations] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [useCloud, setUseCloud] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Totals
  const totalCollected = donations.reduce((sum, d) => sum + Number(d.amount), 0);
  const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const balanceLeft = totalCollected - totalSpent;

  // Function to add donation
  const addDonation = async (donation) => {
    const data = { ...donation, date: donation.date || new Date() };
    // Optimistically show in UI for this session
    setDonations((prev) => [...prev, data]);
    // Donation persistence now happens server-side via webhook (to avoid duplicates and ensure verification).
    // No client Firestore write here by design.
  };

  // Function to add expense (optional)
  const addExpense = async (expense) => {
    const withMeta = {
      id: expense.id || `${Date.now()}_${Math.random().toString(36).slice(2,8)}`,
      ...expense,
      amount: Number(expense.amount || 0),
      date: expense.date || new Date(),
    };
    setExpenses((prev) => [...prev, withMeta]);
    try {
      if (useCloud && db) {
        await addDoc(collection(db, "expenses"), {
          ...withMeta,
          date: new Date(withMeta.date).toISOString(),
        });
      }
    } catch (e) {
      console.warn("Firestore addExpense failed, kept locally", e);
    }
  };

  // Function to add notification
  const addNotification = async (message) => {
    const notification = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2,8)}`,
      message,
      date: new Date(),
      read: false,
    };
    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);
    
    try {
      if (useCloud && db) {
        await addDoc(collection(db, "notifications"), {
          ...notification,
          date: notification.date.toISOString(),
        });
      }
    } catch (e) {
      console.warn("Firestore addNotification failed, kept locally", e);
    }
  };

  // Function to mark notifications as read
  const markNotificationsAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
    setUnreadCount(0);
  };

  // Load from Firestore live if possible; fallback to localStorage
  useEffect(() => {
    let unsubDon = null;
    let unsubExp = null;
    let unsubNot = null;
    try {
      // If db is configured, hook real-time listeners
      if (db) {
        const qd = query(collection(db, "donations"), orderBy("date", "desc"));
        const qe = query(collection(db, "expenses"), orderBy("date", "desc"));
        const qn = query(collection(db, "notifications"), orderBy("date", "desc"));
        
        unsubDon = onSnapshot(qd, (snap) => {
          const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          // normalize date back to Date
          arr.forEach((x) => (x.date = x.date ? new Date(x.date) : new Date()));
          setDonations(arr);
          setUseCloud(true);
        });
        unsubExp = onSnapshot(qe, (snap) => {
          const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          arr.forEach((x) => (x.date = x.date ? new Date(x.date) : new Date()));
          setExpenses(arr);
          setUseCloud(true);
        });
        unsubNot = onSnapshot(qn, (snap) => {
          const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          arr.forEach((x) => (x.date = x.date ? new Date(x.date) : new Date()));
          setNotifications(arr);
          setUnreadCount(arr.filter((n) => !n.read).length);
          setUseCloud(true);
        });
        return () => {
          unsubDon && unsubDon();
          unsubExp && unsubExp();
          unsubNot && unsubNot();
        };
      }
    } catch (e) {
      console.warn("Firestore listeners unavailable, using localStorage", e);
    }

    // fallback to localStorage
    const savedDonations = JSON.parse(localStorage.getItem("donations") || "[]");
    const savedExpenses = JSON.parse(localStorage.getItem("expenses") || "[]");
    const savedNotifications = JSON.parse(localStorage.getItem("notifications") || "[]");
    savedNotifications.forEach((x) => (x.date = x.date ? new Date(x.date) : new Date()));
    setDonations(savedDonations);
    setExpenses(savedExpenses);
    setNotifications(savedNotifications);
    setUnreadCount(savedNotifications.filter((n) => !n.read).length);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("donations", JSON.stringify(donations));
  }, [donations]);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  return (
    <AppContext.Provider
      value={{
        donations,
        expenses,
        totalCollected,
        totalSpent,
        balanceLeft,
        addDonation,
        addExpense,
        notifications,
        unreadCount,
        addNotification,
        markNotificationsAsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Custom hook for easier use
export const useAppData = () => useContext(AppContext);
