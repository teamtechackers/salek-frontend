"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import login_labels from "../../constants/pages/loginConstants"
import { ROUTES } from "../../constants/layout/SidebarConstants"
import { STYLES } from "../../theme/typography/styles"
import FormField from "../../components/FormFields" // ✅ Import the reusable field
import { LAYOUT } from "../../constants/layout/LayoutsContants"
import { IMAGES, ICONS } from "../../constants/assets"
import { useLoginMutation } from "../../../core/services/api/userApi" // Import the login mutation

export default function LoginPage() {
  const [username, setUsername] = useState("") // Changed from email to username
  const [password, setPassword] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [login, { isLoading, error }] = useLoginMutation() // Initialize the login mutation
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await login({ username, password }).unwrap() // Get the full response
      console.log("Login API Response:", response); // Log the full response for debugging

      // Assuming the response might be { userId, token } or { data: { userId, token } }
      const actualAdminId = response.userId || response.data?.userId;
      const actualToken = response.token || response.data?.token;

      if (actualAdminId && actualToken) {
        localStorage.setItem('adminId', actualAdminId); // Store userId in local storage
        localStorage.setItem('token', actualToken); // Store token in local storage
        navigate(ROUTES.DASHBOARD);
      } else {
        console.error("Login response did not contain adminId or token:", response);
        // Handle case where userId or token are missing from response
        // e.g., set an error state to display to the user
      }
    } catch (err) {
      console.error("Failed to login:", err);
      // You might want to set an error state here to display to the user
    }
  }
  return (
    <div className="flex min-h-screen">
      {/* Left side image */}
      <div className={LAYOUT.leftPanel}>
        <img src={IMAGES.loginBanner} alt="Medical supplies and vaccine vial" className="w-full h-full" />
        <div className={LAYOUT.gradientOverlay}></div>
      </div>

      {/* Right side form */}
      <div className={LAYOUT.rightPanel}>
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <img src={ICONS.brandLogo} alt="Brand Logo" />
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <h2 className="block mb-2 text-[34px] text-[#2F3339] font-[500] mb-4">{login_labels.TITLE}</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email field (reusable) */}
              <FormField
                id="username"
                type="text"
                label={login_labels.FORM.FIELDS_LABELS.USERNAME} // Changed label to USERNAME
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required

              />

              {/* Password field (reusable) */}
              <FormField
                id="password"
                type="password"
                label={login_labels.FORM.FIELDS_LABELS.PASSWORD}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {/* Terms */}
              <div className="flex items-center space-x-2">
                <input
                  id="terms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="terms" style={STYLES.terms_text}>
                  {login_labels.FORM.FIELDS_LABELS.TERMS}{" "}
                  <a href="#" style={STYLES.link_text}>
                    {login_labels.FORM.FIELDS_LABELS.CONDITIONS}
                  </a>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!acceptTerms || isLoading} // Disable button when loading or terms not accepted
                style={STYLES.button_text}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed py-3 px-4 rounded-lg transition-colors"
              >
                {isLoading ? "Logging in..." : login_labels.FORM.BUTTON}
              </button>
              {error && (
                <p className="text-red-500 text-center mt-2">
                  {error.data?.message || "Login failed. Please check your credentials."}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
