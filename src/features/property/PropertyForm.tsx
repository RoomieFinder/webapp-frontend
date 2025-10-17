"use client";

import React, { useEffect, useRef, useState, DragEvent } from "react";

export type FormValues = {
    placeName: string;
    caption: string;
    type: string;
    subdistrict: string;
    district: string;
    price: string;
    capacity: string;
    roomSize: string;
    description: string;
};

type DistrictOpt = { ID: number; NameInThai: string; ProvinceID?: number };
type SubdistrictOpt = { ID: number; NameInThai: string; DistrictID: number };

type SubmitResult = { ok: boolean; message?: string };
type SubmitHandler = (values: FormValues, photos: File[]) => Promise<SubmitResult>;

/**
 * Hook that contains all form state + location autocomplete logic.
 * Accept optional initialValues and optional submitHandler (create or update).
 */
export function usePropertyForm(initialValues: Partial<FormValues> = {}, submitHandler?: SubmitHandler) {
    const [formData, setFormData] = useState<FormValues>({
        placeName: initialValues.placeName || "",
        caption: initialValues.caption || "",
        type: initialValues.type || "",
        subdistrict: initialValues.subdistrict || "",
        district: initialValues.district || "",
        price: initialValues.price || "",
        capacity: initialValues.capacity || "",
        roomSize: initialValues.roomSize || "",
        description: initialValues.description || "",
    });

    const [photos, setPhotos] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string>("");

    // location autocomplete
    const [districtQuery, setDistrictQuery] = useState(formData.district);
    const [districtOptions, setDistrictOptions] = useState<DistrictOpt[]>([]);
    const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
    const [selectedDistrictID, setSelectedDistrictID] = useState<number | null>(null);

    const [subdistrictQuery, setSubdistrictQuery] = useState(formData.subdistrict);
    const [subdistrictOptions, setSubdistrictOptions] = useState<SubdistrictOpt[]>([]);
    const [showSubdistrictDropdown, setShowSubdistrictDropdown] = useState(false);

    const apiBase = "http://localhost:8080/locations";
    const districtDebounceRef = useRef<number | null>(null);
    const subdistrictDebounceRef = useRef<number | null>(null);

    async function fetchDistricts(name: string) {
        try {
            const res = await fetch(`${apiBase}/districts?name=${encodeURIComponent(name)}`);
            if (!res.ok) {
                setDistrictOptions([]);
                return;
            }
            const data = await res.json();
            setDistrictOptions((data || []).map((d: any) => ({ ID: d.ID, NameInThai: d.NameInThai, ProvinceID: d.ProvinceID })));
        } catch (err) {
            console.error("fetchDistricts", err);
            setDistrictOptions([]);
        }
    }

    async function fetchSubdistricts(name: string) {
        try {
            const res = await fetch(`${apiBase}/subdistricts?name=${encodeURIComponent(name)}`);
            if (!res.ok) {
                setSubdistrictOptions([]);
                return;
            }
            const data = await res.json();
            let mapped: SubdistrictOpt[] = (data || []).map((s: any) => ({ ID: s.ID, NameInThai: s.NameInThai, DistrictID: s.DistrictID }));
            if (selectedDistrictID !== null) mapped = mapped.filter((m) => m.DistrictID === selectedDistrictID);
            setSubdistrictOptions(mapped);
        } catch (err) {
            console.error("fetchSubdistricts", err);
            setSubdistrictOptions([]);
        }
    }

    function selectDistrict(opt: DistrictOpt) {
        setSelectedDistrictID(opt.ID);
        setFormData((prev) => ({ ...prev, district: opt.NameInThai, subdistrict: "" }));
        setDistrictQuery(opt.NameInThai);
        setShowDistrictDropdown(false);
        setSubdistrictOptions([]);
        setSubdistrictQuery("");
    }

    function selectSubdistrict(opt: SubdistrictOpt) {
        setFormData((prev) => ({ ...prev, subdistrict: opt.NameInThai }));
        setSubdistrictQuery(opt.NameInThai);
        setShowSubdistrictDropdown(false);
    }

    // outside click refs
    const districtWrapperRef = useRef<HTMLDivElement | null>(null);
    const subdistrictWrapperRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        function handleOutsideClick(e: MouseEvent) {
            if (districtWrapperRef.current && !districtWrapperRef.current.contains(e.target as Node)) setShowDistrictDropdown(false);
            if (subdistrictWrapperRef.current && !subdistrictWrapperRef.current.contains(e.target as Node)) setShowSubdistrictDropdown(false);
        }
        document.addEventListener("click", handleOutsideClick);
        return () => document.removeEventListener("click", handleOutsideClick);
    }, []);

    // generic handlers
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === "capacity") {
            if (value === "" || parseInt(value) < 0) {
                setFormData((prev) => ({ ...prev, [name]: "0" } as any));
                return;
            }
        }
        setFormData((prev) => ({ ...prev, [name]: value } as any));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        setPhotos((prev) => [...prev, ...Array.from(files)].slice(0, 5));
    };
    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files) setPhotos((prev) => [...prev, ...Array.from(e.dataTransfer.files)].slice(0, 5));
    };
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault();
    const removePhoto = (index: number) => setPhotos((prev) => prev.filter((_, i) => i !== index));

    // default submit (create) — can be overridden by passing submitHandler to hook
    const defaultSubmit: SubmitHandler = async (values, photosArr) => {
        const requiredFields = ["placeName", "caption", "type", "subdistrict", "district", "price", "capacity", "roomSize", "description"];
        for (const f of requiredFields) if (!values[f as keyof FormValues]?.toString().trim()) return { ok: false, message: `Please fill ${f}` };
        if (photosArr.length === 0) return { ok: false, message: "At least one photo required" };

        const fd = new FormData();
        requiredFields.forEach((field) => fd.append(field, values[field as keyof FormValues] as string));
        photosArr.forEach((p) => fd.append("pictures", p));
        try {
            const res = await fetch("http://localhost:8080/property", { method: "POST", credentials: "include", body: fd });
            const data = await res.json();
            if (!res.ok) return { ok: false, message: data.error || "Create failed" };
            return { ok: true, message: "Created" };
        } catch {
            return { ok: false, message: "Network error" };
        }
    };

    async function onSubmit(e?: React.FormEvent) {
        if (e) e.preventDefault();
        setMessage("");
        setLoading(true);
        const handler = submitHandler ?? defaultSubmit;
        const res = await handler(formData, photos);
        setLoading(false);
        setMessage(res.ok ? (res.message || "Success") : (res.message || "Failed"));
        if (res.ok) {
            setFormData({
                placeName: "",
                caption: "",
                type: "",
                subdistrict: "",
                district: "",
                price: "",
                capacity: "",
                roomSize: "",
                description: "",
            });
            setPhotos([]);
            setDistrictQuery("");
            setDistrictOptions([]);
            setSubdistrictQuery("");
            setSubdistrictOptions([]);
            setSelectedDistrictID(null);
        }
        return res;
    }

    return {
        // values
        formData,
        setFormData,
        photos,
        setPhotos,
        loading,
        message,
        // location/autocomplete state & handlers
        districtQuery,
        setDistrictQuery,
        districtOptions,
        showDistrictDropdown,
        setShowDistrictDropdown,
        selectedDistrictID,
        subdistrictQuery,
        setSubdistrictQuery,
        subdistrictOptions,
        showSubdistrictDropdown,
        setShowSubdistrictDropdown,
        // refs
        districtWrapperRef,
        subdistrictWrapperRef,
        // handlers
        fetchDistricts,
        fetchSubdistricts,
        selectDistrict,
        selectSubdistrict,
        onDistrictInputChange: (v: string) => {
            setDistrictQuery(v);
            setSelectedDistrictID(null);
            setFormData((prev) => ({ ...prev, district: v }));
            setShowDistrictDropdown(true);
            if (districtDebounceRef.current) window.clearTimeout(districtDebounceRef.current);
            districtDebounceRef.current = window.setTimeout(() => {
                if (v.trim().length > 0) fetchDistricts(v.trim());
                else setDistrictOptions([]);
            }, 300);
        },
        onSubdistrictInputChange: (v: string) => {
            setSubdistrictQuery(v);
            setFormData((prev) => ({ ...prev, subdistrict: v }));
            setShowSubdistrictDropdown(true);
            if (subdistrictDebounceRef.current) window.clearTimeout(subdistrictDebounceRef.current);
            subdistrictDebounceRef.current = window.setTimeout(() => {
                if (v.trim().length > 0) fetchSubdistricts(v.trim());
                else setSubdistrictOptions([]);
            }, 300);
        },
        // generic handlers
        handleChange,
        handleFileChange,
        handleDrop,
        handleDragOver,
        removePhoto,
        // submit
        onSubmit,
        // refs (exposed)
        districtRef: districtWrapperRef,
        subdistrictRef: subdistrictWrapperRef,
    };
}

