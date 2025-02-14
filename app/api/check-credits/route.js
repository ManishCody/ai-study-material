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

    const isElite = user.isElite || false;
    const isPremium = user.isPremium || false;
    const CrScore = user.creditScore;
    let hasCredits = false;
    if (isElite) {
      hasCredits = true;
    } else if (isPremium) {
      if (user.creditScore >= 20)
        hasCredits = false;
      else
        hasCredits = true;
    } else {
      if (user.creditScore >= 5)
        hasCredits = false;
      else
        hasCredits = true;
    }

    return new Response(
      JSON.stringify({ success: true, hasCredits, isPremium, isElite , CrScore }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error checking credits:", error.message);
    return new Response(JSON.stringify({ success: false, message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
