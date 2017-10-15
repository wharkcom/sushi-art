import React from 'react';
import ReactDOM from 'react-dom';
import './scss/index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import { ApolloProvider, createNetworkInterface, ApolloClient } from 'react-apollo'

const client = new ApolloClient({
	networkInterface: createNetworkInterface({
		uri: 'https://api.graph.cool/simple/v1/cj6puih7d10nn01813mxzas0i'
	}),
})

ReactDOM.render(
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>
	, document.getElementById('root')
);
registerServiceWorker();
