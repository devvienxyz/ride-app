import useStore from "@/store"
import { LeanButton } from "./buttons"
import { BrandLink } from "./typography";

const NavBar = () => {
  const { logout } = useStore((state) => state)

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/api/logout/", {}, { withCredentials: true });
      logout()
      navigate("/")
    } catch (err) { }
  }

  return (
    <nav className="overflow-x-hidden absolute top-0 px-6 py-4 w-full bg-blue-800">
      <ul className="flex flex-row justify-between">
        <li>
          <BrandLink addlClasses="text-2xl text-white" to="/">ride</BrandLink>
        </li>
        <li className="self-center">
          <LeanButton onClick={handleLogout} addlClasses="text-[1rem]">Log out</LeanButton>
        </li>
      </ul>
    </nav>
  )

}
export default function Layout({ children }) {
  const { user } = useStore((state) => state)
  const addlClasses = !!user ? "mt-16" : "";

  return (
    <div className={`w-screen h-screen overflow-x-hidden mx-auto ${addlClasses}`}>
      {user && <NavBar />}
      {children}
    </div>
  )
}
