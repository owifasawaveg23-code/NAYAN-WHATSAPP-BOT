const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'Nayan', 'data', 'messageCount.json');

function loadMessageCounts() {
  if (fs.existsSync(dataFilePath)) {
    return JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
  }
  return {};
}

function saveMessageCounts(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

function incrementMessageCount(groupId, userId) {
  const data = loadMessageCounts();

  if (!data[groupId]) data[groupId] = {};
  if (!data[groupId][userId]) data[groupId][userId] = 0;

  data[groupId][userId] += 1;
  saveMessageCounts(data);
}

async function topMembers({ sock, chatId, isGroup, limit }) {
  if (!isGroup) {
    return sock.sendMessage(chatId, {
      text: "⚠️ This command works only in groups."
    });
  }

  const data = loadMessageCounts();
  const groupData = data[chatId] || {};

  const sorted = Object.entries(groupData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);

  if (!sorted.length) {
    return sock.sendMessage(chatId, {
      text: "📭 No activity yet!"
    });
  }

  // Medal system 🥇🥈🥉
  const medals = ["🥇", "🥈", "🥉"];

  let text = `
🏆 𝗣𝗥𝗘𝗠𝗜𝗨𝗠 𝗟𝗘𝗔𝗗𝗘𝗥𝗕𝗢𝗔𝗥𝗗

╭───────────────╮
│ 👑 Top Active Members
╰───────────────╯

`;

  let mentions = [];

  sorted.forEach(([userId, count], index) => {
    const medal = medals[index] || "🔹";

    text += `${medal} ${index + 1}. @${userId.split("@")[0]}\n`;
    text += `   💬 Messages: ${count}\n\n`;

    mentions.push(userId);
  });

  text += `
╭───────────────╮
│ 🚀 Keep chatting to rank up!
│ 💎 Stay active, be #1
╰───────────────╯
`;

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
    description: "Premium leaderboard of active members",
    usage: [
      `${global.config.PREFIX}topmembers`,
      `${global.config.PREFIX}top 10`
    ],
    categories: "Utility",
    credit: "Premium by ChatGPT"
  },

  event: async ({ event }) => {
    const { threadId, senderId, isGroup } = event;
    if (isGroup) {
      incrementMessageCount(threadId, senderId);
    }
  },

  start: async ({ event, api, args }) => {
    const { threadId, isGroup } = event;
    const limit = parseInt(args[0]) || 5;

    await topMembers({
      sock: api,
      chatId: threadId,
      isGroup,
      limit
    });
  }
};
