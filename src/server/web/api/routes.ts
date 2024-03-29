import * as express from "express";
import { checkToken } from "./discord";
import auth from "./format/auth";
import syncFormat from "./helper/sync";
import { randomBytes } from "crypto";
import { urlencoded, json } from "body-parser";
import {
  addUserWeb,
  selectUser,
  isUserExist,
  updateUserToken,
} from "../../cache/userweb";
import userRouter from "./user";
import GroupRouter from "./group";
import DocRouter from "./doc";
import GuildRouter from "./guild";
import CommandRouter from "./command";
import ModuleRouter from "./modules";
import LangRouter from "./lang";
import { defaultlocale } from "../../../../config";
import { getAllLang } from "../../cache/lang";
import { channelsRoute } from "./helper/channels";
import langs from "./helper/langs";
import commands from "./helper/commands";
import modules from "./helper/modules";
import { Module } from "../../modules/module";
import { Modules } from "../../modules/ModuleManager";
import roles from "./helper/roles";
import users from "./helper/users";

const router = express.Router();

router.use(urlencoded({ extended: true }));
router.use(json());

/**
 * @name /auth
 * @description called to get Token from discord Token
 * @type POST
 */
router.post("/auth", async (req, res, next) => {
  let err = auth.validate(req.body).error;
  if (!err) {
    const useri = await checkToken(req.body.token);
    if (!useri) return res.status(400).json({ success: false });

    const token = randomBytes(256).toString("base64");

    if (!isUserExist(useri.id)) {
      try {
        let user = await addUserWeb({
          userID: useri.id,
          access_token: req.body.token,
          expires: req.body.expires_in,
          token: token,
        });

        if (user) {
          return res.status(200).json({ success: true, token: token });
        }
        return res.status(400).json({ success: false });
      } catch {
        return res.status(400).json({ success: false });
      }
    } else {
      let user = await updateUserToken({
        userID: useri.id,
        access_token: req.body.token,
        expires: req.body.expires_in,
        token: token,
      });

      if (user) {
        return res.status(200).json({ success: true, token: token });
      }
      return res.status(400).json({ success: false });
    }
  }
  return res.status(400).json({ success: false });
});

/**
 * @name /doc/*
 *
 */
router.use("/doc", DocRouter);

router.get("/test", (req, res, next) => {
  res.send("eaz");
});

/**
 * BEFORE AUTHENTIFICATION
 *
 */

function createRoutesModules(modules: Module[]) {
  for (const module of modules) {
    if (module.routes) {
      router.use(`/module/${module.getName()}`, module.getRoutes());
    }
  }
}
createRoutesModules(Modules);

/**
 * @name /sync
 *
 */

router.use("*", async (req, res, next) => {
  if (req.headers.authorization) {
    try {
      const user = await selectUser(req.headers.authorization);
      if (!user) return res.status(401).json({ success: false });

      req.user = user;
      next();
    } catch {
      return res.status(401).json({ success: false });
    }
  } else return res.status(401).json({ success: false });
});

router.get("/sync", async (req, res, next) => {
  if (req.headers.authorization) {
    try {
      const user = await selectUser(req.headers.authorization);
      if (!user) return res.status(401).json({ success: false });

      return res
        .status(200)
        .json({
          success: true,
          defaultlocale,
          availableslang: getAllLang(),
          data: await syncFormat(user),
        });
    } catch (err) {
      console.log(err);
      return res.status(401).json({ success: false });
    }
  } else {
    return res.status(401).json({ success: false });
  }
});

router.get("/sync/channels", async (req, res, next) => {
  if (req.query && req.query.type) {
    try {
      setTimeout(() => {
        return channelsRoute(req, res);
      }, 1500);
    } catch {
      return res.status(500).json({ success: false });
    }
  } else {
    return res.status(400).json({ success: false });
  }
});

router.get("/sync/customlangs", async (req, res, next) => {
  if (req.query && req.query.type) {
    try {
      setTimeout(() => {
        return langs(req, res);
      }, 1500);
    } catch {
      return res.status(500).json({ success: false });
    }
  } else {
    return res.status(400).json({ success: false });
  }
});

router.get("/sync/commands", async (req, res, next) => {
  if (req.query && req.query.type) {
    try {
      setTimeout(() => {
        return commands(req, res);
      }, 1500);
    } catch {
      return res.status(500).json({ success: false });
    }
  } else {
    return res.status(400).json({ success: false });
  }
});

router.get("/sync/modules", async (req, res, next) => {
  if (req.query && req.query.type) {
    try {
      return modules(req, res);
    } catch {
      return res.status(500).json({ success: false });
    }
  } else {
    return res.status(400).json({ success: false });
  }
});
router.get("/sync/users", async (req, res, next) => {
  if (req.query && req.query.type) {
    try {
      return users(req, res);
    } catch {
      return res.status(500).json({ success: false });
    }
  } else {
    return res.status(400).json({ success: false });
  }
});

router.get("/sync/roles", async (req, res, next) => {
  if (req.query && req.query.type) {
    try {
      setTimeout(() => {
        return roles(req, res);
      }, 1500);
    } catch {
      return res.status(500).json({ success: false });
    }
  } else {
    return res.status(400).json({ success: false });
  }
});

/**
 * @name /user/*
 *
 */

router.use("/user", userRouter);

/**
 * @name /group/*
 */
router.use("/group", GroupRouter);

/**
 * @name /guild/*
 */
router.use("/guild", GuildRouter);

/**
 * @name /command/*
 */
router.use("/command", CommandRouter);

/**
 * @name /modules/*
 *
 */
router.use("/modules", ModuleRouter);

router.use("/lang", LangRouter);

export default router;
