import gql from 'graphql-tag';
import client from './client';

const messagesQuery = gql`
  query MessagesQuery {
    messages {
      id
      from
      text
    }
  }
`;

const addMessageMutation = gql`
  mutation AddMessageMutation($input: MessageInput!) {
    message: addMessage(input: $input) {
      id
      from
      text
    }
  }
`;

const messageSubscription = gql`
  subscription {
    messageAdded {
      id
      from
      text
    }
  }
`;

export function onMessageAdded(handleMessage){
  const observable = client.subscribe({query: messageSubscription});
  return observable.subscribe((result) => handleMessage(result.data.messageAdded));
}

export async function addMessage(text) {
  const {data} = await client.mutate({
    mutation: addMessageMutation,
    variables: {input: {text}}
  });
  return data.message;
}

export async function getMessages() {
  const {data} = await client.query({query: messagesQuery});
  return data.messages;
}
