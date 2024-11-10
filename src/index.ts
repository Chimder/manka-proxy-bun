import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

// app.use("/api/proxy", cors());

app.get("/api/proxy", async (c) => {
  const url = c.req.query("url");

  if (!url || !url.startsWith("https://")) {
    return c.json({ error: "URL must use HTTPS" }, 400);
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "YourCustomUserAgent/1.0",
        Accept: "image/*",
        "Accept-Encoding": "gzip, deflate, br",
      },
    });
    console.log("STARUS", response);
    if (response.status >= 300 && response.status < 400) {
      return c.json(
        { error: `Redirected to ${response.headers.get("Location")}` },
        500
      );
    }

    if (!response.ok) {
      return c.json({ error: `Failed with status ${response.status}` }, 500);
    }

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
