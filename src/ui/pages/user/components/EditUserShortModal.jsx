import React, { useState, useEffect } from "react";

export default function EditUserShortModal({ open, onClose, user = {}, onSave }) {
  const [form, setForm] = useState({
    user_id: user.id || null,
    full_name: user.username || "",
    login: user.phoneNo || "",
    dob: user.DOB ? new Date(user.DOB).toISOString().split('T')[0] : "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        user_id: user.id || null,
        full_name: user.username || "",
        login: user.phoneNo || "",
        dob: user.DOB ? new Date(user.DOB).toISOString().split('T')[0] : "",
      });
    }
  }, [user, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-[420px] max-h-[90vh] overflow-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="rounded-t-2xl bg-[#3f51ff] px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Edit User</h3>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full bg-white/20 grid place-items-center"
              aria-label="close"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-6 pb-6 pt-6">
          {/* Avatar */}
          <div className="flex justify-center -mt-12">
            <div className="relative">
              <img
                src={user.avatar || "https://images.unsplash.com/photo-1603415526960-f7e0328c6f1b?q=80&w=256&auto=format&fit=crop&ixlib=rb-4.0.3&s=0d8b9f7f3d6e1c0b"}
                alt="avatar"
                className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md"
              />

              <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white bg-green-500" />
            </div>
          </div>

          <p className="mt-3 text-center text-sm font-medium">{form.full_name}</p>

          {/* Form */}
          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-600">Name</label>
              <input
                value={form.full_name}
                onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-gray-600">Phone Number/Email</label>
              <input
                value={form.login}
                onChange={(e) => setForm((p) => ({ ...p, login: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            disabled
            />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-gray-600">Date of Birth</label>
              <div className="relative">
                <input
                  type="date"
                  value={form.dob}
                  onChange={(e) => setForm((p) => ({ ...p, dob: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-10 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
               disabled
               />

                <div className="absolute inset-y-0 right-3 grid place-items-center">
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => {
                onSave?.(form);
              }}
              className="flex-1 rounded-full bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow"
            >
              Save Changes
            </button>

            <button
              onClick={onClose}
              className="flex-1 rounded-full bg-[#444951] px-4 py-3 text-sm font-semibold text-white shadow"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
