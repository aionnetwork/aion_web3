const core = require('./core.js');
const log = require('./core.js').log;
const parse = require('./parser.js').parse;
const execute = require('./executor.js').execute;

(async () => {
  try {
    const arguments = process.argv.slice(2);
    const statement = parse(arguments);
    execute(statement);
  } catch (e) {
    log(e);
  }
})();