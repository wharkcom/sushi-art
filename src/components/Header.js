import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'

class Header extends Component {

	render() {
		return (
			<header className='flex'>
				<div className='logo text-onDark'>
					<div>Logo</div>
				</div>
				<nav className='flex'>
					<ul className='rlist--inline flex flex--center'>
						<li>
							<Link to='/'>Home</Link>
						</li>
						<li>
							<Link to='/admin'>Admin</Link>
						</li>
					</ul>
				</nav>
			</header>
		)
	}

}

export default withRouter(Header)