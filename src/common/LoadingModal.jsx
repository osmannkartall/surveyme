import React from 'react';
import { Modal, Portal } from 'react-native-paper';
import PropTypes from 'prop-types';
import LoadingSpinner from './LoadingSpinner';

const LoadingModal = ({ visible }) => (
  <Portal>
    <Modal visible={visible} dismissable={false}>
      <LoadingSpinner />
    </Modal>
  </Portal>
);

LoadingModal.propTypes = {
  visible: PropTypes.bool.isRequired,
};

export default LoadingModal;
