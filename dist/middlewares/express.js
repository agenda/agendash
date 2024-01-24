module.exports = (agendash) => {
  const { api, requeueJobs, deleteJobs, createJob } = agendash;
  const app = express();

  // Body parser middleware
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  // CSP middleware
  app.use((req, res, next) => {
    res.header("Content-Security-Policy", csp);
    next();
  });

  // Serving static files (React app)
  app.use(express.static(path.join(__dirname, "../../public")));

  // Agendash API routes
  app.get("/api", async (request, response) => {
    // ... your existing code ...
  });

  app.post("/api/jobs/requeue", async (request, response) => {
    // ... your existing code ...
  });

  app.post("/api/jobs/delete", async (request, response) => {
    // ... your existing code ...
  });

  app.post("/api/jobs/create", async (request, response) => {
    // ... your existing code ...
  });

  // Catch-all route to serve index.html for all other requests
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/index.html"));
  });

  return app;
};
