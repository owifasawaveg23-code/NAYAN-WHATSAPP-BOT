module.exports = {
  config: {
    name: 'tagall',
    aliases: ['all', 'mentionall'],
    permission: 3,
    prefix: true,
    description: 'Tag all members with admin highlight',
    categories: 'group',
    usages: [`${global.config.PREFIX}tagall [message]`],
    credit: 'Clean Premium by ChatGPT'
  },

  start: async ({ event, api, args }) => {
    const { threadId, message } = event;

    const groupMetadata = await api.groupMetadata(threadId);
    const participants = groupMetadata.participants || [];

    if (!participants.length) {
      return api.sendMessage(threadId, {
        text: "⚠️ No members found in this group."
      });
    }

    // Custom or random message
    const greetings = [
      "👑 Attention সবাই!",
      "🔥 সবাই একটু দেখো!",
      "🚀 All members check!",
      "💎 Squad assemble!",
      "⚡ সবাই অনলাইন হও!"
    ];

    let customMsg = args.join(" ");
    if (!customMsg) {
      customMsg = greetings[Math.floor(Math.random() * greetings.length)];
    }

    let text = `
💎 𝗧𝗔𝗚 𝗔𝗟𝗟

╭───────────────╮
│ ✨ ${customMsg}
╰───────────────╯

`;

    let mentions = [];

    // 👑 Admin section
    text += `👑 *GROUP ADMINS*\n`;
    let hasAdmin = false;

    participants.forEach((user) => {
      if (user.admin) {
        hasAdmin = true;
        text += `👑 @${user.id.split("@")[0]}\n`;
        mentions.push(user.id);
      }
    });

    if (!hasAdmin) {
      text += `❌ No admins found\n`;
    }

    // 👥 Members section
    text += `\n👥 *GROUP MEMBERS*\n`;

    let count = 0;
    participants.forEach((user) => {
      if (!user.admin) {
        count++;
        text += `🔹 ${count}. @${user.id.split("@")[0]}\n`;
        mentions.push(user.id);
      }
    });

    text += `
╭───────────────╮
│ 💌 Stay active সবাই!
╰───────────────╯
`;

    await api.sendMessage(threadId, {
      text,
      mentions
    }, { quoted: message });
  }
};
