// src/app.js
const fs = require("fs");
const os = require("os");
const chalk = require("chalk");

// =====================
// Práctica 1: Registro del sistema
// =====================
function registroSistema(callback) {
  console.log(chalk.blue.bold("=== Inicio del sistema ==="));
  console.time("ProcesoPrincipal");

  function accesoUsuario(usuario) {
    console.count(`Acceso de usuario ${usuario}`);
  }

  accesoUsuario("Carlos");
  accesoUsuario("Ana");
  accesoUsuario("Carlos");

  console.warn(chalk.yellow("⚠️ Capacidad de usuarios alcanzando el límite"));
  console.error(chalk.red("❌ Error: No se pudo conectar a la base de datos"));

  const usuarios = [
    { nombre: "Carlos", rol: "Admin" },
    { nombre: "Ana", rol: "User" },
  ];

  console.table(usuarios);

  // Guardar log en archivo
  fs.writeFileSync("log.txt", JSON.stringify(usuarios, null, 2));
  console.log(chalk.green("✅ Archivo log.txt creado con información de usuarios"));

  setTimeout(() => {
    console.timeEnd("ProcesoPrincipal");
    console.log(chalk.blue.bold("=== Fin del sistema ==="));
    callback(); // 🔥 volver al menú
  }, 3000);
}

// =====================
// Práctica 2: CLI Simple
// =====================
function cliTool(callback) {
  console.log(chalk.cyan("Bienvenido a la CLI de ejemplo"));
  console.log(chalk.cyan("Comandos disponibles: hola, tiempo, salir"));
  process.stdin.setEncoding("utf-8");

  const listener = (data) => {
    const input = data.trim().toLowerCase();

    switch (input) {
      case "hola":
        console.log(chalk.green("[SUCCESS] ¡Hola! ¿Cómo estás?"));
        break;
      case "tiempo":
        console.log(chalk.blue(`[INFO] Tiempo activo: ${process.uptime().toFixed(2)} segundos`));
        break;
      case "salir":
        console.log(chalk.green("[SUCCESS] Saliendo de la CLI..."));
        process.stdin.removeListener("data", listener); // quitar listener CLI
        callback(); // 🔥 volver al menú
        return;
      default:
        console.log(chalk.yellow("[WARNING] Comando no reconocido (usa hola, tiempo, salir)"));
    }

    process.stdout.write("Ingresa un nuevo comando: ");
  };

  process.stdin.on("data", listener);
  process.stdout.write("Ingresa un nuevo comando: ");
}

// =====================
// Práctica 3: Monitor del sistema
// =====================
function systemMonitor(callback) {
  function mostrarInformacion() {
    console.clear();
    console.log(chalk.magenta("🖥️  Monitor de Sistema"));
    console.log("========================");
    console.log(`Sistema: ${os.platform()} (${os.arch()})`);
    console.log(`CPU: ${os.cpus()[0].model}`);
    console.log(`Cores: ${os.cpus().length}`);
    console.log(`Memoria Libre: ${(os.freemem() / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`Memoria Total: ${(os.totalmem() / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`Uptime: ${(os.uptime() / 60).toFixed(2)} minutos`);
    console.log(`Usuario: ${os.userInfo().username}`);
    console.log("========================\n");
    console.log("Presiona ENTER para volver al menú...");
  }

  mostrarInformacion();
  const interval = setInterval(mostrarInformacion, 5000);

  const listener = (data) => {
    if (data.trim() === "") {
      clearInterval(interval);
      process.stdin.removeListener("data", listener);
      callback(); // 🔥 volver al menú
    }
  };

  process.stdin.on("data", listener);
}

// =====================
// Menú Principal
// =====================
function mostrarMenu() {
  console.log(chalk.magenta("\n=== System Analitics CLI ==="));
  console.log(chalk.white("Selecciona la práctica a ejecutar:"));
  console.log(chalk.white("1: Registro del sistema"));
  console.log(chalk.white("2: CLI simple"));
  console.log(chalk.white("3: Monitor del sistema"));
  console.log(chalk.white("0: Salir"));
  process.stdout.write("Ingresa el número correspondiente: ");
}

function iniciarMenu() {
  process.stdin.setEncoding("utf-8");

  const listener = (data) => {
    const option = data.trim();

    switch (option) {
      case "1":
        process.stdin.removeListener("data", listener);
        registroSistema(() => iniciarMenu());
        break;
      case "2":
        process.stdin.removeListener("data", listener);
        cliTool(() => iniciarMenu());
        break;
      case "3":
        process.stdin.removeListener("data", listener);
        systemMonitor(() => iniciarMenu());
        break;
      case "0":
        console.log(chalk.green("👋 Saliendo del programa..."));
        process.exit(0);
        break;
      default:
        console.log(chalk.yellow("[WARNING] Opción no válida. Usa 1, 2, 3 o 0."));
        process.stdout.write("Ingresa el número correspondiente: ");
    }
  };

  mostrarMenu();
  process.stdin.on("data", listener);
}

iniciarMenu();
