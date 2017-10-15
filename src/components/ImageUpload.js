import React, { Component } from 'react'
import { graphql, gql } from 'react-apollo'
import Dropzone from 'react-dropzone'

// Reference: https://github.com/graphcool-examples/react-graphql/blob/master/files-with-apollo/src/components/CreatePage.js
class ImageUpload extends Component {

  state = {
    alt: '',
    description: '',
    src: '',
    imageId: '',
  }

  render() {
    return (
      <div>
        <div className='flex file-submit flex-column flex--center'>
          <h2>Upload an Image</h2>
          <div className='flex flex--center'>
            <div className='flex flex-column'>
              <input
                className='mb2'
                value={this.state.description}
                onChange={(e) => this.setState({ description: e.target.value })}
                type='text'
                placeholder='A description for the Image'
              />
              <input
                className='mb2'
                value={this.state.alt}
                onChange={(e) => this.setState({ alt: e.target.value })}
                type='text'
                placeholder='The image alt text'
              />
            </div>
            <div>
              {!this.state.imageId &&
              <Dropzone
                onDrop={this.onDrop}
                accept='image/*'
                multiple={false}
                style={{}}
                className='dropzone'
              >
                <div>Drop an image or click to choose</div>
              </Dropzone>}
              {this.state.src &&
                <img src={this.state.src} role='presentation' className='w-100 mv3' />
              }
            </div>
          </div>
          <button onClick={() => this._imageUpload()}>Submit</button>
        </div>
      </div>
    )
  }

  onDrop = (files) => {
    // prepare form data, use data key!
    let data = new FormData()
    data.append('data', files[0])

    // use the file endpoint
    fetch('https://api.graph.cool/file/v1/cj6puih7d10nn01813mxzas0i', {
      method: 'POST',
      body: data
    }).then(response => {
      return response.json()
    }).then(image => {
      this.setState({
        imageId: image.id,
        src: image.url,
      })
    })
  }

  _imageUpload = async () => {
    const {alt, description, src} = this.state
    await this.props.uploadImageMutation({
      variables: {
        alt,
        description,
        src
      }
    })
    window.location.pathname = '/admin'
  }
}

const UPLOAD_IMAGE_MUTATION = gql`
  mutation UploadImageMutation($description: String, $alt: String!, $src: String!) {
    createImage(
      description: $description,
      alt: $alt,
      src: $src,
    ) {
      id
      createdAt
      description
      alt
      src
    }
  }
`

export default graphql(UPLOAD_IMAGE_MUTATION, {name: 'uploadImageMutation'})(ImageUpload)