const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export async function GET() {
  try {
    const res = await fetch(
      `${API_GATEWAY_URL}/api/posts/categories`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      return Response.json(
        { error: `Blog service returned ${res.status}` },
        { status: res.status }
      );
    }
    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    console.error("[blog-categories API] Error:", err);
    return Response.json(
      { error: "Failed to fetch blog categories" },
      { status: 500 }
    );
  }
}
