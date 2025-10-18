/**
 * แปลง ISO date string เป็นรูปแบบ "12 October 2025"
 * (at)param dateString - ตัวอย่าง: "2025-10-15T18:33:47.866973+07:00"
 * (at)returns string - "15 October 2025"
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "";

  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

/**
 * เวอร์ชันภาษาไทย
 * @param dateString - ISO date string
 * @returns string - "15 ตุลาคม 2025"
 */
export function formatDateThai(dateString: string | null | undefined): string {
  if (!dateString) return "";

  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("th-TH", { month: "long" });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}
