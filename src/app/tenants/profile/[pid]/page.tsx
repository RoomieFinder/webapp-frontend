import ViewProfile from "@/features/profile/ViewProfile";

export default async function ViewOtherProfile({params}: {params: Promise<{pid: string}>}) {
    const { pid } = await params;
    return <ViewProfile id={pid} />;
}

