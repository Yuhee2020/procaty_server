import { existsSync } from "fs";
import _ from "lodash";
import Logger from "bunyan";
import {mkdirp} from "mkdirp";
import { env } from "../env";
import PrettyStream from "bunyan-prettystream";

export interface LogArgs {
  //filename for log storage
  name: string;
}

let isLogsFolderExists = env.LOGS_PATH ? existsSync(env.LOGS_PATH) : false;

const prettyStdOut = new PrettyStream();
prettyStdOut.pipe(process.stdout);

export function createUHLogger({ name }: LogArgs): Logger {
  if (!isLogsFolderExists) {
    mkdirp.sync(env.LOGS_PATH);
    isLogsFolderExists = true;
  }

  const logger = Logger.createLogger({
    name: `prokaty.${name}`,
    serializers: Logger.stdSerializers,
    streams: [
      {
        level: "info",
        path: `${env.LOGS_PATH}/info_${name}.log`,
      },
      {
        level: "error",
        path: `${env.LOGS_PATH}/error_${name}.log`,
      },

      {
        level: "debug",
        type: "raw",
        stream: prettyStdOut,
      },
    ],
  });

  logger.level(env.LOG_LEVEL.toUpperCase() as Logger.LogLevel);
  return logger;
}
