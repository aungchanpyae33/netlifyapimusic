export default async (request: Request) => {
  const url = new URL(request.url);
  const outputUrl = url.searchParams.get("with");

  if (!outputUrl) {
    return new Response("Missing 'with' query parameter", { status: 400 });
  }

  // Fetch the audio file as a binary stream
  const fetchData = await fetch(outputUrl);

  // Validate response integrity
  if (!fetchData.ok) {
    return new Response(`Failed to fetch resource: ${fetchData.statusText}`, {
      status: fetchData.status,
    });
  }

  const body = await fetchData.arrayBuffer();

  return new Response(body, {
    status: fetchData.status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public,max-age=315000,s-maxage=315000",
    },
  });
};

export const config = { cache: "manual", path: "/api" };
