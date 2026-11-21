"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setError("Invalid email or password.");
        return;
      }

      // Guard against open-redirect: only follow relative paths.
      const rawCallback = searchParams.get("callbackUrl") ?? "";
      const safePath =
        rawCallback.startsWith("/") && !rawCallback.startsWith("//")
          ? rawCallback
          : "/";

      router.push(safePath);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md flex-col gap-5 rounded-2xl border border-indigo-100 bg-white p-8 shadow-xl"
    >
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">Sign in</h1>
        <p className="mt-2 text-sm text-gray-600">
          Use your INT Voice Solutions account to continue.
        </p>
      </div>

      <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
        Email
        <input
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          autoComplete="email"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
        Password
        <input
          required
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          autoComplete="current-password"
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-brand-500 px-4 py-2.5 font-medium text-white shadow-md shadow-indigo-950/20 transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
