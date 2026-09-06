"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";
import { login } from "@/lib/api/auth";
import { AlertCircle, ChefHat } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { token, setAuth } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      router.push("/admin/dashboard");
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await login(email, password);
      setAuth(response.access_token, response.user);
      router.push("/admin/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to login. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #111827, #0f172a)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "448px" }}>
        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              backgroundColor: "#1f2937",
              borderRadius: "8px",
              padding: "16px",
              border: "1px solid #374151",
            }}
          >
            <ChefHat style={{ width: "32px", height: "32px", color: "#f59e0b" }} />
            <div>
              <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "white", margin: "0" }}>
                Admin Panel
              </h1>
              <p style={{ fontSize: "12px", color: "#9ca3af", margin: "0" }}>Daughter's Delight</p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div
          style={{
            backgroundColor: "#1f2937",
            borderRadius: "8px",
            border: "1px solid #374151",
            padding: "32px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          }}
        >
          <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "white", marginBottom: "8px", marginTop: "0" }}>
            Welcome Back
          </h2>
          <p style={{ color: "#9ca3af", marginBottom: "32px", marginTop: "0" }}>Sign in to manage your menu</p>

          {error && (
            <div
              style={{
                backgroundColor: "#7f1d1d",
                border: "1px solid #991b1b",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "24px",
                display: "flex",
                gap: "12px",
              }}
            >
              <AlertCircle style={{ width: "20px", height: "20px", color: "#fecaca", flexShrink: 0, marginTop: "2px" }} />
              <p style={{ color: "#fecaca", fontSize: "14px", margin: "0" }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#d1d5db", marginBottom: "8px" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@eatddelight.com"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  backgroundColor: "#374151",
                  border: "1px solid #4b5563",
                  color: "white",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#d1d5db", marginBottom: "8px" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  backgroundColor: "#374151",
                  border: "1px solid #4b5563",
                  color: "white",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                backgroundColor: loading ? "#4b5563" : "#b45309",
                color: "white",
                fontWeight: "500",
                padding: "12px 16px",
                borderRadius: "8px",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                fontSize: "14px",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#92400e";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#b45309";
                }
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p style={{ textAlign: "center", color: "#9ca3af", fontSize: "14px", marginTop: "24px", marginBottom: "0" }}>
            Authorized personnel only
          </p>
        </div>
      </div>
    </div>
  );
}
