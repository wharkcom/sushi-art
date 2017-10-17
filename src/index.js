import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import './scss/index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import { ApolloProvider, createNetworkInterface, ApolloClient } from 'react-apollo'
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws'

// Create regular NetworkInterface by using apollo-client's API:
const networkInterface = createNetworkInterface({
 uri: 'https://api.graph.cool/simple/v1/cj6puih7d10nn01813mxzas0i' // Your GraphQL endpoint
});

// Create WebSocket client
const wsClient = new SubscriptionClient(`wss://subscriptions.graph.cool/v1/cj6puih7d10nn01813mxzas0i`, {
    reconnect: true,
    connectionParams: {
        // Pass any arguments you want for initialization
    }
});
 
// Extend the network interface with the WebSocket
const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
    networkInterface,
    wsClient
);
 
// Finally, create your ApolloClient instance with the modified network interface
const client = new ApolloClient({
    networkInterface: networkInterfaceWithSubscriptions
});

ReactDOM.render(
	<BrowserRouter>
		<ApolloProvider client={client}>
			<App />
		</ApolloProvider>
	</BrowserRouter>
	, document.getElementById('root')
);
registerServiceWorker();
