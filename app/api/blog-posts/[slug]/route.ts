const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const res = await fetch(`${API_GATEWAY_URL}/api/posts/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return Response.json(
        { error: `Blog post not found` },
        { status: res.status }
      );
    }
    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    console.error(`[blog-post API] Error fetching ${slug}:`, err);
    return Response.json({ error: "Failed to fetch blog post" }, { status: 500 });
  }
}
