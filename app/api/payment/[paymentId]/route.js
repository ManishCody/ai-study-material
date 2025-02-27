import axios from 'axios';

export async function GET(req,  context ) {
    const { paymentId } = await context.params;
    console.log(paymentId);

    try {
        const razorpayRes = await axios.get(
            `https://api.razorpay.com/v1/payments/${paymentId}`,
            {
                auth: {
                    username: process.env.NEXT_PUBLIC_RAZORPAY_KEY_Id,
                    password: process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET,
                },
            }
        );

        return Response.json(razorpayRes.data);
    } catch (err) {
        return Response.json({ message: 'Failed to fetch payment details' }, { status: 500 });
    }
}
