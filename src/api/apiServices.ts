import { BASE_URL } from "@/config/api";

export const apiServices = {
  getMe: async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const json = await res.json();
      if (json.success) {
        return json.data;
      } else {
        console.error("Failed to get current user");
        return null;
      }
    } catch (err) {
      console.error("Error fetching current user:", err);
      return null;
    }
  },
  getUserByID: async (userId: number) => {
    try {
      const res = await fetch(`${BASE_URL}/user/userProfile/${userId}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const json = await res.json();
      if (json) {
        return json;
      } else {
        console.error("Failed to get the user");
        return null;
      }
    } catch (err) {
      console.error("Error fetching the user:", err);
      return null;
    }
  },
  getGroup: async (groupId: number) => {
    try {
      const res = await fetch(`${BASE_URL}/group/${groupId}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const json = await res.json();
      // console.log("Data", json.data)
      if (json.success) return json.data;

      console.error("Failed to fetch group");
      return null;
    } catch (err) {
      console.error("Error fetching group:", err);
      return null;
    }
  },
  getPendingRequests: async (groupId: number, status?: string) => {
    try {
      const res = await fetch(
        `${BASE_URL}/groupRequest/requests/groups/${groupId}`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      const json = await res.json();

      if (json.success) {
        return json.data; // คืนเฉพาะข้อมูล group requests
      }

      console.error("Failed to fetch group requests:", json.message);
      return null;
    } catch (err) {
      console.error("Error fetching group requests:", err);
      return null;
    }
  },
  leaveGroup: async (groupId: number) => {
    try {
      const res = await fetch(`${BASE_URL}/group/${groupId}/leave`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      // console.log(data);

      if (!res.ok) throw new Error("Failed to leave the group");
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },
  deleteGroup: async (groupId: number) => {
    try {
      const res = await fetch(`${BASE_URL}/group/${groupId}/delete`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      console.log(data);

      if (!res.ok) throw new Error("Failed to delete the group");
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },
  deleteMember: async (groupId: number, memberId: number) => {
    try {
      const res = await fetch(
        `${BASE_URL}/group/${groupId}/member/${memberId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();
      // console.log(data);

      if (!res.ok) throw new Error("Failed to delete member");
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },
  promoteLeader: async (groupId: number, leaderId: number) => {
    try {
      const res = await fetch(`${BASE_URL}/group/${groupId}/leader`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_leader_user_id: leaderId }),
      });
      const data = await res.json();
      console.log(data);

      if (!res.ok) throw new Error("Failed to promote leader");
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },
  acceptRequest: async (requestId: number) => {
    try {
      const res = await fetch(
        `${BASE_URL}/groupRequest/requests/${requestId}/accept`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to accept request");

      console.log("Accept success:", data);
      return true;
    } catch (err) {
      console.error("Accept error:", err);
      return false;
    }
  },
  rejectRequest: async (requestId: number) => {
    try {
      const res = await fetch(
        `${BASE_URL}/groupRequest/requests/${requestId}/reject`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to reject request");

      console.log("Reject success:", data);
      return true;
    } catch (err) {
      console.error("Reject error:", err);
      return false;
    }
  },
  joinGroup: async (groupId: number) => {
    try {
      const res = await fetch(
        `${BASE_URL}/groupRequest/requests/groups/${groupId}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        console.error("Failed to join group:", data?.message || res.status);
        return false;
      }

      return true;
    } catch (err) {
      console.error("Error joining group:", err);
      return false;
    }
  },

  getLandlordRequests: async (landlordId: number) => {
    try {
      const res = await fetch(`${BASE_URL}/group/requests/landlord/${landlordId}`);
      const json = await res.json();
      if (json.success) return json.data;
      throw new Error(json?.message || "Failed to fetch landlord requests");
    } catch (err) {
      console.error("Error fetching landlord requests:", err);
      return null;
    }
  },

  getLandlordProperties: async () => {
    try {
      const res = await fetch(`${BASE_URL}/landlord/properties`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json();
      if (res.ok) return json.properties;
      throw new Error(json?.message || "Failed to fetch landlord properties");
    } catch (err) {
      console.error("Error fetching landlord properties:", err);
      return null;
    }
  },

  respondToLandlordRequest: async (requestId: number, accept: boolean) => {
    try {
      const res = await fetch(`${BASE_URL}/landlord/response/${requestId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accept }),
      });
      if (!res.ok) throw new Error("Failed to respond to request");
      return true;
    } catch (err) {
      console.error("Error responding to landlord request:", err);
      return false;
    }
  },

  // Authentication helpers
  authRegister: async (payload: { username: string; email: string; password: string; phone?: string; role?: string }) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      return { ok: res.ok, data: json };
    } catch (err) {
      console.error("Error registering user:", err);
      return { ok: false, data: null };
    }
  },

  authLogin: async (payload: { email: string; password: string }) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      return { ok: res.ok, data: json };
    } catch (err) {
      console.error("Error logging in:", err);
      return { ok: false, data: null };
    }
  },

  // Property creation wrapper (multipart/form-data)
  createProperty: async (formData: FormData) => {
    try {
      const res = await fetch(`${BASE_URL}/property`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to create property");
      return await res.json();
    } catch (err) {
      console.error("Error creating property:", err);
      return null;
    }
  },
  // Location helpers
  getDistricts: async (name: string) => {
    try {
      const res = await fetch(`${BASE_URL}/locations/districts?name=${encodeURIComponent(name)}`);
      if (!res.ok) throw new Error("Failed to fetch districts");
      return await res.json();
    } catch (err) {
      console.error("Error fetching districts:", err);
      return null;
    }
  },

  getSubdistricts: async (name: string, opts?: { districtID?: number; districtName?: string }) => {
    try {
      let url = `${BASE_URL}/locations/subdistricts?name=${encodeURIComponent(name)}`;
      if (opts?.districtID) url += `&districtID=${opts.districtID}`;
      else if (opts?.districtName) url += `&district=${encodeURIComponent(opts.districtName)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch subdistricts");
      return await res.json();
    } catch (err) {
      console.error("Error fetching subdistricts:", err);
      return null;
    }
  },

  // Group / admin helpers
  createGroup: async (payload: { group_name: string; description?: string; property_id?: number }) => {
    try {
      const res = await fetch(`${BASE_URL}/group`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      return { ok: res.ok, data: json };
    } catch (err) {
      console.error("Error creating group:", err);
      return { ok: false, data: null };
    }
  },

  toggleGroupVisibility: async (groupId: number, visibility: number) => {
    try {
      const res = await fetch(`${BASE_URL}/group/${groupId}/visibility`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibility }),
      });
      const text = await res.text();
      let data: any = null;
      try { data = text ? JSON.parse(text) : null; } catch (_) { }
      if (!res.ok) throw new Error(data?.message || `Failed to toggle visibility (${res.status})`);
      return { ok: true, data };
    } catch (err) {
      console.error("Error toggling group visibility:", err);
      return { ok: false, error: err };
    }
  },

  // Preferred properties for groups
  getPreferredProperties: async (groupId: string | number) => {
    try {
      const res = await fetch(`${BASE_URL}/group/${groupId}/preferred-property/`, {
        method: "GET",
        credentials: "include",
      });
      const json = await res.json();
      if (res.ok) return json.data || [];
      throw new Error(json?.message || "Failed to fetch preferred properties");
    } catch (err) {
      console.error("Error fetching preferred properties:", err);
      return null;
    }
  },

  addPreferredProperty: async (propertyId: number) => {
    try {
      const res = await fetch(`${BASE_URL}/group/preferred-property/${propertyId}`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to add preferred property");
      return true;
    } catch (err) {
      console.error("Error adding preferred property:", err);
      return false;
    }
  },

  removePreferredProperty: async (propertyId: number) => {
    try {
      const res = await fetch(`${BASE_URL}/group/preferred-property/${propertyId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to remove preferred property");
      return true;
    } catch (err) {
      console.error("Error removing preferred property:", err);
      return false;
    }
  },

  // Property helpers
  getProperty: async (propertyId: number) => {
    try {
      const res = await fetch(`${BASE_URL}/property/${propertyId}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to fetch property");
      return await res.json();
    } catch (err) {
      console.error("Error fetching property:", err);
      return null;
    }
  },

  bookProperty: async (propertyId: number) => {
    try {
      const res = await fetch(`${BASE_URL}/group/booking/request/${propertyId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Booking request failed");
      return await res.json();
    } catch (err) {
      console.error("Error booking property:", err);
      return null;
    }
  },
  updateProperty: async (propertyId: number | string, formData: FormData) => {
    try {
      const res = await fetch(`${BASE_URL}/property/${propertyId}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.message || `Update failed (${res.status})`);
      return { ok: true, data: json };
    } catch (err) {
      console.error("Error updating property:", err);
      return { ok: false, error: err };
    }
  },

  deleteProperty: async (propertyId: number | string) => {
    try {
      const res = await fetch(`${BASE_URL}/property/${propertyId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Delete failed (${res.status})`);
      }
      return { ok: true };
    } catch (err) {
      console.error("Error deleting property:", err);
      return { ok: false, error: err };
    }
  },
  reportUser: async (tenantId: number, reason: string) => {
    try {
      const res = await fetch(`${BASE_URL}/reports/tenant`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportedTenantId: tenantId, reason: reason }),
      });
      const data = await res.json();
      // console.log(data);

      if (!res) throw new Error("Failed to report user");
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },
  getAllReports: async () => {
    try {
      const res = await fetch(`${BASE_URL}/admin/reports`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const json = await res.json();

      if (json.status == "success") return json.data;

      console.error("Failed to fetch group");
      return null;
    } catch (err) {
      console.error("Error fetching all reports:", err);
      return null;
    }
  },
  async rejectReport(reportId: number) {
    const res = await fetch(`${BASE_URL}/admin/reports/${reportId}/reject`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Failed to reject report");
    return res.json();
  },

  async banUser(reportId: number) {
    const res = await fetch(`${BASE_URL}/admin/reports/${reportId}/accept`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Failed to ban user");
    return res.json();
  },
};
