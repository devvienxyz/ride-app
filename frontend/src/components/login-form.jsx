import { useState } from "react";
import axios from "axios";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await axios.post("/api/login/", { email, password });
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      // Redirect or update UI
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleLogin} className="bg-blue-50 flex flex-col w-full p-8 border border-none rounded">
      <h1 className="brand text-6xl mb-8 text-center">ride</h1>
      <h2 className="text-2xl text-center mb-6">Sign in</h2>
      <h2 className="text-md mb-4 font-light">Sign in with your email address</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        className="block w-full mb-2 p-2 border rounded"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        className="block w-full mb-2 p-2 border rounded"
      />
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <button type="submit" className="brand w-full bg-blue-600 text-xl text-white rounded mt-4 py-4">
        Sign in
      </button>
    </form>
  );
}
