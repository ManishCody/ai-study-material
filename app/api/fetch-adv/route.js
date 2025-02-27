import dbConnect from "@/configs/db";
import Advertisement from "@/models/Ads";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req) {
  console.log("API Route Hit");

  try {
    await dbConnect();

    const email = req.nextUrl.searchParams.get("email");
    if (!email) {
      return NextResponse.json({ error: "email ID is required" }, { status: 400 });
    }

    const user = await User.findOne({email});
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    console.log(user);
    
    const allAds = await Advertisement.find({ advLabel: { $regex: /^ALL$/i } } );
    const shuffledAllAds = allAds.sort(() => 0.5 - Math.random());
    console.log(allAds);
    let finalAds = [];
    console.log( user.courseLabels);
    if (user?.courseLabels?.length > 0) {
        console.log( user.courseLabels);
        
      const userAds = await Advertisement.find({
        advLabel: { $in: user.courseLabels },
      });
      const shuffledUserAds = userAds.sort(() => 0.5 - Math.random());

      finalAds = shuffledUserAds.slice(0, 5);
    }

    const remainingSlots = 10 - finalAds.length;
    finalAds = [...finalAds, ...shuffledAllAds.slice(0, remainingSlots)];

    return NextResponse.json({ ads: finalAds }, { status: 200 });
  } catch (error) {
    console.log("Error fetching ads:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
