import { Dispatch, SetStateAction } from "react";
import { Channel, MessageSimple } from "stream-chat-react";

import { ChannelInner, CreateChannel, EditChannel } from "./";

interface IProps {
  isCreating: boolean;
  setIsCreating: Dispatch<SetStateAction<boolean>>;
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  createType: string;
}

const ChannelContainer = ({
  isCreating,
  setIsCreating,
  isEditing,
  setIsEditing,
  createType,
}: IProps) => {

  if (isCreating) {
    return (
      <div className="channel__container">
        <CreateChannel createType={createType} setIsCreating={setIsCreating} setIsEditing={setIsEditing}/>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="channel__container">
        <EditChannel setIsCreating={setIsCreating} setIsEditing={setIsEditing} />
      </div>
    );
  }

  const EmptyState = () => {
    return (
      <div className="channel-empty__container">
        <p className="channel-empty__first">
          This is the beginning of your chat history.
        </p>
        <p className="channel-empty__second">
          Send messages, attachments, links, emojis, and more!
        </p>
      </div>
    );
  };

  return (
    <div className="channel__container">
      <Channel
        EmptyStateIndicator={EmptyState}
        Message={(messageProps, i) => (
          <MessageSimple key={i} {...messageProps} />
        )}
      >
        <ChannelInner setIsEditing={setIsEditing} />
      </Channel>
    </div>
  );
};

export default ChannelContainer;
