"use client";
import React, { useEffect, useState } from "react";

export default function Viz() {
  const [accounts, setAccounts] = useState<any[]>([]);

  useEffect(() => {
    const userId = localStorage.getItem("user-id");
    if (!userId) return;
    console.log(`${window.location.origin.toString()}/api/data/accounts`);
    const getAccounts = async () => {
      const response = await fetch(
        `${window.location.origin.toString()}/api/data/accounts`,
        {
          method: "POST",
          body: JSON.stringify({ id: userId }),
        }
      );
      const { accounts } = await response.json();
      setAccounts(accounts);
    };
    getAccounts();
  }, []);

  return (
    <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
      <h1 className="mb-8 text-3xl font-bold text-center lg:text-left">Viz</h1>
      <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
        {accounts?.map((account: any) => (
          <div
            key={account.name}
            className="group rounded-lg border px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          >
            {account.name}
          </div>
        ))}
      </div>
    </div>
  );
}
