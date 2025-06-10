import { ADMIN_USER } from "../models/admin.js";

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
    res.json({
      token: "fake-jwt-token",
      user: {
        id: 1,
        username: "admin",
        role: "admin",
      },
    });
  } else {
    res.status(401).json({ error: "Credenciales inválidas" });
  }
};
