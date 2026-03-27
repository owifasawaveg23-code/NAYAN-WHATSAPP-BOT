  // sort
  const sorted = entries
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);

  if (!sorted.length) {
    return sock.sendMessage(chatId, { text: "📭 No data." });
  }

  const medals = ["🥇", "🥈", "🥉"];
  let text = "🏆 Leaderboard\n\n";
  let mentions = [];

  sorted.forEach(([userId, count], index) => {
    const medal = medals[index] || "•";

    const isAdmin = botAdmins.includes(userId);
    const name = isAdmin
      ? `👑 @${userId.split("@")[0]}`
      : `@${userId.split("@")[0]}`;

    text += `${medal} ${name} — ${count}\n`;
    mentions.push(userId);
  });

  await sock.sendMessage(chatId, {
    text,
    mentions
  });
}

module.exports = {
  config: {
    name: "topmembers",
    aliases: ["top", "leaderboard"],
    permission: 0,
    prefix: true,
    cooldowns: 5,
    description: "Top active members",
    category: "Utility",
    credit: "Premium by ChatGPT"
  },

  // 📊 Track messages
  event: async ({ event }) => {
    const { threadId, senderId, isGroup } = event;
    if (isGroup) {
      incrementMessageCount(threadId, senderId);
    }
  },

  // 🔒 Command
  start: async ({ event, api, args }) => {
    const { threadId, senderId, isGroup } = event;

    if (!isGroup) return;

    // 👥 Group Admin check
    const metadata = await api.groupMetadata(threadId);
    const groupAdmins = metadata.participants
      .filter(p => p.admin === "admin" || p.admin === "superadmin")
      .map(p => p.id);

    const isGroupAdmin = groupAdmins.includes(senderId);

    // 🤖 Bot Admin check
    const isBotAdmin = global.config.admin.includes(senderId.split("@")[0]);

    if (!isGroupAdmin && !isBotAdmin) {
      return api.sendMessage(threadId, {
        text: "🚫 Admin only command."
      });
    }

    const limit = parseInt(args[0]) || 5;

    await topMembers({
      sock: api,
      chatId: threadId,
      isGroup,
      limit
    });
  }
};
