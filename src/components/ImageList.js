import React, { Component } from 'react'
import Image from './Image'

class ImageList extends Component {

	render() {
		const images = [{
			id: '1',
			src: 'https://placeimg.com/200/200/animals'
		}, {
			id: '2',
			src: 'https://placeimg.com/200/200/nature'
		}]

		return (
			<div>
				{images.map(image => (
					<Image key={image.id} image={image}/>
				))}
			</div>
		)
	}
}

export default ImageList