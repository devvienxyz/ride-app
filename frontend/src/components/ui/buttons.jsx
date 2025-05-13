const BrandButton = ({ children, ...props }) => (
  <button className="brand w-full bg-blue-600 disabled:bg-blue-100 text-xl text-white rounded mt-4 py-4" {...props}>
    {children}
  </button>
)

export { BrandButton }