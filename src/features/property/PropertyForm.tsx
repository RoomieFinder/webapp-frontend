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
    // existingPhotos can be passed in initialValues (not sent to backend directly)
    // id is optional because some backends return plain URL strings without numeric ids
    existingPhotos?: { id?: number; url: string }[];
};

type DistrictOpt = { ID: number; NameInThai: string; ProvinceID?: number };
type SubdistrictOpt = { ID: number; NameInThai: string; DistrictID: number };

type SubmitResult = { ok: boolean; message?: string };
// now submit handler receives deletedPictureIDs as third arg (for edit)
type SubmitHandler = (values: FormValues, photos: File[], deletedPictureIDs?: number[], deletedPictureURLs?: string[]) => Promise<SubmitResult>;

/**
 * Hook that contains all form state + location autocomplete logic.
 * Accept optional initialValues and optional submitHandler (create or update).
 */
export function usePropertyForm(
    initialValues: Partial<FormValues> = {},
    submitHandler?: SubmitHandler,
    options?: { resetOnSuccess?: boolean }
) {
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
        existingPhotos: initialValues.existingPhotos || [],
    });

    const [photos, setPhotos] = useState<File[]>([]);
    const [existingPhotos, setExistingPhotos] = useState<{ id?: number; url: string }[]>(initialValues.existingPhotos || []);
    const [deletedPictureIDs, setDeletedPictureIDs] = useState<number[]>([]);
    const [deletedPictureURLs, setDeletedPictureURLs] = useState<string[]>([]);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string>("");

    // location autocomplete
    const [districtQuery, setDistrictQuery] = useState(formData.district);
    const [districtOptions, setDistrictOptions] = useState<DistrictOpt[]>([]);
    const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
    const [selectedDistrictID, setSelectedDistrictID] = useState<number | null>(null);
    const [districtHighlightIndex, setDistrictHighlightIndex] = useState<number>(-1);

    const [subdistrictQuery, setSubdistrictQuery] = useState(formData.subdistrict);
    const [subdistrictOptions, setSubdistrictOptions] = useState<SubdistrictOpt[]>([]);
    const [showSubdistrictDropdown, setShowSubdistrictDropdown] = useState(false);
    const [subdistrictHighlightIndex, setSubdistrictHighlightIndex] = useState<number>(-1);

<<<<<<< Updated upstream
    const apiBase = `${process.env.APP_ADDRESS || "http://localhost:8080"}/locations`;
=======
    const apiBase = "https://roomie-finder-api-316466908775.asia-southeast1.run.app/locations" || "http://localhost:8080/locations";
