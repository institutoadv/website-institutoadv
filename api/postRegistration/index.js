// /api/postRegistration/index.js
const sql = require("mssql");

const config = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  server: process.env.SQL_SERVER,
  database: process.env.SQL_DATABASE,
  options: { encrypt: true },
};

module.exports = async function (context, req) {
  try {
    let pool = await sql.connect(config);
    const protocol = `AV${Math.floor(Math.random() * 90000) + 10000}`;

    await // ... adicione os outros inputs aqui ...
    pool
      .request()
      .input("id", sql.VarChar, protocol)
      .input("name", sql.NVarChar, req.body.name)
      .input("cpf", sql.VarChar, req.body.cpf)
      .input("course", sql.VarChar, req.body.course)
      .query(`INSERT INTO Registrations (ID, Name, CPF, Course) 
                    VALUES (@id, @name, @cpf, @course)`);

    context.res = { status: 201, body: { id: protocol, ...req.body } };
  } catch (err) {
    context.log.error(err);
    context.res = { status: 500, body: "Erro ao salvar no SQL" };
  }
};
