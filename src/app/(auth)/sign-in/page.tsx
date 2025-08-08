"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Toaster, toast } from 'react-hot-toast';
import { useMutation, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useForm } from 'react-hook-form'; // Import useForm
import { zodResolver } from '@hookform/resolvers/zod'; // Import zodResolver
import z from 'zod'; // Import zod
import Link from 'next/link';
import { signInValidation } from '@/schemas/signInSchema';
// Create a client for React Query.
const queryClient = new QueryClient();

// --- New Zod Schema for Sign-In Validation ---


// Define a type based on your Zod schema for form data
type SigninFormData = z.infer<typeof signInValidation>;

// Define the type for the signIn result (NextAuth's signIn returns a SignInResponse)
interface SignInResult {
  error: string | undefined;
  status: number;
  ok: boolean;
  url: string | null;
}

const SigninForm = () => {
  const router = useRouter();

  // Initialize useForm with your Zod schema resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormData>({
    resolver: zodResolver(signInValidation), // Use the new signInValidation schema
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  // Use useMutation for the sign-in API call
  const signinMutation = useMutation<SignInResult, Error, SigninFormData>({
    mutationFn: async (signinData) => {
      const result = await signIn('credentials', {
        redirect: false,
        identifier: signinData.identifier, // NextAuth's CredentialsProvider expects 'email'
        password: signinData.password,
      });

      if (result?.error) {
        throw new Error(result.error);
      }
      console.log(result);
      
      return result as SignInResult;
    },
    onSuccess: () => {
      toast.success('Signed in successfully!');
      router.replace('/');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // The onSubmit function from react-hook-form now validates for us
  const onSubmit = (data: SigninFormData) => {
    signinMutation.mutate(data);
  };

  return (
    <div className="card w-full max-w-lg bg-base-100 shadow-xl border border-base-300">
      <div className="card-body p-6">
        <h2 className="card-title text-2xl font-bold mb-4 text-center">Sign In</h2>
        <form onSubmit={handleSubmit(onSubmit)}> {/* Use handleSubmit from react-hook-form */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Email or Username</span>
            </label>
            <input
              type="text"
              placeholder="Email or Username"
              className="input input-bordered w-full"
              {...register('identifier')} 
            />
            {errors.identifier && (
              <p className="text-red-500 text-sm mt-1">{errors.identifier.message}</p>
            )}
          </div>
          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Password"
              className="input input-bordered w-full"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
          <div className="form-control">
            <button type="submit" className="btn btn-primary" disabled={signinMutation.isPending}>
              {signinMutation.isPending ? (
                <span className="loading loading-spinner"></span>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>
        <div className="text-center mt-4 text-sm">
          Don't have an account? <Link href="/signup" className="link link-hover text-primary">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

// Main component that provides the QueryClientProvider
export default function SigninPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="p-8 bg-base-200 min-h-screen flex items-center justify-center">
        <Toaster />
        <SigninForm />
      </div>
    </QueryClientProvider>
  );
}
