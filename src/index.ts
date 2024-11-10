import { Hono } from "hono";

const app = new Hono();

app.get("/api/proxy", async (c) => {
  const url = c.req.query("url");

  if (!url) {
    return c.json({ error: "URL is required" }, 400);
  }

  try {
    // Получаем изображение с внешнего URL с помощью fetch
    const response = await fetch(url);

    if (!response.ok) {
      return c.json({ error: "Failed to fetch image" }, 500);
    }

    // Извлекаем заголовок Content-Type из ответа
    const contentType =
      response.headers.get("content-type") || "application/octet-stream";

    // Чтение данных изображения в виде массива байтов
    const imageData = await response.arrayBuffer();

    // Возвращаем изображение с корректным заголовком Content-Type
    return c.body(imageData, 200, { "Content-Type": contentType });
  } catch (error) {
    return c.json({ error: "Failed to fetch image" }, 500);
  }
});

export default app;
// export default {
//   port: 3001,
//   fetch: app.fetch,
// };
