import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { repoFullName, accessToken } = await req.json();

    if (!repoFullName || !accessToken) {
      return NextResponse.json(
        { error: "repoFullName and accessToken are required" },
        { status: 400 }
      );
    }

    const ghRes = await fetch(
      `https://api.github.com/repos/${repoFullName}/readme`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3.raw",
          "User-Agent": "docugenai-app",
        },
        cache: "no-store",
      }
    );

    if (ghRes.status === 404) {
      return NextResponse.json(
        { error: "README not found for this repository." },
        { status: 404 }
      );
    }

    if (!ghRes.ok) {
      const body = await ghRes.text();
      return NextResponse.json(
        {
          error: `GitHub responded with ${ghRes.status}`,
          details: body,
        },
        { status: ghRes.status }
      );
    }

    const readme = await ghRes.text();
    const content = `# ${repoFullName}\n\n${readme}`;

    return NextResponse.json({ content });
  } catch (error) {
    console.error("generate-docs error", error);
    return NextResponse.json(
      { error: "Failed to generate documentation." },
      { status: 500 }
    );
  }
}

