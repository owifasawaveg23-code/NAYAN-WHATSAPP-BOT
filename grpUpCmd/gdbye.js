module.exports = {
  event: 'remove',
  handle: async ({ api, event }) => {
    const removedMembers = event.participants;

    for (const member of removedMembers) {
      const username = `@${member.split('@')[0]}`;

      const funnyGoodbyes = [
        `🤣 Oh no! ${username} চলে গেল! এখন group এর মজা কোথায়?`,
        `😱 হায়রে! ${username}, তুমি কি আমাদের 😭 ছেড়ে চলে গেলে?`,
        `😂 আরে হে ${username}, group আজ থেকে half-boring হয়ে গেল!`,
        `😏 ${username} চলে গেলে কেউ আর meme post করবে না! RIP 😜`,
        `🔥 সাবধান! ${username} চলে গেছে, এখন drama শুরু!`,
        `🥲 Group আজ traurig 😢, ${username} ছাড়া সব silent!`,
        `🤣 Bye bye ${username}! আশা করি অন্য group এও chaos spread করবে!`,
        `🤪 Oh no! ${username} gone, এখন সবাই suspense mode এ!`,
        `😎 ${username}, তুমি চলে গেলেও আমরা তোমাকে miss করবো forever!`,
        `💔 ${username}, তুমি চলে গেলে group আজ heartbreak experience করছে!`,
        `😂 😹 Group party আজ canceled! ধন্যবাদ ${username}!`,
        `🥳 Wait! ${username}, তুমি চলে গেলে cake কে খাবে? 🎂`,
        `😜 Oh no! ${username}, এবার group chat ghost mode এ! 👻`,
        `🔥 অররে ${username}, তুমি চলে গেলে group energy zero! ⚡`,
        `💀 RIP memes 😭, ${username} gone forever!`
      ];

      const line = funnyGoodbyes[Math.floor(Math.random() * funnyGoodbyes.length)];

      await api.sendMessage(event.id, {
        text: line,
        mentions: [member]
      });
    }
  }
};