>>>>>>> Stashed changes
    const districtDebounceRef = useRef<number | null>(null);
    const subdistrictDebounceRef = useRef<number | null>(null);

    // apply async initialValues when they change (used by edit page)
    useEffect(() => {
        if (!initialValues || Object.keys(initialValues).length === 0) return;
        const next: FormValues = {
            placeName: initialValues.placeName ?? "",
            caption: initialValues.caption ?? "",
            type: initialValues.type ?? "",
            subdistrict: initialValues.subdistrict ?? "",
            district: initialValues.district ?? "",
            price: initialValues.price ?? "",
            capacity: initialValues.capacity ?? "",
            roomSize: initialValues.roomSize ?? "",
            description: initialValues.description ?? "",
            existingPhotos: initialValues.existingPhotos ?? [],
        };
        setFormData(next);
        setDistrictQuery(next.district);
        setSubdistrictQuery(next.subdistrict);
        setShowDistrictDropdown(false);
        setShowSubdistrictDropdown(false);

        // set existing photos state (for edit)
        if (Array.isArray(initialValues.existingPhotos)) {
            setExistingPhotos(initialValues.existingPhotos.map((p: { id?: number; ID?: number; url?: string; URL?: string; path?: string }) => ({ id: p.id ?? p.ID ?? 0, url: p.url ?? p.URL ?? p.path ?? "" })));
        } else {
            setExistingPhotos([]);
        }

        // try to resolve district name -> ID and preload options, then preload subdistricts filtered by that district
        (async () => {
            if (next.district) {
                try {
                    const res = await fetch(`${apiBase}/districts?name=${encodeURIComponent(next.district)}`);
                    if (res.ok) {
                        const data = await res.json();
                        const mapped = (data || []).map((d: { ID: number; NameInThai: string; ProvinceID: number }) => ({ ID: d.ID, NameInThai: d.NameInThai, ProvinceID: d.ProvinceID }));
                        setDistrictOptions(mapped);
                        const match = mapped.find((m: DistrictOpt) => m.NameInThai === next.district);
                        if (match) {
                            setSelectedDistrictID(match.ID);
                            // fetch subdistricts for the district and prefill options
                            const sdRes = await fetch(`${apiBase}/subdistricts?name=${encodeURIComponent(next.subdistrict || "")}&districtID=${match.ID}`);
                            if (sdRes.ok) {
                                const sdData = await sdRes.json();
                                const sdMapped: SubdistrictOpt[] = (sdData || []).map((s: { ID: number; NameInThai: string; DistrictID: number }) => ({ ID: s.ID, NameInThai: s.NameInThai, DistrictID: s.DistrictID }));
                                setSubdistrictOptions(sdMapped);
                                setSubdistrictHighlightIndex(sdMapped.length > 0 ? 0 : -1);
                            }
                        } else {
                            // no exact district match: still try to fetch subdistricts by name
                            if (next.subdistrict) await fetchSubdistricts(next.subdistrict);
                        }
                    } else {
                        if (next.subdistrict) await fetchSubdistricts(next.subdistrict);
                    }
                } catch (err) {
                    console.error("init location load", err);
                    if (next.subdistrict) await fetchSubdistricts(next.subdistrict);
                }
            } else if (next.subdistrict) {
                await fetchSubdistricts(next.subdistrict);
            }
        })();
    }, [initialValues]);

    async function fetchDistricts(name: string) {
        try {
            const res = await fetch(`${apiBase}/districts?name=${encodeURIComponent(name)}`);
            if (!res.ok) {
                setDistrictOptions([]);
                setDistrictHighlightIndex(-1);
                return;
            }
            const data = await res.json();
            const mapped = (data || []).map((d: { ID: number; NameInThai: string; ProvinceID: number }) => ({ ID: d.ID, NameInThai: d.NameInThai, ProvinceID: d.ProvinceID }));
            setDistrictOptions(mapped);
            setDistrictHighlightIndex(mapped.length > 0 ? 0 : -1);
        } catch (err) {
            console.error("fetchDistricts", err);
            setDistrictOptions([]);
            setDistrictHighlightIndex(-1);
        }
    }

    async function fetchSubdistricts(name: string) {
        try {
            // include district name as an extra param when a district is selected (backend may ignore unknown params)
            const districtParam = selectedDistrictID !== null && districtQuery.trim() !== "" ? `&district=${encodeURIComponent(districtQuery)}` : "";
            const res = await fetch(`${apiBase}/subdistricts?name=${encodeURIComponent(name)}${districtParam}`);
            if (!res.ok) {
                setSubdistrictOptions([]);
                setSubdistrictHighlightIndex(-1);
                return;
            }
            const data = await res.json();
            let mapped: SubdistrictOpt[] = (data || []).map((s: { ID: number; NameInThai: string; DistrictID: number }) => ({ ID: s.ID, NameInThai: s.NameInThai, DistrictID: s.DistrictID }));
            if (selectedDistrictID !== null) mapped = mapped.filter((m: SubdistrictOpt) => m.DistrictID === selectedDistrictID);
            setSubdistrictOptions(mapped);
            setSubdistrictHighlightIndex(mapped.length > 0 ? 0 : -1);
        } catch (err) {
            console.error("fetchSubdistricts", err);
            setSubdistrictOptions([]);
            setSubdistrictHighlightIndex(-1);
        }
    }

    function selectDistrict(opt: DistrictOpt) {
        setSelectedDistrictID(opt.ID);
        setFormData((prev) => ({ ...prev, district: opt.NameInThai, subdistrict: "" }));
        setDistrictQuery(opt.NameInThai);
        setShowDistrictDropdown(false);
        setSubdistrictOptions([]);
        setSubdistrictQuery("");
        setDistrictHighlightIndex(-1);
        setSubdistrictHighlightIndex(-1);
    }

    function selectSubdistrict(opt: SubdistrictOpt) {
        setFormData((prev) => ({ ...prev, subdistrict: opt.NameInThai }));
        setSubdistrictQuery(opt.NameInThai);
        setShowSubdistrictDropdown(false);
        setSubdistrictHighlightIndex(-1);
    }

    // keyboard navigation handlers
    function onDistrictKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (!showDistrictDropdown || districtOptions.length === 0) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setDistrictHighlightIndex((i) => Math.min(i + 1, districtOptions.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setDistrictHighlightIndex((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter") {
            e.preventDefault();
            const idx = districtHighlightIndex >= 0 ? districtHighlightIndex : 0;
            const opt = districtOptions[idx];
            if (opt) selectDistrict(opt);
        } else if (e.key === "Escape") {
            setShowDistrictDropdown(false);
        }
    }

    function onSubdistrictKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (!showSubdistrictDropdown || subdistrictOptions.length === 0) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSubdistrictHighlightIndex((i) => Math.min(i + 1, subdistrictOptions.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSubdistrictHighlightIndex((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter") {
            e.preventDefault();
            const idx = subdistrictHighlightIndex >= 0 ? subdistrictHighlightIndex : 0;
            const opt = subdistrictOptions[idx];
            if (opt) selectSubdistrict(opt);
        } else if (e.key === "Escape") {
            setShowSubdistrictDropdown(false);
        }
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
                setFormData((prev) => ({ ...prev, [name]: "0" }));
                return;
            }
        }
        setFormData((prev) => ({ ...prev, [name]: value }));
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
        if (photosArr.length === 0 && existingPhotos.length === 0) return { ok: false, message: "At least one photo required" };

        // guard: total upload size (client-side) to avoid connection resets for very large files
        try {
            const totalBytes = photosArr.reduce((s, p) => s + (p.size || 0), 0);
            const maxBytes = 25 * 1024 * 1024; // 25 MB
            if (totalBytes > maxBytes) return { ok: false, message: `Total photos too large (${Math.round(totalBytes / 1024 / 1024)}MB). Max ${maxBytes / 1024 / 1024}MB.` };
        } catch (e) {
            console.warn("could not compute upload size", e);
        }

        const fd = new FormData();
        requiredFields.forEach((field) => fd.append(field, values[field as keyof FormValues] as string));
        photosArr.forEach((p) => fd.append("pictures", p));

        const doFetch = async () => {
            try {
<<<<<<< Updated upstream
                const res = await fetch(`${process.env.APP_ADDRESS || "http://localhost:8080"}/property`, { method: "POST", credentials: "include", body: fd });
=======
                const res = await fetch("https://roomie-finder-api-316466908775.asia-southeast1.run.app/property" || "http://localhost:8080/property", { method: "POST", credentials: "include", body: fd });
>>>>>>> Stashed changes
                if (!res.ok) {
                    let text = "";
                    try { text = await res.text(); } catch (e) { /* ignore */ }
                    console.error("Create failed", res.status, text);
                    // attempt to parse JSON message if possible
                    try {
                        const data = JSON.parse(text || "{}");
                        return { ok: false, message: data.error || (data.message as string) || `Create failed (${res.status})` };
                    } catch {
                        return { ok: false, message: `Create failed (${res.status})` };
                    }
                }
                // success
                try {
                    const data = await res.json();
                    return { ok: true, message: data.message || "Created" };
                } catch {
                    return { ok: true, message: "Created" };
                }
            } catch (err) {
                // network error
                console.error("Network error during create:", err);
                throw err;
            }
        };

        // single retry on network error
        try {
            return await doFetch();
        } catch (firstErr) {
            console.warn("Retrying create after network error...");
            try {
                return await doFetch();
            } catch (secondErr) {
                console.error("Second network error during create:", secondErr);
                return { ok: false, message: "Network error (check server)" };
            }
        }
    };

    async function onSubmit(e?: React.FormEvent) {
        if (e) e.preventDefault();
        setMessage("");
        setLoading(true);
        const handler = submitHandler ?? defaultSubmit;
        // pass deletedPictureIDs and deletedPictureURLs to submit handler so edit can send them to backend
        const res = await handler(formData, photos, deletedPictureIDs, deletedPictureURLs);
        setLoading(false);
        setMessage(res.ok ? (res.message || "Success") : (res.message || "Failed"));
        const shouldReset = options?.resetOnSuccess ?? true;
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
                existingPhotos: [],
            });
            if (shouldReset) {
                setPhotos([]);
                setExistingPhotos([]);
                setDistrictQuery("");
                setDistrictOptions([]);
                setSubdistrictQuery("");
                setSubdistrictOptions([]);
                setSelectedDistrictID(null);
                setDistrictHighlightIndex(-1);
                setSubdistrictHighlightIndex(-1);
                setDeletedPictureIDs([]);
            }
        }
        return res;
    }

    return {
        // values
        formData,
        setFormData,
        photos,
        setPhotos,
        existingPhotos,
        setExistingPhotos,
        deletedPictureIDs,
        deletedPictureURLs,
        setDeletedPictureIDs,
        setDeletedPictureURLs,
        loading,
        message,
        // location/autocomplete state & handlers
        districtQuery,
        setDistrictQuery,
        districtOptions,
        showDistrictDropdown,
        setShowDistrictDropdown,
        selectedDistrictID,
        districtHighlightIndex,
        setDistrictHighlightIndex,
        subdistrictQuery,
        setSubdistrictQuery,
        subdistrictOptions,
        showSubdistrictDropdown,
        setShowSubdistrictDropdown,
        subdistrictHighlightIndex,
        setSubdistrictHighlightIndex,
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
            setDistrictHighlightIndex(-1);
            if (districtDebounceRef.current) window.clearTimeout(districtDebounceRef.current);
            districtDebounceRef.current = window.setTimeout(() => {
                if (v.trim().length > 0) fetchDistricts(v.trim());
                else setDistrictOptions([]);
            }, 300) as unknown as number;
        },
        onSubdistrictInputChange: (v: string) => {
            setSubdistrictQuery(v);
            setFormData((prev) => ({ ...prev, subdistrict: v }));
            setShowSubdistrictDropdown(true);
            setSubdistrictHighlightIndex(-1);
            if (subdistrictDebounceRef.current) window.clearTimeout(subdistrictDebounceRef.current);
            subdistrictDebounceRef.current = window.setTimeout(() => {
                if (v.trim().length > 0) fetchSubdistricts(v.trim());
                else setSubdistrictOptions([]);
            }, 300) as unknown as number;
        },
        // keyboard nav
        onDistrictKeyDown,
        onSubdistrictKeyDown,
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
        existingPhotos,
        setExistingPhotos,
        deletedPictureIDs,
        deletedPictureURLs,
        setDeletedPictureIDs,
        setDeletedPictureURLs,
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
        // keyboard & highlights
        onDistrictKeyDown,
        onSubdistrictKeyDown,
        districtHighlightIndex,
        subdistrictHighlightIndex,
        setDistrictHighlightIndex,
        setSubdistrictHighlightIndex,
        fetchSubdistricts,
        selectDistrict,
        selectSubdistrict,
    } = form;

    const removeExistingPhoto = (id?: number, url?: string) => {
        // record URL if provided
        if (url && url.trim() !== "") setDeletedPictureURLs((prev) => [...prev, url]);
        // record numeric id if provided
        if (typeof id === "number" && id > 0) setDeletedPictureIDs((prev) => [...prev, id]);
        setExistingPhotos((prev) => prev.filter((p) => !(p.id === id && p.url === url)));
    };

    // keep highlighted option scrolled into view for keyboard navigation
    useEffect(() => {
        if (districtHighlightIndex >= 0 && districtOptions && districtOptions.length > 0) {
            const opt = districtOptions[districtHighlightIndex];
            const id = `district-opt-${opt?.ID ?? districtHighlightIndex}`;
            const el = document.getElementById(id);
            if (el && (el as HTMLElement).scrollIntoView) (el as HTMLElement).scrollIntoView({ block: "nearest" });
        }
    }, [districtHighlightIndex, districtOptions]);

    useEffect(() => {
        if (subdistrictHighlightIndex >= 0 && subdistrictOptions && subdistrictOptions.length > 0) {
            const opt = subdistrictOptions[subdistrictHighlightIndex];
            const id = `subdistrict-opt-${opt?.ID ?? subdistrictHighlightIndex}`;
            const el = document.getElementById(id);
            if (el && (el as HTMLElement).scrollIntoView) (el as HTMLElement).scrollIntoView({ block: "nearest" });
        }
    }, [subdistrictHighlightIndex, subdistrictOptions]);

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

                {/* existing photos (loaded from server on edit) */}
                {existingPhotos && existingPhotos.some(p => p.url && p.url.trim() !== "") && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-4">
                        {existingPhotos
                            .filter((p) => p.url && p.url.trim() !== "")
                            .map((p) => (
                                <div key={p.id} className="relative w-28 h-28 bg-white rounded-lg overflow-hidden flex items-center justify-center shadow">
                                    <img src={p.url || undefined} alt="existing" className="object-cover w-full h-full" />
                                    <button type="button" onClick={() => removeExistingPhoto(p.id, p.url)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600">×</button>
                                </div>
                            ))}
                    </div>
                )}

                {/* newly added photos (File objects) */}
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
                    <input
                        type="text"
                        name="district"
                        value={districtQuery}
                        onChange={(e) => onDistrictInputChange(e.target.value)}
                        onFocus={() => { if (districtQuery.trim().length > 0) fetchDistricts(districtQuery); }}
                        onKeyDown={(e) => onDistrictKeyDown(e)}
                        className="rounded-md p-2 bg-white text-black"
                        autoComplete="off"
                    />
                    {showDistrictDropdown && districtOptions.length > 0 && (
                        <ul className="bg-white text-black rounded-md mt-1 max-h-48 overflow-auto shadow z-50">
                            {districtOptions.map((opt, i) => (
                                <li
                                    id={`district-opt-${opt.ID ?? i}`}
                                    key={opt.ID ?? i}
                                    className={`px-3 py-2 cursor-pointer ${i === districtHighlightIndex ? "bg-slate-200 font-semibold" : "hover:bg-slate-200"}`}
                                    onClick={() => selectDistrict(opt)}
                                    onMouseOver={() => setDistrictHighlightIndex(i)}
                                >
                                    {opt.NameInThai}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="flex flex-col flex-1" ref={subdistrictRef}>
                    <label>Subdistrict</label>
                    <input
                        type="text"
                        name="subdistrict"
                        value={subdistrictQuery}
                        onChange={(e) => onSubdistrictInputChange(e.target.value)}
                        onFocus={() => { if (subdistrictQuery.trim().length > 0) fetchSubdistricts(subdistrictQuery); }}
                        onKeyDown={(e) => onSubdistrictKeyDown(e)}
                        className="rounded-md p-2 bg-white text-black"
                        autoComplete="off"
                    />
                    {showSubdistrictDropdown && subdistrictOptions.length > 0 && (
                        <ul className="bg-white text-black rounded-md mt-1 max-h-48 overflow-auto shadow z-50">
                            {subdistrictOptions.map((opt, i) => (
                                <li
                                    id={`subdistrict-opt-${opt.ID ?? i}`}
                                    key={opt.ID ?? i}
                                    className={`px-3 py-2 cursor-pointer ${i === subdistrictHighlightIndex ? "bg-slate-200 font-semibold" : "hover:bg-slate-200"}`}
                                    onClick={() => selectSubdistrict(opt)}
                                    onMouseOver={() => setSubdistrictHighlightIndex(i)}
                                >
                                    {opt.NameInThai}
                                </li>
                            ))}
                        </ul>
                    )}
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