import useStore from "@/store";
import { Login } from "@components/auth";
import { Rides, RideEvents } from "@components/rides";
import MapSelector from "@components/map-selector/map-selector";


export default function Home() {
  const { user } = useStore((state) => state)

  return (
    <div>
      {!user ? (
        <Login />
      ) : (
        <div className="flex flex-col">
          <div className="lg:py-6">
            <MapSelector />
          </div>
          <div className="lg:py-6">
            {/* render only for users with admin level access */}
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
