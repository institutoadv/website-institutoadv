const { app } = require("@azure/functions");
const sql = require("mssql");

// --- 1. CONFIGURAÇÃO DO BANCO DE DADOS ---
// Usando as variáveis que confirmou no portal Azure
const sqlConfig = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
  server: process.env.SQL_SERVER,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true, // Obrigatório para Azure SQL
    trustServerCertificate: false,
    connectTimeout: 30000, // Aumentado para evitar timeouts de rede
  },
};

let poolPromise;

async function getPool(context) {
  if (!poolPromise) {
    context.log("Tentando estabelecer conexão com: ", process.env.SQL_SERVER);
    poolPromise = sql.connect(sqlConfig).catch((err) => {
      poolPromise = null; // Limpa a promise em caso de erro para tentar novamente
      throw err;
    });
  }
  return poolPromise;
}

// --- 2. FUNÇÃO: postRegistration (Cadastro de Aluno) ---
app.http("postRegistration", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const data = await request.json();
      const protocol = `AV${Math.floor(Math.random() * 90000) + 10000}`;

      const pool = await getPool(context);

      // Certifique-se que os nomes das colunas na query batem com a sua tabela SQL
      await pool
        .request()
        .input("id", sql.VarChar, protocol)
        .input("name", sql.NVarChar, data.name)
        .input("birthDate", sql.Date, data.birthDate)
        .input("cpf", sql.VarChar, data.cpf)
        .input("rg", sql.VarChar, data.rg)
        .input("email", sql.NVarChar, data.email)
        .input("phone", sql.VarChar, data.phone)
        .input("escolaridade", sql.NVarChar, data.escolaridade)
        .input("cep", sql.VarChar, data.cep)
        .input("logradouro", sql.NVarChar, data.logradouro)
        .input("numero", sql.VarChar, data.numero)
        .input("bairro", sql.NVarChar, data.bairro)
        .input("course", sql.VarChar, data.course)
        .input("time", sql.VarChar, data.time)
        .input("turma", sql.NVarChar, data.turma)
        .input("lgpd", sql.Bit, data.lgpdConsent ? 1 : 0)
        .input("status", sql.NVarChar, "Pendente")
        .input(
          "attendance",
          sql.NVarChar,
          JSON.stringify(Array(10).fill(false)),
        ).query(`INSERT INTO Registrations 
                       (ID, Name, BirthDate, CPF, RG, Email, Phone, Escolaridade, CEP, Logradouro, Numero, Bairro, Course, TimeSlot, Turma, LGPDConsent, Status, Attendance)
                       VALUES 
                       (@id, @name, @birthDate, @cpf, @rg, @email, @phone, @escolaridade, @cep, @logradouro, @numero, @bairro, @course, @time, @turma, @lgpd, @status, @attendance)`);

      return {
        status: 201,
        jsonBody: { id: protocol, ...data, status: "Pendente" },
      };
    } catch (err) {
      context.error("ERRO DETALHADO NO SQL:", err);
      return {
        status: 500,
        body: `Erro de Ligação: ${err.message}. Verifique Firewall do SQL Server e se as tabelas existem.`,
      };
    }
  },
});

// --- 3. FUNÇÃO: getRegistrations (Listagem) ---
app.http("getRegistrations", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const pool = await getPool(context);
      const result = await pool
        .request()
        .query("SELECT * FROM Registrations ORDER BY CreatedAt DESC");
      return { jsonBody: result.recordset };
    } catch (err) {
      context.error("Erro ao listar:", err.message);
      return { status: 500, body: `Erro SQL: ${err.message}` };
    }
  },
});

// --- 4. FUNÇÃO: postMessage ---
app.http("postMessage", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const data = await request.json();
      const pool = await getPool(context);
      await pool
        .request()
        .input("name", sql.NVarChar, data.name)
        .input("email", sql.NVarChar, data.email)
        .input("subject", sql.NVarChar, data.subject)
        .input("message", sql.NVarChar, data.message)
        .query(
          "INSERT INTO Messages (Name, Email, Subject, Message) VALUES (@name, @email, @subject, @message)",
        );
      return { status: 200, body: "Mensagem salva." };
    } catch (err) {
      return { status: 500, body: err.message };
    }
  },
});

// --- 5. FUNÇÃO: getMessages ---
app.http("getMessages", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const pool = await getPool(context);
      const result = await pool
        .request()
        .query("SELECT * FROM Messages ORDER BY CreatedAt DESC");
      return { jsonBody: result.recordset };
    } catch (err) {
      return { status: 500, body: err.message };
    }
  },
});
