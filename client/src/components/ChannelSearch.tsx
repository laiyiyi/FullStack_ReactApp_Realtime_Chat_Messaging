/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useChatContext } from "stream-chat-react";

import { ResultsDropdown } from ".";
import { SearchIcon } from "../assets";
import { Channel, UserResponse } from "stream-chat";
import { DefaultStreamChatGenerics } from "stream-chat-react/dist/types/types";

const ChannelSearch = ({
  setToggleContainer,
}: {
  setToggleContainer: Dispatch<SetStateAction<boolean>>;
}) => {
  const { client, setActiveChannel } = useChatContext();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [teamChannels, setTeamChannels] = useState<Channel<DefaultStreamChatGenerics>[]>([]);
  const [directChannels, setDirectChannels] = useState<UserResponse<DefaultStreamChatGenerics>[]>([]);

  useEffect(() => {
    if (!query) {
      setTeamChannels([]);
      setDirectChannels([]);
    }
  }, [query]);

  const getChannels = async (text: string) => {
    try {
      const channelResponse = client.queryChannels({
        type: "team",
        name: { $autocomplete: text },
        members: { $in: [client.userID!] },
      });

      const userResponse = client.queryUsers({
        id: { $ne: client.userID! },
        name: { $autocomplete: text },
      });

      const [channels, { users }] = await Promise.all([
        channelResponse,
        userResponse,
      ]);

      if (channels.length) setTeamChannels(channels);
      if (users.length) setDirectChannels(users);
    } catch (error) {
      setQuery("");
    }
  };

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    setLoading(true);
    setQuery(event.target.value);
    getChannels(event.target.value);
  };

  const setChannel = (channel: any) => {
    setQuery("");
    setActiveChannel(channel);
  };

  return (
    <div className="channel-search__container">
      <div className="channel-search__input__wrapper">
        <div className="channel-search__input__icon">
          <SearchIcon />
        </div>
        <input
          type="text"
          className="channel-search__input__text"
          placeholder="Search"
          value={query}
          onChange={onSearch}
        />
      </div>
      {query && (
        <ResultsDropdown
          teamChannels={teamChannels}
          directChannels={directChannels}
          loading={loading}
          setChannel={setChannel}
          setToggleContainer={setToggleContainer}
        />
      )}
    </div>
  );
};

export default ChannelSearch;
