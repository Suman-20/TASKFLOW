
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/Api.jsx";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const { data } = await API.post("/auth/login", {
          email,
          password,
        });

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data));

        navigate("/");
      } else {
        await API.post("/auth/signup", {
          name,
          email,
          password,
        });

        alert("Signup successful! Now login.");
        setIsLogin(true);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-amber-50 px-4">

     
      <div className="flex items-center gap-1 mb-8">
        <span className="text-5xl">📋</span>
        <h1 className="text-4xl font-mono font-bold tracking-tight text-stone-800">
          TASKFLOW
        </h1>
      </div>

 
      <div className="w-full max-w-md bg-white border-l-8 border-amber-600 p-8 rounded-r-2xl shadow-sm">

        {/* welcome header */}
        <h2 className="font-mono text-sm uppercase tracking-wider text-stone-500 mb-2 flex items-center gap-2">
          <span className="bg-amber-600 w-2 h-2 rounded-full"></span>
          {isLogin ? "WELCOME BACK" : "NEW HERE?"}
        </h2>
        <p className="font-serif text-2xl text-stone-800 mb-8">
          {isLogin ? "sign in to your account" : "create your account"}
        </p>

        {/* 🔘 TOGGLE – stone & amber pills */}
        <div className="flex mb-8 bg-stone-100 p-1 rounded-full">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2.5 text-sm font-mono rounded-full transition-all ${
              isLogin 
                ? "bg-stone-800 text-amber-100 shadow-sm" 
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            LOGIN
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2.5 text-sm font-mono rounded-full transition-all ${
              !isLogin 
                ? "bg-stone-800 text-amber-100 shadow-sm" 
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            SIGNUP
          </button>
        </div>

        {/* 📝 FORM – clean, border-b like dashboard */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase tracking-wider text-stone-500 ml-1">
                full name
              </label>
              <input
                type="text"
                placeholder="e.g. Suman Raul"
                required
                className="w-full bg-stone-50 border-b-2 border-stone-200 p-3 text-lg focus:outline-none focus:border-amber-600 font-serif placeholder:text-stone-400"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-mono uppercase tracking-wider text-stone-500 ml-1">
              email
            </label>
            <input
              type="email"
              placeholder="hello@example.com"
              required
              className="w-full bg-stone-50 border-b-2 border-stone-200 p-3 text-lg focus:outline-none focus:border-amber-600 font-serif placeholder:text-stone-400"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono uppercase tracking-wider text-stone-500 ml-1">
              password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              required
              className="w-full bg-stone-50 border-b-2 border-stone-200 p-3 text-lg focus:outline-none focus:border-amber-600 font-serif placeholder:text-stone-400"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="w-full bg-stone-800 text-amber-100 py-3.5 font-mono text-sm tracking-wider hover:bg-stone-900 transition-colors rounded-none mt-8">
            {isLogin ? "→ LOGIN" : "→ CREATE ACCOUNT"}
          </button>

          {/* subtle hint */}
          <p className="text-center text-xs font-mono text-stone-400 pt-4">
            {isLogin ? "new here? switch to signup ↑" : "already have an account? login ↑"}
          </p>
        </form>
      </div>

      {/* tiny footer – matches dashboard timestamp style */}
      <div className="text-[10px] font-mono text-stone-400 mt-8">
        <span>📋 TASKFLOW · organized simplicity</span>
      </div>
    </div>
  );
};

export default Auth;




