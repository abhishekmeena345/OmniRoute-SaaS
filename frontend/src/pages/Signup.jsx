import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Signup() {
  const [formData, setFormData] = useState({ name: '', phone: '', password: '' });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('https://omniroute-backend-nzap.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Account Created Successfully! Redirecting...');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      setMessage('❌ Server Connection Offline.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = (fieldName) => `
    w-full px-4 py-3.5 rounded-2xl text-sm font-medium
    border-2 transition-all duration-300 ease-out
    bg-white/60 backdrop-blur-sm
    ${focusedField === fieldName 
      ? 'border-emerald-500 bg-white shadow-lg shadow-emerald-500/10 scale-[1.02]' 
      : 'border-slate-200 hover:border-slate-300'}
    placeholder:text-slate-400 text-slate-800
    focus:outline-none
    sm:text-base sm:px-5 sm:py-4
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/50 
                    flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-300/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      
      {/* Floating Particles */}
      <div className="absolute top-20 right-10 w-2 h-2 bg-emerald-400 rounded-full opacity-60 animate-bounce hidden sm:block" style={{ animationDelay: '0s' }} />
      <div className="absolute top-40 left-20 w-3 h-3 bg-teal-400 rounded-full opacity-40 animate-bounce hidden sm:block" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-32 right-32 w-2 h-2 bg-emerald-300 rounded-full opacity-50 animate-bounce hidden sm:block" style={{ animationDelay: '1s' }} />

      {/* Main Card */}
      <div className="relative w-full max-w-[420px] bg-white/80 backdrop-blur-xl 
                      rounded-3xl shadow-2xl shadow-slate-200/50 
                      border border-white/50 p-6 sm:p-8 
                      transform transition-all duration-500 hover:shadow-emerald-100/50">
        
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
            <span className="relative text-5xl sm:text-6xl bg-gradient-to-b from-emerald-50 to-white p-4 rounded-3xl shadow-inner inline-block transform hover:scale-110 transition-transform duration-300">
              👤
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-6 tracking-tight bg-clip-text">
            Create Account
          </h1>
          <p className="text-slate-500 font-medium text-sm sm:text-base mt-2 max-w-[280px] mx-auto leading-relaxed">
            Goyal Supermart par shopping karne ke liye register karein
          </p>
        </div>

        {/* Alert Messages */}
        <div className={`transition-all duration-500 ease-out overflow-hidden ${message ? 'max-h-24 opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'}`}>
          {message && (
            <div className={`p-4 rounded-2xl text-center font-bold text-sm sm:text-base shadow-lg backdrop-blur-sm border ${
              message.includes('❌') 
                ? 'bg-rose-50/90 text-rose-600 border-rose-200 shadow-rose-200/20' 
                : 'bg-emerald-50/90 text-emerald-700 border-emerald-200 shadow-emerald-200/20'
            }`}>
              <span className="animate-pulse inline-block mr-1">
                {message.includes('❌') ? '⚠️' : '🎉'}
              </span>
              {message.replace('❌ ', '').replace('✅ ', '')}
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6">
          
          {/* Name Field */}
          <div className="group">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1 group-focus-within:text-emerald-600 transition-colors">
              Full Name
            </label>
            <div className="relative">
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                required 
                placeholder="Apna naam dale"
                className={inputClasses('name')}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-all duration-300 pointer-events-none">
                {formData.name && <span className="text-emerald-500 text-lg">✓</span>}
              </span>
            </div>
          </div>

          {/* Phone Field */}
          <div className="group">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1 group-focus-within:text-emerald-600 transition-colors">
              WhatsApp / Mobile
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm sm:text-base">+91</span>
              <input 
                type="tel" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField(null)}
                required 
                maxLength="10"
                pattern="[0-9]{10}"
                placeholder="9876543210"
                className={`${inputClasses('phone')} pl-12 sm:pl-14`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-all duration-300 pointer-events-none">
                {formData.phone.length === 10 && <span className="text-emerald-500 text-lg">✓</span>}
              </span>
            </div>
            {formData.phone && formData.phone.length !== 10 && (
              <p className="text-rose-500 text-xs mt-1.5 ml-1 font-medium animate-pulse">10 digits required</p>
            )}
          </div>

          {/* Password Field */}
          <div className="group">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1 group-focus-within:text-emerald-600 transition-colors">
              Password
            </label>
            <div className="relative">
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                required 
                minLength="6"
                placeholder="Min 6 characters"
                className={inputClasses('password')}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-all duration-300 pointer-events-none">
                {formData.password.length >= 6 && <span className="text-emerald-500 text-lg">✓</span>}
              </span>
            </div>
            {formData.password && formData.password.length < 6 && (
              <p className="text-rose-500 text-xs mt-1.5 ml-1 font-medium animate-pulse">Minimum 6 characters</p>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="mt-2 w-full bg-gradient-to-r from-emerald-600 to-teal-600 
                     text-white py-4 rounded-2xl font-black text-sm sm:text-base
                     shadow-xl shadow-emerald-500/30 
                     hover:shadow-emerald-500/50 hover:scale-[1.02] hover:from-emerald-500 hover:to-teal-500
                     active:scale-95 
                     disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100
                     transition-all duration-300 ease-out
                     flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Register Now</span>
                <span className="text-lg">🚀</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-center text-sm font-semibold text-slate-500">
            Already registered?{' '}
            <Link to="/login" 
                  className="text-emerald-600 hover:text-emerald-700 font-black underline-offset-4 hover:underline transition-all">
              Secure Sign In →
            </Link>
          </p>
        </div>

        {/* Trust Badges */}
        <div className="mt-6 flex justify-center gap-4 opacity-50">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
            <span className="text-emerald-500">🔒</span> SSL Secure
          </span>
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
            <span className="text-emerald-500">⚡</span> Fast
          </span>
        </div>
      </div>
    </div>
  );
}

export default Signup;