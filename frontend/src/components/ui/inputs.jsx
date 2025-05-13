const BaseInput = (props) => (
  <input
    className="block w-full mb-2 px-2 py-4 text-xl placeholder-gray-400 border rounded"
    {...props}
  />
)

const EmailInput = (props) => (
  <BaseInput
    type="email"
    placeholder="Email"
    {...props}
  />
);

const PasswordInput = (props) => (
  <BaseInput
    type="password"
    placeholder="Password"
    {...props}
  />
)

export { BaseInput, EmailInput, PasswordInput }