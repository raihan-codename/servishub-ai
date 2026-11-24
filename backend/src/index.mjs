import "dotenv/config";
import app from "./app.mjs";

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server ServisHub berjalan di http://0.0.0.0:${PORT}`);
});