import { Dispatch, SetStateAction } from "react";
import { Channel } from "stream-chat";
import { Avatar, useChatContext } from "stream-chat-react";

interface IProps {
  channel: Channel;
  type: string;
  setIsCreating: Dispatch<SetStateAction<boolean>>;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  setToggleContainer: Dispatch<SetStateAction<boolean>>;
}

const TeamChannelPreview = ({
  channel,
  type,
  setIsCreating,
  setIsEditing,
  setToggleContainer,
}: IProps) => {
  const { channel: activeChannel, client, setActiveChannel } = useChatContext();

  const ChannelPreview = () => (
    <p className="channel-preview__item">
      {channel?.data?.name || channel?.data?.id}
    </p>
  );

  const DirectPreview = () => {
    const members = Object.values(channel.state.members).filter(
      ({ user }) => user.id !== client.userID
    );

    return (
      <div className="channel-preview__item single">
        <Avatar
          image={members[0]?.user?.image}
          name={members[0]?.user?.fullName || members[0]?.user?.id}
          size={24}
        />
        <p>{members[0]?.user?.fullName || members[0]?.user?.id}</p>
      </div>
    );
  };

  return (
    <div
      className={
        channel?.id === activeChannel?.id
          ? "channel-preview__wrapper__selected"
          : "channel-preview__wrapper"
      }
      onClick={() => {
        setIsCreating(false);
        setIsEditing(false);
        setActiveChannel(channel);

        if (setToggleContainer) {
          setToggleContainer((prevState) => !prevState);
        }
      }}
    >
      {type === "team" ? <ChannelPreview /> : <DirectPreview />}
    </div>
  );
};

export default TeamChannelPreview;
