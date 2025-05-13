import LoginForm from "@components/login-form";

export default function Home() {
  return (
    <div className="bg-blue-800 w-full h-full flex justify-center">
      <div className="self-center w-full max-w-11/12 sm:1/2 md:w-1/2 lg:min-w-1/3 lg:w-2/3 lg:max-w-2/5 xl:min-w-1/4 xl:w-1/3 xl:max-w-1/5">
        <LoginForm />
      </div>
    </div >
  );
}