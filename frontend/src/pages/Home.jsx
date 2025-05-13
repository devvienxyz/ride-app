import LoginForm from "@components/login-form";

export default function Home() {
  return (
    <div className="bg-blue-800 w-full h-full flex justify-center">
      <div className="self-center w-full xl:w-1/5">
        <LoginForm />
      </div>
    </div >
  );
}