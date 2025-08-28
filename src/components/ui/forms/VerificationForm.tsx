'use client'

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/StatefulButton";


interface VerifyFormData {
  username: string;
  verifyCode: string;
}

interface VerifyResponse {
  success: boolean;
  message: string;
}

export default function VerificationForm(){
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get("username");

  const [verifyCode, setVerifyCode] = useState("");

  useEffect(() => {
    if (!username) {
      router.push("/signup");
    }
  }, [username, router]);

  const verifyMutation = useMutation<VerifyResponse, Error, VerifyFormData>({
    mutationFn: async (verifyData) => {
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(verifyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to verify");
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast.success(data.message);
      router.push("/sign-in");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username) {
      toast.error("Username not found. Please sign up again.");
      return;
    }
    verifyMutation.mutate({ username, verifyCode });
  };

  return (
    <div className="card w-full max-w-lg bg-base-100 shadow-xl border border-base-300">
      <div className="card-body p-6">
        <h2 className="card-title text-2xl font-bold mb-4 text-center">
          Verify Your Account
        </h2>
        <p className="text-center text-gray-600 mb-6">
          A 6-digit verification code has been sent to your email.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text">Verification Code</span>
            </label>
            <input
              type="text"
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value)}
              placeholder="Enter code"
              className="input input-bordered w-full text-center tracking-widest text-lg"
              maxLength={6}
              required
            />
          </div>

          <div className="form-control">
            <Button type="submit" disabled={verifyMutation.isPending}>
              {verifyMutation.isPending ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </form>

        {/* Resend */}
        <div className="text-center mt-4 text-sm">
          Didn't receive a code?{" "}
          <Link href="/signup" className="link link-hover text-primary">
            Resend
          </Link>
        </div>
      </div>
    </div>
  );
};