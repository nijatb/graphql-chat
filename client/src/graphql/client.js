import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  split,
} from "apollo-boost";
import { getMainDefinition } from "apollo-utilities";
import { WebSocketLink } from "apollo-link-ws";
import { getAccessToken } from "../auth";

const httpUrl = "http://localhost:9000/graphql";
const wsUrl = "ws://localhost:9000/graphql";

const httpLink = ApolloLink.from([
  new ApolloLink((operation, forward) => {
    const token = getAccessToken();
    if (token) {
      operation.setContext({ headers: { authorization: `Bearer ${token}` } });
    }
    return forward(operation);
  }),
  new HttpLink({ uri: httpUrl }),
]);

const wsLink = new WebSocketLink({
  uri: wsUrl,
  options: {
    // connectionParams is set as function, to use the latest value available when connection starts
    connectionParams: () => ({
      accessToken: getAccessToken()
    }),
    lazy: true,
    reconnect: true,
  },
});

function isSubscription(operation) {
  const defintion = getMainDefinition(operation.query);
  return (
    defintion.kind === "OperationDefinition" &&
    defintion.operation === "subscription"
  );
}

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: split(isSubscription, wsLink, httpLink),
  defaultOptions: { query: { fetchPolicy: "no-cache" } },
});

export default client;
