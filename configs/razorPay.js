import Razorpay from "razorpay";

export const createRazorPayInstance = () =>{
    return new Razorpay({
        key_id:process.env.NEXT_PUBLIC_RAZORPAY_KEY_Id,
        key_secret:process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET,
    })
}
