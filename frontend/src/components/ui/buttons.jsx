import { ChevronLeft, ChevronRight } from "@icons";

const LeanButton = ({ children, addlClasses = "", ...props }) => {
  const baseClasses = "w-full bg-transparent disabled:text-gray-500 text-xl rounded m-0 p-0";
  const classes = `${baseClasses} ${addlClasses}`;

  return <button className={classes} {...props}>{children}</button>;
};

const Button = ({ children, addlClasses = "", ...props }) => {
  const baseClasses = "w-full flex justify-center bg-blue-600 disabled:bg-blue-100 text-xl text-white rounded mt-4 py-4";
  const classes = `${baseClasses} ${addlClasses}`;

  return <button className={classes} {...props}>{children}</button>;
};

const BrandButton = ({ children, ...props }) => (
  <Button addlClasses="brand" {...props}>
    {children}
  </Button>
)

const ChevronLeftButton = ({ props }) => (
  <Button addlClasses="bg-transparent" {...props}>
    <ChevronLeft stroke="oklch(28.2% 0.091 267.935)" />
  </Button>
)

const ChevronRightButton = ({ props }) => (
  <Button addlClasses="bg-transparent" {...props}>
    <ChevronRight stroke="oklch(28.2% 0.091 267.935)" />
  </Button>
)

export { Button, BrandButton, LeanButton, ChevronLeftButton, ChevronRightButton }