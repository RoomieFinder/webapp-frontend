"use client";
import TopBar from "@/components/ui/TopBar";
import { usePropertyForm, PropertyFormBody, PropertyFormActions } from "@/features/property/PropertyForm";

export default function CreatePost() {
  const form = usePropertyForm(); // uses default create submit
  return (
    <div className="flex h-screen w-full">
      <div className="flex-1 bg-[#192A46] flex flex-col">
        <div className="w-full px-4"><TopBar pageName="Create a Post" /></div>
        <div className="flex flex-col flex-1 items-center justify-start overflow-y-auto pt-24 pb-6">
          <form onSubmit={form.onSubmit} className="flex flex-col space-y-6 w-full max-w-3xl font-mono text-white">
            <PropertyFormBody form={form} />
            <PropertyFormActions form={form} submitLabel="Create Post" />
          </form>
        </div>
      </div>
    </div>
  );
}