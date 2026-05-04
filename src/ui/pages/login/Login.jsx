import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import login_labels from "../../constants/pages/loginConstants"
import { ROUTES } from "../../constants/layout/SidebarConstants"
import { STYLES } from "../../theme/typography/styles"
import FormField from "../../components/FormFields" // ✅ Import the reusable field
import { LAYOUT } from "../../constants/layout/LayoutsContants"
import { IMAGES, ICONS, LOGOS } from "../../constants/assets"
import { useLoginMutation } from "../../../core/services/api/userApi" // Import the login mutation
import CircularProgress from "@mui/material/CircularProgress";

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [login, { isLoading, error }] = useLoginMutation()
  const navigate = useNavigate()

  // Check if user is already authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    const adminId = localStorage.getItem('adminId');

    if (token && adminId) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoginError("")
    try {
      const response = await login({ username, password }).unwrap()

      const actualAdminId = response.userId || response.data?.userId;
      const actualToken = response.token || response.data?.token;

      if (actualAdminId && actualToken) {
        localStorage.setItem('adminId', actualAdminId);
        localStorage.setItem('token', actualToken);
        navigate(ROUTES.DASHBOARD, { replace: true });
      } else {
        setLoginError("Login failed. Unexpected response from server.");
      }
    } catch (err) {
      // error is also surfaced via the RTK Query `error` state below
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
              <img src={LOGOS.appLogoBlue} alt="Brand Logo" />
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
                className="w-full bg-[#245FFF] hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed py-3 px-4 rounded-lg transition-colors"
              >
                {isLoading ? (
                  <div className="flex justify-center items-center">
                    <CircularProgress size={24} color="inherit" />
                  </div>
                ) : (
                  login_labels.FORM.BUTTON
                )}
              </button>
              {(error || loginError) && (
                <p className="text-red-500 text-center mt-2">
                  {loginError || error?.data?.message || "Invalid credentials. Please try again."}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}