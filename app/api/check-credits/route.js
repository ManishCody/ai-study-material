import dbConnect from "@/configs/db"; 
import User from "@/models/User";

export async function GET(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { email } = req.query;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ success: false, message: "Invalid email" });
  }

  try {
    await dbConnect(); 
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isElite = user.isElite || false;
    const isPremium = user.isPremium || false;
    const isMember = user.isMember || false;

    let hasCredits = false;

    if (isElite) {
      hasCredits = true;  
    } else if (isPremium) {
      hasCredits = user.creditScore >= 20; 
    } else {
      hasCredits = user.creditScore >= 5; 
    }

    return res.status(200).json({ 
      success: true, 
      hasCredits, 
      isMember, 
      isPremium, 
      isElite 
    });
  } catch (error) {
    console.error("Error checking credits:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
