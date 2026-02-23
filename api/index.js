const { CosmosClient } = require("@azure/cosmos");

// A string de conexão você configura no Portal Azure depois
const client = new CosmosClient(process.env.COSMOS_DB_CONNECTION_STRING);

module.exports = async function (context, req) {
  const database = client.database("instituto_db");
  const container = database.container("Items");

  // Exemplo de query simples
  const { resources: items } = await container.items.readAll().fetchAll();

  context.res = {
    status: 200,
    body: items,
  };
};
