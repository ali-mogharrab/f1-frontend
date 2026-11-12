import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { changePassword } from "../api/authApi";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { PageHeader } from "../components/common/PageHeader";
import { getApiErrorMessage } from "../utils/apiError";

export function ChangePasswordPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (newPassword !== newPasswordConfirm) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await changePassword({
        old_password: oldPassword,
        new_password: newPassword,
        new_password_confirm: newPasswordConfirm,
      });

      setSuccessMessage(response.message);
      setOldPassword("");
      setNewPassword("");
      setNewPasswordConfirm("");
      logout();
      navigate("/login", { replace: true, state: { reason: "password-changed" } });
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-2xl">
      <PageHeader
        eyebrow="Account"
        title="Change password"
        description="Update the password used to sign in to your Formula 1 account."
      />

      <div className="auth-card">
        {successMessage ? (
          <div className="mb-6 rounded-2xl bg-green-50 p-4 text-sm font-medium text-green-700 dark:bg-green-950/40 dark:text-green-300">
            {successMessage}
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mb-6">
            <ErrorMessage
              title="Password change failed"
              message={errorMessage}
            />
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="oldPassword"
              className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Current password
            </label>

            <input
              id="oldPassword"
              type="password"
              value={oldPassword}
              onChange={(event) => setOldPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-red-950"
              required
            />
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              New password
            </label>

            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-red-950"
              required
            />
          </div>

          <div>
            <label
              htmlFor="newPasswordConfirm"
              className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Confirm new password
            </label>

            <input
              id="newPasswordConfirm"
              type="password"
              value={newPasswordConfirm}
              onChange={(event) => setNewPasswordConfirm(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-red-950"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
          >
            {isSubmitting ? "Changing password..." : "Change password"}
          </button>
        </form>
      </div>
    </section>
  );
}
