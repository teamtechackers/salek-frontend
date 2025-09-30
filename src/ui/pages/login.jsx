"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import login_labels from "../../core/utils/strings/pages/loginlabels"
import { ROUTES } from "../constants/SidebarConstants"
import { STYLES } from "../../core/utils/typography/styles"
import FormField from "../components/FormFields" // ✅ Import the reusable field
import { LAYOUT } from "../constants/LayoutsContants"
// import Layout from "../components/Layout"
import { IMAGES, ICONS } from "../../core/utils/constants/assets"
export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const navigate = useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault()
    navigate(ROUTES.DASHBOARD)
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
            <h2 style={STYLES.page_title}>{login_labels.TITLE}</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email field (reusable) */}
              <FormField
                id="email"
                type="email"
                label={login_labels.FORM.FIELDS_LABELS.EMAIL}
                placeholder="Enter your Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  {login_labels.FORM.FIELDS_LABELS.TERMS},{" "}
                  <a href="#" style={STYLES.link_text}>
                    {login_labels.FORM.FIELDS_LABELS.CONDITIONS}
                  </a>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!acceptTerms}
                style={STYLES.button_text}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed py-3 px-4 rounded-lg transition-colors"
              >
                {login_labels.FORM.BUTTON}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
