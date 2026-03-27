module.exports = {
  event: 'add',
  handle: async ({ api, event }) => {
    const newMembers = event.participants;
    const groupInfo = await api.groupMetadata(event.id);
    const groupName = groupInfo.subject;

    // 💖 Flirty lines
    const flirtyLines = [
      "😏 তুমি আসতেই গ্রুপটা আরো সুন্দর হয়ে গেল...",
      "💘 কে তুমি? না বলে ঢুকে হৃদয় চুরি করছো!",
      "🔥 সাবধান! তোমার এন্ট্রিতে সবাই crush খেয়ে যাবে!",
      "😘 Welcome! কিন্তু আগে বলো, এত cute হওয়ার লাইসেন্স কোথায় পেয়েছো?",
      "😎 তুমি কি VIP? না হলে এত style কিভাবে!",
      "💞 তোমার জন্যই আজ group এ vibe এসেছে!",
      "😜 Careful! কেউ তোমার প্রেমে পড়ে যেতে পারে!",
      "💎 তুমি আসায় group এখন premium feel দিচ্ছে!",
      "😍 First impression = Heart attack 💘",
      "🥀 তুমি কি single? (Just asking 😏)"
    ];

    for (const member of newMembers) {
      let profilePicUrl;

      try {
        profilePicUrl = await api.profilePictureUrl(member, 'image');
      } catch {
        profilePicUrl = null;
      }

      const username = `@${member.split('@')[0]}`;
      const line = flirtyLines[Math.floor(Math.random() * flirtyLines.length)];

      // 💎 Stylish Flirty Message
      const message = `
💖 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗕𝗔𝗕𝗬 😏
╭───────────────╮
│ 👋 Hey ${username}
│ 💌 ${line}
│ 🏷️ ${groupName}
╰───────────────╯
💫 এখন থেকে তুমি আমাদের VIP 😎
🔥 Stay active না হলে miss করবে!

🍷 𝐀𝐯𝐢 💸
`;

      if (profilePicUrl) {
        await api.sendMessage(event.id, {
          image: { url: profilePicUrl },
          caption: message,
          mentions: [member]
        });
      } else {
        await api.sendMessage(event.id, {
          text: message,
          mentions: [member]
        });
      }
    }
  }
};
