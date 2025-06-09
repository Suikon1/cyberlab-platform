// DATOS EN MEMORIA (sin base de datos)
let machines = [
  {
    id: 1,
    name: "anonymouspingu",
    difficulty: "Intermedio",
    description:
      "Máquina de pentesting enfocada en técnicas de anonimato y steganografía avanzada",
    size: "231.2 MB",
    tags: ["Steganography", "OSINT", "Network"],
    completed: true,
    starred: true,
    writeups: [],
  },
  {
    id: 2,
    name: "dance-samba",
    difficulty: "Fácil",
    description:
      "Desafío de explotación web con temática brasileña, ideal para principiantes",
    size: "159.3 MB",
    tags: ["Web", "SQLi", "File Upload"],
    completed: true,
    starred: true,
    writeups: [],
  },
  {
    id: 3,
    name: "inclusion",
    difficulty: "Intermedio",
    description:
      "Desafío de inclusión de archivos locales y remotos con escalada de privilegios",
    size: "187.6 MB",
    tags: ["File Inclusion", "LFI", "RFI", "Linux"],
    completed: true,
    starred: false,
    writeups: [],
  },
  {
    id: 4,
    name: "mirame",
    difficulty: "Fácil",
    description:
      "Máquina introductoria con vulnerabilidades básicas de enumeración",
    size: "142.8 MB",
    tags: ["Beginner", "Web", "Enumeration"],
    completed: true,
    starred: false,
    writeups: [],
  },
  {
    id: 5,
    name: "pinguinazo",
    difficulty: "Avanzado",
    description:
      "Desafío avanzado con múltiples vectores de ataque y técnicas complejas",
    size: "203.1 MB",
    tags: ["Advanced", "Multi-vector", "Exploitation"],
    completed: true,
    starred: true,
    writeups: [],
  },
  {
    id: 6,
    name: "whoiam",
    difficulty: "Intermedio",
    description:
      "Desafío de identificación de usuarios y escalada de privilegios en sistema Linux",
    size: "188.5 MB",
    tags: ["Privilege Escalation", "Linux", "Identity"],
    completed: true,
    starred: false,
    writeups: [],
  },
];

export default machines;
