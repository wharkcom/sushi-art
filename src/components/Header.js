import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { GC_USER_ID, GC_AUTH_TOKEN } from '../constants'

class Header extends Component {

	render() {
		const userId = localStorage.getItem(GC_USER_ID)

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
						{userId &&
							<li>
								<Link to='/admin'>Admin</Link>
							</li>
						}
		        {userId ?
		          <li onClick={() => {
		            localStorage.removeItem(GC_USER_ID)
		            localStorage.removeItem(GC_AUTH_TOKEN)
		            this.props.history.push(`/`)
		          }}>
		          	<Link to='#'>Logout</Link>
		          </li>
		          :
		          <li>
		          	<Link to='/login'>Login</Link>
	          	</li>
		        }
					</ul>
				</nav>
			</header>
		)
	}

}

export default withRouter(Header)