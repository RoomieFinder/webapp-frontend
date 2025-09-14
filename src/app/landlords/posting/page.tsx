"use client";

import TopBar from "@/components/ui/TopBar";
import { useState, DragEvent } from "react";

export default function CreatePost() {
  const [formData, setFormData] = useState({
    placeName: "",
    caption: "",
    type: "",
    address: "",
    price: "",
    capacity: "",
    roomSize: "",
    description: "",
  });

  const [photos, setPhotos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle text input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Enforce capacity to be >= 0
    if (name === "capacity") {
      if (value === "" || parseInt(value) < 0) {
        setFormData((prev) => ({ ...prev, [name]: "0" }));
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setPhotos((prev) => [...prev, ...Array.from(files)].slice(0, 5));
  };

  // Handle drag & drop
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      setPhotos((prev) => [...prev, ...Array.from(e.dataTransfer.files)].slice(0, 5));
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Remove photo
  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      // ✅ build FormData
      const formDataToSend = new FormData();
      formDataToSend.append("placeName", formData.placeName);
      formDataToSend.append("caption", formData.caption);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("capacity", formData.capacity);
      formDataToSend.append("roomSize", formData.roomSize);
      formDataToSend.append("description", formData.description);

      // ✅ backend expects "pictures"
      photos.forEach((file) => {
        formDataToSend.append("pictures", file);
      });

      const res = await fetch("http://localhost:8080/property", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // don’t set Content-Type, browser does it
        },
        body: formDataToSend,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Property created successfully!");
        setFormData({
          placeName: "",
          caption: "",
          type: "",
          address: "",
          price: "",
          capacity: "",
          roomSize: "",
          description: "",
        });
        setPhotos([]);
      } else {
        setMessage(`❌ ${data.error || "Failed to create property"}`);
      }
    } catch (err) {
      setMessage("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full">
      <div className="flex-1 bg-[#192A46] flex flex-col">
        {/* TopBar */}
        <div className="w-full px-4">
          <TopBar pageName="Create a Post" />
        </div>

        {/* Form */}
        <div className="flex flex-col flex-1 items-center justify-start overflow-y-auto pt-24 pb-6">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-6 w-full max-w-3xl font-mono text-white"
          >
            {/* Place’s name */}
            <div className="flex flex-col w-full">
              <label>Place’s name</label>
              <input
                type="text"
                name="placeName"
                value={formData.placeName}
                onChange={handleChange}
                required
                className="rounded-md p-2 bg-white text-black"
              />
            </div>

            {/* Caption */}
            <div className="flex flex-col w-full">
              <label>Post Captions</label>
              <input
                type="text"
                name="caption"
                value={formData.caption}
                onChange={handleChange}
                required
                className="rounded-md p-2 bg-white text-black"
              />
            </div>

            {/* Photos with drag & drop */}
            <div className="flex flex-col w-full">
              <label>Photos</label>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-gray-400 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-700/30 transition"
                onClick={() =>
                  document.getElementById("fileInput")?.click()
                }
              >
                <p className="text-gray-300">Drag & Drop or Click to Upload</p>
                <input
                  id="fileInput"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Grid Preview */}
              {photos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-4">
                  {photos.slice(0, 5).map((file, idx) => (
                    <div
                      key={idx}
                      className="relative w-28 h-28 bg-white rounded-lg overflow-hidden flex items-center justify-center shadow"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="object-cover w-full h-full"
                      />
                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => removePhoto(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {photos.length > 5 && (
                    <div className="w-28 h-28 bg-gray-700 rounded-lg flex items-center justify-center text-white font-semibold">
                      +{photos.length - 5} more
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Address + Type */}
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <div className="flex flex-col flex-1">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="rounded-md p-2 bg-white text-black"
                />
              </div>
              <div className="flex flex-col flex-1">
                <label>Type</label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="rounded-md p-2 bg-white text-black"
                />
              </div>
            </div>

            {/* Price + Room size + Capacity */}
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <div className="flex flex-col flex-1 min-w-0">
                <label>Price (THB)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="rounded-md p-2 bg-white text-black"
                />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <label>Room size (sqm)</label>
                <input
                  type="number"
                  name="roomSize"
                  value={formData.roomSize}
                  onChange={handleChange}
                  className="rounded-md p-2 bg-white text-black"
                />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <label>Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  min={0}
                  value={formData.capacity}
                  onChange={handleChange}
                  className="rounded-md p-2 bg-white text-black"
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col w-full">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="rounded-md p-2 bg-white text-black"
              />
            </div>

            {/* Submit button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#E6DFC9] text-black px-10 py-3 rounded-md shadow font-extrabold
                        hover:bg-[#d4c6aa] hover:scale-105 hover:shadow-lg transition-all duration-200"
              >
                {loading ? "Creating..." : "Create Post"}
              </button>
            </div>
          </form>

          {message && <p className="mt-4 text-white font-mono">{message}</p>}
        </div>
      </div>
    </div>
  );
}