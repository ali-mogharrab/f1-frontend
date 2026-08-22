import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { requestPasswordReset } from "../api/authApi";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { getApiErrorMessage } from "../utils/apiError";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await requestPasswordReset({ email });
      setSuccessMessage(response.message);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-shell max-w-md">
      <div className="auth-card">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
          Account
        </p>

        <h1 className="text-3xl font-bold text-slate-950 dark:text-white">
          Reset password
        </h1>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Enter the email for your account and the backend will send a reset
          link if that account exists.
        </p>

        {successMessage ? (
          <div className="mt-6 rounded-2xl bg-green-50 p-4 text-sm font-medium text-green-700 dark:bg-green-950/40 dark:text-green-300">
            {successMessage}
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mt-6">
            <ErrorMessage
              title="Could not request reset"
              message={errorMessage}
            />
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-red-950"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
          >
            {isSubmitting ? "Sending reset link..." : "Send reset link"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
          Remembered it?{" "}
          <Link to="/login" className="font-semibold text-red-600">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}
