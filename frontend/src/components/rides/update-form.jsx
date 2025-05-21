import { useState } from "react"
import axiosInstance from "@/axios";
import { StatusFilterOptions } from "@/constants"
import { SingleSelectOnDropdown, DateTimeField } from "@/components/ui";

function DetailFormItem({ label: itemLabel, children }) {
  return (
    <div className="">
      <label className="mt-4 font-semibold">{itemLabel}</label>
      <input className="text-slate-500" />
    </div>
  )
}

export default function RideEditForm({ currentValues, rideId, setIsEditing }) {
  const [formData, setFormData] = useState({
    status: currentValues.status || "",
    pickup_time: currentValues.pickup_time || ""
  });

  const handleCancel = (e) => {
    setIsEditing(false);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    // TODO: prompt dialog -- Please confirm bla bla bla
    e.preventDefault();

    try {
      await axiosInstance.patch(`/rides/${rideId}`, formData, { withCredentials: true })
    } catch (err) {
      return;
    }

    setIsEditing(false);
  };

  return (
    <form>
      <div className="flex flex-col gap-6">

        <SingleSelectOnDropdown
          name="status"
          options={StatusFilterOptions}
          label={"Ride Status"}
          handleChange={handleChange}
          currentValue={currentValues.status}
        />

        <DateTimeField
          name="pickup_time"
          label="Pickup time"
          handleChange={handleChange}
          value={formData.pickup_time}
          helperText={"Pickup time must be within 2 hours from now."}
        />

        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-6 md:px-24 lg:px-20">
          <button onClick={handleSave} className="py-2 px-4 md:w-full text-gray-800 text-md border rounded-md border-slate-900 bg-transparent hover:border-slate-500 hover:bg-slate-500 hover:text-white">Save</button>
          <button onClick={handleCancel} className="py-2 px-4 md:w-full text-gray-800 text-md border rounded-md border-slate-900 bg-transparent hover:border-red-300 hover:bg-red-400 hover:text-white">Cancel</button>
        </div>
      </div>
    </form>
  )
}

export { DetailFormItem }