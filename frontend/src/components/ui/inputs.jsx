import { useState } from "react";
import { Info as InfoIcon } from "@icons/misc"
import { DownwardChevron } from "@icons/chevron";
import { getMaxLocal, getNowLocal } from "@utils/booking";

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

function TextAreaInput({ name, label, value, handleChange }) {
  return (
    <div className="flex flext-col">
      <label className="block text-sm font-bold text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        name={name}
        maxLength={200}
        rows={3}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 resize-none"
        placeholder="Enter description (max 200 characters)"
        value={!!value || ""}
        onChange={handleChange}
      />
      <p className="text-xs text-gray-500 mt-1">
        {200 - (value?.length || 0)} characters remaining
      </p>
    </div>
  )
}

function DateTimeField({ name, label, value, handleChange, helperText = null }) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="text-sm font-bold text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="datetime-local"
        id={name}
        name={name}
        value={value || ""}
        onChange={handleChange}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        maxLength={100}
        min={getNowLocal()}
        max={getMaxLocal()}
      />

      {helperText && (
        <div className="mt-2 flex text-xs text-slate-500">
          <InfoIcon />
          {helperText}
        </div>
      )}
    </div>
  )
}

function SingleSelectOnDropdown({ name, options, handleChange, label, currentValue }) {
  const handlePreChange = (e) => {
    if (e.target.value !== currentValue) handleChange(e);
  }

  return (
    <div className="w-full">
      <label className="block mb-1 text-sm font-bold text-slate-800">
        {label}
      </label>

      <div className="relative">
        <select
          name={name}
          onChange={handlePreChange}
          defaultValue={currentValue}
          className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer">
          {Object.entries(options).map(([key, value]) => (
            <option key={key} value={key}>{value}</option>
          ))}
        </select>
        <span className="h-5 w-5 ml-1 absolute top-2.5 right-2.5">
          <DownwardChevron className="" />
        </span>
      </div>
    </div>
  )
}

function MultiSelectOnDropdown({ filterLabel, filterOptions, onMultiselectChange }) {
  const [selected, setSelected] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false)

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    const updated = e.target.checked
      ? [...selected, value]
      : selected.filter((v) => v !== value);

    setSelected(updated);
    onMultiselectChange(updated);
  };

  return (
    <div className="h-full relative inline-block text-left">
      <button
        className="inline-flex h-full w-full items-center justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
        type="button"
        onClick={() => setShowDropdown(!showDropdown)}>
        {filterLabel}<DownwardChevron />
      </button>

      {showDropdown && (
        <div className="absolute left-1/2 -translate-x-1/2 z-10 mt-2 w-auto origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-hidden">
          <div className="flex">
            <fieldset className="space-y-2 p-3">
              {Object.entries(filterOptions).map(([key, optLabel]) => (
                <label key={key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={key}
                    checked={selected.includes(key)}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">{optLabel}</span>
                </label>
              ))}
            </fieldset>
          </div>
        </div>
      )}
    </div>
  )
}

export {
  BaseInput,
  EmailInput,
  PasswordInput,
  SingleSelectOnDropdown,
  MultiSelectOnDropdown,
  TextAreaInput,
  DateTimeField,
}