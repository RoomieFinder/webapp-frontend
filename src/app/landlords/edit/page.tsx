"use client";

import TopBar from "@/components/ui/TopBar";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { usePropertyForm, PropertyFormBody, PropertyFormActions, FormValues } from "@/features/property/PropertyForm";

type PictureItem = { id?: number; ID?: number; url?: string; URL?: string; Path?: string; path?: string };

function EditPostPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pid = searchParams?.get("pid") ?? undefined;
    const [loadingInitial, setLoadingInitial] = useState(true);
    const [initialValues, setInitialValues] = useState<Partial<FormValues> | null>(null);

    useEffect(() => {
        if (!pid) { setLoadingInitial(false); return; }
        (async () => {
            try {
                const res = await fetch(process.env.APP_ADDRESS ? `${process.env.APP_ADDRESS}/property/${pid}` : `https://roomie-finder-api-316466908775.asia-southeast1.run.app/property/${pid}`, {
                    method: "GET",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                });
                if (!res.ok) {
                    setLoadingInitial(false);
                    return;
                }
                const json = await res.json();
                const p = json.property ?? json;

                if (!p || Object.keys(p).length === 0) {
                    setLoadingInitial(false);
                    return;
                }

                // tolerant picture extraction (handles string arrays and object arrays, different casing)
                // prefer numeric IDs when backend returns `pictureIds` alongside `pictures`
                let pics: { id?: number; url: string }[] = [];
                const pictureIdsAny = p.pictureIds ?? p.PictureIds ?? p.PictureIDs ?? p.pictureIDs;
                if (Array.isArray(p.pictures)) {
                    if (Array.isArray(pictureIdsAny) && pictureIdsAny.length === p.pictures.length) {
                        pics = p.pictures.map((u: string | PictureItem, i: number) => ({ id: pictureIdsAny[i], url: typeof u === "string" ? u : (u.url ?? u.URL ?? "") }));
                    } else {
                        pics = p.pictures.map((u: string | PictureItem) => ({ url: typeof u === "string" ? u : (u.url ?? u.URL ?? "") }));
                    }
                } else if (Array.isArray(p.Pictures)) {
                    const idsAny = p.PictureIds ?? p.pictureIds ?? p.PictureIDs ?? p.pictureIDs;
                    if (Array.isArray(idsAny) && idsAny.length === p.Pictures.length) {
                        pics = p.Pictures.map((x: PictureItem, i: number) => ({ id: idsAny[i] ?? x.ID ?? x.id, url: x.URL ?? x.url ?? x.Path ?? x.path ?? "" }));
                    } else {
                        pics = p.Pictures.map((x: PictureItem) => ({ id: x.ID ?? x.id, url: x.URL ?? x.url ?? x.Path ?? x.path ?? "" }));
                    }
                } else if (Array.isArray(p.PicturesUrls)) {
                    pics = p.PicturesUrls.map((u: string | PictureItem) => ({ url: typeof u === "string" ? u : (u.url ?? u) }));
                } else if (Array.isArray(p.Images)) {
                    const idsAny = p.imageIds ?? p.ImageIds ?? p.ImageIDs ?? p.imageIDs;
                    if (Array.isArray(idsAny) && idsAny.length === p.Images.length) {
                        pics = p.Images.map((x: string | PictureItem, i: number) => ({ id: idsAny[i] ?? (typeof x === "object" ? (x.ID ?? x.id) : undefined), url: typeof x === "string" ? x : (x.URL ?? x.url ?? "") }));
                    } else {
                        pics = p.Images.map((x: string | PictureItem) => ({ id: typeof x === "object" ? (x.ID ?? x.id) : undefined, url: typeof x === "string" ? x : (x.URL ?? x.url ?? "") }));
                    }
                } else if (Array.isArray(p.Photos)) {
                    const idsAny = p.photoIds ?? p.PhotoIds ?? p.PhotoIDs ?? p.photoIDs;
                    if (Array.isArray(idsAny) && idsAny.length === p.Photos.length) {
                        pics = p.Photos.map((x: string | PictureItem, i: number) => ({ id: idsAny[i] ?? (typeof x === "string" ? undefined : (x.ID ?? x.id)), url: typeof x === "string" ? x : (x.URL ?? x.url ?? x) }));
                    } else {
                        pics = p.Photos.map((x: string | PictureItem) => ({ id: typeof x === "string" ? undefined : (x.ID ?? x.id), url: typeof x === "string" ? x : (x.URL ?? x.url ?? x) }));
                    }
                }

                // build initial values tolerant to key casing and alternate field names
                setInitialValues({
                    placeName: (p.placeName ?? p.PlaceName) ?? "",
                    caption: (p.caption ?? p.Caption) ?? "",
                    type: (p.type ?? p.Type) ?? "",
                    price: (p.rentalFee ?? p.RentalFee ?? "") !== "" ? String(p.rentalFee ?? p.RentalFee ?? "") : "",
                    capacity: (p.capacity ?? p.Capacity ?? "") !== "" ? String(p.capacity ?? p.Capacity ?? "") : "",
                    roomSize: (p.roomSize ?? p.RoomSize ?? "") !== "" ? String(p.roomSize ?? p.RoomSize ?? "") : "",
                    description: (p.description ?? p.Description) ?? "",
                    // backend may return plain names like subDistrictName / districtName (your example)
                    district: (p.districtName ?? p.DistrictName) ?? (p.subDistrictName ?? p.SubDistrictName) ?? (p.SubDistrict?.District?.NameInThai ?? p.SubDistrict?.DistrictName) ?? "",
                    subdistrict: (p.subDistrictName ?? p.SubDistrictName) ?? (p.SubDistrict?.NameInThai ?? p.SubDistrictName ?? "") ?? "",
                    existingPhotos: pics,
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingInitial(false);
            }
        })();
    }, [pid]);

    // helper: extract the object key from an R2 URL like https://...r2.dev/<key>
    function extractR2Key(raw: string): string {
        if (!raw) return "";
        const s = raw.toString().trim().replace(/^['"]|['"]$/g, "");
        try {
            const u = new URL(s);
            const p = u.pathname.replace(/^\//, "");
            if (p) return p;
        } catch {
            // ignore and fallback to regex
        }
        const m = /r2\.dev\/([^'"\)\s,]+)/.exec(s);
        return m && m[1] ? m[1] : "";
    }

    async function updateHandler(values: FormValues, photos: File[], deletingPictureIds?: number[], deletingPictureUrls?: string[]) {
        if (!pid) return { ok: false, message: "property id missing" };
        const fd = new FormData();
        fd.append("placeName", values.placeName);
        fd.append("caption", values.caption);
        fd.append("type", values.type);
        fd.append("subdistrict", values.subdistrict);
        fd.append("district", values.district);
        fd.append("price", values.price);
        fd.append("capacity", values.capacity);
        fd.append("roomSize", values.roomSize);
        fd.append("description", values.description);
        photos.forEach((p) => fd.append("newPictures", p));

        // append deletingPictureIds (multiple values)
        if (Array.isArray(deletingPictureIds) && deletingPictureIds.length > 0) {
            deletingPictureIds.forEach((id) => fd.append("deletingPictureIds", String(id)));
        }

        // append deletingPictureUrls but send only the R2 object key (path after r2.dev/)
        if (Array.isArray(deletingPictureUrls) && deletingPictureUrls.length > 0) {
            deletingPictureUrls.forEach((u) => {
                const key = extractR2Key(u || "");
                if (key) fd.append("deletingPictureUrls", key);
            });
        }

        try {
            const res = await fetch(`${process.env.APP_ADDRESS || "http://localhost:8080"}/property/${pid}`, {
                method: "PUT",
                credentials: "include",
                body: fd,
            });
            const data = await res.json();
            if (!res.ok) return { ok: false, message: data?.Message || data?.error || "Update failed" };
            // on success, refetch the property to get updated values and update initialValues
            try {
                const refetch = await fetch(`${process.env.APP_ADDRESS || "http://localhost:8080"}/property/${pid}`, {
                    method: "GET",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                });
                if (refetch.ok) {
                    const j = await refetch.json();
                    const p = j.property ?? j;
                    // tolerant picture extraction (same logic as initial load)
                    let pics: { id?: number; url: string }[] = [];
                    const pictureIdsAny = p.pictureIds ?? p.PictureIds ?? p.PictureIDs ?? p.pictureIDs;
                    if (Array.isArray(p.pictures)) {
                        if (Array.isArray(pictureIdsAny) && pictureIdsAny.length === p.pictures.length) {
                            pics = p.pictures.map((u: string | PictureItem, i: number) => ({ id: pictureIdsAny[i], url: typeof u === "string" ? u : (u.url ?? u.URL ?? "") }));
                        } else {
                            pics = p.pictures.map((u: string | PictureItem) => ({ url: typeof u === "string" ? u : (u.url ?? u.URL ?? "") }));
                        }
                    } else if (Array.isArray(p.Pictures)) {
                        const idsAny = p.PictureIds ?? p.pictureIds ?? p.PictureIDs ?? p.pictureIDs;
                        if (Array.isArray(idsAny) && idsAny.length === p.Pictures.length) {
                            pics = p.Pictures.map((x: PictureItem, i: number) => ({ id: idsAny[i] ?? x.ID ?? x.id, url: x.URL ?? x.url ?? x.Path ?? x.path ?? "" }));
                        } else {
                            pics = p.Pictures.map((x: PictureItem) => ({ id: x.ID ?? x.id, url: x.URL ?? x.url ?? x.Path ?? x.path ?? "" }));
                        }
                    } else if (Array.isArray(p.PicturesUrls)) {
                        pics = p.PicturesUrls.map((u: string | { url?: string }) => ({ url: typeof u === "string" ? u : (u.url ?? "") }));
                    } else if (Array.isArray(p.Images)) {
                        const idsAny = p.imageIds ?? p.ImageIds ?? p.ImageIDs ?? p.imageIDs;
                        if (Array.isArray(idsAny) && idsAny.length === p.Images.length) {
                            pics = p.Images.map((x: string | PictureItem, i: number) => ({ id: idsAny[i] ?? (typeof x === "object" ? (x.ID ?? x.id) : undefined), url: typeof x === "string" ? x : (x.URL ?? x.url ?? "") }));
                        } else {
                            pics = p.Images.map((x: string | PictureItem) => ({ id: typeof x === "object" ? (x.ID ?? x.id) : undefined, url: typeof x === "string" ? x : (x.URL ?? x.url ?? "") }));
                        }
                    } else if (Array.isArray(p.Photos)) {
                        const idsAny = p.photoIds ?? p.PhotoIds ?? p.PhotoIDs ?? p.photoIDs;
                        if (Array.isArray(idsAny) && idsAny.length === p.Photos.length) {
                            pics = p.Photos.map((x: string | PictureItem, i: number) => ({ id: idsAny[i] ?? (typeof x === "object" ? (x.ID ?? x.id) : undefined), url: typeof x === "string" ? x : (x.URL ?? x.url ?? "") }));
                        } else {
                            pics = p.Photos.map((x: string | PictureItem) => ({ id: typeof x === "object" ? (x.ID ?? x.id) : undefined, url: typeof x === "string" ? x : (x.URL ?? x.url ?? "") }));
                        }
                    }

                    setInitialValues({
                        placeName: (p.placeName ?? p.PlaceName) ?? "",
                        caption: (p.caption ?? p.Caption) ?? "",
                        type: (p.type ?? p.Type) ?? "",
                        price: (p.rentalFee ?? p.RentalFee ?? "") !== "" ? String(p.rentalFee ?? p.RentalFee ?? "") : "",
                        capacity: (p.capacity ?? p.Capacity ?? "") !== "" ? String(p.capacity ?? p.Capacity ?? "") : "",
                        roomSize: (p.roomSize ?? p.RoomSize ?? "") !== "" ? String(p.roomSize ?? p.RoomSize ?? "") : "",
                        description: (p.description ?? p.Description) ?? "",
                        district: (p.districtName ?? p.DistrictName) ?? (p.subDistrictName ?? p.SubDistrictName) ?? (p.SubDistrict?.District?.NameInThai ?? p.SubDistrict?.DistrictName) ?? "",
                        subdistrict: (p.subDistrictName ?? p.SubDistrictName) ?? (p.SubDistrict?.NameInThai ?? p.SubDistrictName ?? "") ?? "",
                        existingPhotos: pics,
                    });
                }
            } catch (e) {
                console.error("refetch after update failed", e);
            }

            return { ok: true, message: "Updated" };
        } catch (err) {
            console.error(err);
            return { ok: false, message: "Network error" };
        }
    }

    async function handleDelete() {
        if (!pid) return;
        try {
            const res = await fetch(`${process.env.APP_ADDRESS || "http://localhost:8080"}/property/${pid}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (res.ok) router.push("/landlords");
            else console.error("delete failed");
        } catch (err) {
            console.error(err);
        }
    }

    // call hook with initialValues (may be null at first)
    const form = usePropertyForm(initialValues ?? {}, updateHandler, { resetOnSuccess: false });

    if (loadingInitial) {
        return (
            <div className="flex h-screen w-full">
                <div className="flex-1 bg-[#192A46] flex flex-col">
                    <div className="w-full px-4"><TopBar pageName="Edit Post" /></div>
                    <div className="flex-1 flex items-center justify-center text-white">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full">
            <div className="flex-1 bg-[#192A46] flex flex-col">
                <div className="w-full px-4"><TopBar pageName="Edit Post" /></div>
                <div className="flex flex-col flex-1 items-center justify-start overflow-y-auto pt-24 pb-6">
                    <form onSubmit={form.onSubmit} className="flex flex-col space-y-6 w-full max-w-3xl font-mono text-white">
                        <PropertyFormBody form={form} />
                        <PropertyFormActions form={form} submitLabel="Save Changes" onDelete={handleDelete} />
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function EditPostPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen bg-[#0F1B2D] text-white">Loading...</div>}>
            <EditPostPageContent />
        </Suspense>
    );
}