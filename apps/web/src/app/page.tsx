"use client";

import { useActionState, useEffect, useState } from "react";

import { login } from "@/lib/dashboard-auth";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, action, pending] = useActionState(login, undefined);

  useEffect(() => {
    if (state?.message) {
      // invalid email / password
      alert(state.message);
    }
  }, [state]);

  const formInput = "flex flex-col gap-2";

  return (
    <div className="bg-ut-burntorange flex-1 grid place-items-center">
      <div className="p-5 bg-background rounded-xl min-w-full min-[24rem]:min-w-96">
        <form action={action} className="flex flex-col gap-4">
          <h1 className="text-3xl font-medium">Login</h1>
          <div className={formInput}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              placeholder="bevo@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {state?.errors?.email && <p>{state.errors.email}</p>}
          </div>

          <div className={formInput}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {state?.errors?.password && <p>{state.errors.password}</p>}
          </div>

          <button disabled={pending} type="submit">
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}
