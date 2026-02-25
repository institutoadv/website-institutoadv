const { app } = require("@azure/functions");
const sql = require("mssql");

// --- 1. CONFIGURAÇÃO DO BANCO DE DADOS ---
const sqlConfig = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
  server: process.env.SQL_SERVER,
  pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

// --- 2. FUNÇÃO: postRegistration (Cadastro de Aluno) ---
app.http("postRegistration", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const data = await request.json();
      const protocol = `AV${Math.floor(Math.random() * 90000) + 10000}`;
      const pool = await sql.connect(sqlConfig);

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
      context.error("Erro no SQL:", err);
      return { status: 500, body: "Erro ao salvar no banco." };
    }
  },
});

// --- 3. FUNÇÃO: getRegistrations (Listar Alunos) ---
app.http("getRegistrations", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const pool = await sql.connect(sqlConfig);
      const result = await pool
        .request()
        .query("SELECT * FROM Registrations ORDER BY CreatedAt DESC");
      return { jsonBody: result.recordset };
    } catch (err) {
      return { status: 500, body: err.message };
    }
  },
});

// --- 4. FUNÇÃO: postMessage (Contato) ---
app.http("postMessage", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const data = await request.json();
      const pool = await sql.connect(sqlConfig);
      await pool
        .request()
        .input("name", sql.NVarChar, data.name)
        .input("email", sql.NVarChar, data.email)
        .input("subject", sql.NVarChar, data.subject)
        .input("message", sql.NVarChar, data.message)
        .query(
          "INSERT INTO Messages (Name, Email, Subject, Message) VALUES (@name, @email, @subject, @message)",
        );
      return { status: 200, body: "Mensagem recebida." };
    } catch (err) {
      return { status: 500, body: err.message };
    }
  },
});

// --- 5. FUNÇÃO: getMessages (Listar Mensagens) ---
app.http("getMessages", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const pool = await sql.connect(sqlConfig);
      const result = await pool
        .request()
        .query("SELECT * FROM Messages ORDER BY CreatedAt DESC");
      return { jsonBody: result.recordset };
    } catch (err) {
      return { status: 500, body: err.message };
    }
  },
});
