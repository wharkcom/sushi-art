import React, { Component } from 'react'
import { graphql, gql, compose } from 'react-apollo'
import Dropzone from 'react-dropzone'

// Reference: https://github.com/graphcool-examples/react-graphql/blob/master/files-with-apollo/src/components/CreatePage.js
class ImageUpload extends Component {

  state = {
    alt: '',
    description: '',
    src: '',
    fileId: '',
    success: false
  }

  render() {
    return (
      <div>
        <div className='flex file-submit flex-column flex--center'>
          <h2>Upload an Image</h2>
          <div className='flex flex--center'>
            <div className='flex flex-column'>
              <label>
                <div>Description</div>
                <input
                  className='mb2'
                  value={this.state.description}
                  onChange={(e) => this.setState({ description: e.target.value })}
                  type='text'
                  placeholder='A description for the Image'
                />
              </label>
              <label>
                <div>Alt Text</div>
                <input
                  className='mb2'
                  value={this.state.alt}
                  onChange={(e) => this.setState({ alt: e.target.value })}
                  type='text'
                  placeholder='The image alt text'
                />
              </label>
            </div>
            <div>
              {!this.state.fileId &&
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
                <img src={this.state.src} role='presentation' alt='Uploaded file' className='w-100 mv3' />
              }
            </div>
          </div>
          <button onClick={() => this._imageUpload()} className='btn btn--submit'>Submit</button>
          {this.state.success &&
                <div className='success'>Your image loaded successfully</div>
              }
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
        fileId: image.id,
        src: image.url,
      })
    })
  }

  _imageUpload = async () => {
    const {alt, description, src, fileId} = this.state
    await this.props.uploadImageMutation({
      variables: {
        alt,
        description,
        src
      }
    }).then(({data}) => {
      this.props.relateImageMutation({
        variables: {
          fileId,
          imageId: data.createImage.id
        }
      })
    }).then(
      this.setState({
        alt: '',
        description: '',
        src: '',
        fileId: '',
        success: true
      })
    )
    // window.location.pathname = '/admin'
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
const RELATE_IMAGE_MUTATION = gql`
  mutation RelateImageMutation($fileId: ID!, $imageId: ID!) {
    setFileOnImage(
      imageImageId: $imageId,
      fileFileId: $fileId
    ) {
      fileFile {
        id
        image {
          id
        }
      }
    }
  }
`

const ImageUploadWithMutations = compose(
  graphql(UPLOAD_IMAGE_MUTATION, {
    name: 'uploadImageMutation'
  }),
  graphql(RELATE_IMAGE_MUTATION, {
    name: 'relateImageMutation'
  })
) (ImageUpload)

export default ImageUploadWithMutations

// export default graphql(UPLOAD_IMAGE_MUTATION, {name: 'uploadImageMutation'})(ImageUpload)