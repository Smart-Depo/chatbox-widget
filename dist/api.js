var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// components/api.ts
var api_exports = {};
__export(api_exports, {
  default: () => createChatBoxAPI
});
module.exports = __toCommonJS(api_exports);
var import_redis = require("@upstash/redis");
function createChatBoxAPI(options) {
  const redis = import_redis.Redis.fromEnv();
  return async function(req, res) {
    const method = req.method;
    const api = req.query.chatbox[0];
    const chatId = req.query.chatbox[1];
    const host = `https://smartdepo.chat`;
    try {
      if (!chatId)
        throw new Error("Missing chatId");
      switch (api) {
        case "chat":
          switch (method) {
            case "GET":
              const chatData = await redis.lrange(chatId, 0, 2 ** 32 - 1);
              return res.status(200).json({ chatData });
            case "POST":
              const chatText = req.body.text;
              const response = await redis.rpush(chatId, chatText);
              return res.status(200).json({ response });
            default:
              throw new Error("Method not allowed");
          }
        case "slack-email":
          if (method !== "POST")
            throw new Error("Method not allowed");
          const slackEmail = req.body.email;
          if (!slackEmail)
            throw new Error("Missing email");
          const notifyEmailText = `A user left their email address ${slackEmail} with chat id: ${host}/chat/${chatId}`;
          const requestsEmail = options.webhooks.map(async (webhook) => {
            return fetch(webhook, {
              method: "POST",
              body: JSON.stringify({ text: notifyEmailText }),
              headers: {
                "Content-Type": "application/json"
              }
            });
          });
          await Promise.all(requestsEmail);
          return res.status(200).json({ response: "ok" });
        case "slack":
          if (method !== "POST")
            throw new Error("Method not allowed");
          let notifyText = `New chat with id: ${host}/chat/${chatId}`;
          if (req.body) {
            notifyText = `Old chat with id: ${host}/chat/${chatId} has a new message!`;
          }
          const requestsNotify = options.webhooks.map(async (webhook) => {
            return fetch(webhook, {
              method: "POST",
              body: JSON.stringify({ text: notifyText }),
              headers: {
                "Content-Type": "application/json"
              }
            });
          });
          await Promise.all(requestsNotify);
          return res.status(200).json({ response: "ok" });
        default:
          throw new Error("Method not allowed");
      }
    } catch (err) {
      let message = err;
      console.log(err);
      if (err instanceof TypeError) {
        message = err.message;
      }
      return res.status(500).json({ message });
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
