import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Signup() {
  const [formData, setFormData] = useState({ name: '', phone: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5005/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Account Created Successfully! Redirecting...');
        setTimeout(() => navigate('/login'), 1500); // Login page par bhejo
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      setMessage('❌ Server Connection Offline.');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center p-6 font-sans text-slate-800">
      <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full border border-slate-100 transform transition-all duration-300">
        
        {/* Header Icon & Text */}
        <div className="text-center mb-6">
          <span className="text-4xl bg-slate-50 p-3 rounded-2xl shadow-inner inline-block">👤</span>
          <h2 className="text-2xl font-black text-slate-800 mt-4 tracking-tight">Create Account</h2>
          <p className="text-slate-400 font-medium text-xs mt-1">Meena Supermart par shopping karne ke liye register karein</p>
        </div>

        {/* Dynamic Alert Messages */}
        {message && (
          <div className={`p-3 text-xs rounded-xl mb-4 text-center font-bold border shadow-inner ${
            message.includes('❌') ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
          }`}>
            {message}
          </div>
        )}

        {/* Premium Form Layout */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-black uppercase text-slate-400 tracking-wider mb-1.5">Full Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              placeholder="Abhishek Meena" 
              className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 transition-all" 
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-400 tracking-wider mb-1.5">WhatsApp / Mobile Number</label>
            <input 
              type="tel" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              required 
              placeholder="9876543210" 
              className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 transition-all" 
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-400 tracking-wider mb-1.5">Choose Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
              placeholder="••••••••" 
              className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 transition-all" 
            />
          </div>

          <button 
            type="submit" 
            className="mt-2 w-full bg-emerald-600 text-white py-3.5 rounded-xl font-black text-sm hover:bg-emerald-700 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            Register Now 🚀
          </button>
        </form>

        {/* Bottom Link */}
        <p className="text-center mt-6 text-xs font-semibold text-slate-400">
          Already registered? <Link to="/login" className="text-emerald-600 hover:underline font-black">Secure Sign In</Link>
        </p>
        
      </div>
    </div>
  );
}

export default Signup;