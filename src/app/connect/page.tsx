"use client";
import React, { useEffect, useState } from "react";
import Vessel from "@vesselapi/client-sdk";
import { useRouter } from "next/navigation";

export default function App() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [existing, setExisting] = useState<boolean | null>(false);
  useEffect(() => {
    const existing = localStorage.getItem("user-id");
    if (existing) {
      setUserId(existing);
      setExisting(true);
      return;
    }
    setExisting(false);
    const id = Math.random().toString(36).substring(2);
    localStorage.setItem("user-id", id);
    setUserId(id);
  }, []);

  const onLoad = async () => {
    console.log("loaded");
    if (existing) {
      await fetch("/api/connection/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
        }),
      });
    }
  };
  const onClose = () => {
    console.log("closed");
  };
  const { open } = Vessel({
    onSuccess: async (sessionToken) => {
      await fetch("/api/connection/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionToken,
          userId, // Store this against your user id.
        }),
      });
      router.push("/viz");
    },
    onLoad,
    onClose,
  });

  const [integrations, setIntegrations] = useState<any[]>([]);
  useEffect(() => {
    const getIntegrations = async () => {
      const res = await fetch("https://app.vessel.dev/api/integrations/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await res.json();
      setIntegrations(json.result.integrations);
    };
    getIntegrations();
  }, []);

  return (
    <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
      <h1 className="mb-8 text-3xl font-bold text-center lg:text-left">
        Connect your Integrations
      </h1>
      <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
        {integrations?.map((integration: any) => (
          <button
            className="group rounded-lg border px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            onClick={() =>
              open({
                integrationId: integration.id,
                getSessionToken: async () => {
                  const response = await fetch("/api/connection/start", {
                    method: "POST",
                  });
                  const { sessionToken } = await response.json();
                  return sessionToken;
                },
              })
            }
            key={integration.id}
          >
            <img src={integration.display.iconURI} width={300} />
            <p>{integration.display.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
