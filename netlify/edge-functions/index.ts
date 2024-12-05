import type { Config } from "@netlify/edge-functions";
export default async (request: Request) => {
  const url = new URL(request.url);
  const outputUrl = url.pathname.replace("/api/", "");
  console.log(outputUrl);
  if (!outputUrl) {
    return new Response("Missing 'with' query parameter", { status: 400 });
  }

  try {
    const fetchData = await fetch(outputUrl);

    if (!fetchData.ok) {
      return new Response(`Failed to fetch resource: ${fetchData.statusText}`, {
        status: fetchData.status,
      });
    }

    console.log(
      `Fetched resource size: ${fetchData.headers.get("content-length")}`
    );

    return new Response(fetchData.body, {
      status: fetchData.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public,max-age=315000,s-maxage=315000",
      },
    });
  } catch (error) {
    return new Response(`Error fetching resource: ${error.message}`, {
      status: 500,
    });
  }
};

export const config: Config = {
  cache: "manual",
  path: "/api/*",
};
