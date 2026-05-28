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

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalEarning: 0,
    topSellingProduct: 'Loading...'
  });

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (!token || !loggedInUser || loggedInUser.role !== 'admin') {
      alert("🔒 Access Denied!");
      navigate('/');
    } else {
      fetchProducts();
      fetchOrders();
      fetchStats(); 
    }
  }, []);

  const fetchProducts = async () => {
    try {
      // 👇 NAYA: Live Render Backend Link
      const res = await fetch('https://omniroute-backend-nzap.onrender.com/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) { console.error(err); }
  };

  const fetchOrders = async () => {
    try {
      // 👇 NAYA: Live Render Backend Link
      const res = await fetch('https://omniroute-backend-nzap.onrender.com/api/orders/all');
      const data = await res.json();
      setOrders(data);
    } catch (err) { console.error(err); }
  };

  const fetchStats = async () => {
    try {
      // 👇 NAYA: Live Render Backend Link
      const res = await fetch('https://omniroute-backend-nzap.onrender.com/api/orders/dashboard-stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) { console.error('Stats laane me error:', err); }
  };

  const handleUpdateStatus = async (orderId, newStatus, orderDetails) => {
    try {
      // 👇 NAYA: Live Render Backend Link
      const res = await fetch(`https://omniroute-backend-nzap.onrender.com/api/orders/update-status/${orderId}`, {
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
          const messageText = encodeURIComponent(`🎉 *MEENA SUPERMART* 🎉\n----------------------------------\nHi *${orderDetails.customerName}*,\n\nAapka order successfully *CONFIRM* ho gaya hai! 👍\nHamare yahan se saaman pack ho raha hai.\n\n💰 *Total Amount:* ₹${orderDetails.totalBill}`);
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

        const cloudRes = await fetch("https://api.cloudinary.com/v1_1/dssur0ode/image/upload", { method: "POST", body: uploadData });
        const cloudData = await cloudRes.json();
        if (cloudRes.ok) imageUrl = cloudData.secure_url;
      }

      const productData = { ...formData, image: imageUrl };
      
      // 👇 NAYA: Live Render Backend Links
      let response = editingId 
        ? await fetch(`https://omniroute-backend-nzap.onrender.com/api/products/update/${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(productData) })
        : await fetch('https://omniroute-backend-nzap.onrender.com/api/products/add', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(productData) });

      if (response.ok) {
        setMessage('✅ Inventory Updated Successfully!');
        setFormData({ name: '', category: '', price: '', originalPrice: '', stock: '' });
        setImageFile(null);
        setEditingId(null);
        fetchProducts();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) { setMessage('❌ Error'); } finally { setIsUploading(false); }
  };

  return (
    <div className="bg-slate-50 min-h-screen p-6 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Modern Left Side Form Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 h-fit">
          <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
            {editingId ? "✏️ Edit Item Details" : "➕ Add Product To Store"}
          </h2>
          {message && <div className="p-3 text-xs rounded-xl mb-4 text-center font-bold bg-emerald-50 text-emerald-700 shadow-inner">{message}</div>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" className="border border-slate-200 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50" required />
            
            <select name="category" value={formData.category} onChange={handleChange} className="border border-slate-200 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 text-slate-500" required>
              <option value="">Choose Category</option>
              <option value="Groceries">Groceries</option>
              <option value="Snacks">Snacks</option>
              <option value="Beverages">Beverages</option>
              <option value="Combos">🔥 Combos & Offers</option>
            </select>

            <div className="grid grid-cols-3 gap-3">
              <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} placeholder="MRP (₹)" className="border border-slate-200 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50" />
              <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Offer Price (₹)" className="border border-slate-200 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50" required />
              <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="Stock Qty" className="border border-slate-200 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50" required />
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-dashed border-slate-300 text-center relative cursor-pointer">
              <input type="file" onChange={(e) => setImageFile(e.target.files[0])} className="text-xs opacity-70 w-full cursor-pointer" />
            </div>
            <button type="submit" disabled={isUploading} className="bg-emerald-600 text-white p-3.5 rounded-xl font-black text-sm hover:bg-emerald-700 shadow-md active:scale-95 cursor-pointer transition-all">
              {isUploading ? 'Syncing Up... ⏳' : editingId ? 'Save Changes' : 'Launch Item Live'}
            </button>
          </form>
        </div>

        {/* Right Side Control Dashboard */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:col-span-2 flex flex-col gap-8">
          
          {/* Dashboard Stats Panel */}
          <div>
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">📊 Dukaan Insights</h2>
               <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="text-xs bg-rose-500 text-white px-4 py-1.5 rounded-full hover:bg-rose-600 font-bold shadow-sm cursor-pointer transition-colors">Exit Console</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex flex-col items-center justify-center shadow-sm">
                <h3 className="text-emerald-600/70 text-[10px] font-black uppercase tracking-widest mb-1">Total Earning</h3>
                <p className="text-2xl font-black text-emerald-700">₹{stats.totalEarning}</p>
              </div>
              <div className="bg-sky-50 border border-sky-100 p-4 rounded-2xl flex flex-col items-center justify-center shadow-sm">
                <h3 className="text-sky-600/70 text-[10px] font-black uppercase tracking-widest mb-1">Orders Delivered</h3>
                <p className="text-2xl font-black text-sky-700">{stats.totalOrders}</p>
              </div>
              <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex flex-col items-center justify-center shadow-sm text-center">
                <h3 className="text-amber-600/70 text-[10px] font-black uppercase tracking-widest mb-1">Top Item 🔥</h3>
                <p className="text-lg font-black text-amber-700 truncate w-full">{stats.topSellingProduct}</p>
              </div>
            </div>
          </div>

          {/* Live Inventory Sub-Panel */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">📦 Live Shell Items ({products.length})</h2>
            </div>
            <div className="max-h-60 overflow-y-auto border border-slate-100 rounded-2xl text-sm shadow-inner bg-slate-50">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b font-bold text-slate-400 text-xs uppercase tracking-wider">
                    <td className="p-3">Item Name</td><td className="p-3">Cost</td><td className="p-3 text-center">Modifications</td>
                  </tr>
                </thead>
                <tbody>
                  {products.map(item => (
                    <tr key={item._id} className="border-b border-slate-200/60 hover:bg-white transition-colors">
                      <td className="p-3 font-bold text-slate-700">{item.name}</td>
                      <td className="p-3 text-emerald-600 font-black">₹{item.price}</td>
                      <td className="p-3 flex gap-4 justify-center">
                        <button onClick={() => { 
                          setEditingId(item._id); 
                          setFormData({
                            name: item.name,
                            category: item.category,
                            price: item.price,
                            originalPrice: item.originalPrice || '',
                            stock: item.stock,
                            image: item.image || ''
                          }); 
                        }} className="text-xs text-amber-500 font-black hover:underline cursor-pointer">Edit</button>
                        
                        {/* 👇 NAYA: Live Render Backend Link */}
                        <button onClick={() => { if(window.confirm("Delete?")) fetch(`https://omniroute-backend-nzap.onrender.com/api/products/delete/${item._id}`, {method:'DELETE'}).then(()=>fetchProducts()) }} className="text-xs text-rose-500 font-black hover:underline cursor-pointer">Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Incoming Orders Notification Deck */}
          <div>
            <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">🔔 Dispatch Queue ({orders.length})</h2>
            {orders.length === 0 ? (
              <div className="p-6 bg-slate-50 border rounded-2xl text-center text-slate-400 font-medium">No pending tickets in pipeline.</div>
            ) : (
              <div className="flex flex-col gap-4 max-h-96 overflow-y-auto pr-2">
                {orders.map((order) => (
                  <div key={order._id} className="border border-slate-100 p-4 rounded-2xl shadow-sm bg-slate-50 flex flex-col gap-3">
                    <div className="flex justify-between items-start border-b pb-3">
                      <div>
                        <p className="font-black text-slate-800 text-base">{order.customerName}</p>
                        <p className="text-xs text-slate-400 font-bold mt-0.5">📞 {order.customerPhone}</p>
                        <div className="mt-2 flex flex-col gap-1 items-start">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider ${
                            order.orderType === 'Delivery' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {order.orderType === 'Delivery' ? '🛵 Home Delivery' : '🛍️ Store Pickup'}
                          </span>
                          
                          {order.orderType === 'Delivery' && order.deliveryAddress && (
                            <div className="bg-slate-100 p-2 rounded border border-slate-200 mt-1 w-full text-xs text-slate-600 font-medium">
                              <span className="font-bold text-slate-800 block mb-0.5">📍 Address / Hostel No:</span>
                              {order.deliveryAddress}
                            </div>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${
                        order.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                        order.status === 'Accepted' ? 'bg-sky-100 text-sky-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>{order.status}</span>
                    </div>

                    <div className="text-xs font-semibold text-slate-500 flex flex-wrap gap-1.5">
                      {order.items.map((i, idx) => <span key={idx} className="bg-white border border-slate-200/60 px-2.5 py-1 rounded-lg shadow-inner">• {i.name}</span>)}
                    </div>

                    <div className="flex justify-between items-center mt-2 border-t border-slate-200/40 pt-3">
                      <p className="font-black text-base text-slate-800"><span className="text-xs text-slate-400 font-bold uppercase block tracking-wider">Total Value</span>₹{order.totalBill}</p>
                      <div className="flex gap-2">
                        {order.status === 'Pending' && (
                          <button onClick={() => handleUpdateStatus(order._id, 'Accepted', order)} className="bg-sky-500 text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-sky-600 shadow-md transition-colors cursor-pointer">Accept & Notify</button>
                        )}
                        {order.status === 'Accepted' && (
                          <button onClick={() => handleUpdateStatus(order._id, 'Delivered', order)} className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-emerald-700 shadow-md transition-colors cursor-pointer">Mark Out For Delivery</button>
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
  );
}

export default AdminDashboard;