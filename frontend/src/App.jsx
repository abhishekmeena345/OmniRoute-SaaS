import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Signup from './pages/Signup';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';

// ==========================================
// 1. MODERN NAVBAR COMPONENT
// ==========================================
function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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
    <header className="bg-emerald-600/90 backdrop-blur-md text-white p-4 shadow-lg sticky top-0 z-30 transition-all">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <Link to="/" className="text-2xl font-black tracking-tight flex items-center gap-2 drop-shadow-sm">
          <span className="bg-white p-1.5 rounded-xl shadow-inner text-xl">🛒</span> GOYAL <span className="text-emerald-200">Supermart</span>
        </Link>
        
        <div className="flex gap-4 items-center text-sm font-semibold">
          {user ? (
            <div className="flex items-center gap-3 bg-emerald-700/50 px-3 py-1.5 rounded-full border border-emerald-500/30">
              <span className="text-emerald-100 hidden sm:inline">Hi, <strong className="text-white">{user.name}</strong></span>
              {user.role === 'admin' && (
                <Link to="/admin" className="bg-amber-400 text-gray-900 px-3 py-1 rounded-full font-bold hover:bg-amber-300 shadow transition-all transform hover:scale-105">
                  ⚙️ Admin Panel
                </Link>
              )}
              <button onClick={handleLogout} className="bg-rose-500 hover:bg-rose-600 px-3 py-1 rounded-full text-xs font-bold shadow transition-colors cursor-pointer">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-4 items-center">
              <Link to="/login" className="hover:text-emerald-200 transition-colors">Login</Link>
              <Link to="/signup" className="bg-white text-emerald-700 px-4 py-2 rounded-full shadow-md font-bold hover:bg-emerald-50 transition-all transform hover:scale-105">Signup</Link>
            </div>
          )}
        </div>
      </div>
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

  const loggedInUser = JSON.parse(localStorage.getItem('user'));
  const isAdmin = loggedInUser?.role === 'admin';

  useEffect(() => {
    fetch('http://localhost:5005/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));

    if (loggedInUser && !isAdmin) fetchUserOrders();
  }, []);

  const fetchUserOrders = () => {
    fetch(`http://localhost:5005/api/orders/user/${loggedInUser.id}`)
      .then(res => res.json())
      .then(data => setUserOrders(data))
      .catch(err => console.error(err));
  };

  const addToCart = (product) => setCart([...cart, product]);
  const removeFromCart = (indexToRemove) => setCart(cart.filter((_, index) => index !== indexToRemove));
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
      const response = await fetch('http://localhost:5005/api/orders/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const adminPhoneNumber = "919302277345"; 
        let itemsText = cart.map((item, idx) => `${idx + 1}. ${item.name} - ₹${item.price}`).join('\n');
        
        const deliveryText = orderType === 'Delivery' ? `🛵 *Type:* Home Delivery\n📍 *Address:* ${deliveryAddress}` : `🛍️ *Type:* Store Pickup`;
        
        const messageText = encodeURIComponent(`🛒 *MEENA SUPERMART - NEW ORDER* 🛒\n----------------------------------\n👤 *Customer:* ${loggedInUser.name}\n📞 *Phone:* ${loggedInUser.phone}\n${deliveryText}\n\n📦 *Items List:*\n${itemsText}\n----------------------------------\n💰 *Total Bill:* ₹${totalBill}\nStatus: *Pending Approval*`);
        
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
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12 text-slate-800">
      <Navbar />
      
      {/* Search & Shortcuts Sticky Bar */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 p-4 shadow-sm sticky top-[68px] z-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* Search Box */}
          <div className="w-full md:max-w-md relative">
            <input 
              type="text" 
              placeholder="🔍 Saaman ka naam ya category dhoondhein..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-slate-200 pl-10 pr-4 py-2.5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-inner bg-slate-50 transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-3 text-slate-400 hover:text-rose-500 font-bold text-xs cursor-pointer">✕ Clear</button>
            )}
          </div>

          {/* Quick Filter & Actions */}
          <div className="flex gap-2 w-full md:w-auto justify-between sm:justify-end items-center">
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold overflow-x-auto">
              {["All", "Combos", "Groceries", "Snacks", "Beverages"].map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all whitespace-nowrap ${selectedCategory === cat ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {!isAdmin && loggedInUser && (
              <div className="flex gap-2">
                <button onClick={() => setIsOrdersOpen(true)} className="bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl font-bold text-xs border border-slate-200 shadow-sm cursor-pointer transition-all">📜 Orders ({userOrders.length})</button>
                <button onClick={() => setIsCartOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md cursor-pointer transition-all">🛒 Cart ({cart.length})</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modern Product Display Section */}
      <main className="max-w-6xl mx-auto p-4 mt-6">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-slate-100 max-w-md mx-auto mt-10">
            <p className="text-4xl">🍿</p>
            <p className="text-slate-400 font-medium mt-3">Maaf kijiye, koi saaman nahi mila.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {filteredProducts.map((item) => {
              // 👇 NAYA: Percentage Calculate Karne ka logic
              const discountPercent = item.originalPrice && item.originalPrice > item.price 
                ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) 
                : 0;

              return (
                <div key={item._id} className="bg-white rounded-3xl shadow-sm hover:shadow-xl border border-slate-100/60 p-4 flex flex-col transition-all transform hover:-translate-y-1 relative">
                  
                  {/* Image Container */}
                  <div className="bg-slate-50 h-40 rounded-2xl mb-4 flex items-center justify-center overflow-hidden relative shadow-inner group">
                    <img src={item.image || "https://via.placeholder.com/150"} alt={item.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <span className="absolute top-2 left-2 text-[10px] font-black tracking-wide uppercase text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full shadow-sm">{item.category}</span>
                    
                    {/* 👇 NAYA: Agar discount hai toh percentage dikhega, warna Combos pe normal OFFER dikhega 👇 */}
                    {discountPercent > 0 ? (
                      <span className="absolute top-2 right-2 bg-rose-500 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-md animate-pulse">
                        {discountPercent}% OFF 🔥
                      </span>
                    ) : item.category === 'Combos' && (
                      <span className="absolute top-2 right-2 bg-rose-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md animate-pulse">OFFER 🔥</span>
                    )}
                  </div>
                  
                  {/* Details */}
                  <div className="mb-4 flex-1">
                    <h3 className="font-bold text-slate-800 text-base leading-tight tracking-tight">{item.name}</h3>
                    <p className="text-xs text-slate-400 font-medium mt-1">Stock: {item.stock} pcs</p>
                  </div>

                  {/* Pricing Row */}
                  <div className="mt-auto flex justify-between items-center pt-2 border-t border-slate-50">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Price</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="font-black text-slate-900 text-lg">₹{item.price}</p>
                        
                        {/* 👇 NAYA: Yahan purana price aur percentage badge dikhaya gaya hai 👇 */}
                        {item.originalPrice > item.price && (
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs text-slate-400 line-through font-bold">₹{item.originalPrice}</p>
                            <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md border border-emerald-200">
                              -{discountPercent}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    {!isAdmin && (
                      <button 
                        onClick={() => addToCart(item)} 
                        className="bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white px-4 py-2 rounded-xl text-xs font-black transition-all shadow-sm hover:shadow cursor-pointer transform active:scale-95"
                      >
                        + ADD
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modern Cart Slide Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 flex flex-col overflow-y-auto animate-slide-in">
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">🛒 Aapka Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-rose-500 font-bold text-xl cursor-pointer">✕</button>
            </div>
            {cart.length === 0 ? (
              <div className="text-center my-auto text-slate-400 font-medium">
                <p className="text-4xl mb-2">🧺</p>Cart ekdum khaali hai!
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto pr-1">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl mb-3 shadow-sm border border-slate-100">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                      <p className="text-xs text-emerald-600 font-extrabold mt-0.5">₹{item.price}</p>
                    </div>
                    <button onClick={() => removeFromCart(index)} className="text-rose-400 hover:text-rose-600 text-xs font-bold cursor-pointer bg-white px-2.5 py-1 rounded-lg border shadow-sm">Remove</button>
                  </div>
                ))}
              </div>
            )}
            
            {cart.length > 0 && (
              <div className="mt-auto pt-4 border-t border-slate-100 bg-white">
                
                {/* Delivery ya Pickup Option UI */}
                <div className="my-4 bg-slate-50 p-4 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="font-bold mb-3 text-sm text-slate-800">📦 Order Kaise Lena Hai?</h3>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600">
                      <input type="radio" value="Pickup" checked={orderType === 'Pickup'} onChange={(e) => setOrderType(e.target.value)} className="accent-emerald-600" />
                      🛍️ Dukaan Se (Pickup)
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600">
                      <input type="radio" value="Delivery" checked={orderType === 'Delivery'} onChange={(e) => setOrderType(e.target.value)} className="accent-emerald-600" />
                      🛵 Room Par (Delivery)
                    </label>
                  </div>

                  {orderType === 'Delivery' && (
                    <textarea 
                      placeholder="Hostel Name, Room No., ya Address likhein..."
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full mt-3 p-2.5 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      rows="2"
                      required
                    />
                  )}
                </div>

                <div className="flex justify-between text-base font-bold mb-4 px-1">
                  <span className="text-slate-400">Total Bill Amount:</span>
                  <span className="text-emerald-600 text-xl font-black">₹{totalBill}</span>
                </div>
                <button onClick={handleCheckout} className="w-full bg-emerald-600 text-white py-3.5 rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all shadow-md active:scale-95 cursor-pointer">
                  Confirm Order & Send Bill 🚀
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modern Order History Slide Drawer */}
      {isOrdersOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 flex flex-col overflow-y-auto">
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">📄 Purchase History</h2>
              <button onClick={() => setIsOrdersOpen(false)} className="text-slate-400 hover:text-rose-500 font-bold text-xl cursor-pointer">✕</button>
            </div>
            {userOrders.length === 0 ? (
              <div className="text-center my-auto text-slate-400 font-medium">Aapne koi order nahi kiya hai.</div>
            ) : (
              <div className="flex flex-col gap-4 overflow-y-auto pr-1">
                {userOrders.map((order) => (
                  <div key={order._id} className="border border-slate-100 p-4 rounded-2xl bg-slate-50 flex flex-col gap-2 shadow-sm">
                    <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                      <span className="text-slate-400 font-bold text-[10px]">🗓️ {new Date(order.createdAt).toLocaleDateString()}</span>
                      <span className={`px-2.5 py-1 rounded-full font-black text-[10px] uppercase tracking-wider ${
                        order.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                        order.status === 'Accepted' ? 'bg-sky-100 text-sky-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>{order.status}</span>
                    </div>
                    
                    {/* User History Me Order Type Dikhana */}
                    <div className="text-[10px] font-bold mt-1 text-slate-500">
                      {order.orderType === 'Delivery' ? `🛵 Delivery: ${order.deliveryAddress}` : `🛍️ Store Pickup`}
                    </div>

                    <div className="text-slate-600 font-semibold text-xs py-1">
                      {order.items.map((i, idx) => <span key={idx} className="bg-white border px-2 py-0.5 rounded-md mr-1 inline-block mt-1">{i.name}</span>)}
                    </div>
                    <div className="flex justify-between items-center mt-1 pt-1 border-t border-slate-200/40">
                      <span className="text-xs font-bold text-slate-400">Total Paid</span>
                      <p className="font-black text-slate-800 text-sm">₹{order.totalBill}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
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