import React, { useCallback, useRef, useState } from "react";
import "./ChatHeader.css";
import { FaRegCopy } from "react-icons/fa";

import { toast } from "react-toastify";

const ChatHeader = ({ url }) => {
  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Copied link to clipboard!", {
        autoClose: 500,
        hideProgressBar: true,
      });
    });
  }, [url]);

  return (
    <div className="chat__header">
      <input className="input__url" type="text" value={url} readOnly />

      <button className="copy__button" onClick={copyToClipboard}>
        <FaRegCopy className="copy__icon" />
      </button>
    </div>
  );
};

export default ChatHeader;
