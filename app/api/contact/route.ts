import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phone, subject, message } = body;

    // Validate required fields
    if (!fullName || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Send to contact service
    const contactServiceUrl = process.env.NEXT_PUBLIC_CONTACT_SERVICE_URL || "http://localhost:9005";

    const response = await fetch(`${contactServiceUrl}/api/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: fullName.trim(),
        email: email.trim(),
        phone: phone?.trim() || null,
        subject: subject.trim(),
        message: message.trim(),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Contact service error: ${response.status}`, errorText);
      throw new Error(`Contact service error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! We'll get back to you soon.",
        contactId: result.id
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
