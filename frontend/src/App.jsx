import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Signup from './pages/Signup';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';

const API_BASE = 'https://omniroute-backend-nzap.onrender.com/api';

// ==========================================
// 1. MODERN NAVBAR COMPONENT
// ==========================================
function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) setUser(JSON.parse(loggedInUser));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 text-white shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-all">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-black tracking-tight leading-none">Goyal <span className="text-emerald-200">Supermart</span></h1>
              <p className="text-[10px] text-emerald-200/80 font-bold uppercase tracking-widest">Your Daily Needs</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-2xl border border-white/20">
                  <div className="w-7 h-7 bg-emerald-400 rounded-full flex items-center justify-center text-xs font-black text-emerald-900">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white leading-none">{user.name}</p>
                    <p className="text-[10px] text-emerald-200 font-medium">{user.phone}</p>
                  </div>
                </div>
                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="bg-amber-400 hover:bg-amber-300 text-amber-900 px-4 py-2.5 rounded-xl font-black text-xs shadow-lg shadow-amber-400/30 hover:shadow-amber-400/50 transition-all hover:scale-105 flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Admin Panel
                  </Link>
                )}
                <button 
                  onClick={handleLogout} 
                  className="bg-rose-500/90 hover:bg-rose-500 text-white px-4 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 transition-all hover:scale-105 flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  to="/login" 
                  className="text-emerald-100 hover:text-white font-bold text-sm transition-colors px-3 py-2"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-white text-emerald-700 hover:bg-emerald-50 px-5 py-2.5 rounded-xl font-black text-sm shadow-lg shadow-white/20 hover:shadow-xl transition-all hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-emerald-800/95 backdrop-blur-lg border-t border-emerald-600/50 animate-fade-in">
          <div className="px-4 py-4 space-y-3">
            {user ? (
              <>
                <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl">
                  <div className="w-10 h-10 bg-emerald-400 rounded-full flex items-center justify-center text-sm font-black text-emerald-900">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-white">{user.name}</p>
                    <p className="text-xs text-emerald-200">{user.phone}</p>
                  </div>
                </div>
                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block bg-amber-400 text-amber-900 px-4 py-3 rounded-xl font-black text-sm text-center"
                  >
                    ⚙️ Admin Panel
                  </Link>
                )}
                <button 
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="w-full bg-rose-500 text-white px-4 py-3 rounded-xl font-black text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="space-y-2">
                <Link 
                  to="/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center text-emerald-100 font-bold py-3"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block bg-white text-emerald-700 px-4 py-3 rounded-xl font-black text-sm text-center"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

