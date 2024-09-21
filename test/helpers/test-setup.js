const { DataSource, Agenda } = require("@cawstudios/agenda");

async function setupAgenda() {
  const agenda = new Agenda({
    dataSource: DataSource.MONGO,
    dataSourceOptions: {
      db: {
        address: "mongodb://127.0.0.1/agendash-test-db",
        collection: "agendash-test-collection",
      }
    }
  });
  
  await agenda.start();
  return agenda;
}


module.exports = { setupAgenda };