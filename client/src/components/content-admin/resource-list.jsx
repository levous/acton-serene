import React from 'react'
import PropTypes from 'prop-types'
import {ListGroup, ListGroupItem} from 'react-bootstrap'
import moment from 'moment'

//NOTE: intentionally left semi-colons out.
//      Experimenting with the concept that thei are old-school and unnecessary.
//      Like double spaces after a perdiod.  Which I stil (and always will) do :)


const propTypes = {
  resourceList: PropTypes.array,
  selectedResourceTargetPath: PropTypes.string,
  onSelectResource: PropTypes.func
}

const defaultProps = {}

/* **
 * List of Resource Keys to provide navigation to ContentPackage admin
 */
const ResourceList = ({resourceList, selectedResourceTargetPath, onSelectResource}) => {

  if(!resourceList) return null

  const listItemAttributes = resource => {
    let attr = {}
    if(resource.resourceTargetPath === selectedResourceTargetPath) {
      attr.active = true
    } else if(!resource.published) attr.bsStyle = 'warning'

    return attr
  }

  return (
    <ListGroup>
      {resourceList.map((resource, i) => (
        <ListGroupItem
          key={i}
          header={resource.resourceTargetPath}
          onClick={() => onSelectResource(resource)}
          {...listItemAttributes(resource)}>
          last saved: {new moment(resource.updatedAt).format('MM/DD/YYYY')}
        </ListGroupItem>
        )
      )}
    </ListGroup>
  )
}

ResourceList.propTypes = propTypes;
ResourceList.defaultProps = defaultProps;

export default ResourceList
