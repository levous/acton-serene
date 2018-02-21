import React from 'react'
import PropTypes from 'prop-types'
import {FormGroup, ControlLabel, FormControl ,HelpBlock} from 'react-bootstrap'
// import moment from 'moment'

//NOTE: intentionally left semi-colons out.
//      Experimenting with the concept that thei are old-school and unnecessary.
//      Like double spaces after a perdiod.  Which I stil (and always will) do :)


const propTypes = {
  resource: PropTypes.object,
  onResourceUpdate: PropTypes.func.isRequired
}

const defaultProps = {}

/* **
 * Edit Resource
 */
class ResourceEdit extends React.Component {
  constructor (props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.getValidationState = this.getValidationState.bind(this);

    this.state = {
      value: ''
    };
  }

  getValidationState() {
    const length = this.state.value.length
    if (length > 10) return 'success'
    else if (length > 5) return 'warning'
    else if (length > 0) return 'error'
    return null
  }

  handleChange(e) {
    this.setState({ value: e.target.value })
  }

  render () {

    const FieldGroup = ({ id, label, help, ...props }) => {
      return (
        <FormGroup
          controlId={id}
          validationState={this.getValidationState()}
          >
          <ControlLabel>{label}</ControlLabel>
          <FormControl {...props} />
          <FormControl.Feedback />
          {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
      )
    }

    return (
      <form>
        <FieldGroup id='fred'
          label='ok there'
          help='wicked'
          value={this.state.value}
          type='text'
          onChange={this.handleChange}
          notworking="true"
          />

        <FormGroup
          controlId="formBasicText"
          validationState={this.getValidationState()}
        >
          <ControlLabel>Working example with validation</ControlLabel>

          <FormControl
            type="text"
            value={this.state.value}
            placeholder="Enter resourceTargetingPath"
            onChange={this.handleChange}
          />
          <FormControl.Feedback />
          <HelpBlock>Validation is based on string length.</HelpBlock>
        </FormGroup>
      </form>
    )
  }
}

ResourceEdit.propTypes = propTypes;
ResourceEdit.defaultProps = defaultProps;

export default ResourceEdit
