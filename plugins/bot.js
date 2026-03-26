const axios = require("axios");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// typing feel
async function sendTyping(api, threadId, text, quoted) {
  await sleep(800 + Math.random() * 1200); // human delay
  return api.sendMessage(threadId, { text }, { quoted });
}

// mood system
function getMoodReply(reply) {
  const moods = [
    reply,
    `${reply} 🙂`,
    `${reply}...`,
    `Hmm 🤔 ${reply}`,
    `${reply} 😌`,
    `${reply} btw 😏`,
  ];
  return moods[Math.floor(Math.random() * moods.length)];
}

module.exports = {
  config: {
    name: "bot",
    aliases: ["sim"],
    permission: 0,
    prefix: "both",
    categorie: "AI Chat",
    cooldowns: 5,
    credit: "Upgraded by ChatGPT",
    description: "Smart human-like AI bot",
  },

  start: async function ({ api, event, args }) {
    const { threadId, message, senderId } = event;
    const usermsg = args.join(" ");

    // greeting
    if (!usermsg) {
      const greetings = [
        "কি খবর 🙂",
        "ডাকছিলা? আমি আছি তো 😌",
        "বল কি লাগবে",
        "হুম শুনতেছি 👀",
        "আবার ডাকছো কেন 😏",
        "কি ব্যাপার, মনে পড়ছে নাকি 😌"
      ];

      const msg = `@${senderId.split("@")[0]} ${greetings[Math.floor(Math.random() * greetings.length)]}`;

      const sent = await sendTyping(api, threadId, msg, message);

      global.client.handleReply.push({
        name: this.config.name,
        author: senderId,
        messageID: sent.key.id,
        type: "chat"
      });
      return;
    }

    try {
      const apis = await axios.get("https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/main/api.json");
      const apiss = apis.data.api;

      const res = await axios.get(
        `${apiss}/sim?type=ask&ask=${encodeURIComponent(usermsg)}`
      );

      let reply = res.data.data?.msg || "বুঝলাম না 😅";

      // human style modify
      reply = getMoodReply(reply);

      const sent = await sendTyping(api, threadId, reply, message);

      global.client.handleReply.push({
        name: this.config.name,
        author: senderId,
        messageID: sent.key.id,
        type: "chat"
      });

    } catch (err) {
      return sendTyping(api, threadId, "আজকে একটু mood নাই 😴 পরে কথা বলি", message);
    }
  },

  handleReply: async function ({ api, event }) {
    const { threadId, message, body, senderId } = event;

    try {
      const apis = await axios.get("https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/main/api.json");
      const apiss = apis.data.api;

      const res = await axios.get(
        `${apiss}/sim?type=ask&ask=${encodeURIComponent(body)}`
      );

      let reply = res.data.data?.msg || "হুম বুঝতেছি 😅";

      reply = getMoodReply(reply);

      const sent = await sendTyping(api, threadId, reply, message);

      global.client.handleReply.push({
        name: "bot",
        author: senderId,
        messageID: sent.key.id,
        type: "chat"
      });

    } catch (err) {
      return sendTyping(api, threadId, "এইটা মাথায় ঢুকলো না 😵", message);
    }
  }
};
