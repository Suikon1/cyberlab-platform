// Ruta principal
app.get("/", (req, res) => {
  res.json({
    message: "🔒 CyberLab API funcionando correctamente!",
    version: "1.0.0",
    status: "online",
  });
});
