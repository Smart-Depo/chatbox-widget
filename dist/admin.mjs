import {
  Chat,
  Form
} from "./chunk-6ULOPPWZ.mjs";
import "./chunk-N3HJPGEW.mjs";

// components/admin/index.tsx
import React2, { useContext } from "react";
import { useRouter } from "next/router";

// components/admin/store.tsx
import React, { createContext, useEffect, useState } from "react";
var defaultState = {};
var ChatBoxContext = createContext(defaultState);
function ChatBoxProvider({
  children,
  id
}) {
  const [isChatTrigger, setIsChatTrigger] = useState(performance.now());
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
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
  useEffect(() => {
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
  return /* @__PURE__ */ React.createElement(ChatBoxContext.Provider, {
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

// components/admin/index.tsx
function ChatBoxAdmin() {
  const { id, isChatTrigger, chat, message, setMessage, onSendMessage } = useContext(store_default);
  return /* @__PURE__ */ React2.createElement("div", {
    className: "chatbox"
  }, /* @__PURE__ */ React2.createElement("div", {
    className: "chatbox-admin-root"
  }, /* @__PURE__ */ React2.createElement("div", {
    className: "chatbox-admin-grid"
  }, /* @__PURE__ */ React2.createElement("header", {
    className: "chatbox-admin-header"
  }, /* @__PURE__ */ React2.createElement("h1", null, "Hi, chat id: ", id, ":")), /* @__PURE__ */ React2.createElement(Chat, {
    chat,
    isChatTrigger
  }), /* @__PURE__ */ React2.createElement(Form, {
    message,
    setMessage,
    onSendMessage
  }))));
}
function ChatBoxAdminRoot(props) {
  const router = useRouter();
  const { id } = router.query;
  return /* @__PURE__ */ React2.createElement(ChatBoxProvider, {
    id
  }, /* @__PURE__ */ React2.createElement(ChatBoxAdmin, null));
}
export {
  ChatBoxAdminRoot as default
};
