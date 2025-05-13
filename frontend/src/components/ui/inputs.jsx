const EmailInput = (props) => (
  <input
    type="email"
    placeholder="Email"
    className="block w-full mb-2 p-2 border rounded"
    {...props}
  />
);

const PasswordInput = (props) => (
  <input
    type="password"
    placeholder="Password"
    className="block w-full mb-2 p-2 border rounded"
    {...props}
  />
)

export { EmailInput, PasswordInput }