var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// components/admin/index.tsx
var admin_exports = {};
__export(admin_exports, {
  default: () => ChatBoxAdminRoot
});
module.exports = __toCommonJS(admin_exports);
var import_react6 = __toESM(require("react"));
var import_router = require("next/router");

// components/admin/store.tsx
var import_react = __toESM(require("react"));
var defaultState = {};
var ChatBoxContext = (0, import_react.createContext)(defaultState);
function ChatBoxProvider({
  children,
  id
}) {
  const [isChatTrigger, setIsChatTrigger] = (0, import_react.useState)(performance.now());
  const [chat, setChat] = (0, import_react.useState)([]);
  const [message, setMessage] = (0, import_react.useState)("");
  async function fetchList() {
    const response = await fetch(`/api/chatbox/chat/${id}`, { method: "GET" });
    const data = await response.json();
    setChat(data.chatData);
  }
  const onSendMessage = async () => {
    let replyText = "o:" + message;
    await fetch(`/api/chatbox/chat/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: replyText })
    });
    await fetchList();
    setIsChatTrigger(performance.now());
    setMessage("");
  };
  (0, import_react.useEffect)(() => {
    if (!id)
      return;
    fetchList();
    setTimeout(() => {
      setIsChatTrigger(performance.now());
    }, 100);
    const interval = setInterval(() => {
      fetchList();
    }, 3e3);
    return () => clearInterval(interval);
  }, [id]);
  return /* @__PURE__ */ import_react.default.createElement(ChatBoxContext.Provider, {
    value: {
      id,
      isChatTrigger,
      chat,
      message,
      setMessage,
      onSendMessage
    }
  }, children);
}
var store_default = ChatBoxContext;

// components/shared/chat.tsx
var import_react4 = __toESM(require("react"));

// components/widget/components/email.tsx
var import_react3 = __toESM(require("react"));

// components/widget/store.tsx
var import_react2 = __toESM(require("react"));
var import_nanoid = require("nanoid");
var defaultState2 = {
  showOnInitial: false
};
var ChatBoxContext2 = (0, import_react2.createContext)(defaultState2);
var store_default2 = ChatBoxContext2;

// components/widget/components/email.tsx
function Email() {
  const { isEmailSent, email, setEmail, onSendEmail } = (0, import_react3.useContext)(store_default2);
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

// components/shared/form.tsx
var import_react5 = __toESM(require("react"));
var import_react_textarea_autosize = __toESM(require("react-textarea-autosize"));
function Form({
  message,
  setMessage,
  onSendMessage
}) {
  return /* @__PURE__ */ import_react5.default.createElement("form", {
    className: "chatbox-form",
    onSubmit: (e) => {
      e.preventDefault();
      onSendMessage();
    }
  }, /* @__PURE__ */ import_react5.default.createElement(import_react_textarea_autosize.default, {
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
  }), /* @__PURE__ */ import_react5.default.createElement("div", null, /* @__PURE__ */ import_react5.default.createElement("button", {
    type: "submit",
    className: "chatbox-form-submit"
  }, /* @__PURE__ */ import_react5.default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    strokeWidth: "1.5",
    stroke: "#666",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /* @__PURE__ */ import_react5.default.createElement("path", {
    stroke: "none",
    d: "M0 0h24v24H0z",
    fill: "none"
  }), /* @__PURE__ */ import_react5.default.createElement("line", {
    x1: "10",
    y1: "14",
    x2: "21",
    y2: "3"
  }), /* @__PURE__ */ import_react5.default.createElement("path", {
    d: "M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5"
  })))));
}

// components/admin/index.tsx
function ChatBoxAdmin() {
  const { id, isChatTrigger, chat, message, setMessage, onSendMessage } = (0, import_react6.useContext)(store_default);
  return /* @__PURE__ */ import_react6.default.createElement("div", {
    className: "chatbox"
  }, /* @__PURE__ */ import_react6.default.createElement("div", {
    className: "chatbox-admin-root"
  }, /* @__PURE__ */ import_react6.default.createElement("div", {
    className: "chatbox-admin-grid"
  }, /* @__PURE__ */ import_react6.default.createElement("header", {
    className: "chatbox-admin-header"
  }, /* @__PURE__ */ import_react6.default.createElement("h1", null, "Hi, chat id: ", id, ":")), /* @__PURE__ */ import_react6.default.createElement(Chat, {
    chat,
    isChatTrigger
  }), /* @__PURE__ */ import_react6.default.createElement(Form, {
    message,
    setMessage,
    onSendMessage
  }))));
}
function ChatBoxAdminRoot(props) {
  const router = (0, import_router.useRouter)();
  const { id } = router.query;
  return /* @__PURE__ */ import_react6.default.createElement(ChatBoxProvider, {
    id
  }, /* @__PURE__ */ import_react6.default.createElement(ChatBoxAdmin, null));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
