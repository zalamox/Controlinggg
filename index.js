const Discord = require("discord.js-selfasta");
require("./reply");
const fetchAll = require('discord-fetch-all');
const puppeteer = require("puppeteer");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
var FormData = require('form-data');
let fs = require('fs');
//let config = require("config");
const keep_alive = require("./keep_alive.js");

process.on("unhandledRejection", error => {
  return;
});
process.on("unhandledRejection", error => {
  return;
});
 process.on("unhandledRejection", error => {
  return;
});

 process.on("unhandledRejection", error => {
  return console.log(error)
});
const tokens = process.env.tokens.split("*");
tokens.forEach(token=>{
  const client = new Discord.Client({
    allowedMentions: {
        repliedUser: true
    }
});
  client.on("ready",()=>{
    console.log(client.user.username);
    client.user.setActivity("Hello There ", {type:"CUSTOM_STATUS"});
      fs.readFile('config.json', (err, data) => {
    if (err) throw err;
    let config = JSON.parse(data);
        if(config.voiceChannel){
          let channel = client.channels.cache.get(config.voiceChannel);
          if(!channel)return;
          channel.join().catch(err=> console.log("Error To Join This Channel"))
        }
      })
    })
client.on("message",async message=>{
  fs.readFile('config.json', (err, data) => {
    if (err) throw err;
    let config = JSON.parse(data);
  if(config.devs.some(id => message.author.id == id)){
    if(message.content.split(" ")[0] == config.prefix+"help"){

      message.channel.send(`
قائـــمة المساعدة الخاصة بالسيلف بوت 

    ${config.prefix}addReply <الرسالة>|<الرد \`إفصل بين الرسالة والرد بالرمز |\`
    ${config.prefix}deleteReply <الرسالة الخاصة بالرد>
    ${config.prefix}reply-list
    ${config.prefix}set-mention-reply
    ${config.prefix}set-voice-channel
    ${config.prefix}add-giveaway-bot
    ${config.prefix}set-log-channel
    ${config.prefix}set-reaction-timeout

`);
    }else if(message.content.split(" ")[0] == config.prefix+"addReply"){
let content = message.content.split(" ").slice(1).join(" ");
      let msg = content.split("|")[0];
      let reply = content.split("|")[1];
      if(!msg || !reply)return message.channel.send("في شي خطا");
      config.autoReply[msg] = reply;
      let data = JSON.stringify(config, null, 2);
      fs.writeFileSync('config.json', data);
      message.channel.send(`
تم إضافة الرسالة : "${msg}"
الرد : "${reply}"`);
    }
    else if(message.content.split(" ")[0] == config.prefix+"reply-list"){
let reply = Object.keys(config.autoReply).map(key=> `\n\n${key}\n${config.autoReply[key]}`).join("");
      message.channel.send(`
${reply}
`);
    }else if(message.content.split(" ")[0] == config.prefix+"deleteReply"){
let content = message.content.split(" ").slice(1).join(" ");
      let msg = content;
      if(!msg)return message.channel.send("في شي خطا");
      delete config.autoReply[msg];
      let data = JSON.stringify(config, null, 2);
      fs.writeFileSync('config.json', data);
      message.channel.send(`
تم إزالة الرسالة : "${msg}"`);
    }else if(message.content.split(" ")[0] == config.prefix+"set-mention-reply"){
      let content = message.content.split(" ").slice(1).join(" ");
      let msg = content.split("|")[0];
      if(msg == "") msg = false;
      config.mentionReply= msg;
      let data = JSON.stringify(config, null, 2);
      fs.writeFileSync('config.json', data);
      message.channel.send(`
       رد المنشن الان هو :  ${msg}
`);
    }else if(message.content.split(" ")[0] == config.prefix+"set-voice-channel"){
      //console.log(message.mentions.channels.size);
      let content = message.mentions.channels;
      if(content.size == 0) return message.channel.send("في شي خطا");
      content = content.first();
      console.log(content);
      if(content.type != "voice")return message.channel.send("في شي خطا");
      content.join().catch(err=> console.log("Error To Join Server"))
      let msg = content.id;
      config.voiceChannel= msg;
      let data = JSON.stringify(config, null, 2);
      fs.writeFileSync('config.json', data);
      message.channel.send(`
       ${content}
`);
    }else if(message.content.split(" ")[0] == config.prefix+"set-log-channel"){
      //console.log(message.mentions.channels.size);
      let content = message.mentions.channels;
      if(content.size == 0) return message.channel.send("في شي خطا");
      content = content.first();
      console.log(content);
      if(content.type == "voice")return message.channel.send("في شي خطا");
      let msg = content.id;
      config.autoReaction.logChannel = msg;
      let data = JSON.stringify(config, null, 2);
      fs.writeFileSync('config.json', data);
      message.channel.send(`
       Log Channel : ${content}
`);
    }else if(message.content.split(" ")[0] == config.prefix+"add-giveaway-bot"){
      //console.log(message.mentions.channels.size);
      let content = message.mentions.users;
      if(content.size == 0) return message.channel.send("في شي خطا");
      content = content.first();
      console.log(content);
      let msg = content.id;
      config.autoReaction.giveawayBots.push(msg);
      let data = JSON.stringify(config, null, 2);
      fs.writeFileSync('config.json', data);
      message.channel.send(`
       <@${content.id}> Now Giveaway Bot
`);
    }else if(message.content.split(" ")[0] == config.prefix+"set-reaction-timeout"){
      //console.log(message.mentions.channels.size);
      let content = message.content.split(" ").slice(1).join("");
      if(isNaN(content))return message.channel.send("في شي خطا");
      
      config.autoReaction.reactionTimeout= content;
      let data = JSON.stringify(config, null, 2);
      fs.writeFileSync('config.json', data);
      message.channel.send(`
       Timeout ${content}Seconds Now.
`);
    }
  }
  })
})
  client.on("message",async message=>{
    if(message.author.id == client.user.id)return;
      fs.readFile('config.json', (err, data) => {
    if (err) throw err;
    let config = JSON.parse(data);
if(Object.keys(config.autoReply).some(key => message.content == key)){
  setTimeout(()=>{
      message.inlineReply(config.autoReply[message.content]);
  },Math.floor(Math.random() * 10000));

}
        if(message.content.includes(`<@${client.user.id}>`) || message.content.includes(`<@!${client.user.id}>`)){
          if(!config.mentionReply)return;
            setTimeout(()=>{
      message.inlineReply(config.mentionReply);
  },Math.floor(Math.random() * 10000));
        }
      })
  })
client.on('messageReactionAdd', (reaction, user) =>{
 // reaction.message.react(reaction.emoji)
        fs.readFile('config.json', (err, data) => {
    if (err) throw err;
    let config = JSON.parse(data);
  if(config.autoReaction.giveawayBots.some(botId => user.id == botId)){
    setTimeout(()=>{
      reaction.message.react(reaction.emoji);
      if(config.autoReaction.logChannel && config.autoReaction.logChannel != ""){
      let channel = client.channels.cache.get(config.autoReaction.logChannel);
        if(!channel)return;
        
channel.send({content : `Giveaway Entered Link To : \n https://discord.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id}`});
      }
    },config.autoReaction.reactionTimeout*1000)
  }
        })
  })

  client.login(token);
})