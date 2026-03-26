const os = require('os');

module.exports = {
  config: {
    name: 'info',
    aliases: ['about', 'admininfo', 'serverinfo'],
    permission: 0,
    prefix: 'both',
    categorie: 'Utilities',
    credit: 'Developed by Mohammad Nayan',
    usages: [`${global.config.PREFIX}info - Show admin and server information.`],
  },
  start: async ({ event, api, message }) => {
    try {
      const uptimeSeconds = process.uptime();
      const uptime = new Date(uptimeSeconds * 1000).toISOString().substr(11, 8);

      const adminListText =
        global.config.admin.length > 0
          ? global.config.admin
              .map((id, i) => `${i + 1}. @${id.split('@')[0]}`)
              .join('\n')
          : 'No admins found.';

      const infoMessage = `
--------------------------------------------
𝐍𝐚𝐦𝐞           : 𝐗𝐚𝐡𝐢𝐝 𝐏𝐫𝐢𝐦𝐞
𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤       : 𝐗𝐚𝐡𝐢𝐝 𝐏𝐫𝐢𝐦𝐞
𝐑𝐞𝐥𝐢𝐠𝐢𝐨𝐧       : 𝐈𝐬𝐥𝐚𝐦
𝐏𝐞𝐫𝐦𝐚𝐧𝐞𝐧𝐭 𝐀𝐝𝐝𝐫𝐞𝐬𝐬: 𝐂𝐨𝐦𝐢𝐥𝐥𝐚, 𝐂𝐡𝐚𝐭𝐭𝐚𝐠𝐫𝐚𝐦
𝐂𝐮𝐫𝐫𝐞𝐧𝐭 𝐀𝐝𝐝𝐫𝐞𝐬𝐬 : 𝐇𝐨𝐦𝐧𝐚, 𝐂𝐨𝐦𝐢𝐥𝐥𝐚 
𝐆𝐞𝐧𝐝𝐞𝐫       : 𝐌𝐚𝐥𝐞
𝐀𝐠𝐞           : 𝟏𝟕+
𝐑𝐞𝐥𝐚𝐭𝐢𝐨𝐧𝐬𝐡𝐢𝐩 : 𝐒𝐢𝐧𝐠𝐥𝐞
𝐖𝐨𝐫𝐤         : 𝐁𝐮𝐬𝐢𝐧𝐞𝐬𝐬𝐦𝐚𝐧
--------------------------------------------
\`\`\`
🖥️ Server Info:
• Platform       : ${os.platform()}
• CPU            : ${os.cpus()[0].model}
• Node.js Version: ${process.version}
• Uptime         : ${uptime}
• Total Memory   : ${(os.totalmem() / (1024 ** 3)).toFixed(2)} GB
• Free Memory    : ${(os.freemem() / (1024 ** 3)).toFixed(2)} GB
\`\`\``;

      await api.sendMessage(
            event.threadId,
            { image: { url: "https://i.postimg.cc/2y9bTqv6/retouch-2025071913433217.jpg" }, caption: infoMessage || '' },
            { quoted: event.message }
          );;
    } catch (error) {
      console.error(error);
      await api.sendMessage(event.threadId, '❌ An error occurred while fetching info.', { quoted: event.message });
    }
  },
};