/**
 * Presentational form body (no submit button).
 * Pass the object returned from usePropertyForm into the `form` prop.
 */
export function PropertyFormBody({ form }: { form: ReturnType<typeof usePropertyForm> }) {
    const {
        formData,
        photos,
        handleChange,
        handleFileChange,
        handleDrop,
        handleDragOver,
        removePhoto,
        // location
        districtQuery,
        onDistrictInputChange,
        districtOptions,
        showDistrictDropdown,
        districtRef,
        fetchDistricts,
        subdistrictQuery,
        onSubdistrictInputChange,
        subdistrictOptions,
        showSubdistrictDropdown,
        subdistrictRef,
        selectedDistrictID,
    } = form;

    return (
        <>
            {/* Place’s name */}
            <div className="flex flex-col w-full">
                <label>Place’s name</label>
                <input type="text" name="placeName" value={formData.placeName} onChange={handleChange} required className="rounded-md p-2 bg-white text-black" />
            </div>

            {/* Caption */}
            <div className="flex flex-col w-full">
                <label>Post Captions</label>
                <input type="text" name="caption" value={formData.caption} onChange={handleChange} required className="rounded-md p-2 bg-white text-black" />
            </div>

            {/* Type */}
            <div className="flex flex-col w-full">
                <label>Type</label>
                <input type="text" name="type" value={formData.type} onChange={handleChange} required placeholder="e.g., Apartment, Condo, Room" className="rounded-md p-2 bg-white text-black" />
            </div>

            {/* Photos */}
            <div className="flex flex-col w-full">
                <label>Photos</label>
                <div onDrop={handleDrop} onDragOver={handleDragOver} className="border-2 border-dashed border-gray-400 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-700/30 transition" onClick={() => (document.getElementById("fileInput") as HTMLInputElement | null)?.click()}>
                    <p className="text-gray-300">Drag & Drop or Click to Upload</p>
                    <input id="fileInput" type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                </div>

                {photos.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-4">
                        {photos.slice(0, 5).map((file, idx) => (
                            <div key={idx} className="relative w-28 h-28 bg-white rounded-lg overflow-hidden flex items-center justify-center shadow">
                                <img src={URL.createObjectURL(file)} alt="preview" className="object-cover w-full h-full" />
                                <button type="button" onClick={() => removePhoto(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600">×</button>
                            </div>
                        ))}
                        {photos.length > 5 && <div className="w-28 h-28 bg-gray-700 rounded-lg flex items-center justify-center text-white font-semibold">+{photos.length - 5} more</div>}
                    </div>
                )}
            </div>

            {/* District + Subdistrict */}
            <div className="flex flex-col md:flex-row gap-4 w-full">
                <div className="flex flex-col flex-1" ref={districtRef}>
                    <label>District</label>
                    <input type="text" name="district" value={districtQuery} onChange={(e) => onDistrictInputChange(e.target.value)} onFocus={() => { if (districtQuery.trim().length > 0) fetchDistricts(districtQuery); }} className="rounded-md p-2 bg-white text-black" autoComplete="off" />
                    {showDistrictDropdown && districtOptions.length > 0 && <ul className="bg-white text-black rounded-md mt-1 max-h-48 overflow-auto shadow z-50">{districtOptions.map((opt) => (<li key={opt.ID} className="px-3 py-2 hover:bg-slate-200 cursor-pointer" onClick={() => form.selectDistrict(opt)}>{opt.NameInThai}</li>))}</ul>}
                </div>

                <div className="flex flex-col flex-1" ref={subdistrictRef}>
                    <label>Subdistrict</label>
                    <input type="text" name="subdistrict" value={subdistrictQuery} onChange={(e) => onSubdistrictInputChange(e.target.value)} onFocus={() => { if (subdistrictQuery.trim().length > 0) form.fetchSubdistricts(subdistrictQuery); }} className="rounded-md p-2 bg-white text-black" autoComplete="off" />
                    {showSubdistrictDropdown && subdistrictOptions.length > 0 && <ul className="bg-white text-black rounded-md mt-1 max-h-48 overflow-auto shadow z-50">{subdistrictOptions.map((opt) => (<li key={opt.ID} className="px-3 py-2 hover:bg-slate-200 cursor-pointer" onClick={() => form.selectSubdistrict(opt)}>{opt.NameInThai}</li>))}</ul>}
                    {selectedDistrictID !== null && subdistrictOptions.length === 0 && subdistrictQuery.trim().length > 0 && <p className="text-sm text-gray-300 mt-1">No subdistricts found for selected district.</p>}
                </div>
            </div>

            {/* Price + Room size + Capacity */}
            <div className="flex flex-col md:flex-row gap-4 w-full">
                <div className="flex flex-col flex-1 min-w-0">
                    <label>Price (THB)</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} className="rounded-md p-2 bg-white text-black" />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                    <label>Room size (sqm)</label>
                    <input type="number" name="roomSize" value={formData.roomSize} onChange={handleChange} className="rounded-md p-2 bg-white text-black" />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                    <label>Capacity</label>
                    <input type="number" name="capacity" min={0} value={formData.capacity} onChange={handleChange} className="rounded-md p-2 bg-white text-black" />
                </div>
            </div>

            {/* Description */}
            <div className="flex flex-col w-full">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="rounded-md p-2 bg-white text-black" />
            </div>
        </>
    );
}

/**
 * Action buttons component.
 * - submitLabel: button text
 * - onDelete: optional delete handler (for edit page)
 */
export function PropertyFormActions({
    form,
    submitLabel = "Create Post",
    onDelete,
}: {
    form: ReturnType<typeof usePropertyForm>;
    submitLabel?: string;
    onDelete?: () => Promise<void>;
}) {
    return (
        <div className="flex justify-center pt-6 space-x-4">
            {onDelete && (
                <button type="button" onClick={onDelete} className="bg-red-400 text-white px-6 py-2 rounded-md">
                    Delete Post
                </button>
            )}
            <button type="submit" disabled={form.loading} className="bg-[#E6DFC9] text-black px-10 py-3 rounded-md shadow font-extrabold hover:bg-[#d4c6aa] hover:scale-105 transition-all duration-200">
                {form.loading ? "Processing..." : submitLabel}
            </button>
            {form.message && <p className="mt-4 text-white font-mono">{form.message}</p>}
        </div>
    );
}