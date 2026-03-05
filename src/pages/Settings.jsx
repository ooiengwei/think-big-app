import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { supabase } from "../lib/supabase"
import AuthModal from "../components/AuthModal"

export default function Settings() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAuth, setShowAuth] = useState(false)

  // Email
  const [newEmail, setNewEmail] = useState("")
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailMsg, setEmailMsg] = useState(null)

  // Password
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState(null)

  // Delete
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState("")
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })
  }, [])

  async function handleUpdateEmail() {
    setEmailLoading(true)
    setEmailMsg(null)
    const { error } = await supabase.auth.updateUser({ email: newEmail })
    if (error) setEmailMsg({ type: "error", text: error.message })
    else setEmailMsg({ type: "success", text: "Confirmation email sent. Check your inbox to confirm the change." })
    setEmailLoading(false)
  }

  async function handleUpdatePassword() {
    if (newPassword !== confirmPassword) { setPasswordMsg({ type: "error", text: "Passwords do not match." }); return }
    if (newPassword.length < 8) { setPasswordMsg({ type: "error", text: "Password must be at least 8 characters." }); return }
    setPasswordLoading(true)
    setPasswordMsg(null)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) setPasswordMsg({ type: "error", text: error.message })
    else { setPasswordMsg({ type: "success", text: "Password updated successfully." }); setNewPassword(""); setConfirmPassword("") }
    setPasswordLoading(false)
  }

  async function handleDeleteAccount() {
    if (deleteConfirm !== "DELETE") return
    setDeleteLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from("assessments").delete().eq("user_id", user.id)
      await supabase.auth.signOut()
      alert("Your account has been signed out. To permanently delete all data, email thinkbig.eco@gmail.com with subject 'Account Deletion Request'.")
      navigate("/")
    }
    setDeleteLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F8FF] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#00AEEF]" size={32} />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F0F8FF] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-sm w-full text-center">
          <h2 className="text-xl font-bold text-[#0A0F1E] mb-2">Sign in to access settings</h2>
          <p className="text-gray-500 text-sm mb-6">You need an account to manage your settings.</p>
          <button
            onClick={() => setShowAuth(true)}
            className="bg-[#00AEEF] text-white rounded-xl px-6 py-2.5 text-sm font-semibold hover:bg-[#0097D0] transition-colors"
          >
            Sign In
          </button>
        </div>
        {showAuth && (
          <AuthModal
            onClose={() => setShowAuth(false)}
            onSuccess={(u) => { setUser(u); setShowAuth(false) }}
          />
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F0F8FF]">
      {/* Hero */}
      <section className="bg-[#F0F8FF] py-10">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-[#0A0F1E]">&#9881;&#65039; Account Settings</h1>
          <p className="text-gray-500 text-sm mt-2">Manage your account details and preferences</p>
          <span className="inline-block mt-3 bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
            Signed in as: {user.email}
          </span>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-2xl mx-auto px-4 pb-16 space-y-6">

        {/* Card 1 — Update Email */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-[#0A0F1E] mb-1">&#128231; Email Address</h2>
          <p className="text-gray-400 text-sm mb-4">Current: {user.email}</p>
          <label className="block text-sm font-medium text-[#0A0F1E] mb-1.5">New email address</label>
          <input
            type="email"
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
            placeholder="Enter new email"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent"
          />
          <button
            onClick={handleUpdateEmail}
            disabled={emailLoading || !newEmail}
            className="mt-3 bg-[#00AEEF] text-white rounded-xl px-6 py-2.5 text-sm font-semibold hover:bg-[#0097D0] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {emailLoading && <Loader2 size={16} className="animate-spin" />}
            Update Email
          </button>
          {emailMsg && (
            <p className={`mt-3 text-sm ${emailMsg.type === "success" ? "text-green-600" : "text-red-600"}`}>
              {emailMsg.type === "success" ? "✓" : "✗"} {emailMsg.text}
            </p>
          )}
        </div>

        {/* Card 2 — Change Password */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-[#0A0F1E] mb-4">&#128274; Change Password</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-[#0A0F1E] mb-1.5">New password</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Min 8 characters"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0A0F1E] mb-1.5">Confirm new password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                onBlur={() => {
                  if (confirmPassword && newPassword !== confirmPassword) {
                    setPasswordMsg({ type: "error", text: "Passwords do not match." })
                  } else if (passwordMsg?.text === "Passwords do not match.") {
                    setPasswordMsg(null)
                  }
                }}
                placeholder="Re-enter new password"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent"
              />
            </div>
          </div>
          <button
            onClick={handleUpdatePassword}
            disabled={passwordLoading || !newPassword || !confirmPassword}
            className="mt-3 bg-[#00AEEF] text-white rounded-xl px-6 py-2.5 text-sm font-semibold hover:bg-[#0097D0] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {passwordLoading && <Loader2 size={16} className="animate-spin" />}
            Update Password
          </button>
          {passwordMsg && (
            <p className={`mt-3 text-sm ${passwordMsg.type === "success" ? "text-green-600" : "text-red-600"}`}>
              {passwordMsg.type === "success" ? "✓" : "✗"} {passwordMsg.text}
            </p>
          )}
        </div>

        {/* Card 3 — Data & Privacy */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h2 className="font-bold text-[#0A0F1E] mb-3">&#128203; Your Data</h2>
          <p className="text-gray-500 text-sm mb-4">
            Your assessment responses and scores are stored securely. You own your data.
          </p>
          <div className="space-y-2">
            <Link to="/dashboard" className="block text-sm text-[#00AEEF] hover:underline font-medium">
              View your assessment history &rarr;
            </Link>
            <Link to="/privacy" className="block text-sm text-[#00AEEF] hover:underline font-medium">
              Read our Privacy Policy &rarr;
            </Link>
          </div>
        </div>

        {/* Card 4 — Danger Zone */}
        <div className="bg-red-50/30 rounded-2xl p-6 border border-red-100">
          <h2 className="font-bold text-red-600 mb-2">&#9888;&#65039; Danger Zone</h2>
          <p className="text-gray-500 text-sm mb-4">
            Permanently delete your account and all associated data. This cannot be undone.
          </p>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="border border-red-300 text-red-500 rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-red-50 transition-colors"
            >
              Delete My Account
            </button>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-4">
              <p className="text-sm font-medium text-red-700 mb-3">Are you sure? Type DELETE to confirm:</p>
              <input
                type="text"
                value={deleteConfirm}
                onChange={e => setDeleteConfirm(e.target.value)}
                placeholder="Type DELETE"
                className="w-full border border-red-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent mb-3"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirm !== "DELETE" || deleteLoading}
                  className="bg-red-500 text-white rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {deleteLoading && <Loader2 size={16} className="animate-spin" />}
                  Yes, permanently delete
                </button>
                <button
                  onClick={() => { setShowDeleteConfirm(false); setDeleteConfirm("") }}
                  className="border border-gray-300 text-gray-500 rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
