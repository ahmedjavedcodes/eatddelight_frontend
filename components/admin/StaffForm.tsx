"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store/auth";
import { createStaff } from "@/lib/api/admin";
import { AlertCircle, X } from "lucide-react";

interface StaffFormProps {
  onClose: () => void;
  onSaved: () => void;
}

export default function StaffForm({ onClose, onSaved }: StaffFormProps) {
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "staff" as const,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      if (!token) throw new Error("Not authenticated");

      await createStaff(token, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      onSaved();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create staff member",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-foreground placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";
  const labelClass = "mb-1.5 block text-sm font-medium text-foreground";

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Add Staff Member
        </h2>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-tint hover:text-foreground"
        >
          <X size={18} />
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl bg-primary/10 p-4">
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-primary-dark" />
          <p className="text-sm text-primary-dark">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className={labelClass}>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Ahmed Ali"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ahmed@eatddelight.com"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Role *</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="staff">Staff (Create/Update only)</option>
              <option value="owner">Owner (Full Access)</option>
            </select>
            <p className="mt-1 text-xs text-muted">
              Staff members can create and update items but cannot delete or manage other staff
            </p>
          </div>

          <div>
            <label className={labelClass}>Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={inputClass}
              required
              minLength={8}
            />
            <p className="mt-1 text-xs text-muted">Minimum 8 characters</p>
          </div>

          <div>
            <label className={labelClass}>Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className={inputClass}
              required
              minLength={8}
            />
          </div>
        </div>

        <div className="flex gap-3 border-t border-black/5 pt-5">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-full bg-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-muted"
          >
            {loading ? "Creating..." : "Create Staff Member"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full bg-tint py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-tint/70"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
