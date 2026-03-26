const axios = require("axios");

module.exports = {
  config: {
    name: 'help',
    aliases: ['menu'],
    permission: 0,
    prefix: true,
    description: 'Premium clickable menu',
    category: 'Utility',
    credit: 'Clickable Premium by ChatGPT',
  },

  start: async ({ event, api, args, loadcmd }) => {
    const { threadId, getPrefix } = event;

    const commands = loadcmd.map(cmd => cmd.config);
    const prefix = await getPrefix(threadId) || global.config.PREFIX;

    // 🎨 Category system
    const categories = {};

    commands.forEach(cmd => {
      let cat = cmd.category || cmd.categories || "OTHER";
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(cmd);
    });

    // 🔍 SINGLE COMMAND
    if (args[0]) {
      const cmd = commands.find(c => c.name === args[0].toLowerCase());
      if (!cmd) {
        return api.sendMessage(threadId, { text: `❌ Command not found` });
      }

      return api.sendMessage(threadId, {
        text: `
💎 COMMAND INFO

🔹 Name: ${cmd.name}
🔹 Aliases: ${cmd.aliases?.join(", ") || "None"}
🔹 Description: ${cmd.description || "No description"}
🔹 Usage: ${cmd.usages?.join("\n") || "Not set"}
🔹 Permission: ${cmd.permission}
🔹 Category: ${cmd.category}
        `
      });
    }

    // 🕒 Time
    const time = new Date().toLocaleTimeString("en-US", {
      timeZone: global.config.timeZone || "Asia/Dhaka",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });

    // 💎 MENU
    let text = `
╭━━━〔 💎 ${global.config.botName} 〕━━━╮
┃ 👑 Owner: ${global.config.botOwner}
┃ ⚡ Prefix: ${prefix}
┃ 🕒 Time: ${time}
┃ 📜 Commands: ${commands.length}
╰━━━━━━━━━━━━━━━━━━━━━━━╯
`;

    for (const cat in categories) {
      text += `\n╭─〔 ${cat.toUpperCase()} 〕\n`;

      categories[cat].forEach(cmd => {
        // 🔥 CLICKABLE FORMAT
        text += `┃ ➤ \`${prefix}${cmd.name}\`\n`;
      });

      text += `╰───────────────`;
    }

    text += `
\n💡 Tip: Click any command above to use it instantly!
`;

    try {
      const img = await axios.get(global.config.helpPic, { responseType: "stream" });

      await api.sendMessage(threadId, {
        image: { stream: img.data },
        caption: text
      });

    } catch {
      await api.sendMessage(threadId, { text });
    }
  },
};
