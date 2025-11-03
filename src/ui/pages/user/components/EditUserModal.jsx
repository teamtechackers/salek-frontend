import React, { useEffect, useRef, useState } from "react";
import { useUpdateUserMutation, useUpdateDependentMutation } from "../../../../core/services/api/userApi"; // Import both mutations
import CircularProgress from "@mui/material/CircularProgress";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField
} from "@mui/material";

const EditUserModal = ({ open, onClose, user, isDependent, parentUserId, refetchUserDetails, refetchDependentDetails, onSuccessfulEditAndClose }) => {
  console.log("EditUserModal - user:", user);
  console.log("EditUserModal - isDependent:", isDependent);
  console.log("EditUserModal - parentUserId:", parentUserId);
  console.log("EditUserModal - refetchUserDetails:", refetchUserDetails);
  console.log("EditUserModal - refetchDependentDetails:", refetchDependentDetails);

  const initialFormData = {
    name: "",
    dob: "", // Added DOB field
    gender: "",
    country: "",
    address: "",
    phoneNumber: "",
    maritalStatus: "",
    children: "",
    pregnancy: "",
    trimester: "",
    relation: "", // Added for dependents
  };

  const [formData, setFormData] = useState(initialFormData);
  const [updateUser, { isLoading: isUpdatingUser, error: userUpdateError }] = useUpdateUserMutation();
  const [updateDependent, { isLoading: isUpdatingDependent, error: dependentUpdateError }] = useUpdateDependentMutation();
  const [isProcessing, setIsProcessing] = useState(false); // State for processing indicator

  const adminId = localStorage.getItem('adminId');

  useEffect(() => {
    if (user && open) {
      console.log("EditUserModal - Setting form data for user/dependent:", user);
      setFormData({
        name: user.full_name || user.username || user.relation_type || "", // Use full_name or relation_type for dependents
        dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : "", // Format DOB for input type="date"
        gender: user.gender === 'M' ? 'Male' : user.gender === 'F' ? 'Female' : user.gender === 'male' ? 'Male' : user.gender === 'female' ? 'Female' : user.gender || "",
        country: user.country || "",
        address: user.address || "",
        phoneNumber: user.phone_number || user.contact_no || "",
        maritalStatus: user.material_status ? user.material_status.charAt(0).toUpperCase() + user.material_status.slice(1) : "",
        children: user.do_you_have_children ? String(user.how_many_children) : "",
        pregnancy: user.are_you_pregnant ? "Yes" : "No",
        trimester: user.are_you_pregnant && user.pregnancy_detail ? String(user.pregnancy_detail).match(/\d+/)?.[0] || "" : "",
        relation: user.relation_type || "", // For dependents
      });
    } else {
      console.log("EditUserModal - No user/dependent data or modal closed, setting initial form data");
      setFormData(initialFormData);
    }
  }, [user, open]); // Depend on 'user' (passed data) and 'open'

  const isLoading = isUpdatingUser || isUpdatingDependent || isProcessing;
  const error = userUpdateError || dependentUpdateError;

  const confirmRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (open) {
      previouslyFocused.current = document.activeElement;
      const t = setTimeout(() => confirmRef.current?.focus(), 0);
      document.body.style.overflow = "hidden";
      const onKey = (e) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", onKey);
      return () => {
        window.removeEventListener("keydown", onKey);
        document.body.style.overflow = "";
        if (previouslyFocused.current instanceof HTMLElement) {
          previouslyFocused.current.focus();
        }
        clearTimeout(t);
      };
    }
  }, [open, onClose]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true); // Set processing state
    try {
      const adminId = localStorage.getItem("adminId");
      const genderValue = formData.gender === 'Male' ? 'male' : formData.gender === 'Female' ? 'female' : formData.gender;
      console.log("Form gender:", formData.gender);
      console.log("Converted gender:", genderValue);

      let basePayload = {
        full_name: formData.name || null,
        dob: formData.dob || null,
        phone_number: formData.phoneNumber || null,
        gender: genderValue || null,
        country: formData.country || null,
        address: formData.address || null,
        material_status: formData.maritalStatus || null,
        do_you_have_children: formData.children > 0 ? 1 : 0,
        how_many_children: Number(formData.children) || 0,
        are_you_pregnant: formData.pregnancy === 'Yes' ? 1 : 0,
        pregnancy_detail: formData.pregnancy === 'Yes' ? (formData.trimester || null) : null,
      };

      let result;
      if (isDependent) {
        const dependentUpdatePayload = {
          admin_user_id: adminId,
          user_id: parentUserId, // Use parentUserId from props
          dependent_id: user.id, // Dependent's ID
          ...basePayload,
          relation_type: formData.relation || null, // For dependents
        };
        console.log("Sending dependent update payload:", dependentUpdatePayload);
        result = await updateDependent(dependentUpdatePayload).unwrap();
        // For dependents, we need to refetch both the dependent details and the user details
        // Use the exposed refetch functions with error handling
        setTimeout(() => {
          try {
            if (window.userListRefetchDependentDetails) {
              window.userListRefetchDependentDetails();
            }
          } catch (e) {
            console.warn("Could not refetch dependent details:", e);
          }
          
          try {
            if (window.userListRefetchUserDetails) {
              window.userListRefetchUserDetails();
            }
          } catch (e) {
            console.warn("Could not refetch user details:", e);
          }
          
          // Only close modal after data is updated
          setIsProcessing(false); // Reset processing state
          
          // Call the success callback or close the modal
          if (onSuccessfulEditAndClose) {
            onSuccessfulEditAndClose(); // Call the callback to close modal and handle any additional logic
          } else {
            onClose(); // Fallback to just closing the modal
          }
        }, 150); // Slightly longer delay to ensure data is updated
      } else {
        const userUpdatePayload = {
          admin_user_id: adminId,
          user_id: user.id, // User's ID
          ...basePayload,
        };
        console.log("Sending user update payload:", userUpdatePayload);
        result = await updateUser(userUpdatePayload).unwrap();
        // Use the exposed refetch function with error handling
        setTimeout(() => {
          try {
            if (window.userListRefetchUserDetails) {
              window.userListRefetchUserDetails();
            }
          } catch (e) {
            console.warn("Could not refetch user details:", e);
          }
          
          // Only close modal after data is updated
          setIsProcessing(false); // Reset processing state
          
          // Call the success callback or close the modal
          if (onSuccessfulEditAndClose) {
            onSuccessfulEditAndClose(); // Call the callback to close modal and handle any additional logic
          } else {
            onClose(); // Fallback to just closing the modal
          }
        }, 150); // Slightly longer delay to ensure data is updated
      }

      console.log("Update successful:", result);
    } catch (err) {
      console.error("Failed to update:", err);
      setIsProcessing(false); // Reset processing state on error
      alert(`Failed to update ${isDependent ? 'dependent' : 'user'}. Please try again.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 text-white px-5 py-3 flex justify-between items-center">
          <h2 className="text-lg font-semibold">{isDependent ? "Edit Dependent" : "Edit User"}</h2>
          <button
            onClick={onClose}
            className="text-white text-2xl leading-none focus:outline-none"
            ref={confirmRef}
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Name (for both user and dependent) */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              {isDependent ? "Dependent Name" : "Full Name"}
            </label>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isLoading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                },
              }}
            />
          </div>

          {/* Relation (for dependents) */}
          {isDependent && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Relation</label>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                name="relation"
                value={formData.relation}
                onChange={handleChange}
                required
                disabled={isLoading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                  },
                }}
              />
            </div>
          )}

          {/* DOB & Gender */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Date of Birth</label>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                disabled
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                  },
                }}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Gender</label>
              <Select
                name="gender"
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                displayEmpty
                fullWidth
                size="small"
                required
                disabled={isLoading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px !important',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderRadius: '10px !important',
                  },
                }}
              >
                <MenuItem value="">
                  <em>Select Gender</em>
                </MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Male">Male</MenuItem>
              </Select>
            </div>
          </div>

          {/* Country & Address */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Country</label>
              <Select
                name="country"
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
                displayEmpty
                fullWidth
                size="small"
                required
                disabled={isLoading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px !important',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderRadius: '10px !important',
                  },
                }}
              >
                <MenuItem value="">
                  <em>Select Country</em>
                </MenuItem>
                <MenuItem value="India">India</MenuItem>
                <MenuItem value="Pakistan">Pakistan</MenuItem>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Address</label>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                disabled={isLoading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                  },
                }}
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Phone Number</label>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required={!isDependent} 
              disabled={!isDependent || isLoading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                },
              }}
            />
          </div>

          {/* Marital & Children */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Marital Status</label>
              <Select
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={(e) => setFormData({...formData, maritalStatus: e.target.value})}
                displayEmpty
                fullWidth
                size="small"
                required
                disabled={isLoading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px !important',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderRadius: '10px !important',
                  },
                }}
              >
                <MenuItem value="">
                  <em>Select Status</em>
                </MenuItem>
                <MenuItem value="Married">Married</MenuItem>
                <MenuItem value="Single">Single</MenuItem>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Children</label>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                type="number"
                name="children"
                value={formData.children}
                onChange={handleChange}
                disabled={isLoading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                  },
                }}
              />
            </div>
          </div>

          {/* Pregnancy & Trimester */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Pregnancy</label>
              <Select
                name="pregnancy"
                value={formData.pregnancy}
                onChange={(e) => setFormData({...formData, pregnancy: e.target.value})}
                displayEmpty
                fullWidth
                size="small"
                disabled={isLoading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px !important',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderRadius: '10px !important',
                  },
                }}
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Trimester</label>
              <Select
                name="trimester"
                value={formData.trimester}
                onChange={(e) => setFormData({...formData, trimester: e.target.value})}
                displayEmpty
                fullWidth
                size="small"
                disabled={isLoading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px !important',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderRadius: '10px !important',
                  },
                }}
              >
                <MenuItem value="">
                  <em>Select Trimester</em>
                </MenuItem>
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="3">3</MenuItem>
              </Select>
            </div>
          </div>

          <div className="flex justify-between pt-4 gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-1/2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <CircularProgress size={20} color="inherit" className="mr-2" />
                  <span>Saving...</span>
                </div>
              ) : (
                "Save Changes"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="w-1/2 bg-[#444951] text-white py-2 rounded-lg hover:bg-gray-400 transition disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;