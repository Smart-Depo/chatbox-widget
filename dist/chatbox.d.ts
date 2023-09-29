import React from 'react';

interface IChatBoxWidget {
    themeColor?: string;
    textColor?: string;
    autoMessage?: string;
    title?: string;
    description?: string;
    showOnInitial?: boolean;
    customIcon?: React.ReactElement;
}
declare function ChatBox({ themeColor, textColor, autoMessage, title, description, showOnInitial, customIcon, }: IChatBoxWidget): JSX.Element;

export { IChatBoxWidget, ChatBox as default };
