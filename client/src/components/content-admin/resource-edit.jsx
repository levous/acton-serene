import React from 'react'
import PropTypes from 'prop-types'
import {ListGroup, ListGroupItem} from 'react-bootstrap'
import moment from 'moment'

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
  }

  resourceKey = resource && resource.resourceTargetingPath || '';

  handleChange(e) {
    this.setState({ value: e.target.value });
  }
  render () {
    return (
      <form>
        <FormGroup
          controlId="formBasicText"
          validationState={this.getValidationState()}
        >
          <ControlLabel>Working example with validation</ControlLabel>
          <FormControl
            type="text"
            value={this.state.resourceTargetingPath}
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

ResourceList.propTypes = propTypes;
ResourceList.defaultProps = defaultProps;

export default ResourceList
