import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: (process.env.EMAIL_PASSWORD || "").replace(/\s/g, ""),
  },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body.email?.trim().toLowerCase();

    console.log("Newsletter request:", { email });
    console.log("Email config:", {
      user: process.env.EMAIL_USER,
      hasPassword: !!process.env.EMAIL_PASSWORD,
      from: process.env.EMAIL_FROM
    });

    // Validate email
    if (!email || !email.includes("@") || email.length < 5) {
      console.error("Invalid email format:", email);
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Send confirmation email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "noreply@ministore.com",
      to: email,
      subject: "Welcome to MiniStore Newsletter! 🎉",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f2f3f5; padding: 20px; text-align: center;">
            <h2 style="color: #1e1e1e; margin: 0;">MiniStore</h2>
          </div>

          <div style="padding: 30px; background-color: #ffffff;">
            <h1 style="color: #1e1e1e; font-size: 24px;">Welcome to Our Newsletter!</h1>

            <p style="color: #555; font-size: 16px; line-height: 1.6;">
              Thank you for subscribing to MiniStore! You're now part of our community.
            </p>

            <p style="color: #555; font-size: 16px; line-height: 1.6;">
              We'll send you:
            </p>
            <ul style="color: #555; font-size: 16px; line-height: 1.8;">
              <li>✨ Latest product launches & exclusive deals</li>
              <li>📝 Tech tips & gadget reviews from our blog</li>
              <li>🎁 Special subscriber-only discounts</li>
              <li>📱 Updates on new features & services</li>
            </ul>

            <div style="margin: 30px 0; text-align: center;">
              <a href="http://localhost:3000/shop" style="background-color: #5FCFCF; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Start Shopping
              </a>
            </div>

            <p style="color: #999; font-size: 14px; line-height: 1.6;">
              Questions? Visit our <a href="http://localhost:3000/contact" style="color: #5FCFCF; text-decoration: none;">contact page</a> or reply to this email.
            </p>
          </div>

          <div style="background-color: #f2f3f5; padding: 20px; text-align: center; color: #999; font-size: 12px;">
            <p>© 2024 MiniStore. All rights reserved.</p>
            <p>You're receiving this because you subscribed to our newsletter.</p>
          </div>
        </div>
      `,
    });

    console.log(`✅ Newsletter email sent to: ${email}`);

    return NextResponse.json(
      { message: "Successfully subscribed! Check your email.", email },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Newsletter error:", error.message);
    console.error("Full error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}
