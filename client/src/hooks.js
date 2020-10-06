import { useQuery, useMutation, useSubscription } from "@apollo/react-hooks";
import {
  addMessage,
  getMessages,
  onMessageAdded,
  messagesQuery,
  addMessageMutation,
  messageSubscription,
} from "./graphql/queries";


export function useChatMessages() {
    const { loading, error, data } = useQuery(messagesQuery);
  
    const messages = data ? data.messages : [];
    useSubscription(messageSubscription, {
      onSubscriptionData: ({ client, subscriptionData }) => {
        client.writeData({
          data: {
            messages: messages.concat(subscriptionData.data.messageAdded),
          },
        });
      },
    });
  
    const [addMessage] = useMutation(addMessageMutation);
    return {
      loading,
      error,
      messages,
      addMessage : (text) => addMessage({ variables: { input: { text } } })
    };
  }