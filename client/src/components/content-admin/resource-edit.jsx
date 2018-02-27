import React from 'react'
import PropTypes from 'prop-types'
import {FormGroup, ControlLabel, FormControl ,HelpBlock, Button} from 'react-bootstrap'

// import moment from 'moment'

//NOTE: intentionally left semi-colons out.
//      Experimenting with the concept that thei are old-school and unnecessary.
//      Like double spaces after a perdiod.  Which I stil (and always will) do :)


const propTypes = {
  managedContent: PropTypes.object,
  onResourceUpdate: PropTypes.func.isRequired
}

const defaultProps = {}

/* **
 * Edit Resource
 */
class ResourceEdit extends React.Component {
  constructor (props) {
    super(props);
    this.handleChange = this.handleChange.bind(this)
    this.getValidationState = this.getValidationState.bind(this)
    this.saveResource = this.saveResource.bind(this)
    this.state = {
      managedContent: this.props.managedContent
    };
  }

  getValidationState() {
    if(!(this.state && this.state.value)) return null
    const length = this.state.value.length
    if (length > 10) return 'success'
    else if (length > 5) return 'warning'
    else if (length > 0) return 'error'
    return null
  }

  handleChange(e) {
    const updated = Object.assign(
      {},
      this.state.managedContent,
      {resourceTargetPath: e.target.value}
    )
    this.setState({ managedContent: updated })
  }

  saveResource() {
    this.props.onResourceUpdate(this.state.managedContent)
  }

  render () {
    const val = this.state.managedContent.resourceTargetPath

    return (
      <form>

        <FormGroup
          controlId="formBasicText"
          validationState={this.getValidationState()}
        >
          <ControlLabel>Resource Edit</ControlLabel>

          <FormControl
            type="text"
            value={val}
            placeholder="Enter Resource Target Path"
            onChange={this.handleChange}
          />
          <FormControl.Feedback />
          <HelpBlock></HelpBlock>
        </FormGroup>
        <Button bsStyle="primary" style={{float:'right', marginTop: '25px'}} onClick={this.saveResource}>Save</Button>

      </form>
    )
  }
}

ResourceEdit.propTypes = propTypes
ResourceEdit.defaultProps = defaultProps

export default ResourceEdit
