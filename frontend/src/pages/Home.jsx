import useStore from "@/store";
import { Login } from "@components/auth";
import { Rides, RideEvents } from "@components/rides";


export default function Home() {
  const { user } = useStore((state) => state)

  return (
    <div>
      {!user ? (
        <Login />
      ) : (
        <div className="flex flex-col">
          <div className="lg:py-6">
            <Rides />
          </div>
{/* 
          <div className="lg:py-6">
            <RideEvents />
          </div> */}
        </div>
      )}
    </div>
  );
}
