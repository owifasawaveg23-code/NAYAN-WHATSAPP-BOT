module.exports = {
  event: 'add',
  handle: async ({ api, event }) => {
    const newMembers = event.participants;
    const groupInfo = await api.groupMetadata(event.id);
    const groupName = groupInfo.subject;
    const totalMembers = groupInfo.participants.length;

    // 🎲 Random welcome lines
    const welcomeLines = [
      "🌟 Welcome aboard! Enjoy your stay!",
      "🔥 New member detected! Let's gooo!",
      "🎉 Party just got bigger!",
      "💎 A new legend joined the squad!",
      "🚀 Fasten your seatbelt, fun ahead!",
      "😎 Welcome to the coolest group!"
    ];

    for (const member of newMembers) {
      let profilePicUrl;

      try {
        profilePicUrl = await api.profilePictureUrl(member, 'image');
      } catch {
        profilePicUrl = null;
      }

      const username = `@${member.split('@')[0]}`;
      const randomLine = welcomeLines[Math.floor(Math.random() * welcomeLines.length)];

      // 💎 Premium UI Message
      const welcomeMessage = `
💎 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗧𝗛𝗘 𝗚𝗥𝗢𝗨𝗣

╭───────────────╮
│ 👋 Hello ${username}
│ 🎉 ${randomLine}
│ 🏷️ Group: ${groupName}
╰───────────────╯

╭───────────────╮
│ 👥 Members: ${totalMembers}
│ 📢 Be respectful
│ ⚡ Stay active
│ 🎯 Enjoy your time!
╰───────────────╯

✨ 𝗘𝗻𝗷𝗼𝘆 & 𝗵𝗮𝘃𝗲 𝗳𝘂𝗻 🚀
`;

      // 📸 Send with profile pic (if available)
      if (profilePicUrl) {
        await api.sendMessage(event.id, {
          image: { url: profilePicUrl },
          caption: welcomeMessage,
          mentions: [member]
        });
      } else {
        await api.sendMessage(event.id, {
          text: welcomeMessage,
          mentions: [member]
        });
      }
    }
  }
};
