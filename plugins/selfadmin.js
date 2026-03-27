module.exports = {
  config: {
    name: "admin",
    aliases: ["makeadmin"],
    permission: 2,
    prefix: true,
    categorie: "Moderation",
    credit: "XAHID PRIME 🍷",
    description: "Make admin (mention/reply/self)",
  },

  start: async ({ api, event }) => {
    const { threadId, message, senderId } = event;

    // 🔐 Only bot admin
    const isBotAdmin = global.config.admin?.includes(senderId.split("@")[0]);
    if (!isBotAdmin) {
      return api.sendMessage(threadId, {
        text: "❌ Only Bot Admin can use this command!"
      }, { quoted: message });
    }

    // 📌 Check bot admin status
    const metadata = await api.groupMetadata(threadId);
    const botId = api.user.id || api.user.jid;

    const isBotGroupAdmin = metadata.participants.find(
      p => p.id === botId && (p.admin === "admin" || p.admin === "superadmin")
    );

    if (!isBotGroupAdmin) {
      return api.sendMessage(threadId, {
        text: "⚠️ Bot must be group admin first!"
      }, { quoted: message });
    }

    // 🔍 Detect target
    let targetUsers = [];

    // 1️⃣ Mention
    const mentions = event.message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    if (mentions && mentions.length > 0) {
      targetUsers = mentions;
    }

    // 2️⃣ Reply
    else if (event.message.message?.extendedTextMessage?.contextInfo?.participant) {
      targetUsers = [event.message.message.extendedTextMessage.contextInfo.participant];
    }

    // 3️⃣ Self
    else {
      targetUsers = [senderId];
    }

    try {
      for (const user of targetUsers) {
        await api.groupParticipantsUpdate(threadId, [user], "promote");
      }

      await api.sendMessage(threadId, {
        text: `👑 Admin বানানো হয়েছে:\n${targetUsers.map(u => `@${u.split("@")[0]}`).join("\n")}`,
        mentions: targetUsers
      }, { quoted: message });

    } catch (err) {
      console.error("❌ Admin error:", err);

      await api.sendMessage(threadId, {
        text: "❌ Admin বানানো সম্ভব হয়নি!"
      }, { quoted: message });
    }
  }
};
