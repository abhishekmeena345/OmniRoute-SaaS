import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({ name: '', category: '', price: '', originalPrice: '', stock: '' });
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard'); // For mobile tabs

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalEarning: 0,
    topSellingProduct: 'Loading...'
  });

  const API_BASE = 'https://omniroute-backend-nzap.onrender.com/api';

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (!token || !loggedInUser || loggedInUser.role !== 'admin') {
      alert("🔒 Access Denied!");
      navigate('/');
    } else {
      fetchAllData();
    }
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchProducts(), fetchOrders(), fetchStats()]);
    setLoading(false);
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) { console.error(err); }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}/orders/all`);
      const data = await res.json();
      setOrders(data);
    } catch (err) { console.error(err); }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/orders/dashboard-stats`);
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch (err) { console.error('Stats error:', err); }
  };

  const handleUpdateStatus = async (orderId, newStatus, orderDetails) => {
    try {
      const res = await fetch(`${API_BASE}/orders/update-status/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        fetchOrders();
        fetchStats();

        if (newStatus === 'Accepted' && orderDetails) {
          let customerPhone = orderDetails.customerPhone;
          if (!customerPhone.startsWith('91')) customerPhone = '91' + customerPhone;
          const messageText = encodeURIComponent(
            `🎉 *Goyal SUPERMART* 🎉\n----------------------------------\nHi *${orderDetails.customerName}*,\n\nAapka order successfully *CONFIRM* ho gaya hai! 👍\nHamare yahan se saaman pack ho raha hai.\n\n💰 *Total Amount:* ₹${orderDetails.totalBill}`
          );
          window.open(`https://wa.me/${customerPhone}?text=${messageText}`, '_blank');
        }
      }
    } catch (err) { console.error(err); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setMessage('Processing... ⏳');

    try {
      let imageUrl = formData.image || "";
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append("file", imageFile);
        uploadData.append("upload_preset", "kirana_store");
        uploadData.append("cloud_name", "dssur0ode");

        const cloudRes = await fetch("https://api.cloudinary.com/v1_1/dssur0ode/image/upload", { 
          method: "POST", 
          body: uploadData 
        });
        const cloudData = await cloudRes.json();
        if (cloudRes.ok) imageUrl = cloudData.secure_url;
      }

      const productData = { ...formData, image: imageUrl };
      const response = editingId
        ? await fetch(`${API_BASE}/products/update/${editingId}`, { 
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(productData) 
          })
        : await fetch(`${API_BASE}/products/add`, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(productData) 
          });

      if (response.ok) {
        setMessage('✅ Inventory Updated Successfully!');
        setFormData({ name: '', category: '', price: '', originalPrice: '', stock: '' });
        setImageFile(null);
        setEditingId(null);
        fetchProducts();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) { 
      setMessage('❌ Error'); 
    } finally { 
      setIsUploading(false); 
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      try {
        await fetch(`${API_BASE}/products/delete/${id}`, { method: 'DELETE' });
        fetchProducts();
      } catch (err) { console.error(err); }
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price,
      originalPrice: item.originalPrice || '',
      stock: item.stock,
      image: item.image || ''
    });
    // Scroll to form on mobile
    if (window.innerWidth < 768) {
      document.getElementById('product-form')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-bold animate-pulse">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 font-sans text-slate-800">
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-lg sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">GS</span>
            </div>
            <h1 className="font-black text-lg text-slate-800">Goyal Supermart</h1>
          </div>
          <button onClick={handleLogout} className="text-xs bg-rose-500 text-white px-3 py-1.5 rounded-full font-bold">
            Logout
          </button>
        </div>
        {/* Mobile Tabs */}
        <div className="flex border-t border-slate-100">
          {['dashboard', 'products', 'orders'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === tab 
                  ? 'text-emerald-600 border-b-2 border-emerald-500 bg-emerald-50' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab === 'dashboard' && '📊 Stats'}
              {tab === 'products' && '📦 Products'}
              {tab === 'orders' && '🔔 Orders'}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <span className="text-white font-black text-xl">GS</span>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800">Goyal Supermart</h1>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Admin Console</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
              <span className="text-xs text-slate-400 font-bold">Logged in as</span>
              <p className="text-sm font-black text-slate-700">Admin</p>
            </div>
            <button 
              onClick={handleLogout} 
              className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-rose-200 transition-all hover:scale-105 active:scale-95"
            >
              Exit Console
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Side - Product Form */}
          <div 
            id="product-form"
            className={`lg:col-span-4 ${activeTab !== 'products' && activeTab !== 'dashboard' ? 'hidden md:block' : ''}`}
          >
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden sticky top-24">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-6 text-white">
                <h2 className="text-xl font-black flex items-center gap-2">
                  {editingId ? "✏️ Edit Product" : "➕ Add New Product"}
                </h2>
                <p className="text-emerald-100 text-xs font-medium mt-1 opacity-80">
                  {editingId ? "Update existing product details" : "Add a new item to your inventory"}
                </p>
              </div>

              <div className="p-6">
                {/* Message Toast */}
                {message && (
                  <div className={`p-4 rounded-2xl mb-5 text-center font-bold text-sm shadow-lg animate-bounce ${
                    message.includes('✅') 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* Product Name */}
                  <div className="group">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Product Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      placeholder="e.g. Basmati Rice 5kg" 
                      className="w-full border-2 border-slate-100 p-3.5 rounded-2xl text-sm focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 bg-slate-50/50 transition-all font-medium" 
                      required 
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Category</label>
                    <div className="relative">
                      <select 
                        name="category" 
                        value={formData.category} 
                        onChange={handleChange} 
                        className="w-full border-2 border-slate-100 p-3.5 rounded-2xl text-sm focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 bg-slate-50/50 appearance-none font-medium cursor-pointer transition-all" 
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Groceries">🥬 Groceries</option>
                        <option value="Snacks">🍿 Snacks</option>
                        <option value="Beverages">🥤 Beverages</option>
                        <option value="Combos">🔥 Combos & Offers</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                    </div>
                  </div>

                  {/* Price Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">MRP</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                        <input 
                          type="number" 
                          name="originalPrice" 
                          value={formData.originalPrice} 
                          onChange={handleChange} 
                          placeholder="0" 
                          className="w-full border-2 border-slate-100 pl-7 pr-3 py-3 rounded-2xl text-sm focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 bg-slate-50/50 transition-all font-medium" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Offer</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 font-bold text-xs">₹</span>
                        <input 
                          type="number" 
                          name="price" 
                          value={formData.price} 
                          onChange={handleChange} 
                          placeholder="0" 
                          className="w-full border-2 border-slate-100 pl-7 pr-3 py-3 rounded-2xl text-sm focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 bg-slate-50/50 transition-all font-medium" 
                          required 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Stock</label>
                      <input 
                        type="number" 
                        name="stock" 
                        value={formData.stock} 
                        onChange={handleChange} 
                        placeholder="Qty" 
                        className="w-full border-2 border-slate-100 p-3 py-3 rounded-2xl text-sm focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 bg-slate-50/50 transition-all font-medium text-center" 
                        required 
                      />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Product Image</label>
                    <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-emerald-300 hover:bg-emerald-50/30 transition-all cursor-pointer group">
                      <input 
                        type="file" 
                        onChange={(e) => setImageFile(e.target.files[0])} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                      />
                      <div className="pointer-events-none">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-emerald-100 transition-colors">
                          <svg className="w-5 h-5 text-slate-400 group-hover:text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">
                          {imageFile ? imageFile.name : 'Click to upload image'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    disabled={isUploading} 
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-4 rounded-2xl font-black text-sm shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                  >
                    {isUploading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        Syncing...
                      </span>
                    ) : editingId ? '💾 Save Changes' : '🚀 Launch Product Live'}
                  </button>

                  {editingId && (
                    <button 
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setFormData({ name: '', category: '', price: '', originalPrice: '', stock: '' });
                        setImageFile(null);
                      }}
                      className="w-full bg-slate-100 text-slate-600 p-3 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all"
                    >
                      Cancel Editing
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>

          {/* Right Side - Dashboard */}
          <div className={`lg:col-span-8 flex flex-col gap-6 ${activeTab === 'products' ? 'hidden md:block' : ''}`}>
            
            {/* Stats Cards */}
            <div className={`${activeTab !== 'dashboard' && activeTab !== 'orders' ? 'hidden md:block' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">📊 Dukaan Insights</h2>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Real-time business analytics</p>
                </div>
                <button 
                  onClick={fetchAllData}
                  className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm"
                >
                  🔄 Refresh
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Total Earning */}
                <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-lg shadow-emerald-100/50 hover:shadow-xl hover:shadow-emerald-200/50 transition-all hover:-translate-y-1 group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                      <svg className="w-5 h-5 text-emerald-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-full">Revenue</span>
                  </div>
                  <h3 className="text-emerald-600/60 text-[10px] font-black uppercase tracking-widest mb-1">Total Earning</h3>
                  <p className="text-3xl font-black text-emerald-700">₹{stats.totalEarning?.toLocaleString() || 0}</p>
                </div>

                {/* Total Orders */}
                <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-lg shadow-sky-100/50 hover:shadow-xl hover:shadow-sky-200/50 transition-all hover:-translate-y-1 group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-sky-100 rounded-2xl flex items-center justify-center group-hover:bg-sky-500 transition-colors">
                      <svg className="w-5 h-5 text-sky-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest bg-sky-50 px-2 py-1 rounded-full">Orders</span>
                  </div>
                  <h3 className="text-sky-600/60 text-[10px] font-black uppercase tracking-widest mb-1">Orders Delivered</h3>
                  <p className="text-3xl font-black text-sky-700">{stats.totalOrders}</p>
                </div>

                {/* Top Product */}
                <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-lg shadow-amber-100/50 hover:shadow-xl hover:shadow-amber-200/50 transition-all hover:-translate-y-1 group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center group-hover:bg-amber-500 transition-colors">
                      <svg className="w-5 h-5 text-amber-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-2 py-1 rounded-full">Best Seller</span>
                  </div>
                  <h3 className="text-amber-600/60 text-[10px] font-black uppercase tracking-widest mb-1">Top Item 🔥</h3>
                  <p className="text-lg font-black text-amber-700 truncate">{stats.topSellingProduct}</p>
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div className={`${activeTab !== 'dashboard' && activeTab !== 'products' ? 'hidden md:block' : ''}`}>
              <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">📦 Live Inventory</h2>
                    <p className="text-xs text-slate-400 font-medium">{products.length} products in stock</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-black px-3 py-1.5 rounded-full">
                    {products.length} Items
                  </span>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-100">
                        <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product</th>
                        <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                        <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">MRP</th>
                        <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Price</th>
                        <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Stock</th>
                        <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((item, idx) => (
                        <tr 
                          key={item._id} 
                          className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group"
                          style={{ animationDelay: `${idx * 50}ms` }}
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-lg">
                                {item.image ? (
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                                ) : (
                                  '📦'
                                )}
                              </div>
                              <span className="font-bold text-slate-700 text-sm">{item.name}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                              item.category === 'Groceries' ? 'bg-green-100 text-green-700' :
                              item.category === 'Snacks' ? 'bg-orange-100 text-orange-700' :
                              item.category === 'Beverages' ? 'bg-blue-100 text-blue-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {item.category}
                            </span>
                          </td>
                          <td className="p-4 text-right text-slate-400 font-bold text-sm line-through">₹{item.originalPrice}</td>
                          <td className="p-4 text-right text-emerald-600 font-black text-sm">₹{item.price}</td>
                          <td className="p-4 text-center">
                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-black ${
                              item.stock > 10 ? 'bg-emerald-100 text-emerald-700' :
                              item.stock > 0 ? 'bg-amber-100 text-amber-700' :
                              'bg-rose-100 text-rose-700'
                            }`}>
                              {item.stock}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => handleEdit(item)} 
                                className="bg-amber-50 text-amber-600 hover:bg-amber-100 p-2 rounded-xl transition-all hover:scale-110"
                                title="Edit"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button 
                                onClick={() => handleDelete(item._id)} 
                                className="bg-rose-50 text-rose-600 hover:bg-rose-100 p-2 rounded-xl transition-all hover:scale-110"
                                title="Delete"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Product Cards */}
                <div className="md:hidden p-4 space-y-3 max-h-[500px] overflow-y-auto">
                  {products.map((item) => (
                    <div key={item._id} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                            ) : (
                              '📦'
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              item.category === 'Groceries' ? 'bg-green-100 text-green-700' :
                              item.category === 'Snacks' ? 'bg-orange-100 text-orange-700' :
                              item.category === 'Beverages' ? 'bg-blue-100 text-blue-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {item.category}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-emerald-600 font-black text-lg">₹{item.price}</p>
                          <p className="text-slate-400 text-xs line-through">₹{item.originalPrice}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 font-medium">Stock:</span>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
                            item.stock > 10 ? 'bg-emerald-100 text-emerald-700' :
                            item.stock > 0 ? 'bg-amber-100 text-amber-700' :
                            'bg-rose-100 text-rose-700'
                          }`}>
                            {item.stock} left
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEdit(item)} 
                            className="bg-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(item._id)} 
                            className="bg-rose-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Orders Section */}
            <div className={`${activeTab !== 'dashboard' && activeTab !== 'orders' ? 'hidden md:block' : ''}`}>
              <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">🔔 Dispatch Queue</h2>
                    <p className="text-xs text-slate-400 font-medium">{orders.length} pending orders</p>
                  </div>
                  <span className={`text-xs font-black px-3 py-1.5 rounded-full ${
                    orders.length > 0 ? 'bg-amber-100 text-amber-700 animate-pulse' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {orders.length > 0 ? '🔴 Live' : '✅ All Clear'}
                  </span>
                </div>

                {orders.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-slate-500 font-bold text-lg">No pending orders!</p>
                    <p className="text-slate-400 text-sm mt-1">All orders have been processed</p>
                  </div>
                ) : (
                  <div className="max-h-[600px] overflow-y-auto p-4 space-y-4">
                    {orders.map((order) => (
                      <div 
                        key={order._id} 
                        className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:shadow-lg hover:border-slate-200 transition-all"
                      >
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4 pb-4 border-b border-slate-200">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-black text-slate-800 text-lg">{order.customerName}</p>
                              <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider ${
                                order.orderType === 'Delivery' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
                              }`}>
                                {order.orderType === 'Delivery' ? '🛵 Delivery' : '🛍️ Pickup'}
                              </span>
                            </div>
                            <p className="text-sm text-slate-500 font-medium flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              {order.customerPhone}
                            </p>
                            {order.orderType === 'Delivery' && order.deliveryAddress && (
                              <div className="mt-2 bg-white p-3 rounded-xl border border-slate-200 flex items-start gap-2">
                                <svg className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <p className="text-xs text-slate-600 font-medium leading-relaxed">{order.deliveryAddress}</p>
                              </div>
                            )}
                          </div>
                          <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider self-start ${
                            order.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                            order.status === 'Accepted' ? 'bg-sky-100 text-sky-700' :
                            'bg-emerald-100 text-emerald-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>

                        {/* Order Items */}
                        <div className="mb-4">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Order Items</p>
                          <div className="flex flex-wrap gap-2">
                            {order.items.map((i, idx) => (
                              <span key={idx} className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 shadow-sm">
                                {i.name} {i.quantity && `×${i.quantity}`}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Order Footer */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-slate-200">
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Amount</p>
                            <p className="text-2xl font-black text-slate-800">₹{order.totalBill}</p>
                          </div>
                          <div className="flex gap-3 w-full sm:w-auto">
                            {order.status === 'Pending' && (
                              <button 
                                onClick={() => handleUpdateStatus(order._id, 'Accepted', order)} 
                                className="flex-1 sm:flex-none bg-gradient-to-r from-sky-500 to-sky-600 text-white px-6 py-3 rounded-xl text-sm font-black hover:shadow-lg hover:shadow-sky-200 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Accept & Notify
                              </button>
                            )}
                            {order.status === 'Accepted' && (
                              <button 
                                onClick={() => handleUpdateStatus(order._id, 'Delivered', order)} 
                                className="flex-1 sm:flex-none bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-black hover:shadow-lg hover:shadow-emerald-200 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Mark Delivered
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;