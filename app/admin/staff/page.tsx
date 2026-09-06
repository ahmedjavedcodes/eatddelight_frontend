"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";
import { getStaff, updateStaff } from "@/lib/api/admin";
import { AdminUser } from "@/lib/api/admin";
import { Plus, AlertCircle, Shield, User } from "lucide-react";
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
        setError(
          err instanceof Error ? err.message : "Failed to fetch staff",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [token, isOwner, router]);

  const handleStaffSaved = () => {
    setShowForm(false);
    // Refetch staff
    if (token) {
      getStaff(token)
        .then(setStaff)
        .catch((err) =>
          setError(err instanceof Error ? err.message : "Failed to refresh"),
        );
    }
  };

  const handleToggleActive = async (id: number, isActive: boolean) => {
    if (!token) return;

    try {
      const updatedStaff = await updateStaff(token, id, {
        is_active: !isActive,
      });
      setStaff(staff.map((s) => (s.id === id ? updatedStaff : s)));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update staff",
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading staff...</div>
      </div>
    );
  }

  if (!isOwner()) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Staff Management</h1>
          <p className="text-gray-400">
            {staff.length} staff member{staff.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Staff
        </button>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-8 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-200 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-200">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-300 text-sm mt-2 hover:text-red-200"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <div className="mb-8">
          <StaffForm
            onClose={() => setShowForm(false)}
            onSaved={handleStaffSaved}
          />
        </div>
      )}

      {/* Staff List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {staff.length === 0 ? (
          <div className="col-span-full">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center text-gray-400">
              <p className="mb-4">No staff members yet</p>
              <button
                onClick={() => setShowForm(true)}
                className="text-amber-400 hover:text-amber-300"
              >
                Add your first staff member
              </button>
            </div>
          </div>
        ) : (
          staff.map((member) => (
            <div
              key={member.id}
              className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-lg p-3">
                    {member.role === "owner" ? (
                      <Shield className="w-6 h-6 text-white" />
                    ) : (
                      <User className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                    <p className="text-sm text-gray-400 mb-2">{member.email}</p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          member.role === "owner"
                            ? "bg-purple-900 text-purple-200"
                            : "bg-blue-900 text-blue-200"
                        }`}
                      >
                        {member.role === "owner" ? "Owner" : "Staff"}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          member.is_active
                            ? "bg-green-900 text-green-200"
                            : "bg-red-900 text-red-200"
                        }`}
                      >
                        {member.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700">
                {member.id !== currentUser?.id && (
                  <button
                    onClick={() =>
                      handleToggleActive(member.id, member.is_active)
                    }
                    className={`w-full px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                      member.is_active
                        ? "bg-red-900 hover:bg-red-800 text-red-200"
                        : "bg-green-900 hover:bg-green-800 text-green-200"
                    }`}
                  >
                    {member.is_active ? "Deactivate" : "Activate"}
                  </button>
                )}
                {member.id === currentUser?.id && (
                  <p className="text-sm text-gray-400 text-center">
                    This is your account
                  </p>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-xs text-gray-500">
                  Joined{" "}
                  {new Date(member.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
