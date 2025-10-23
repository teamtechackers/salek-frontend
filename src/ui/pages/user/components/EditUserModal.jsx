import React, { useEffect, useRef, useState } from "react";

const EditUserModal = ({open, onClose }) => {
  const [showDependents, setShowDependents] = useState(true);
    const confirmRef = useRef(null)
    const previouslyFocused = useRef(null)
    useEffect(() => {
      if (open) {
        previouslyFocused.current = document.activeElement
        const t = setTimeout(() => confirmRef.current?.focus(), 0)
        document.body.style.overflow = "hidden"
        const onKey = (e) => {
          if (e.key === "Escape") onClose()
        }
        window.addEventListener("keydown", onKey)
        return () => {
          window.removeEventListener("keydown", onKey)
          document.body.style.overflow = ""
          if (previouslyFocused.current instanceof HTMLElement) {
            previouslyFocused.current.focus()
          }
          clearTimeout(t)
        }
      }
    }, [open, onClose])
  
    if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 text-white px-5 py-3 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Edit</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-700 rounded-full w-7 h-7 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="p-5 max-h-[80vh] overflow-y-auto space-y-4">
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              defaultValue="Sarah Malik"
              className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          {/* DOB & Gender */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Date of Birth</label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                <input
                  type="text"
                  defaultValue="25 August 1985"
                  className="flex-1 outline-none bg-transparent"
                />
                <span className="text-gray-500 cursor-pointer">📅</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Gender</label>
              <select className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500">
                <option>Female</option>
                <option>Male</option>
              </select>
            </div>
          </div>

          {/* Country & Address */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Country</label>
              <select className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500">
                <option>India</option>
                <option>Pakistan</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Address</label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                <input
                  type="text"
                  defaultValue="abc street Xyz city"
                  className="flex-1 outline-none bg-transparent"
                />
                <span className="text-gray-500 cursor-pointer">✏️</span>
              </div>
            </div>
          </div>

          {/* Phone Number */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              defaultValue="+919837197371"
              className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          {/* Marital & Children */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Marital Status</label>
              <select className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500">
                <option>Married</option>
                <option>Single</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Children</label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                <input
                  type="text"
                  defaultValue="2"
                  className="flex-1 outline-none bg-transparent"
                />
                <span className="text-gray-500 cursor-pointer">✏️</span>
              </div>
            </div>
          </div>

          {/* Pregnancy & Trimester */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Pregnancy</label>
              <select className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500">
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Trimester</label>
              <select className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500">
                <option>1</option>
                <option>2</option>
                <option>3</option>
              </select>
            </div>
          </div>

          {/* Dependents */}
          <div>
            <button
              onClick={() => setShowDependents(!showDependents)}
              className="w-full bg-blue-600 text-white py-2 rounded-lg mb-3 hover:bg-blue-700 transition"
            >
              Dependents
            </button>

            {showDependents && (
              <div className="flex justify-start gap-3">
                <img src="https://img.icons8.com/emoji/48/child-emoji.png" alt="child1" className="w-10 h-10" />
                <img src="https://img.icons8.com/emoji/48/family-emoji.png" alt="family" className="w-10 h-10" />
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4 gap-3">
            <button className="w-1/2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
              Save Changes
            </button>
            <button
              onClick={onClose}
              className="w-1/2 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
