import { Request, Response } from "express";
import { getUsers } from "../../../cache/user";

export default async (req: Request, res: Response) => {
  try {
    if (req.query.type && typeof req.query.type === "string") {
      switch (req.query.type.toLowerCase()) {
        case "all": {
          const g = [];
          for (const [id_, guild] of req.user.guilds) {
            if (guild.permission.hasPermission("users.see")) {
                const x = [];
               const Users = getUsers(id_)
                for (const [id, member] of await guild.Guild.members.fetch())  {
                   const group = Users.find(x => x.userID === id) ? Users.find(x => x.userID === id).Groups : []
               x.push({
                id : id,
                nickname : member.nickname,
                tag : member.user.tag,
                avatarUrl : member.user.displayAvatarURL({dynamic : true,format : "webp",size : 128}),
                groups : group ? group : [] 
            })
              }
              g.push({ guild: id_, data: x });
            }
          }
          if (g[0])
            return res.status(200).json({ success: true, data: g });
        }
        default: {
          if (req.user.guilds.get(req.query.type)) {
              const guild = req.user.guilds.get(req.query.type);
              const Users = getUsers(req.query.type);
            if (guild.permission.hasPermission("users.see")) {
              const x = [];
                for (const [id, member] of await guild.Guild.members.fetch()) {
                  const group = Users.find((x) => x.userID === id)
                    ? Users.find((x) => x.userID === id).Groups
                    : [];
                x.push({
                  id: id,
                  nickname: member.nickname,
                  tag: member.user.tag,
                  avatarUrl: member.user.displayAvatarURL({
                    dynamic: true,
                    format: "webp",
                    size: 128,
                  }),
                  groups: group ? group : [],
                });
              }
              return res.status(200).json({ success: true, data: x });
            }
          }
          return res.status(400).json({ success: false });
        }
      }
    }
  } catch {
    return res.status(500).json({ success: false });
  }
};
