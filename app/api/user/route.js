import dbConnect from "@/configs/db";
import User from "@/models/User";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");

        if (!email) {
            return new Response(JSON.stringify({ success: false, message: "Invalid email" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        await dbConnect();
        const user = await User.findOne({ email });

        if (!user) {
            return new Response(JSON.stringify({ success: false, message: "User not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }
        console.log(user);
        
        return new Response(
            JSON.stringify({ success: true, user }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.log("Error checking credits:", error.message);
        return new Response(JSON.stringify({ success: false, message: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
