import {
  Chat,
  ChatBoxProvider,
  Form,
  store_default
} from "./chunk-6ULOPPWZ.mjs";
import {
  __objRest,
  __spreadValues
} from "./chunk-N3HJPGEW.mjs";

// components/widget/index.tsx
import React6 from "react";

// components/widget/components/modal.tsx
import React2, { useContext as useContext2 } from "react";

// components/widget/components/header.tsx
import React, { useContext } from "react";
function Header() {
  const { title, description } = useContext(store_default);
  return /* @__PURE__ */ React.createElement("div", {
    className: "chatbox-widget-header"
  }, /* @__PURE__ */ React.createElement("h2", null, title ? title : "Hi \u{1F44B}"), /* @__PURE__ */ React.createElement("p", null, description ? description : "Ask us anything, or share your feedback."));
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
  } = useContext2(store_default);
  if (!isModalShow)
    return null;
  return /* @__PURE__ */ React2.createElement("div", {
    className: "chatbox-widget-modal"
  }, /* @__PURE__ */ React2.createElement(Header, null), /* @__PURE__ */ React2.createElement(Chat, {
    chat,
    emailForm: true,
    isChatTrigger
  }), /* @__PURE__ */ React2.createElement(Form, {
    message,
    setMessage,
    onSendMessage
  }));
}

// components/widget/components/trigger-button.tsx
import React5, { useContext as useContext3 } from "react";

// components/widget/components/icon-default.tsx
import React3 from "react";
function IconDefault(_a) {
  var _b = _a, { size = 30 } = _b, props = __objRest(_b, ["size"]);
  return /* @__PURE__ */ React3.createElement("svg", __spreadValues({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    stroke: "var(--color-text)",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    viewBox: "0 0 24 24",
    width: size,
    height: size
  }, props), /* @__PURE__ */ React3.createElement("path", {
    stroke: "none",
    d: "M0 0h24v24H0z",
    fill: "none"
  }), /* @__PURE__ */ React3.createElement("path", {
    d: "M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1"
  }), /* @__PURE__ */ React3.createElement("line", {
    x1: "12",
    y1: "12",
    x2: "12",
    y2: "12.01"
  }), /* @__PURE__ */ React3.createElement("line", {
    x1: "8",
    y1: "12",
    x2: "8",
    y2: "12.01"
  }), /* @__PURE__ */ React3.createElement("line", {
    x1: "16",
    y1: "12",
    x2: "16",
    y2: "12.01"
  }));
}

// components/widget/components/icon-close.tsx
import React4 from "react";
function IconClose(_a) {
  var _b = _a, { size = 30 } = _b, props = __objRest(_b, ["size"]);
  return /* @__PURE__ */ React4.createElement("svg", __spreadValues({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    stroke: "var(--color-text)",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    viewBox: "0 0 24 24",
    width: size,
    height: size
  }, props), /* @__PURE__ */ React4.createElement("path", {
    stroke: "none",
    d: "M0 0h24v24H0z",
    fill: "none"
  }), /* @__PURE__ */ React4.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /* @__PURE__ */ React4.createElement("line", {
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
  const { isModalShow, onModalShow } = useContext3(store_default);
  return /* @__PURE__ */ React5.createElement("button", {
    type: "button",
    className: "chatbox-widget-trigger-button",
    onClick: () => {
      onModalShow(!isModalShow);
    }
  }, isModalShow ? /* @__PURE__ */ React5.createElement(React5.Fragment, null, /* @__PURE__ */ React5.createElement(IconClose, {
    size: 30
  })) : /* @__PURE__ */ React5.createElement(React5.Fragment, null, children ? children : /* @__PURE__ */ React5.createElement(IconDefault, null)));
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
  return /* @__PURE__ */ React6.createElement(ChatBoxProvider, {
    themeColor,
    textColor,
    autoMessage,
    title,
    description,
    showOnInitial
  }, /* @__PURE__ */ React6.createElement("div", {
    className: "chatbox",
    style: {
      "--color-primary": themeColor,
      "--color-text": textColor
    }
  }, /* @__PURE__ */ React6.createElement("div", {
    className: "chatbox-widget-root"
  }, /* @__PURE__ */ React6.createElement(TriggerButton, null, customIcon), /* @__PURE__ */ React6.createElement(Modal, null))));
}
export {
  ChatBox as default
};
