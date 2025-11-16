"use client";

import SearchBar from "@/components/ui/SearchBar";
import Image from "next/image";
import { useState, useEffect } from "react";
import { apiServices } from "@/api/apiServices";
import BanConfirmModal from "@/components/ui/BanConfirmModal";
import SuccessModal from "@/components/ui/SuccessModal";

interface Report {
  ID: number;
  ReporterUserID: number;
  ReportedUserID: number;
  Reason: string;
  Status: string;
  CreatedAt: string;
}

interface User {
  ID: number;
  Username: string;
  Tenant?: {
    PersonalProfile?: {
      Pictures?: { Link: string }[];
    };
  };
}

export default function ReportsHandlingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [reports, setReports] = useState<
    (Report & { reporter?: User; reported?: User })[]
  >([]);
  const [loading, setLoading] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [banModalOpen, setBanModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    reportId: number;
    reportedName: string;
    reporterName: string;
    reportedPersonalPicture?: string;
    reason?: string;
  } | null>(null);

  const openBanModal = (
    report: Report & { reporter?: User; reported?: User }
  ) => {
    setSelectedUser({
      reportId: report.ID,
      reportedName: report.reported?.Username || "Unknown",
      reporterName: report.reporter?.Username || "Unknown",
      reportedPersonalPicture:
        report.reported?.Tenant?.PersonalProfile?.Pictures?.[0]?.Link,
      reason: report.Reason,
    });
    setBanModalOpen(true);
  };

  // โหลดข้อมูลทั้งหมด
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const res = await apiServices.getAllReports();
        if (!res) return;

        // ดึง user profile ของแต่ละคู่
        const enriched = await Promise.all(
          res.map(async (report: Report) => {
            const [reporter, reported] = await Promise.all([
              apiServices.getUserByID(report.ReporterUserID),
              apiServices.getUserByID(report.ReportedUserID),
            ]);
            return { ...report, reporter, reported };
          })
        );

        setReports(enriched);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleSearch = (query: string) => setSearchQuery(query);

  const filteredReports = reports.filter((r) =>
    r.reported?.Username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleReject = async (reportId: number) => {
    try {
      await apiServices.rejectReport(reportId);
      // alert("Report rejected successfully");
      setSuccessMessage("Report rejected successfully");
      setShowSuccess(true);

      setReports((prev) => prev.filter((r) => r.ID !== reportId));
    } catch (error) {
      console.error(error);
      alert("Failed to reject report");
    }
  };

  const handleBanFromModal = async (reportId: number) => {
    try {
      await apiServices.banUser(reportId);
      // alert("User banned successfully");
      setSuccessMessage("User banned successfully");
      setShowSuccess(true);

      setReports((prev) => prev.filter((r) => r.ID !== reportId));
    } catch (error) {
      console.error(error);
      alert("Failed to ban user");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0F1B2D] text-black">
      <SearchBar onSearch={handleSearch} />

      <div className="flex flex-1 p-4 gap-4">
        {/* Left side - Reports */}
        <div className="flex-1 bg-white rounded-2xl p-6 overflow-y-auto ml-[62px]">
          <h2 className="text-2xl font-bold mb-3">Reports</h2>
          <hr className="mb-4" />

          {loading ? (
            <p>Loading...</p>
          ) : filteredReports.length === 0 ? (
            <p>No reports found.</p>
          ) : (
            <ul className="">
              {filteredReports.map((report) => {
                const profilePic =
                  report.reported?.Tenant?.PersonalProfile?.Pictures?.[0]?.Link;

                return (
                  <li
                    key={report.ID}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-200 transition"
                  >
                    <div className="flex items-center gap-4">
                      {/* Profile image */}
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-300 flex-shrink-0">
                        <Image
                          src={profilePic || "/default_profile.png"}
                          alt="profile"
                          width={56}
                          height={56}
                          className="object-cover w-full h-full "
                        />
                      </div>

                      {/* Text details */}
                      <div>
                        <p className="font-semibold text-lg">
                          {report.reported?.Username || "Unknown"}
                        </p>
                        <p className="text-sm text-gray-600">
                          Reported by: {report.reporter?.Username || "Unknown"}
                        </p>
                        <p className="text-sm text-gray-600">
                          Reason: {report.Reason}
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleReject(report.ID)}
                        className="px-4 py-2 bg-[#627EAA] text-white rounded-lg hover:bg-[#4d6996] transition hover:cursor-pointer"
                      >
                        Reject Report
                      </button>
                      <button
                        onClick={() => openBanModal(report)}
                        className="px-4 py-2 bg-[#E68780] text-white rounded-lg hover:bg-[#cc6b64] transition hover:cursor-pointer"
                      >
                        Ban
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Right side - History */}
        {/* <div className="w-1/3 bg-white rounded-2xl p-6 flex flex-col">
          <h2 className="text-2xl font-bold mb-3">History</h2>
          <hr className="mb-3" />
          <div className="space-y-2 text-sm">
            <p>
              Adam Banned
              <br />
              <span className="text-gray-500">
                20:23, 21 Oct 2025 by admin1
              </span>
            </p>
            <p>
              Jake Banned
              <br />
              <span className="text-gray-500">
                20:23, 21 Oct 2025 by admin2
              </span>
            </p>
            <p>
              Chris’s report rejected
              <br />
              <span className="text-gray-500">
                20:23, 21 Oct 2025 by admin3
              </span>
            </p>
          </div>
        </div> */}
      </div>

      <SuccessModal
        open={showSuccess}
        message={successMessage}
        onConfirm={() => {
          setShowSuccess(false);
        }}
      />

      <BanConfirmModal
        open={banModalOpen}
        onClose={() => setBanModalOpen(false)}
        user={selectedUser}
        onSubmit={(reportId) => handleBanFromModal(reportId)}
      />
    </div>
  );
}
