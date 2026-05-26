import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SignUp routing="hash" signInUrl="/login" afterSignUpUrl="/dashboard" />
    </div>
  );
}
