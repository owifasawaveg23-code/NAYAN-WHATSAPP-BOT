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
    return sock.sendMessage(chatId, { text: "⚠️ Group only." });
  }

  const data = loadMessageCounts();
  const groupData = data[chatId] || {};

  let sorted = Object.entries(groupData)
    .sort((a, b) => b[1] - a[1]);

  const ownerId = global.config.ownerNumber + "@s.whatsapp.net";

  // 👉 owner remove (duplicate avoid)
  sorted = sorted.filter(([uid]) => uid !== ownerId);

  // 👉 limit slice
  sorted = sorted.slice(0, limit);

  // 🎲 random gap (5–15)
  const gap = Math.floor(Math.random() * 11) + 5;

  let ownerCount = 0;
  if (sorted[1]) {
    ownerCount = Math.max(0, sorted[1][1] - gap);
  }

  // 👉 insert owner at 3rd
  if (limit >= 3) {
    sorted.splice(2, 0, [ownerId, ownerCount]);
  }

  sorted = sorted.slice(0, limit);

  if (!sorted.length) {
    return sock.sendMessage(chatId, { text: "📭 No data." });
  }

  const medals = ["🥇", "🥈", "🥉"];
  let text = "🏆 Leaderboard\n\n";
  let mentions = [];

  sorted.forEach(([userId, count], index) => {
    const medal = medals[index] || "•";

    const isOwner = userId === ownerId;
    const name = isOwner
      ? `@${userId.split("@")[0]}`
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
    credit: "Random gap by ChatGPT"
  },

  event: async ({ event }) => {
    const { threadId, senderId, isGroup } = event;
    if (isGroup) {
      incrementMessageCount(threadId, senderId);
    }
  },

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
        text: "Aga admin hois tarpor 😂"
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
