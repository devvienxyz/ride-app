import useStore from "@/store"
import axiosInstance from "@/axios";
import { LeanButton } from "./buttons"
import { BrandLink } from "./typography";

const NavBar = () => {
  const { logout } = useStore((state) => state)

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post("/logout/", {}, { withCredentials: true });
      logout()
      navigate("/")
    } catch (err) { }
  }

  return (
    <nav className="overflow-x-hidden absolute top-0 px-4 sm:px-12 py-4 w-full bg-white">
      <ul className="sm:mx-12 flex flex-row justify-between">
        <li>
          <BrandLink addlClasses="text-2xl text-blue-950" to="/">ride</BrandLink>
        </li>
        <li className="self-center">
          <LeanButton onClick={handleLogout} addlClasses="text-[1rem] text-blue-950">Log out</LeanButton>
        </li>
      </ul>
    </nav>
  )
}
export default function Layout({ children }) {
  const { user } = useStore((state) => state)
  const addlClasses = !!user ? "mt-16" : "";

  return (
    <div className={`w-screen h-screen overflow-x-hidden mx-auto text-blue-950 bg-blue-50 ${addlClasses}`}>
      {user && <NavBar />}
      {children}
    </div>
  )
}
