import "reflect-metadata";
import { createUHLogger } from "./helpers/Log";
import express from "express";
import startServer from "./server";

const log = createUHLogger({ name: "uncaught" });

process.on("uncaughtException", (err) => {
  try {
    log.error(err, "Caught exception: " + err);
  } catch (logWritingErr) {
    try {
      console.error("Cannot write to log!");
      console.error(logWritingErr);
    } catch (consoleWritingError) {}
  }

  console.error(err);
});

process.on("unhandledRejection", (err) => {
  try {
    log.error(err, "Uncaught rejection: " + err);
  } catch (logWritingErr) {
    try {
      console.error("Cannot write to log!");
      console.error(logWritingErr);
    } catch (consoleWritingError) {}
  }

  console.error(err);
});

startServer(express());
