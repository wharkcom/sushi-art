import React, { Component } from 'react'

class Image extends Component {

	render() {
		return (
			<div>
				<img src={this.props.image.src} alt={this.props.image.src} />
			</div>
		)
	}

}

export default Image