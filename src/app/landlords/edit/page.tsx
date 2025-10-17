"use client";

import TopBar from "@/components/ui/TopBar";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { usePropertyForm, PropertyFormBody, PropertyFormActions, FormValues } from "@/features/property/PropertyForm";

export default function EditPostPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pid = searchParams?.get("pid") ?? undefined;
    const [loadingInitial, setLoadingInitial] = useState(true);
    const [initialValues, setInitialValues] = useState<Partial<FormValues> | null>(null);

    useEffect(() => {
        if (!pid) { setLoadingInitial(false); return; }
        (async () => {
            try {
                const res = await fetch(`http://localhost:8080/property/${pid}`);
                if (!res.ok) { setLoadingInitial(false); return; }
                const json = await res.json();
                const p = json.property ?? json;

                // try to extract picture list from common fields returned by backend
                let pics: { id: number; url: string }[] = [];
                if (Array.isArray(p.Pictures)) {
                    pics = p.Pictures.map((x: any) => ({ id: x.ID ?? x.id ?? 0, url: x.URL ?? x.url ?? x.Path ?? x.path ?? "" }));
                } else if (Array.isArray(p.PicturesUrls)) {
                    pics = p.PicturesUrls.map((u: any, i: number) => ({ id: i, url: typeof u === "string" ? u : (u.url ?? u) }));
                } else if (Array.isArray(p.Images)) {
                    pics = p.Images.map((x: any) => ({ id: x.ID ?? x.id ?? 0, url: x.URL ?? x.url ?? x }));
                } else if (Array.isArray(p.Photos)) {
                    pics = p.Photos.map((x: any) => ({ id: x.ID ?? x.id ?? 0, url: x.URL ?? x.url ?? x }));
                }

                setInitialValues({
                    placeName: p.PlaceName ?? "",
                    caption: p.Caption ?? "",
                    type: p.Type ?? "",
                    price: p.RentalFee != null ? String(p.RentalFee) : "",
                    capacity: p.Capacity != null ? String(p.Capacity) : "",
                    roomSize: p.RoomSize != null ? String(p.RoomSize) : "",
                    description: p.Description ?? "",
                    district: p.SubDistrict?.District?.NameInThai ?? p.SubDistrict?.DistrictName ?? "",
                    subdistrict: p.SubDistrict?.NameInThai ?? p.SubDistrictName ?? "",
                    existingPhotos: pics,
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingInitial(false);
            }
        })();
    }, [pid]);

    async function updateHandler(values: FormValues, photos: File[], deletingPictureIds?: number[]) {
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

        try {
            const res = await fetch(`http://localhost:8080/property/${pid}`, {
                method: "PUT",
                credentials: "include",
                body: fd,
            });
            const data = await res.json();
            if (!res.ok) return { ok: false, message: data?.Message || data?.error || "Update failed" };
            return { ok: true, message: "Updated" };
        } catch (err) {
            console.error(err);
            return { ok: false, message: "Network error" };
        }
    }

    async function handleDelete() {
        if (!pid) return;
        try {
            const res = await fetch(`http://localhost:8080/property/${pid}`, {
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
    const form = usePropertyForm(initialValues ?? {}, updateHandler);

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