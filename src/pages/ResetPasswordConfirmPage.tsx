import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { confirmPasswordReset } from "../api/authApi";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { getApiErrorMessage } from "../utils/apiError";

export function ResetPasswordConfirmPage() {
  const [searchParams] = useSearchParams();
  const uid = searchParams.get("uid") ?? "";
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (!uid || !token) {
      setErrorMessage("The password reset link is missing required values.");
      return;
    }

    if (password !== passwordConfirm) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await confirmPasswordReset({
        uid,
        token,
        new_password: password,
        new_password_confirm: passwordConfirm,
      });

      setSuccessMessage(response.message);
      setPassword("");
      setPasswordConfirm("");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-md">
      <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-900 sm:p-8">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
          Account
        </p>

        <h1 className="text-3xl font-bold text-slate-950 dark:text-white">
          Choose a new password
        </h1>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Use the reset link from your email to set a fresh password.
        </p>

        {successMessage ? (
          <div className="mt-6 rounded-2xl bg-green-50 p-4 text-sm font-medium text-green-700 dark:bg-green-950/40 dark:text-green-300">
            {successMessage}{" "}
            <Link to="/login" className="font-semibold underline">
              Login
            </Link>
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mt-6">
            <ErrorMessage title="Reset failed" message={errorMessage} />
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              New password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-red-950"
              required
            />
          </div>

          <div>
            <label
              htmlFor="passwordConfirm"
              className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Confirm new password
            </label>

            <input
              id="passwordConfirm"
              type="password"
              value={passwordConfirm}
              onChange={(event) => setPasswordConfirm(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-red-950"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || Boolean(successMessage)}
            className="w-full rounded-xl bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
          >
            {isSubmitting ? "Saving password..." : "Save new password"}
          </button>
        </form>
      </div>
    </section>
  );
}
