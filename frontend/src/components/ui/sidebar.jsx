import { XMark } from "@icons"
import Spinner from "./loaders"

function LoaderSidebar({ onClose }) {
  return (
    <div className="fixed z-2 right-0 top-0 w-full sm:w-2/3 lg:w-1/3 xl:max-w-1/4 h-full bg-slate-50 shadow p-8 pt-12 flex flex-col text-slate-800">
      <div className="flex flex-col h-full justify-center">
        <Spinner />
        <button onClick={onClose} className="text-slate-900 self-center mb-2 underline">Close this view</button>
      </div>
    </div>
  )
}

export default function Sidebar({ onClose, children }) {
  return (
    <div className="fixed z-2 right-0 top-0 w-full sm:w-2/3 lg:w-1/3 xl:max-w-1/4 h-full bg-slate-50 shadow p-8 pt-12 flex flex-col text-slate-800">
      <button onClick={onClose} className="text-slate-900 self-end mb-2">
        <XMark />
      </button>
      {children}
    </div>
  )
}

export { LoaderSidebar }