// ==========================================
// 2. PREMIUM STOREFRONT HOME PAGE
// ==========================================
function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [orderType, setOrderType] = useState('Pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState({});

  const loggedInUser = JSON.parse(localStorage.getItem('user'));
  const isAdmin = loggedInUser?.role === 'admin';

  useEffect(() => {
    fetchProducts();
    if (loggedInUser && !isAdmin) fetchUserOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}/orders/user/${loggedInUser.id}`);
      const data = await res.json();
      setUserOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
    // Show "Added" feedback
    setAddedToCart(prev => ({ ...prev, [product._id]: true }));
    setTimeout(() => {
      setAddedToCart(prev => ({ ...prev, [product._id]: false }));
    }, 1500);
  };

  const removeFromCart = (indexToRemove) => {
    setCart(cart.filter((_, index) => index !== indexToRemove));
  };

  const totalBill = cart.reduce((total, item) => total + item.price, 0);

  const handleCheckout = async () => {
    if (!loggedInUser) {
      alert("⚠️ Order karne ke liye pehle Login karein!");
      navigate('/login');
      return;
    }

    if (orderType === 'Delivery' && !deliveryAddress.trim()) {
      alert("⚠️ Please apna delivery address ya hostel number likhein!");
      return;
    }

    const orderData = {
      userId: loggedInUser.id,
      customerName: loggedInUser.name,
      customerPhone: loggedInUser.phone,
      items: cart.map(item => ({ productId: item._id, name: item.name, price: item.price })),
      totalBill: totalBill,
      orderType: orderType,
      deliveryAddress: orderType === 'Delivery' ? deliveryAddress : ''
    };

    try {
      const response = await fetch(`${API_BASE}/orders/place`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const adminPhoneNumber = "917999206373";
        let itemsText = cart.map((item, idx) => `${idx + 1}. ${item.name} - ₹${item.price}`).join('\n');
        const deliveryText = orderType === 'Delivery' 
          ? `🛵 *Type:* Home Delivery\n📍 *Address:* ${deliveryAddress}` 
          : `🛍️ *Type:* Store Pickup`;
        const messageText = encodeURIComponent(
          `🛒 *Goyal SUPERMART - NEW ORDER* 🛒\n----------------------------------\n👤 *Customer:* ${loggedInUser.name}\n📞 *Phone:* ${loggedInUser.phone}\n${deliveryText}\n\n📦 *Items List:*\n${itemsText}\n----------------------------------\n💰 *Total Bill:* ₹${totalBill}\nStatus: *Pending Approval*`
        );
        const whatsappUrl = `https://wa.me/${adminPhoneNumber}?text=${messageText}`;

        alert("🎉 Order successfully placed!");
        setCart([]);
        setDeliveryAddress('');
        setOrderType('Pickup');
        setIsCartOpen(false);
        fetchUserOrders();
        window.open(whatsappUrl, '_blank');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filteredProducts = products.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { name: "All", icon: "🏠", color: "bg-slate-100 text-slate-600" },
    { name: "Combos", icon: "🔥", color: "bg-rose-100 text-rose-600" },
    { name: "Groceries", icon: "🥬", color: "bg-green-100 text-green-600" },
    { name: "Snacks", icon: "🍿", color: "bg-orange-100 text-orange-600" },
    { name: "Beverages", icon: "🥤", color: "bg-blue-100 text-blue-600" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-bold animate-pulse">Loading Products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 font-sans text-slate-800">
      <Navbar />

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0aDR2NGgtNHpNMjAgMjBoNHY0aC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center md:text-left">
              <span className="inline-block bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold mb-3 border border-white/30">
                🚀 Fast Delivery Available
              </span>
              <h1 className="text-3xl md:text-5xl font-black leading-tight mb-3">
                Fresh Groceries<br />
                <span className="text-emerald-200">Delivered to You</span>
              </h1>
              <p className="text-emerald-100 text-sm md:text-base max-w-md mb-6">
                Quality products at unbeatable prices. Order now and get your daily essentials delivered to your hostel!
              </p>
              <div className="flex gap-3 justify-center md:justify-start">
                <button 
                  onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white text-emerald-700 px-6 py-3 rounded-2xl font-black text-sm shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                >
                  Shop Now 🛒
                </button>
                {!loggedInUser && (
                  <Link 
                    to="/signup"
                    className="bg-emerald-800/50 backdrop-blur text-white border border-white/30 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-emerald-800/70 transition-all"
                  >
                    Join Free
                  </Link>
                )}
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-48 h-48 bg-white/10 backdrop-blur rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl">
                <span className="text-7xl">🛒</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-xl">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="text" 
                placeholder="Search products, categories..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-2 border-slate-100 pl-12 pr-12 py-3 rounded-2xl text-sm focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 bg-slate-50/50 transition-all font-medium"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Action Buttons */}
            {!isAdmin && loggedInUser && (
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsOrdersOpen(true)} 
                  className="flex-1 md:flex-none bg-white border-2 border-slate-100 text-slate-700 px-5 py-3 rounded-2xl font-bold text-sm hover:border-slate-200 hover:shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="hidden sm:inline">Orders</span>
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-black">{userOrders.length}</span>
                </button>
                <button 
                  onClick={() => setIsCartOpen(true)} 
                  className="flex-1 md:flex-none bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="hidden sm:inline">Cart</span>
                  <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-black">{cart.length}</span>
                </button>
              </div>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => (
              <button 
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                  selectedCategory === cat.name 
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200 scale-105" 
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <main id="products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🔍</span>
            </div>
            <p className="text-slate-500 font-bold text-lg">No products found</p>
            <p className="text-slate-400 text-sm mt-1">Try a different search or category</p>
            <button 
              onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
              className="mt-4 bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((item, idx) => {
              const discountPercent = item.originalPrice && item.originalPrice > item.price 
                ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) 
                : 0;

              return (
                <div 
                  key={item._id} 
                  className="bg-white rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 overflow-hidden flex flex-col transition-all hover:-translate-y-1 group"
                  style={{ animationDelay: `${idx * 30}ms` }}
                >
                  {/* Image */}
                  <div className="relative h-44 sm:h-52 bg-slate-50 overflow-hidden">
                    <img 
                      src={item.image || "https://via.placeholder.com/300"} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Category Badge */}
                    <span className="absolute top-3 left-3 text-[10px] font-black tracking-wide uppercase bg-white/90 backdrop-blur text-slate-700 px-3 py-1.5 rounded-full shadow-sm">
                      {item.category}
                    </span>
                    {/* Discount Badge */}
                    {discountPercent > 0 ? (
                      <span className="absolute top-3 right-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white text-[11px] font-black px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                        -{discountPercent}%
                      </span>
                    ) : item.category === 'Combos' && (
                      <span className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">
                        OFFER 🔥
                      </span>
                    )}
                    {/* Stock Badge */}
                    {item.stock <= 5 && item.stock > 0 && (
                      <span className="absolute bottom-3 left-3 bg-amber-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md">
                        Only {item.stock} left!
                      </span>
                    )}
                    {item.stock === 0 && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                        <span className="bg-white text-slate-800 text-xs font-black px-4 py-2 rounded-full">Out of Stock</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-slate-800 text-sm md:text-base leading-tight mb-1 line-clamp-2">{item.name}</h3>
                    <p className="text-xs text-slate-400 font-medium mb-3">{item.stock > 0 ? `${item.stock} in stock` : 'Unavailable'}</p>
                    
                    <div className="mt-auto">
                      <div className="flex items-end gap-2 mb-3">
                        <span className="text-2xl font-black text-slate-900">₹{item.price}</span>
                        {item.originalPrice > item.price && (
                          <span className="text-sm text-slate-400 line-through font-bold mb-1">₹{item.originalPrice}</span>
                        )}
                      </div>
                      
                      {!isAdmin && item.stock > 0 && (
                        <button 
                          onClick={() => addToCart(item)} 
                          disabled={addedToCart[item._id]}
                          className={`w-full py-3 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 ${
                            addedToCart[item._id]
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200 hover:shadow-xl hover:scale-[1.02] active:scale-95'
                          }`}
                        >
                          {addedToCart[item._id] ? (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Added!
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              Add to Cart
                            </>
                          )}
                        </button>
                      )}
                      {item.stock === 0 && (
                        <button disabled className="w-full py-3 rounded-2xl font-black text-sm bg-slate-100 text-slate-400 cursor-not-allowed">
                          Out of Stock
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="font-black text-white text-lg">Goyal Supermart</span>
          </div>
          <p className="text-xs">Fresh groceries delivered to your doorstep. Quality you can trust.</p>
          <div className="mt-4 pt-4 border-t border-slate-800 text-[10px]">
            © 2026 Goyal Supermart. All rights reserved.
          </div>
        </div>
      </footer>

      {/* ========================================== */}
      {/* CART SLIDE DRAWER */}
      {/* ========================================== */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in" 
            onClick={() => setIsCartOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl animate-slide-in-right flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
              <div>
                <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">🛒 Your Cart</h2>
                <p className="text-xs text-slate-400 font-medium mt-0.5">{cart.length} items</p>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)} 
                className="w-10 h-10 bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-500 rounded-xl flex items-center justify-center transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-3xl">🧺</span>
                  </div>
                  <p className="text-slate-500 font-bold text-lg">Your cart is empty</p>
                  <p className="text-slate-400 text-sm mt-1">Add some products to get started</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item, index) => (
                    <div key={index} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-4">
                      <div className="w-14 h-14 bg-white rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                        <img src={item.image || "https://via.placeholder.com/100"} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 text-sm truncate">{item.name}</p>
                        <p className="text-emerald-600 font-black text-sm mt-0.5">₹{item.price}</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(index)} 
                        className="w-8 h-8 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-lg flex items-center justify-center transition-all hover:scale-110 flex-shrink-0"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Checkout Section */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-slate-100 bg-gradient-to-t from-slate-50 to-white">
                {/* Order Type */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-4">
                  <h3 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                    Delivery Option
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      orderType === 'Pickup' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 hover:border-slate-200'
                    }`}>
                      <input 
                        type="radio" 
                        value="Pickup" 
                        checked={orderType === 'Pickup'} 
                        onChange={(e) => setOrderType(e.target.value)} 
                        className="accent-emerald-600 w-4 h-4" 
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-800">Store Pickup</p>
                        <p className="text-[10px] text-slate-400">Collect from shop</p>
                      </div>
                    </label>
                    <label className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      orderType === 'Delivery' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 hover:border-slate-200'
                    }`}>
                      <input 
                        type="radio" 
                        value="Delivery" 
                        checked={orderType === 'Delivery'} 
                        onChange={(e) => setOrderType(e.target.value)} 
                        className="accent-emerald-600 w-4 h-4" 
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-800">Home Delivery</p>
                        <p className="text-[10px] text-slate-400">Delivered to you</p>
                      </div>
                    </label>
                  </div>

                  {orderType === 'Delivery' && (
                    <div className="mt-3">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Delivery Address</label>
                      <textarea 
                        placeholder="Hostel Name, Room No., Block, etc..."
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full p-3 border-2 border-slate-100 rounded-xl text-xs focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 bg-slate-50/50 transition-all font-medium resize-none"
                        rows="2"
                      />
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="flex items-center justify-between mb-4 px-1">
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Amount</p>
                    <p className="text-3xl font-black text-slate-800">₹{totalBill}</p>
                  </div>
                  <p className="text-xs text-slate-400">{cart.length} items</p>
                </div>

                <button 
                  onClick={handleCheckout} 
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Place Order & Send Bill
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* ORDERS SLIDE DRAWER */}
      {/* ========================================== */}
      {isOrdersOpen && (
        <div className="fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in" 
            onClick={() => setIsOrdersOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl animate-slide-in-right flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
              <div>
                <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">📜 Order History</h2>
                <p className="text-xs text-slate-400 font-medium mt-0.5">{userOrders.length} orders</p>
              </div>
              <button 
                onClick={() => setIsOrdersOpen(false)} 
                className="w-10 h-10 bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-500 rounded-xl flex items-center justify-center transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Orders List */}
            <div className="flex-1 overflow-y-auto p-6">
              {userOrders.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-3xl">📋</span>
                  </div>
                  <p className="text-slate-500 font-bold text-lg">No orders yet</p>
                  <p className="text-slate-400 text-sm mt-1">Your order history will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userOrders.map((order) => (
                    <div key={order._id} className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:shadow-md transition-all">
                      {/* Order Header */}
                      <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-200/60">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-700">Order #{order._id?.slice(-6).toUpperCase()}</p>
                            <p className="text-[10px] text-slate-400">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1.5 rounded-full font-black text-[10px] uppercase tracking-wider ${
                          order.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                          order.status === 'Accepted' ? 'bg-sky-100 text-sky-700' : 
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>

                      {/* Order Type */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                          order.orderType === 'Delivery' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {order.orderType === 'Delivery' ? '🛵 Delivery' : '🛍️ Pickup'}
                        </span>
                        {order.orderType === 'Delivery' && order.deliveryAddress && (
                          <p className="text-[10px] text-slate-500 truncate flex-1">{order.deliveryAddress}</p>
                        )}
                      </div>

                      {/* Items */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {order.items.map((i, idx) => (
                          <span key={idx} className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-600">
                            {i.name}
                          </span>
                        ))}
                      </div>

                      {/* Total */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-200/40">
                        <span className="text-xs font-bold text-slate-400">Total Paid</span>
                        <p className="text-lg font-black text-slate-800">₹{order.totalBill}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add CSS animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;