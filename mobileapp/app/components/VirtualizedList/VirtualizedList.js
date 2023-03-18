import React from 'react';
import {FlatList} from 'react-native';
import styles from './styles';

const VirtualizedList = props => {
  return (
    <FlatList
      keyboardShouldPersistTaps="always"
      data={[]}
      contentContainerStyle={[styles.container, props.styles]}
      onRefresh={props?.onRefresh || null}
      refreshing={props.refreshing || false}
      keyExtractor={() => 'key'}
      renderItem={null}
      ListHeaderComponent={<>{props.children}</>}
    />
  );
};

export default VirtualizedList;
