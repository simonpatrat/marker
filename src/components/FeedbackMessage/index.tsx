import React from 'react';
import { Message } from 'semantic-ui-react';

type ErrorMessageType = string;

const messageTypeProp: { [key: string]: { [key: string]: boolean } } = {
  success: { success: true },
  info: { info: true },
  warning: { warning: true },
  negative: { negative: true },
};

export const FeedBackMessage: React.FunctionComponent<{
  type: ErrorMessageType;
  message: string;
  info?: string;
}> = ({ type, message, info }) => {
  const feedback = messageTypeProp[type] ? messageTypeProp[type] : {};

  return (
    <Message {...feedback}>
      <Message.Header>{message}</Message.Header>
      {!!info && <p>{info}</p>}
    </Message>
  );
};
