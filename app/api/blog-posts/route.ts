const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "0";
  const size = searchParams.get("size") || "9";
  const category = searchParams.get("category");
  const tag = searchParams.get("tag");
  const q = searchParams.get("q");

  try {
    const params = new URLSearchParams();
    params.set("page", page);
    params.set("size", size);
    if (category) params.set("category", category);
    if (tag) params.set("tag", tag);
    if (q) params.set("q", q);

    const res = await fetch(
      `${API_GATEWAY_URL}/api/posts?${params.toString()}`,
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
    console.error("[blog-posts API] Error:", err);
    return Response.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}
