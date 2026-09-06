"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";
import { getStaff, updateStaff } from "@/lib/api/admin";
import { AdminUser } from "@/lib/api/admin";
import { Plus, AlertCircle, Shield, User } from "lucide-react";
import PageHeading from "@/components/storefront/PageHeading";
import StaffForm from "@/components/admin/StaffForm";

export default function StaffPage() {
  const router = useRouter();
  const { token, isOwner, user: currentUser } = useAuthStore();
  const [staff, setStaff] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!isOwner()) {
      router.push("/admin/dashboard");
      return;
    }

    const fetchStaff = async () => {
      if (!token) return;

      try {
        const staffMembers = await getStaff(token);
        setStaff(staffMembers);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch staff");
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleStaffSaved = () => {
    setShowForm(false);
    if (token) {
      getStaff(token)
        .then(setStaff)
        .catch((err) => setError(err instanceof Error ? err.message : "Failed to refresh"));
    }
  };

  const handleToggleActive = async (id: number, isActive: boolean) => {
    if (!token) return;

    try {
      const updatedStaff = await updateStaff(token, id, { is_active: !isActive });
      setStaff(staff.map((s) => (s.id === id ? updatedStaff : s)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update staff");
    }
  };

  if (!isOwner()) {
    return null;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <PageHeading eyebrow="Admin" title="Staff" />
          <p className="mt-2 text-sm text-muted">
            {loading ? "Loading…" : `${staff.length} staff member${staff.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          <Plus size={16} />
          Add Staff
        </button>
      </div>

      {error && (
        <div className="mt-6 flex items-start gap-3 rounded-xl bg-primary/10 p-4">
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-primary-dark" />
          <div>
            <p className="text-sm text-primary-dark">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-1 text-xs font-medium text-primary-dark underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <div className="mt-6">
          <StaffForm onClose={() => setShowForm(false)} onSaved={handleStaffSaved} />
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {loading ? (
          <div className="col-span-full rounded-2xl bg-white p-10 text-center text-sm text-muted shadow-sm ring-1 ring-black/5">
            Loading staff…
          </div>
        ) : staff.length === 0 ? (
          <div className="col-span-full rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-black/5">
            <p className="text-sm text-muted">No staff members yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-2 text-sm font-semibold text-primary hover:text-primary-dark"
            >
              Add your first staff member
            </button>
          </div>
        ) : (
          staff.map((member) => (
            <div
              key={member.id}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-tint text-primary">
                  {member.role === "owner" ? <Shield size={18} /> : <User size={18} />}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate font-heading font-semibold text-foreground">
                    {member.name}
                  </h3>
                  <p className="truncate text-sm text-muted">{member.email}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        member.role === "owner"
                          ? "bg-gold/15 text-gold"
                          : "bg-tint text-primary-dark"
                      }`}
                    >
                      {member.role === "owner" ? "Owner" : "Staff"}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        member.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-black/5 text-muted"
                      }`}
                    >
                      {member.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-black/5 pt-4">
                {member.id !== currentUser?.id ? (
                  <button
                    onClick={() => handleToggleActive(member.id, member.is_active)}
                    className={`w-full rounded-full py-2 text-sm font-semibold transition-colors ${
                      member.is_active
                        ? "bg-primary/10 text-primary-dark hover:bg-primary/20"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {member.is_active ? "Deactivate" : "Activate"}
                  </button>
                ) : (
                  <p className="text-center text-sm text-muted">This is your account</p>
                )}
              </div>

              <p className="mt-3 text-xs text-muted">
                Joined {new Date(member.created_at).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
