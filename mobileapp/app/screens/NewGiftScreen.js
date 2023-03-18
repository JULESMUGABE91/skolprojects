import React from 'react';
import {NewGift} from '../components/Gifts';
import {Container} from '../components/Container';

class NewGiftScreen extends React.Component {
  getSelectedItem(item) {
    console.log('********SEL ITEM', item);
  }
  render() {
    return (
      <Container>
        <NewGift
          navigation={this.props.navigation}
          params={{
            ...this.props.route.params,
            getSelectedItem: params => this.getSelectedItem(params),
          }}
        />
      </Container>
    );
  }
}

export default NewGiftScreen;
