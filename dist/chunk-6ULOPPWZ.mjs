// components/widget/store.tsx
import React, { createContext, useEffect, useState } from "react";
import { nanoid } from "nanoid";
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
var ChatBoxContext = createContext(defaultState);
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
  const [UID, setUID] = useState(localID ? localID : initialID);
  const [chatInitiated, setChatInitiated] = useState(localID ? true : false);
  const [isEmailSent, setIsEmailSent] = useState(getWithExpiry("emailSent"));
  const [hasBeen5Minutes, setHasBeen5Minutes] = useState(getWithExpiry("hasBeen5Minutes"));
  const [isChatTrigger, setIsChatTrigger] = useState(performance.now());
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isModalShow, setIsModalShow] = useState(showOnInitial);
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
        id = nanoid(10);
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
        id = nanoid(10);
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
  useEffect(() => {
    if (!chatInitiated || !isModalShow)
      return;
    fetchList();
    const interval = setInterval(() => {
      fetchList();
    }, 3e3);
    return () => clearInterval(interval);
  }, [chatInitiated, isModalShow, UID, hasBeen5Minutes]);
  return /* @__PURE__ */ React.createElement(ChatBoxContext.Provider, {
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
import React2 from "react";
import TextareaAutosize from "react-textarea-autosize";
function Form({
  message,
  setMessage,
  onSendMessage
}) {
  return /* @__PURE__ */ React2.createElement("form", {
    className: "chatbox-form",
    onSubmit: (e) => {
      e.preventDefault();
      onSendMessage();
    }
  }, /* @__PURE__ */ React2.createElement(TextareaAutosize, {
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
  }), /* @__PURE__ */ React2.createElement("div", null, /* @__PURE__ */ React2.createElement("button", {
    type: "submit",
    className: "chatbox-form-submit"
  }, /* @__PURE__ */ React2.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    strokeWidth: "1.5",
    stroke: "#666",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /* @__PURE__ */ React2.createElement("path", {
    stroke: "none",
    d: "M0 0h24v24H0z",
    fill: "none"
  }), /* @__PURE__ */ React2.createElement("line", {
    x1: "10",
    y1: "14",
    x2: "21",
    y2: "3"
  }), /* @__PURE__ */ React2.createElement("path", {
    d: "M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5"
  })))));
}

// components/shared/chat.tsx
import React4, { useEffect as useEffect2, useRef } from "react";

// components/widget/components/email.tsx
import React3, { useContext } from "react";
function Email() {
  const { isEmailSent, email, setEmail, onSendEmail } = useContext(store_default);
  if (isEmailSent)
    return /* @__PURE__ */ React3.createElement("div", {
      className: "chatbox-widget-email-form"
    }, "Thank you for your email. We'll be in touch as soon as possible.");
  return /* @__PURE__ */ React3.createElement("form", {
    className: "chatbox-widget-email-form",
    onSubmit: (event) => {
      event.preventDefault();
      onSendEmail();
    }
  }, /* @__PURE__ */ React3.createElement("p", null, "Don\u2019t have time to wait for a response? Leave your email and we\u2019ll be in touch as soon as possible."), /* @__PURE__ */ React3.createElement("input", {
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
  const chatContainerRef = useRef(null);
  useEffect2(() => {
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
    const Message = () => /* @__PURE__ */ React4.createElement("div", {
      className: `chatbox-chat-message ${classNames}`
    }, /* @__PURE__ */ React4.createElement("span", null, parsedStr[1]));
    if (emailForm && index === 0) {
      return /* @__PURE__ */ React4.createElement("div", {
        key: 9999
      }, /* @__PURE__ */ React4.createElement(Message, null), /* @__PURE__ */ React4.createElement(Email, null));
    }
    return /* @__PURE__ */ React4.createElement("div", {
      key: index
    }, /* @__PURE__ */ React4.createElement(Message, null));
  });
  return /* @__PURE__ */ React4.createElement("div", {
    className: "chatbox-chat",
    ref: chatContainerRef
  }, Messages);
}

export {
  ChatBoxProvider,
  store_default,
  Form,
  Chat
};
