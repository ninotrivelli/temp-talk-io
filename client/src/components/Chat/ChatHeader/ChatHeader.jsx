import React, { useCallback, useRef, useState } from "react";
import "./ChatHeader.css";
import { FaRegCopy } from "react-icons/fa";
const ChatHeader = ({ url }) => {
  const inputRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [url]);

  return (
    <div className="chat__header">
      <input className="input__url" type="text" value={url} readOnly />

      <button className="copy__button" onClick={copyToClipboard}>
        <FaRegCopy className="copy__icon" />
      </button>
      {copied && <p>Copied!</p>}
    </div>
  );
};

export default ChatHeader;
