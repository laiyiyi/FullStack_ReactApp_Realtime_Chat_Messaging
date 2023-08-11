import React, { Dispatch, SetStateAction, PropsWithChildren } from "react";

import { AddChannel } from "../assets";
import { APIErrorResponse, ErrorFromResponse } from "stream-chat";

interface IProps {
  error: ErrorFromResponse<APIErrorResponse> | null;
  loading?: boolean | undefined;
  type: string;
  setIsCreating: Dispatch<SetStateAction<boolean>>;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  setCreateType: Dispatch<SetStateAction<string>>;
  setToggleContainer: Dispatch<SetStateAction<boolean>>;
}

const TeamChannelList = ({
  children,
  error = null,
  loading,
  type,
  setIsCreating,
  setIsEditing,
  setCreateType,
  setToggleContainer
}: PropsWithChildren<IProps>) => {
  if (error) {
    return type === "team" ? (
      <div className="team-channel-list">
        <p className="team-channel-list__message">
          Connection error, please wait a moment and try again.
        </p>
      </div>
    ) : null;
  }

  if (loading) {
    return (
      <div className="team-channel-list">
        <p className="team-channel-list__message loading">
          {type === "team" ? "Channels" : "Messages"} loading...
        </p>
      </div>
    );
  }
  return (
    <div className="team-channel-list">
      <div className="team-channel-list__header">
        <p className="team-channel-list__header__title">
          {type === "team" ? "Channels" : "Direct Messages"}
        </p>
        <AddChannel
          setIsCreating={setIsCreating}
          setIsEditing={setIsEditing}
          setCreateType={setCreateType}
          setToggleContainer={setToggleContainer}
          type={type === "team" ? "team" : "messaging"}
        />
      </div>
      {children}
    </div>
  );
};

export default TeamChannelList;
