import React from "react";
import "./Features.css";
import { BsLockFill } from "react-icons/bs";
import { GiTimeBomb, GiEmptyHourglass } from "react-icons/Gi";
import { MdTouchApp } from "react-icons/md";
const Features = () => {
  const features = [
    {
      icon: <BsLockFill />,
      title: "Exclusive",
      description:
        "Once two connections are established, the chat room is completely locked, even if a third party has the link. It's just you and your invitee.",
    },
    {
      icon: <GiEmptyHourglass />,
      title: "Temporary",
      description:
        "Your chats have a built-in expiry time set by you. After the set duration, conversations disappear forever, leaving no trace behind. No databases, no data storage.",
    },
    {
      icon: <GiTimeBomb />,
      title: "Anonymous",
      description:
        "No sign-ups, no user profiles, just pure conversation. Share your thoughts without any ties to your identity.",
    },

    {
      icon: <MdTouchApp />,
      title: "Controlled",
      description:
        "Your conversation, your rules. Opt to self-destruct the chat you created anytime you desire, ending the dialogue at your own pace.",
    },
  ];

  return (
    <div id="features" className="features-container container">
      {features.map((feature, index) => (
        <div key={index} className="feature">
          <span className="feature__icon">{feature.icon}</span>
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Features;
