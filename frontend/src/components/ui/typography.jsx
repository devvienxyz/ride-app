import { Link } from "react-router";


const BrandHeader1 = ({ children }) => (
  <h1 className="brand text-6xl mb-8 text-center">{children}</h1>
)

const Header2 = ({ children }) => (
  <h2 className="text-2xl text-center mb-6">{children}</h2>
)

const SubHeader = ({ children }) => (
  <p className="text-md mb-4 font-light">{children}</p>
)

const ErrorDiv = ({ children }) => (
  <div className="font-light text-md text-red-600 mb-2">{children}</div>
)

const AppLink = ({ children, addlClasses = "", underline = false, ...props }) => (
  <Link className={`text-blue-800 ${underline ? "underline" : ""} ${addlClasses}`} {...props}>
    {children}
  </Link>
)

const BrandLink = ({ children, addlClasses = "", ...props }) => (
  <AppLink addlClasses={`brand ${addlClasses}`} {...props}>{children}</AppLink>
)


export { BrandHeader1, Header2, SubHeader, ErrorDiv, AppLink, BrandLink }
