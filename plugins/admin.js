const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "../config.json");

module.exports = {
  config: {
    name: "admin",
    aliases: ["admins"],
    permission: 0,
    prefix: true,
    description: "Premium admin panel system",
    category: "Administration",
    credit: "Premium by ChatGPT",
  },

  start: async ({ api, event, args }) => {
    try {
      const { threadId, message, isSenderBotadmin } = event;

      const saveConfig = () => {
        fs.writeFileSync(configPath, JSON.stringify(global.config, null, 2), "utf8");
      };

      // ===== ADD BOT ADMIN =====
      if (args[0] === "add") {

        if (!isSenderBotadmin) {
          return api.sendMessage(threadId, {
            text: "🚫 Only bot admins can add new admins."
          }, { quoted: message });
        }

        const mentions = event.message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

        if (!mentions.length) {
          return api.sendMessage(threadId, {
            text: "⚠️ Mention user to add."
          }, { quoted: message });
        }

        let added = [];

        mentions.forEach(jid => {
          const uid = jid.split("@")[0];
          if (!global.config.admin.includes(uid)) {
            global.config.admin.push(uid);
            added.push(uid);
          }
        });

        saveConfig();

        return api.sendMessage(threadId, {
          text: `✅ *Added Bot Admin*\n\n${added.map(u => `👑 @${u}`).join("\n")}`,
          mentions: mentions
        }, { quoted: message });
      }

      // ===== REMOVE BOT ADMIN =====
      if (args[0] === "remove") {

        if (!isSenderBotadmin) {
          return api.sendMessage(threadId, {
            text: "🚫 Only bot admins can remove admins."
          }, { quoted: message });
        }

        const mentions = event.message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

        if (!mentions.length) {
          return api.sendMessage(threadId, {
            text: "⚠️ Mention user to remove."
          }, { quoted: message });
        }

        let removed = [];

        mentions.forEach(jid => {
          const uid = jid.split("@")[0];
          if (global.config.admin.includes(uid)) {
            global.config.admin = global.config.admin.filter(a => a !== uid);
            removed.push(uid);
          }
        });

        saveConfig();

        return api.sendMessage(threadId, {
          text: removed.length
            ? `❌ *Removed Bot Admin*\n\n${removed.map(u => `👑 @${u}`).join("\n")}`
            : "⚠️ User not in bot admin list.",
          mentions: removed
        }, { quoted: message });
      }

      // ===== SHOW PANEL =====
      const metadata = await api.groupMetadata(threadId);

      const admins = metadata.participants.filter(
        (p) => p.admin === "admin" || p.admin === "superadmin"
      );

      let text = `
💎 𝗣𝗥𝗘𝗠𝗜𝗨𝗠 𝗔𝗗𝗠𝗜𝗡 𝗣𝗔𝗡𝗘𝗟

╭───────────────╮
│ 👑 Group Admins
╰───────────────╯
`;

      let mentions = [];

      if (admins.length) {
        admins.forEach((admin, i) => {
          const uid = admin.id.split("@")[0];
          text += `👑 ${i + 1}. @${uid}\n`;
          mentions.push(admin.id);
        });
      } else {
        text += "❌ No group admins found\n";
      }

      text += `
╭───────────────╮
│ 🤖 Bot Admins
╰───────────────╯
`;

      if (global.config.admin && global.config.admin.length) {
        global.config.admin.forEach((uid, i) => {
          text += `🔹 ${i + 1}. @${uid}\n`;
          mentions.push(uid);
        });
      } else {
        text += "❌ No bot admins set\n";
      }

      text += `
╭───────────────╮
│ ⚙️ Controls
│ ➤ admin add @user
│ ➤ admin remove @user
╰───────────────╯
`;

      await api.sendMessage(threadId, {
        text,
        mentions
      }, { quoted: message });

    } catch (err) {
      console.error("❌ Admin command error:", err);
      await api.sendMessage(event.threadId, {
        text: "❌ Failed to load admin panel."
      });
    }
  },
};
