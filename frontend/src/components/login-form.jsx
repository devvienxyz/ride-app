import axios from "axios";
import { useState } from "react";
import { EmailInput, PasswordInput, BrandButton, BrandHeader1, Header2, SubHeader, ErrorDiv, BrandLink } from "@components/ui";

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
      <BrandHeader1>ride</BrandHeader1>

      <Header2>Sign in</Header2>

      <SubHeader>Sign in with your email address</SubHeader>

      <EmailInput
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required />

      <PasswordInput
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required />

      {error && <ErrorDiv>{error}</ErrorDiv>}

      <BrandButton type="submit">Sign in</BrandButton>

      <div className="mt-4">
        <SubHeader>
          Don't have an account? <BrandLink to={"/#"}>Sign up now</BrandLink>
        </SubHeader>
      </div>
    </form>
  );
}
