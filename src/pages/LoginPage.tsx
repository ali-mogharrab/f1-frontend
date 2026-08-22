import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { login } from "../api/authApi";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../utils/apiError";

export function LoginPage() {
  const navigate = useNavigate();
  const { setAuthTokens, refreshUser } = useAuth();

  const [username, setUsername] = useState("demoadmin");
  const [password, setPassword] = useState("DemoPassword123!");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const tokens = await login({
        username,
        password,
      });

      setAuthTokens(tokens.access, tokens.refresh);
      await refreshUser();

      navigate("/dashboard");
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
          Login
        </h1>

        {errorMessage ? (
          <div className="mt-6">
            <ErrorMessage title="Login failed" message={errorMessage} />
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="username"
              className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Username
            </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-red-950"
              required
            />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between gap-3">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Password
              </label>
            </div>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-red-950"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
          Do not have an account?{" "}
          <Link to="/register" className="font-semibold text-red-600 dark:text-red-400">
            Create one
          </Link>
        </p>
        <p className="mt-3 text-center">
          <Link
                to="/forgot-password"
                className="text-sm font-semibold text-red-600 dark:text-red-400"
              >
                Forgot password?
          </Link>
        </p>
      </div>
    </section>
  );
}
