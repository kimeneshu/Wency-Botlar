  
const moment = require("moment")
const Discord = require("discord.js")
moment.locale("tr")


const streamDenetleme = require('../models/streamDB.js')


const ms = require('ms')
module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(member, voiceChannel) {
    streamDenetleme.findOne({
        user: member.id
    }, async (err, res) => {
        if (!res) {
            const data = new streamDenetleme({
                user: member.id,
                baslangic: Date.now(),
            channelName: voiceChannel.name,
            channelID: voiceChannel.id
            })
           if(voiceChannel.parentID == this.client.config.channels.streamParentID){
            data.save().catch(e => console.log(e))
           }
        }
    })
  }
};