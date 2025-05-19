import { useState } from "react";
import { DownwardChevron } from "@icons/chevron";

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
  MultiSelectOnDropdown,
}