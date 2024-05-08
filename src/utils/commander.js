const { Command } = require("commander");
const program = new Command();

program
  .option("--mode <mode>", "modo de trbajo", "produccion");
program.parse();

module.exports = program;
