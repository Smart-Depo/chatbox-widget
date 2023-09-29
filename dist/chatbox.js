var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// components/widget/index.tsx
var widget_exports = {};
__export(widget_exports, {
  default: () => ChatBox
});
module.exports = __toCommonJS(widget_exports);
var import_react10 = __toESM(require("react"));

// components/widget/components/modal.tsx
var import_react6 = __toESM(require("react"));

// components/widget/store.tsx
var import_react = __toESM(require("react"));
var import_nanoid = require("nanoid");
function getWithExpiry(key) {
  const itemStr = localStorage.getItem(key);
  if (!itemStr)
    return null;
  const item = JSON.parse(itemStr);
  const now = new Date();
  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    window.location.reload();
    return null;
  }
  return item.value;
}
function setWithExpiry(key, value, ttl = 24 * 60 * 60 * 1e3) {
  const now = new Date();
  const item = {
    value,
    expiry: now.getTime() + ttl
  };
  localStorage.setItem(key, JSON.stringify(item));
}
var defaultState = {
  showOnInitial: false
};
var ChatBoxContext = (0, import_react.createContext)(defaultState);
function ChatBoxProvider({
  themeColor,
  textColor,
  autoMessage,
  title,
  description,
  showOnInitial,
  children
}) {
  let initialID = "visitor";
  const localID = getWithExpiry("chatbox_id");
  const [UID, setUID] = (0, import_react.useState)(localID ? localID : initialID);
  const [chatInitiated, setChatInitiated] = (0, import_react.useState)(localID ? true : false);
  const [isEmailSent, setIsEmailSent] = (0, import_react.useState)(getWithExpiry("emailSent"));
  const [hasBeen5Minutes, setHasBeen5Minutes] = (0, import_react.useState)(getWithExpiry("hasBeen5Minutes"));
  const [isChatTrigger, setIsChatTrigger] = (0, import_react.useState)(performance.now());
  const [chat, setChat] = (0, import_react.useState)([]);
  const [message, setMessage] = (0, import_react.useState)("");
  const [email, setEmail] = (0, import_react.useState)("");
  const [isModalShow, setIsModalShow] = (0, import_react.useState)(showOnInitial);
  async function fetchList(id = UID) {
    const response = await fetch(`/api/chatbox/chat/${id}`, { method: "GET" });
    const data = await response.json();
    setChat(data.chatData);
  }
  const onSendMessage = async () => {
    try {
      let id = UID;
      let chatInitiatedTemp = chatInitiated;
      if (!chatInitiated) {
        id = (0, import_nanoid.nanoid)(10);
        const initResponse = await fetch(`/api/chatbox/slack/${id}`, {
          method: "POST"
        });
        setWithExpiry("chatbox_id", id);
        if (initResponse.status !== 200) {
          localStorage.removeItem("chatbox_id");
          localStorage.removeItem("hasBeen5Minutes");
          localStorage.removeItem("emailSent");
          throw new Error("Failed to init chat");
        }
        setChatInitiated(true);
        setUID(id);
      }
      const hasBeen5Minutes2 = getWithExpiry("hasBeen5Minutes");
      setWithExpiry("hasBeen5Minutes", "false", 5 * 60 * 1e3);
      setHasBeen5Minutes(false);
      if (!hasBeen5Minutes2 && chatInitiatedTemp) {
        const initResponse = await fetch(`/api/chatbox/slack/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ reminder: "Reminder" })
        });
        if (initResponse.status !== 200) {
          localStorage.removeItem("hasBeen5Minutes");
          setHasBeen5Minutes(true);
          throw new Error("Failed to post reminder.");
        }
      }
      let replyText = "i:" + message;
      const replyResponse = await fetch(`/api/chatbox/chat/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: replyText })
      });
      if (replyResponse.status !== 200) {
        throw new Error("Failed to reply");
      }
      await fetchList(id);
      setIsChatTrigger(performance.now());
      setMessage("");
    } catch (err) {
      alert(err);
    }
  };
  const onSendEmail = async () => {
    try {
      if (isEmailSent)
        return;
      let id = UID;
      if (!chatInitiated) {
        id = (0, import_nanoid.nanoid)(10);
        setWithExpiry("chatbox_id", id);
        setWithExpiry("hasBeen5Minutes", "false", 5 * 60 * 1e3);
        setUID(id);
      }
      const response = await fetch(`/api/chatbox/slack-email/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });
      if (response.status !== 200) {
        throw new Error("Failed to send email address");
      }
      setWithExpiry("emailSent", "true");
      setIsEmailSent(true);
    } catch (err) {
      alert(err);
    }
  };
  const onModalShow = (status) => {
    setIsModalShow(status);
    if (status)
      setIsChatTrigger(performance.now());
  };
  (0, import_react.useEffect)(() => {
    if (!chatInitiated || !isModalShow)
      return;
    fetchList();
    const interval = setInterval(() => {
      fetchList();
    }, 3e3);
    return () => clearInterval(interval);
  }, [chatInitiated, isModalShow, UID, hasBeen5Minutes]);
  return /* @__PURE__ */ import_react.default.createElement(ChatBoxContext.Provider, {
    value: {
      themeColor,
      textColor,
      autoMessage,
      title,
      description,
      showOnInitial,
      isModalShow,
      onModalShow,
      isChatTrigger,
      chat,
      message,
      setMessage,
      onSendMessage,
      isEmailSent,
      email,
      setEmail,
      onSendEmail
    }
  }, children);
}
var store_default = ChatBoxContext;

// components/shared/form.tsx
var import_react2 = __toESM(require("react"));
var import_react_textarea_autosize = __toESM(require("react-textarea-autosize"));
function Form({
  message,
  setMessage,
  onSendMessage
}) {
  return /* @__PURE__ */ import_react2.default.createElement("form", {
    className: "chatbox-form",
    onSubmit: (e) => {
      e.preventDefault();
      onSendMessage();
    }
  }, /* @__PURE__ */ import_react2.default.createElement(import_react_textarea_autosize.default, {
    autoFocus: true,
    required: true,
    name: "message",
    placeholder: "Write a message...",
    className: "chatbox-form-message",
    maxRows: 5,
    value: message,
    onChange: (event) => {
      setMessage(event.target.value.split("\n").filter((v) => v).join(" "));
    },
    onKeyUp: (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        onSendMessage();
      }
    }
  }), /* @__PURE__ */ import_react2.default.createElement("div", null, /* @__PURE__ */ import_react2.default.createElement("button", {
    type: "submit",
    className: "chatbox-form-submit"
  }, /* @__PURE__ */ import_react2.default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    strokeWidth: "1.5",
    stroke: "#666",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /* @__PURE__ */ import_react2.default.createElement("path", {
    stroke: "none",
    d: "M0 0h24v24H0z",
    fill: "none"
  }), /* @__PURE__ */ import_react2.default.createElement("line", {
    x1: "10",
    y1: "14",
    x2: "21",
    y2: "3"
  }), /* @__PURE__ */ import_react2.default.createElement("path", {
    d: "M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5"
  })))));
}

// components/shared/chat.tsx
var import_react4 = __toESM(require("react"));

// components/widget/components/email.tsx
var import_react3 = __toESM(require("react"));
function Email() {
  const { isEmailSent, email, setEmail, onSendEmail } = (0, import_react3.useContext)(store_default);
  if (isEmailSent)
    return /* @__PURE__ */ import_react3.default.createElement("div", {
      className: "chatbox-widget-email-form"
    }, "Thank you for your email. We'll be in touch as soon as possible.");
  return /* @__PURE__ */ import_react3.default.createElement("form", {
    className: "chatbox-widget-email-form",
    onSubmit: (event) => {
      event.preventDefault();
      onSendEmail();
    }
  }, /* @__PURE__ */ import_react3.default.createElement("p", null, "Don\u2019t have time to wait for a response? Leave your email and we\u2019ll be in touch as soon as possible."), /* @__PURE__ */ import_react3.default.createElement("input", {
    type: "email",
    placeholder: "Enter email address",
    value: email,
    onChange: (event) => setEmail(event.target.value)
  }));
}

// components/shared/chat.tsx
function Chat({
  isChatTrigger,
  chat,
  emailForm = false
}) {
  const chatContainerRef = (0, import_react4.useRef)(null);
  (0, import_react4.useEffect)(() => {
    if (!chatContainerRef.current)
      return;
    chatContainerRef.current.scrollTo({
      behavior: "smooth",
      top: 99999
    });
  }, [isChatTrigger]);
  function parseString(str) {
    let sender = str.substring(0, 1);
    let message = str.substring(2);
    return [sender, message];
  }
  const Messages = chat.map((item, index) => {
    const parsedStr = parseString(item);
    const isIn = parsedStr[0] === "i";
    const classNames = isIn ? "chatbox-chat-message-in" : "chatbox-chat-message-out";
    const Message = () => /* @__PURE__ */ import_react4.default.createElement("div", {
      className: `chatbox-chat-message ${classNames}`
    }, /* @__PURE__ */ import_react4.default.createElement("span", null, parsedStr[1]));
    if (emailForm && index === 0) {
      return /* @__PURE__ */ import_react4.default.createElement("div", {
        key: 9999
      }, /* @__PURE__ */ import_react4.default.createElement(Message, null), /* @__PURE__ */ import_react4.default.createElement(Email, null));
    }
    return /* @__PURE__ */ import_react4.default.createElement("div", {
      key: index
    }, /* @__PURE__ */ import_react4.default.createElement(Message, null));
  });
  return /* @__PURE__ */ import_react4.default.createElement("div", {
    className: "chatbox-chat",
    ref: chatContainerRef
  }, Messages);
}

// components/widget/components/header.tsx
var import_react5 = __toESM(require("react"));
function Header() {
  const { title, description } = (0, import_react5.useContext)(store_default);
  return /* @__PURE__ */ import_react5.default.createElement("div", {
    className: "chatbox-widget-header"
  }, /* @__PURE__ */ import_react5.default.createElement("h2", null, title ? title : "Hi \u{1F44B}"), /* @__PURE__ */ import_react5.default.createElement("p", null, description ? description : "Ask us anything, or share your feedback."));
}

// components/widget/components/modal.tsx
function Modal() {
  const {
    isModalShow,
    isChatTrigger,
    chat,
    message,
    setMessage,
    onSendMessage,
    onSendEmail
  } = (0, import_react6.useContext)(store_default);
  if (!isModalShow)
    return null;
  return /* @__PURE__ */ import_react6.default.createElement("div", {
    className: "chatbox-widget-modal"
  }, /* @__PURE__ */ import_react6.default.createElement(Header, null), /* @__PURE__ */ import_react6.default.createElement(Chat, {
    chat,
    emailForm: true,
    isChatTrigger
  }), /* @__PURE__ */ import_react6.default.createElement(Form, {
    message,
    setMessage,
    onSendMessage
  }));
}

// components/widget/components/trigger-button.tsx
var import_react9 = __toESM(require("react"));

// components/widget/components/icon-default.tsx
var import_react7 = __toESM(require("react"));
function IconDefault(_a) {
  var _b = _a, { size = 30 } = _b, props = __objRest(_b, ["size"]);
  return /* @__PURE__ */ import_react7.default.createElement("svg", __spreadValues({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    stroke: "var(--color-text)",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    viewBox: "0 0 24 24",
    width: size,
    height: size
  }, props), /* @__PURE__ */ import_react7.default.createElement("path", {
    stroke: "none",
    d: "M0 0h24v24H0z",
    fill: "none"
  }), /* @__PURE__ */ import_react7.default.createElement("path", {
    d: "M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1"
  }), /* @__PURE__ */ import_react7.default.createElement("line", {
    x1: "12",
    y1: "12",
    x2: "12",
    y2: "12.01"
  }), /* @__PURE__ */ import_react7.default.createElement("line", {
    x1: "8",
    y1: "12",
    x2: "8",
    y2: "12.01"
  }), /* @__PURE__ */ import_react7.default.createElement("line", {
    x1: "16",
    y1: "12",
    x2: "16",
    y2: "12.01"
  }));
}

// components/widget/components/icon-close.tsx
var import_react8 = __toESM(require("react"));
function IconClose(_a) {
  var _b = _a, { size = 30 } = _b, props = __objRest(_b, ["size"]);
  return /* @__PURE__ */ import_react8.default.createElement("svg", __spreadValues({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    stroke: "var(--color-text)",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    viewBox: "0 0 24 24",
    width: size,
    height: size
  }, props), /* @__PURE__ */ import_react8.default.createElement("path", {
    stroke: "none",
    d: "M0 0h24v24H0z",
    fill: "none"
  }), /* @__PURE__ */ import_react8.default.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /* @__PURE__ */ import_react8.default.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  }));
}

// components/widget/components/trigger-button.tsx
function TriggerButton({
  children
}) {
  const { isModalShow, onModalShow } = (0, import_react9.useContext)(store_default);
  return /* @__PURE__ */ import_react9.default.createElement("button", {
    type: "button",
    className: "chatbox-widget-trigger-button",
    onClick: () => {
      onModalShow(!isModalShow);
    }
  }, isModalShow ? /* @__PURE__ */ import_react9.default.createElement(import_react9.default.Fragment, null, /* @__PURE__ */ import_react9.default.createElement(IconClose, {
    size: 30
  })) : /* @__PURE__ */ import_react9.default.createElement(import_react9.default.Fragment, null, children ? children : /* @__PURE__ */ import_react9.default.createElement(IconDefault, null)));
}

// components/widget/index.tsx
function ChatBox({
  themeColor = "#2d00c6",
  textColor = "#fff",
  autoMessage,
  title,
  description,
  showOnInitial = false,
  customIcon
}) {
  return /* @__PURE__ */ import_react10.default.createElement(ChatBoxProvider, {
    themeColor,
    textColor,
    autoMessage,
    title,
    description,
    showOnInitial
  }, /* @__PURE__ */ import_react10.default.createElement("div", {
    className: "chatbox",
    style: {
      "--color-primary": themeColor,
      "--color-text": textColor
    }
  }, /* @__PURE__ */ import_react10.default.createElement("div", {
    className: "chatbox-widget-root"
  }, /* @__PURE__ */ import_react10.default.createElement(TriggerButton, null, customIcon), /* @__PURE__ */ import_react10.default.createElement(Modal, null))));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
