module.exports = {
  config: {
    name: "antimedia",
    aliases: ["am"],
    permission: 2,
    prefix: true,
    description: "Block photos, stickers & videos in group",
    category: "moderation",
  },

  start: async ({ event, api, args }) => {
    const { threadId, isSenderAdmin } = event;

    if (!isSenderAdmin) {
      return api.sendMessage(threadId, { text: "❌ Only admins can use this command." });
    }

    global.antiMedia = global.antiMedia || {};

    const option = args[0];

    if (option === "on") {
      global.antiMedia[threadId] = true;
      return api.sendMessage(threadId, { text: "🚫 Anti Media system is now ON!" });
    }

    if (option === "off") {
      global.antiMedia[threadId] = false;
      return api.sendMessage(threadId, { text: "✅ Anti Media system is now OFF!" });
    }

    return api.sendMessage(threadId, {
      text: "Usage:\n.antimedia on\n.antimedia off"
    });
  },

  event: async ({ event, api }) => {
    const { threadId, message, senderId } = event;

    if (!global.antiMedia || !global.antiMedia[threadId]) return;

    const msg = message?.message;

    // Detect media types
    const isImage = msg?.imageMessage;
    const isSticker = msg?.stickerMessage;
    const isVideo = msg?.videoMessage;

    if (isImage || isSticker || isVideo) {
      try {
        const msgId = message.key.id;
        const participant = message.key.participant || senderId;

        // Delete message
        await api.sendMessage(threadId, {
          delete: {
            remoteJid: threadId,
            fromMe: false,
            id: msgId,
            participant: participant
          }
        });

        // Warning message
        await api.sendMessage(threadId, {
          text: `🚫 @${senderId.split("@")[0]} মিডিয়া (ছবি/স্টিকার/ভিডিও) পাঠানো নিষিদ্ধ!`,
          mentions: [senderId]
        });

      } catch (err) {
        console.error("❌ Delete failed:", err);
      }
    }
  }
};
