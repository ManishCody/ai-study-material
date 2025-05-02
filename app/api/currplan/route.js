import User from "@/models/User";
import dbConnect from "@/configs/db";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return new Response(JSON.stringify({ success: false, message: "Email is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return new Response(JSON.stringify({ success: false, message: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    let remainingDays = 0;
    if (user.subscriptionEndDate) {
      const now = new Date();
      const expiry = new Date(user.subscriptionEndDate);

      remainingDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    }

    return new Response(
      JSON.stringify({
        success: true,
        currentPlan: user.currentPlan,
        subscriptionEndDate: user.subscriptionEndDate,
        remainingDays: remainingDays > 0 ? remainingDays : 0,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ success: false, message: "Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
