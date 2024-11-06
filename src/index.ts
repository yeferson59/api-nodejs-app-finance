import "module-alias/register.js";
import app from "@/app";
import { PORT } from "@/config";

app.listen(PORT, async () => {
  console.log("listening on http://localhost:" + PORT);
});
