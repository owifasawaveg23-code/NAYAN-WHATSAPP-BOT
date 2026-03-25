const os = require("os");

module.exports = {
  config: {
    name: 'ping',
    aliases: ['p'],
    permission: 0,
    prefix: 'both',
    categories: 'system',
    description: 'Premium bot status checker',
    usages: ['ping'],
    credit: 'Premium Version by ChatGPT'
  },

  start: async ({ event, api }) => {
    const { threadId } = event;

    const start = Date.now();

    const loadingMsg = await api.sendMessage(threadId, {
      text: "⏳ 𝗖𝗵𝗲𝗰𝗸𝗶𝗻𝗴 𝗦𝘆𝘀𝘁𝗲𝗺..."
    });

    const latency = Date.now() - start;

    // Uptime
    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s = Math.floor(uptime % 60);

    // RAM Info
    const totalMem = (os.totalmem() / 1024 / 1024).toFixed(0);
    const freeMem = (os.freemem() / 1024 / 1024).toFixed(0);
    const usedMem = totalMem - freeMem;

    // CPU Info
    const cpu = os.cpus()[0].model;

    // Speed indicator
    let speedStatus = "🟢 Fast";
    if (latency > 300) speedStatus = "🟡 Normal";
    if (latency > 800) speedStatus = "🔴 Slow";

    // Random header
    const headers = [
      "🏓 𝗣𝗥𝗘𝗠𝗜𝗨𝗠 𝗣𝗢𝗡𝗚",
      "⚡ 𝗕𝗢𝗧 𝗣𝗘𝗥𝗙𝗢𝗥𝗠𝗔𝗡𝗖𝗘",
      "🚀 𝗦𝗬𝗦𝗧𝗘𝗠 𝗦𝗧𝗔𝗧𝗨𝗦",
      "💎 𝗔𝗗𝗩𝗔𝗡𝗖𝗘𝗗 𝗣𝗜𝗡𝗚"
    ];

    const title = headers[Math.floor(Math.random() * headers.length)];

    const text = `
${title}

╭───────────────╮
│ 🤖 Bot Status : Online
│ ⚡ Latency   : ${latency} ms
│ 📶 Speed     : ${speedStatus}
│ ⏱️ Uptime    : ${h}h ${m}m ${s}s
╰───────────────╯

╭───────────────╮
│ 🧠 CPU       : ${cpu}
│ 💾 RAM Used  : ${usedMem} MB
│ 📦 Total RAM : ${totalMem} MB
╰───────────────╯

✨ 𝗔𝗹𝗹 𝘀𝘆𝘀𝘁𝗲𝗺𝘀 𝗿𝘂𝗻𝗻𝗶𝗻𝗴 𝗽𝗲𝗿𝗳𝗲𝗰𝘁𝗹𝘆 🚀
`;

    await api.sendMessage(threadId, { text });
  },
};
