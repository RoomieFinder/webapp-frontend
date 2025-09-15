import React from "react";
import Link from "next/link"; // ใช้สำหรับ Next.js

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onFilter?: (filter: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onFilter }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        background: "transparent",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          display: "flex",
          alignItems: "center",
          background: "#fff",
          borderRadius: "6px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          padding: "10px 32px 10px 20px",
          margin: "10px 15px 0 80px",
          gap: "12px",
        }}
      >
        {/* Search box */}
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => onSearch?.(e.target.value)}
          style={{
            width: "600px",
            height: "40px",
            border: "none",
            outline: "none",
            fontSize: "14px",
            padding: "8px",
            marginLeft: "10px",
            background: "#f5f5f5",
            borderRadius: "16px",
          }}
        />

        {/* Filter dropdown */}
        <select
          onChange={(e) => onFilter?.(e.target.value)}
          style={{
            width: "300px",
            height: "40px",
            border: "none",
            outline: "none",
            fontSize: "14px",
            padding: "8px 12px",
            background: "#f5f5f5",
            borderRadius: "16px",
            cursor: "pointer",
          }}
        >
          <option value="">Filter</option>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
        </select>

        {/* Profile picture */}
        <Link href="/tenants/profile" style={{ marginLeft: "auto" }}>
          <img
            src="/mock_user.png" // ใส่ path รูปจริงของคุณ
            alt="Profile"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              cursor: "pointer",
              marginLeft: "auto", // ดันไปขวาสุด
            }}
          />
        </Link>
      </div>
    </div>
  );
};

export default SearchBar;
