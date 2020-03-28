module.exports = {
  name: "feed",
  description: "Magic.",
  async execute (client, message, args) { // eslint-disable-line no-unused-vars
    if (!["275831434772742144", "367302593753645057"].includes(message.author.id)) return message.author.send("Developer-restricted beta feature.");
    // Code goes here, obviousuly.  
  }
};