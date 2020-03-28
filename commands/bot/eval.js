module.exports = {
  name: "eval",
  description: "?",
  async execute (client, message, args) { // eslint-disable-line no-unused-vars
    if (!["275831434772742144", "367302593753645057"].includes(message.author.id)) return;
    const code = args.join(" ");
    try {
      const evaluat = async (c) => eval(c);
      const evaled = await evaluat(code);
      const clean = await safe(client, evaled);

      const MAX_CHARS = 3 + 2 + clean.length + 3;
      if (MAX_CHARS > 1800) {
        return message.channel.send("Snap, the output has exceeded 1800 charachters in length. Sending it as file...", { files: [{ attachment: Buffer.from(clean), name: "eval.txt" }] });
      }

      message.channel.send(`📥 Input:\`\`\`js\n${code}\n\`\`\`\n📤 Output:\`\`\`js\n${clean}\n\`\`\``);
    } catch (err) {
      message.channel.send(`📥 Input:\`\`\`js\n${code}\n\`\`\`\n📤 Output:\`\`\`xl\n${err}\n\`\`\``);
    }
  }
};

async function safe (client, text) {
  if (text && text.constructor.name == "Promise") text = await text;
  if (typeof evaled !== "string") text = require("util").inspect(text, {depth: 0});

  text = text.replace(/`/g, "`" + String.fromCharCode(8203))
    .replace(/@/g, "@" + String.fromCharCode(8203))
    .replace(client.token, null);

  return text;
}
