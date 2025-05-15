const ChevronLeft = ({ stroke = "currentColor", fill = "none", size = "16px", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill={fill}
    viewBox="0 0 24 24"
    strokeWidth={3}
    stroke={stroke}
    aria-hidden="true"
    data-slot="icon"
    className=""
    width={size}
    height={size}
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>
)

const ChevronRight = ({ stroke = "currentColor", fill = "none", size = "16px", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill={fill}
    viewBox="0 0 24 24"
    strokeWidth={3}
    stroke={stroke}
    aria-hidden="true"
    data-slot="icon"
    className=""
    width={size}
    height={size}
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>
)

export { ChevronLeft, ChevronRight }
