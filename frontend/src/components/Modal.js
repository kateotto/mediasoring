import React from 'react';
import PropTypes from 'prop-types';

class Modal extends React.Component {
  render() {
    // Render nothing if the "show" prop is false
    if(!this.props.show) {
      return null;
    }

    // The gray background
    const backdropStyle = {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      padding: 50,
      fontSize: '25px',
      height: '110%'
    };

    // The modal "window"
    const modalStyle = {
    position: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    textAlign: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    maxWidth: '50%',
    minHeight: 300,
    margin: '0 auto',
    padding: '30px'
    };

    const closeStyle = {
        border: 'none',
        backgroundColor: 'transparent',
        color: '#0007D8',
        fontSize: '15px'
    };
   

    return (
      <div className="backdrop" style={backdropStyle}>
        <div className="modal" style={modalStyle}>
          {this.props.children}
          <div className="footer">
          <br/>
            <button className="closeBtn" style={closeStyle} onClick={this.props.onClose}>
             innym razem
            </button>
          </div>
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  children: PropTypes.node
};

export default Modal;
