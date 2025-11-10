// src/pages/Home.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppData } from "../context/AppContext";

export default function Home() {
  const {
    donations,
    expenses,
    totalCollected,
    totalSpent,
    balanceLeft
  } = useAppData();

  const navigate = useNavigate();
  // load all images from assets folder (vite) and use as carousel (exclude svg or very small images)
  const imported = import.meta.glob('../assets/*.{jpg,jpeg,png}', { eager: true });
  const urls = useMemo(() => (
    Object.values(imported)
      .map((m) => (m && m.default) || m)
      .filter((src) => typeof src === 'string')
  ), []);

  const [images, setImages] = useState([]);
  const [active, setActive] = useState(0);

  // Preload and filter out very small images; keep up to 10 to avoid lag
  useEffect(() => {
    let cancelled = false;
    const preload = async () => {
      const loaded = await Promise.all(
        urls.map((u) => new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve({ url: u, w: img.naturalWidth, h: img.naturalHeight });
          img.onerror = () => resolve(null);
          img.src = u;
        }))
      );
      const filtered = loaded
        .filter(Boolean)
        .filter((x) => x.w >= 400 && x.h >= 300)
        .map((x) => x.url)
        .slice(0, 10);
      if (!cancelled) setImages(filtered);
    };
    preload();
    return () => { cancelled = true; };
  }, [urls]);

  // Auto-advance every 3s
  useEffect(() => {
    if (!images.length) return;
    const id = setInterval(() => {
      setActive((s) => (s + 1) % images.length);
    }, 3000);
    return () => clearInterval(id);
  }, [images.length]);

  const prev = () => setActive((s) => (s - 1 + images.length) % images.length);
  const next = () => setActive((s) => (s + 1) % images.length);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // This Month Collection
  const thisMonthCollection = donations
    .filter(
      d =>
        new Date(d.date).getMonth() === currentMonth &&
        new Date(d.date).getFullYear() === currentYear
    )
    .reduce((sum, d) => sum + d.amount, 0);

  // This Month Expenses
  const thisMonthSpend = expenses
    .filter(
      e =>
        new Date(e.date).getMonth() === currentMonth &&
        new Date(e.date).getFullYear() === currentYear
    )
    .reduce((sum, e) => sum + e.amount, 0);

  // Recent Donations
  const recentDonations = [...donations]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="p-4 md:p-6">
      {/* Hero: image slider left, title + donate right */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Left: Image slider */}
        <div className="w-full md:w-1/3 flex justify-center md:justify-start">
          <div className="relative">
            {images.length ? (
              <img
                src={images[active]}
                alt={`Mandir ${active + 1}`}
                className="rounded-2xl shadow-lg h-64 w-56 sm:h-72 sm:w-64 object-cover"
              />
            ) : (
              <div className="w-56 h-64 sm:w-64 sm:h-72 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
                Image
              </div>
            )}
            {/* Controls */}
            {images.length > 1 && (
              <>
                <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-2 py-1 rounded-full hover:bg-black/60">‹</button>
                <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-2 py-1 rounded-full hover:bg-black/60">›</button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {images.map((_, i) => (
                    <span key={i} className={`h-1.5 w-3 rounded-full ${i === active ? 'bg-white' : 'bg-white/50'}`}></span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: Title, Sanskrit line + meaning and Donate button */}
        <div className="w-full md:w-2/3 flex flex-col md:items-start text-center md:text-left">
          <div className="w-full">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-orange-700 leading-snug">
              भक्त्या हृदयं समर्प्यते,सेवया जीवनं पवित्रम्।
              <br />शिवदानेन लोकोऽयं शुभं भवेत्॥
            </h2>

            <p className="mt-3 text-gray-700 max-w-2xl text-sm sm:text-base md:text-lg">
              Offer your heart in devotion, purify your life through service.
              <br />Let your gift to Lord Shiva bless the world.
            </p>

            <div className="mt-5">
              <button
                onClick={() => navigate('/donations')}
                className="px-6 py-3 sm:px-7 sm:py-4 text-base sm:text-lg bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 w-full sm:w-auto"
              >
                Donate Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 text-center mb-6 md:mb-8">
        <div className="bg-green-100 p-4 md:p-6 rounded-xl shadow">
          <h2 className="text-sm md:text-base text-gray-600">This Month's Collection</h2>
          <p className="text-xl md:text-2xl font-bold text-green-600">
            ₹{thisMonthCollection}
          </p>
        </div>
        <div className="bg-red-100 p-4 md:p-6 rounded-xl shadow">
          <h2 className="text-sm md:text-base text-gray-600">Spent This Month</h2>
          <p className="text-xl md:text-2xl font-bold text-red-600">₹{thisMonthSpend}</p>
        </div>
        <div className="bg-blue-100 p-4 md:p-6 rounded-xl shadow sm:col-span-2 md:col-span-1">
          <h2 className="text-sm md:text-base text-gray-600">Balance Left (Total)</h2>
          <p className="text-xl md:text-2xl font-bold text-blue-600">₹{balanceLeft}</p>
        </div>
      </div>

      {/* (Donate button now redirects to /donations) */}
    </div>
  );
}
