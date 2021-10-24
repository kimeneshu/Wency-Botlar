module.exports = class {
  constructor (client) {
    this.client = client;
  }

  async run (error) {
    this.client.logger.log(`Discord.js tarafından bir hata oluştu: \n${JSON.stringify(error)}`, "error");
  }
};
