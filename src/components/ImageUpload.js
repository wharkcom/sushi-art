import React, { Component } from 'react'
import { graphql, gql, compose } from 'react-apollo'
import Dropzone from 'react-dropzone'
import sizeOf from 'image-size' //For image size calc
import url from 'url' //For image size calc
import http from 'http' //For image size calc

// Reference: https://github.com/graphcool-examples/react-graphql/blob/master/files-with-apollo/src/components/CreatePage.js
class ImageUpload extends Component {

  state = {
    alt: '',
    description: '',
    src: '',
    fileId: '',
    width: '',
    height: '',
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
  
  setAspectRatio = (image) => {
    // Following 'Using a URL' from https://www.npmjs.com/package/image-size
    var options = url.parse(image.url)
    // Have to redefine global 'this' since http.get defines its own 'this'
    var that = this

    http.get(options, function (response) {
      var chunks = [];
      response.on('data', function (chunk) {
        chunks.push(chunk);
      }).on('end', function() {
        var buffer = Buffer.concat(chunks);
        var dims = sizeOf(buffer)
        // Adding dimensions to the state
        that.setState({
          width: dims.width,
          height: dims.height
        })
      });
    });
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
      // I'm setting the width/height values separately since http.get doesn't return a promise. This shouldn't be a problem since the values will be set by the time the user actually clicks to upload the image. At some point, I should add a check on the state.width/height values and not allow upload until they are set.
      this.setAspectRatio(image)
      return image
    })
  }

  _imageUpload = async () => {
    const {alt, description, src, fileId, width, height} = this.state
    await this.props.uploadImageMutation({
      variables: {
        alt,
        description,
        src,
        width,
        height
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
        width: '',
        height: '',
        success: true
      })
    )
    // window.location.pathname = '/admin'
  }

}

const UPLOAD_IMAGE_MUTATION = gql`
  mutation UploadImageMutation($description: String, $alt: String!, $src: String!, $width: Int, $height: Int) {
    createImage(
      description: $description,
      alt: $alt,
      src: $src,
      width: $width,
      height: $height
    ) {
      id
      createdAt
      description
      alt
      src
      width
      height
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