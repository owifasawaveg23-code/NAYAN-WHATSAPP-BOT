module.exports = {
  config: {
    name: "hidetag",
    aliases: ["hidetag", "tag"],
    permission: 1, // admin only (0 করলে সবাই ইউজ করতে পারবে)
    prefix: true,
    description: "Tag all members silently",
    usage: ["hidetag your message"],
    categories: "Group",
    credit: "Modified by ChatGPT"
  },

  start: async ({ event, api, args }) => {
    const { threadId, isGroup } = event;

    if (!isGroup) {
      return api.sendMessage("⚠️ Group only command.", threadId);
    }

    // group info নিয়ে আসা
    const threadInfo = await api.getThreadInfo(threadId);
    const members = threadInfo.participantIDs;

    // message
    const msg = args.join(" ") || "📢 Attention everyone!";

    await api.sendMessage({
      body: msg,
      mentions: members
    }, threadId);
  }
};
