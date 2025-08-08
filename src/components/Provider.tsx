"use client";

import { SessionProvider } from "next-auth/react";
import { NotificationProvider } from "./NotificationToaster";
import { ImageKitProvider } from "@imagekit/next";
const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT!;
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY!;

export default function Providers({ children }: { children: React.ReactNode }) {
  const authenticator = async () => {
    try {
      const res = await fetch("/api/imagekit-auth");
      console.log("response", res)
      if (!res.ok) throw new Error("Failed to authenticate");
      return res.json();
    } catch (error) {
      console.error("ImageKit authentication error:", error);
      throw error;
    }
  };

  return (
    <SessionProvider refetchInterval={5 * 60}>
      <NotificationProvider>
        <ImageKitProvider
          urlEndpoint={urlEndpoint}
        >
          {children}
        </ImageKitProvider>
      </NotificationProvider>
    </SessionProvider>
  );
}