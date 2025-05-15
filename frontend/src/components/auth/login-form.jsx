import { useState } from "react";
import { useNavigate } from "react-router";
import useStore from "@/store"
import axiosInstance from "@/axios"
import { EmailInput, PasswordInput } from "@components/ui/inputs";
import { BrandButton } from "@components/ui/buttons";
import { BrandHeader1, Header2, SubHeader, ErrorDiv, BrandLink } from "@components/ui/typography";

export default function LoginForm() {
  const navigate = useNavigate();
  const { setUser } = useStore((state) => state)

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await axiosInstance.post("/login/", { email, password }, { withCredentials: true });
      const { first_name } = res.data;
      setUser({ email, first_name })
      navigate("/")
    } catch (err) {
      setError("Invalid credentials");
      setUser(null)
    }
  };

  return (
    <form onSubmit={handleLogin} className="bg-blue-50 flex flex-col w-full py-8 px-2 sm:px-8 lg:p-8 border border-none rounded">
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
          Don't have an account? <BrandLink underline={true} to={"/#"}>Sign up now</BrandLink>
        </SubHeader>
      </div>
    </form>
  );
}
