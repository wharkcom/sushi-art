import React, { Component } from 'react'

class Image extends Component {

	render() {
		if (this.props.image.width && this.props.image.height) {
			var aspect = this.props.image.width/this.props.image.height >= 1 ? 'landscape' : 'portrait'
		}
		this.state = {
			aspect: aspect
		}
		
		return (
			<div className='imageWrapper'>
				<img src={this.props.image.src} alt={this.props.image.alt} className={this.state.aspect}/>
				<div className='description'>{this.props.image.description}</div>
			</div>
		)
	}

}

export default Image