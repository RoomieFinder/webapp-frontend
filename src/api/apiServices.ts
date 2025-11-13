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
};
