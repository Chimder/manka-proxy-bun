import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";

const app = new Hono();

app.use("/api/proxy", cors());

app.get("/api/proxy", async (c) => {
  const url = c.req.query("url");

  if (!url) {
    return c.json({ error: "URL is required" }, 400);
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error(
        `Failed to fetch image: ${response.status} ${response.statusText}`
      );
      return c.json({ error: "Failed to fetch image" }, 500);
    }

    const contentType =
      response.headers.get("content-type") || "application/octet-stream";
    const imageData = await response.arrayBuffer();

    return c.body(imageData, 200, { "Content-Type": contentType });
  } catch (error) {
    console.error("Error fetching image:", error);
    return c.json({ error: "Failed to fetch image" }, 500);
  }
});

// export default {
//   port: 3001,
//   fetch: app.fetch,
// };

export default app;
