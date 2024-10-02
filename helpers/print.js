import chalk from "chalk";
class OutPutType{
    static INFO = "INFO";
    static SUCCESS = "SUCCESS";
    static ERROR = "ERROR";
    static WARNING = "WARNING";
}
function print(message, outputType) {
  switch (outputType) {
    case OutPutType.INFO:
      console.log(chalk.blue(message));
      break;
    case OutPutType.SUCCESS:
      console.log(chalk.green(message));
      break;
    case OutPutType.ERROR:
      console.log(chalk.red(message));
      break;
    case OutPutType.WARNING:
      console.log(chalk.yellow(message));
      break;
    default:
      console.log(chalk.green(message));
  }
}

export{
    OutPutType,
    print
}