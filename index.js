const minimist = require('minimist')
const { sanitizeCurlArgs } = require('./helpers/parse-curl')
const Storage = require('./storage').Database;
const { outputEmptyArgsError } = require('./output');
let db = new Storage();

module.exports = () => {
  const cmdArgs = sanitizeCurlArgs(process.argv.slice(2))
  const args = minimist(cmdArgs);
  
  if (args._.length == 0) {
    outputEmptyArgsError();
    return;
  }

  let cmd_string = process.argv.slice(2).map((arg) => {
    // if (/\s/g.test(arg)) {
    //   return "'" + arg.replace(/'/g, "'\\''") + "'";
    // }
    // return arg;
    return "\"" + arg.replace(/'/g, '"') + "\"";
  });

  let exec_str = 'curl -i ' + cmd_string.join(' ');
  let cmd = args._[0]

  if (args.version || args.v) {
    cmd = 'version'
  }

  if (args.help || args.h) {
    cmd = 'help'
  }

  switch (cmd) {
    case 'run':
      require('./cmds/run')(args, db)
      break

    case 'version':
      require('./cmds/version')(args)
      break

    case 'help':
      require('./cmds/help')(args)
      break

    case 'history':
      require('./cmds/history')(args, db)
      break

    case 'collections':
      require('./cmds/collections')(args, db)
      break

    case 'clear':
      require('./cmds/clear')(args, db)
      break

    case 'new':
      require('./cmds/new')(args, db)
      break

    default:
      require('./cmds/curlx')(args, exec_str, db)
      break
  }
}
