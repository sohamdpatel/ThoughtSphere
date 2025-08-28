'use client'

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import {
  useMutation,
} from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounceValue } from "usehooks-ts";
import { Loader2 } from "lucide-react";
import z from "zod";
import Link from "next/link";
import { signUpValidation } from "@/schemas/signUpSchema";
import { Button } from "@/components/ui/StatefulButton";
import userServices from "@/database-services/user";

interface SignupResponse {
  success: boolean;
  message: string;
} 

// Define a type based on your Zod schema for form data
type SignupFormData = z.infer<typeof signUpValidation>;

export default function SignupForm() {
  const router = useRouter();

  // Initialize useForm with your Zod schema resolver1
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signUpValidation),
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
      password: "",
      image: "",
    },
  });

  const username = watch("username");
  const [debouncedUsername] = useDebounceValue(username, 500);
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const data = await userServices.validateUsername(debouncedUsername);
          console.log(data.message);

          setUsernameMessage(data.message);
        } catch (error: any) {
          console.error("Error checking username:", error);
          setUsernameMessage("Error checking username");
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [debouncedUsername]);

  const signupMutation = useMutation<SignupResponse, Error, SignupFormData>({
    mutationFn: async (signupData) => {
      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to sign up");
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      toast.success(data.message);
      router.push(`/verify-code?username=${variables.username}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    return await signupMutation.mutateAsync(data);
  };

  return (
    <div className="card w-full max-w-lg bg-base-100 shadow-xl border border-base-300">
      <div className="card-body p-6">
        <h2 className="card-title text-2xl font-bold mb-4 text-center">
          Create an Account
        </h2>
        <form>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Username</span>
            </label>
            <input
              type="text"
              placeholder="Username"
              className="input input-bordered w-full"
              {...register("username")}
            />
            {isCheckingUsername && <Loader2 className="animate-spin" />}
            {!isCheckingUsername && usernameMessage && (
              <p
                className={`text-sm ${usernameMessage === "Username is unique" ? "text-green-500" : "text-red-500"}`}
              >
                {usernameMessage}
              </p>
            )}
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Full Name</span>
            </label>
            <input
              type="text"
              placeholder="Full Name"
              className="input input-bordered w-full"
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Password"
              className="input input-bordered w-full"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text">Profile Image URL (Optional)</span>
            </label>
            <input
              type="text"
              placeholder="https://example.com/image.jpg"
              className="input input-bordered w-full"
              {...register("image")}
            />
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">
                {errors.image.message}
              </p>
            )}
          </div>
          <div>
            <Button
              type="button" // prevent default form submit
              disabled={signupMutation.isPending || isCheckingUsername}
              onClick={async () => {
                try {
                  await handleSubmit(onSubmit)();
                } catch (err) {
                  // let the button animate error
                  throw err;
                }
              }}
            >
              Sign Up
            </Button>
          </div>
        </form>
        <div className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link href="/sign-in" className="link link-hover text-primary">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};