import React, { Component } from 'react'

class Image extends Component {

	render() {

		return (
			<div className='imageWrapper'>
				<img src={this.props.image.src} alt={this.props.image.src}/>
				<div className='description'>{this.props.image.description}</div>
			</div>
		)
	}

}

export default Image