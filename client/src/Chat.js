import React from "react";
import { useQuery, useMutation, useSubscription } from "@apollo/react-hooks";
import {
  addMessage,
  getMessages,
  onMessageAdded,
  messagesQuery,
  addMessageMutation,
  messageSubscription
} from "./graphql/queries";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

const Chat = ({ user }) => {

  const { loading, error, data } = useQuery(messagesQuery);

  const messages = data? data.messages : []
  useSubscription(messageSubscription, {
    onSubscriptionData: ({client, subscriptionData}) => {
      // setMessages(messages.concat(result.subscriptionData.data.messageAdded));
      client.writeData({ 
        data: {
          messages: messages.concat(subscriptionData.data.messageAdded)
        }
      })
    }
  })

  const [addMessage] = useMutation(addMessageMutation);

  const handleSend = async (text) => {
    await addMessage({ variables: { input: { text } } });
  };


  if (loading) return "Loading...";
  if (error) return "Error: " + error;

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Chatting as {user}</h1>
        <MessageList user={user} messages={messages} />
        <MessageInput onSend={handleSend} />
      </div>
    </section>
  );
};

export default Chat;
