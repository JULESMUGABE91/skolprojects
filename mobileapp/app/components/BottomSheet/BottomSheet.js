import React from 'react';
import BottomSheet from '@gorhom/bottom-sheet';

class BottomSheetModal extends React.Component {
  constructor(props) {
    super(props);
    this.bottomSheetRef = React.createRef();
  }

  handleOnExpandPress = () => {
    if (this.bottomSheetRef.current) {
      this.bottomSheetRef.current.expand();
    }
  };

  render() {
    const {snapPoints, children, index = 0} = this.props;

    return (
      <BottomSheet
        ref={this.bottomSheetRef}
        snapPoints={snapPoints}
        index={index}>
        {children}
      </BottomSheet>
    );
  }
}

export default BottomSheetModal;
