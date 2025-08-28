

import SigninForm from "@/components/ui/forms/SigninForm";



// Main component that provides the QueryClientProvider
export default function SigninPage() {
  return (
      <div className="p-8 bg-base-200 min-h-screen flex items-center justify-center">
        <SigninForm />
      </div>
  );
}
