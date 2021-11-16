require('dotenv').config()

const { Command, Option, InvalidArgumentError } = require('commander');
const program = new Command();

// eslint-disable-next-line no-unused-vars
function commanderParseInt(value, _previous) {
  // parseInt takes a string and a radix
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    throw new InvalidArgumentError('Not a number.');
  }
  return parsedValue;
}

program.addOption(
  new Option(
    "-d, --db <db>",
    "[required] Mongo connection string, same as Agenda connection string")
    .env('AGENDASH_DB'));

program.addOption(
  new Option(
    "-c, --collection <collection>",
    "[optional] Mongo collection, same as Agenda collection name, default agendaJobs")
    .default("agendaJobs")
    .env('AGENDASH_COLLECTION'));

program.addOption(
  new Option(
    "-p, --port <port>",
    "[optional] Server port, default 3000")
    .argParser(commanderParseInt)
    .default(3000)
    .env('AGENDASH_PORT'));

program.addOption(
  new Option(
    "-t, --title <title>",
    "[optional] Page title, default Agendash")
    .default("Agendash")
    .env('AGENDASH_PAGE_TITLE'));

program.addOption(
  new Option(
    "--path <path>",
    "[optional] Path to bind Agendash to, default /")
    .default("/")
    .env('AGENDASH_PATH'));

program.parse(process.argv);
const options = program.opts()

if (!options.db) {
  console.error("--db required");
  process.exit(1);
}

if (!options.path.startsWith("/")) {
  console.error("--path must begin with /");
  process.exit(1);
}

module.exports = options;
