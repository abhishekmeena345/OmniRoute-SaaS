import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5005/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setMessage('✅ Access Granted! Redirecting...');
        setTimeout(() => navigate('/'), 1500);
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) { setMessage('❌ Server Connection Offline.'); }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center p-6 font-sans text-slate-800">
      <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full border border-slate-100 transform transition-all duration-300">
        <div className="text-center mb-6">
          <span className="text-4xl bg-slate-50 p-3 rounded-2xl shadow-inner inline-block">🔒</span>
          <h2 className="text-2xl font-black text-slate-800 mt-4 tracking-tight">Welcome Back!</h2>
          <p className="text-slate-400 font-medium text-xs mt-1">Apna credentials enter karke store access karein</p>
        </div>

        {message && <div className="p-3 text-xs rounded-xl mb-4 text-center font-bold bg-slate-50 border shadow-inner text-emerald-600">{message}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-black uppercase text-slate-400 tracking-wider mb-1.5">Registered Mobile Number</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="9876543210" className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50" />
          </div>
          <div>
            <label className="block text-xs font-black uppercase text-slate-400 tracking-wider mb-1.5">Secret Key Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50" />
          </div>
          <button type="submit" className="mt-2 w-full bg-emerald-600 text-white py-3.5 rounded-xl font-black text-sm hover:bg-emerald-700 shadow-md active:scale-95 transition-all cursor-pointer">
            Secure Sign In 🚀
          </button>
        </form>
        <p className="text-center mt-6 text-xs font-semibold text-slate-400">
          New user setup? <Link to="/signup" className="text-emerald-600 hover:underline font-black">Create Account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;