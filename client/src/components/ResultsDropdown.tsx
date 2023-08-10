import React, { Dispatch, SetStateAction } from "react";
import {
  Channel,
  ChannelMemberResponse,
  DefaultGenerics,
  StreamChat,
  UserResponse,
} from "stream-chat";
import { Avatar, useChatContext } from "stream-chat-react";
import { DefaultStreamChatGenerics } from "stream-chat-react/dist/types/types";

interface IProps {
  teamChannels: ChannelMemberResponse[];
  directChannels: UserResponse[];
  loading: boolean;
  setChannel: (channel: Channel) => void;
  setToggleContainer: Dispatch<SetStateAction<boolean>>;
}

const channelByUser = async ({
  client,
  setActiveChannel,
  channel,
  setChannel,
}: {
  client: StreamChat;
  setActiveChannel: (channel: Channel) => void;
  channel: Channel<DefaultStreamChatGenerics>;
  setChannel: (channel: Channel) => void;
}) => {
  const filters = {
    type: "messaging",
    member_count: 2,
    members: { $eq: [client.user.id!, client.userID!] },
  };

  const [existingChannel] = await client.queryChannels(filters);

  if (existingChannel) return setActiveChannel(existingChannel);

  const newChannel = client.channel("messaging", {
    members: [channel.id!, client.userID!],
  });

  setChannel(newChannel);

  return setActiveChannel(newChannel);
};

const SearchResult = ({
  channel,
  type,
  setChannel,
  setToggleContainer,
}: {
  channel: Channel<DefaultGenerics>;
  type: string;
  setChannel: (channel: Channel<DefaultGenerics>) => void;
  setToggleContainer: Dispatch<SetStateAction<boolean>>;
}) => {
  const { client, setActiveChannel } = useChatContext();
  console.log("client", client);
  if (type === "channel") {
    return (
      <div
        onClick={() => {
          setChannel(channel);
          if (setToggleContainer) {
            setToggleContainer((prevState) => !prevState);
          }
        }}
        className="channel-search__result-container"
      >
        <div className="result-hashtag">#</div>
        <p className="channel-search__result-text">{channel?.data?.name}</p>
      </div>
    );
  }

  return (
    <div
      onClick={async () => {
        channelByUser({ client, setActiveChannel, channel, setChannel });
        if (setToggleContainer) {
          setToggleContainer((prevState) => !prevState);
        }
      }}
      className="channel-search__result-container"
    >
      <div className="channel-search__result-user">
        <Avatar
          image={channel?.image || undefined}
          name={channel?.name}
          size={24}
        />
        <p className="channel-search__result-text">{channel.name}</p>
      </div>
    </div>
  );
};

const ResultsDropdown = ({
  teamChannels,
  directChannels,
  loading,
  setChannel,
  setToggleContainer,
}: IProps) => {
  console.log("directChannels", directChannels);
  return (
    <div className="channel-search__results">
      <p className="channel-search__results-header">Channels</p>
      {loading && !teamChannels.length && (
        <p className="channel-search__results-header">
          <i>Loading...</i>
        </p>
      )}
      {!loading && !teamChannels.length ? (
        <p className="channel-search__results-header">
          <i>No channels found</i>
        </p>
      ) : (
        teamChannels?.map((channel, i) => (
          <SearchResult
            channel={channel}
            key={i}
            setChannel={setChannel}
            type="channel"
            setToggleContainer={setToggleContainer}
          />
        ))
      )}
      <p className="channel-search__results-header">Users</p>
      {loading && !directChannels.length && (
        <p className="channel-search__results-header">
          <i>Loading...</i>
        </p>
      )}
      {!loading && !directChannels.length ? (
        <p className="channel-search__res ults-header">
          <i>No direct messages found</i>
        </p>
      ) : (
        directChannels.map((channel, i) => (
          <SearchResult
            channel={channel}
            key={i}
            setChannel={setChannel}
            type="user"
            setToggleContainer={setToggleContainer}
          />
        ))
      )}
    </div>
  );
};

export default ResultsDropdown;
