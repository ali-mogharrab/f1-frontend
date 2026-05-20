import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/authApi";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { useAuth } from "../context/AuthContext";

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
    } catch {
      setErrorMessage("Invalid username or password.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-md">
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-red-600">
          Account
        </p>

        <h1 className="text-3xl font-bold text-slate-950">Login</h1>

        <p className="mt-2 text-sm text-slate-600">
          Use your Django demo account or a user you created in the backend.
        </p>

        {errorMessage ? (
          <div className="mt-6">
            <ErrorMessage title="Login failed" message={errorMessage} />
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="username"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Username
            </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
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
        <p className="mt-6 text-center text-sm text-slate-600">
          Do not have an account?{" "}
          <Link to="/register" className="font-semibold text-red-600">
            Create one
          </Link>
        </p>
      </div>
    </section>
  );
}