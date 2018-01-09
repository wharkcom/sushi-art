import React, { Component } from 'react'
import Image from './Image'
import { graphql, gql, compose } from 'react-apollo'

class ImageList extends Component {

	state = {
		currentImage: {},
		viewer: "hidden",
	}

	_getImages = () => {
		return this.props.allImagesQuery.allImages
	}
	_openFigViewer = (image) => {
		this.setState({currentImage: image})
		this.setState({viewer: ""})
	}

	_closeFigViewer = () => {
		this.setState({currentImage: {}})
		this.setState({viewer: "hidden"})
	}

	_subscribeToNewImages = () => {
		this.props.allImagesQuery.subscribeToMore({
			document: gql`
				subscription {
					Image(filter: {
						mutation_in: [CREATED, UPDATED]
					}) {
						node {
							id
							src
							alt
							description
							width
							height
						}
					}
				}
			`,
			updateQuery: (previous, { subscriptionData }) => {
				const newAllImages = [
					subscriptionData.data.Image.node,
					...previous.allImages
				]
				const result = {
					...previous,
					allImages: newAllImages
				}
				return result
			}
		})
	}

	componentDidMount() {
		this._subscribeToNewImages()
	}

	render() {

		// 1
	  if (this.props.allImagesQuery && this.props.allImagesQuery.loading) {
	    return <div>Loading</div>
	  }

	  // 2
	  if (this.props.allImagesQuery && this.props.allImagesQuery.error) {
	    return <div>Error</div>
	  }

		// const images = this.props.allImagesQuery.allImages
		const images = this._getImages()

		return (
			<div className='flex'>
				<div className='imageList flex flex--wrap'>
					{images.map(image => (
						<div key={image.id} onClick={() => {this._openFigViewer(image)}}>
							<Image key={image.id} image={image} />
						</div>
					))}
				</div>
				{this.state.currentImage &&
					<div className={'figureViewer ' + this.state.viewer} >
						<div className='modal' onClick={() => {this._closeFigViewer()}}></div>
						<Image image={this.state.currentImage} />
					</div>
				}
			</div>
		)
	}
}

const ALL_IMAGES = gql`
  query AllImagesQuery {
	  allImages {
	    description
	    alt
	    src
	    id
	    width
	    height
	  }
	}
` 

const ImageListQL = compose(
  graphql(ALL_IMAGES, {
    name: 'allImagesQuery'
  })
) (ImageList)

export default ImageListQL