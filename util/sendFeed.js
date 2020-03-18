module.exports = async (channel) => {
  setTimeout(function () {
    channel.send("feed");
  }, 5000);
};