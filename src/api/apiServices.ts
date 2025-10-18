export const apiServices = {
  getMe: async () => {
    try {
      const res = await fetch("http://localhost:8080/auth/me", {
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
  getGroup: async (groupId: number) => {
    try {
      const res = await fetch(`http://localhost:8080/group/${groupId}`, {
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
  leaveGroup: async (groupId: number) => {
    try {
      const res = await fetch(`http://localhost:8080/group/${groupId}/leave`, {
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
      const res = await fetch(`http://localhost:8080/group/${groupId}/delete`, {
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
        `http://localhost:8080/group/${groupId}/member/${memberId}`,
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
      const res = await fetch(`http://localhost:8080/group/${groupId}/leader`, {
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
};
