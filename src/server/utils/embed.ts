import { MessageEmbed } from "discord.js";
import { embed_default_color } from "../../../config";
import { getGuild } from "../cache/guilds";
import { parsePlaceHolder } from "./placeholders";

type embed_ = {
  fields?: {
    val1: string;
    val2?: string;
    inline?: boolean;
  }[];
  description?: string;
  color?: string;
  name?: string;
  guildid?: string;
};

type emreturn = {
  getEmbed(): MessageEmbed;
  addFields(
    fields: {
      val1: string;
      val2?: string;
      inline?: boolean;
    }[]
  ): embed_;
  clearFields(): embed_;
};

export default function embed(e: embed_): emreturn {
  let m = new MessageEmbed();

  if (e.fields)
    e.fields.forEach((c) => {
      m.addField(c.val1, c.val2 ? c.val2 : " ", c.inline);
    });

  if (e.guildid) {
    const guild = getGuild(e.guildid);
    if (guild) var settings = guild.settings;
  }
  if (e.description) m.setDescription(e.description);

  const emcolor =
    settings && settings.embed.color
      ? settings.embed.color
      : embed_default_color;
  m.setColor(emcolor || embed_default_color);

  if (settings && settings.embed.date) m.setTimestamp(Date.now());

  const footer =
    settings && settings.embed.footer
      ? parsePlaceHolder({ text: settings.embed.footer, guildID: e.guildid })
      : false;

  if (footer) m.setFooter(footer);

  if (e.name) m.title = e.name;

  let x: emreturn = {
    getEmbed: () => m,
    addFields: (fields) => {
      fields.forEach((c) => {
        m.addField(c.val1, c.val2 ? c.val2 : `\u200B`, c.inline);
      });
      return this;
    },
    clearFields: () => {
      m.fields = [];
      return this;
    },
  };

  return x;
}
