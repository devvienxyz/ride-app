const BrandButton = ({ children, ...props }) => (
  <button className="brand w-full bg-blue-600 text-xl text-white disabled:bg-blue-100 rounded mt-4 py-4">
    {children}
  </button>
)

export { BrandButton }