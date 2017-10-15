import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import '../scss/App.css';
import ImageList from './ImageList';
import Header from './Header';
import Admin from './Admin';

class App extends Component {
	render() {
		return (
			<div>
				<Header />
				<main>
					<Switch>
						<Route exact path='/' component={ImageList} />
						<Route exact path='/admin' component={Admin} />
					</Switch>
				</main>
			</div>
		)
	}
}

export default App;
