import { ApolloServer } from "apollo-server-express";
import argon2 from "argon2";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import http from "http";
import mongoose from "mongoose";
import * as path from "path";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { Container } from "typedi";
import { env } from "./env";
// import {UserResolver} from "./graphql";
import { createUHLogger } from "./helpers";
import { NotificationType, UserRole } from "./lib";
import { authChecker } from "./middleware";
import UserModel from "./models/user/UserModel";
import {UserResolver} from "./graphql/user";
import {refreshToken} from "./routes/refreshToken";
import LoginLogModel from "./models/loginLog/LoginLogModel";

// import { refreshToken } from "./routes";

const bodyParser = require("body-parser");
const log = createUHLogger({ name: "server" });

// async function _onDBConnect() {
//   //that's important to see even if logs disabled, do not remove!
//   console.log("Connected to DB");
//   const adminEmail = env.GLOBAL_ADMIN_EMAIL;
//   const adminPassword = env.GLOBAL_ADMIN_PASSWORD;
//
//   const globalAdminFound = await UserModel.findOne({
//     email: adminEmail,
//   }).exec();
//
//   if (!globalAdminFound) {
//     const admin = new UserModel();
//     admin.set({
//       email: adminEmail,
//       hashedPassword: await argon2.hash(adminPassword),
//       firstName: env.GLOBAL_ADMIN_FNAME,
//       lastName: env.GLOBAL_ADMIN_LNAME,
//       emailVerified: true,
//       role: UserRole.GLOBAL_ADMIN,
//       notificationTypes: [NotificationType.EMAIL],
//       createdBy: admin.id,
//     });
//
//     try {
//       await admin.save();
//     } catch (err) {
//       log.error(err, "Cannot create GLOBAL ADMIN: " + err);
//       throw new Error("DB Connection failed");
//     }
//   }
// }

async function startServer(app: Application) {
  //Mongoose Models
  Container.set({ id: "USER", factory: () => UserModel });
  Container.set({ id: "LOGIN_LOG", factory: () => LoginLogModel });


  //GQL Schema
  const schema = await buildSchema({
    resolvers: [
      UserResolver,
    ],
    emitSchemaFile: path.resolve(__dirname, "schema.gql"),
    authChecker,
    authMode: "error",
    container: Container,
    dateScalarMode: "isoDate",
  });
  const dbUrl = `mongodb+srv://${env.DB_USER}:${env.DB_PASSWORD}@prokaty.ckeb2et.mongodb.net/?retryWrites=true&w=majority`;

  mongoose
    .connect(dbUrl)
    .then(async (_res) => {
      // await _onDBConnect();
      console.log("Connected to DB");
      app.use(
        cors({
          credentials: true,
          origin: [
            // /\.networkio\.io$/,
            // "https://networkio.io/",
            // "https://staging.networkio.io/",
            "https://studio.apollographql.com",
            env.FRONT_URL,
            env.FRONT_ADMIN_FBASE_URL,
            env.FRONT_ADMIN_LOCAL_URL,
            env.FRONT_ADMIN_URL,
            env.FRONT_LOCAL_URL,
            env.FRONT_WWW_URL,
          ],
        })
      );
      //additional server settings
      app.use(cookieParser());
      app.use(express.json({ limit: "10mb" }));

      app.set("trust proxy", 1);

      //static apis
      app.post("/refresh_token", (req, res) => refreshToken(req, res));

      //GQL Server
      const server = new ApolloServer({
        schema,
        context: ({ req, res}) => ({
          req,
          res,
        }),
        introspection: true,
      });
      await server.start();
      // @ts-ignore
      server.applyMiddleware({ app, path: "/api", cors: false });

      const httpServer = http.createServer(app);
      httpServer.listen({ port: env.PORT }, () => {
        console.log(`Server started on port: ${env.PORT}`);
      });

    })
    .catch((err) => {
      console.error(err);
    });
}

export default startServer;
