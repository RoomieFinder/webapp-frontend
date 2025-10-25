import ViewGroup from "@/components/ui/ViewGroup";
// This is the corrected code
export default function ViewOtherProfile({ params }: { params: { gid: string } }) {
    // 1. Destructure 'gid' (not 'pid') from params.
    // 2. 'params' is an object, not a promise, so no 'await' is needed.
    const { gid } = params; 

    // 3. Parse the 'gid' string from the URL into a number.
    const groupId = parseInt(gid, 10);

    // 4. Pass the number to your component.
    //    Add a check to handle cases where parsing fails (e.g., /group/abc)
    if (isNaN(groupId)) {
        return <div>Invalid Group ID</div>;
    }
    
    return <ViewGroup gid={groupId} />;
}