import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
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
      <SignIn
        routing="hash"
        signUpUrl="/signup"
        afterSignInUrl="/dashboard"
        redirectUrl="/dashboard"
      />
    </div>
  );
}
