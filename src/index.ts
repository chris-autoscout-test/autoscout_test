// Use dotEnv for config
import app from "./app";

// port is now available to the Node.js runtime
// as if it were an environment variable
const port = process.env.SERVER_PORT;

app.listen(port, () => {
  console.log(`Server Listening on http://localhost:${port}`);
});
