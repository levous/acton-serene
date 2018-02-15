import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap'
import '../scss/components/loading-spinner.css';

const propTypes = {
  loading: PropTypes.bool.isRequired
};
const defaultProps = {};

export default function LoadingSpinner({loading}) {
  return (
    <Modal show={loading}>
      <Modal.Header>
        <Modal.Title>please wait...</Modal.Title>
      </Modal.Header>
      <Modal.Body><div className='loading-spinner'></div></Modal.Body>
      <Modal.Footer>
      </Modal.Footer>
    </Modal>

  );
}

LoadingSpinner.propTypes = propTypes;
LoadingSpinner.defaultProps = defaultProps;
