import React from 'react';
import {TouchableOpacity, View, Image} from 'react-native';
import {Text} from '../Text';
import styles from './styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Checkbox from '../Input/Checkbox';
import {connect} from 'react-redux';
import {Button} from '../Button';

class ListItem extends React.Component {
  render() {
    const props = this.props;

    const {accent_color, primary_color} = props;

    return (
      <TouchableOpacity onPress={props.onPress} onLongPress={props.onLongPress}>
        <View
          style={[
            styles.list_item_container,
            props.style,
            props.background && styles.list_item_container_bg,
            props.border && styles.border,
            props.selected && {borderColor: primary_color},
          ]}>
          {props.checkboxLeft && (
            <Checkbox checked={props.checkedLeft} onCheck={props.onCheckLeft} />
          )}
          {props.left_icon && (
            <View
              style={[
                styles.icon_container,
                props.left_icon_primary_bg && styles.left_icon_primary_bg,
              ]}>
              <MaterialCommunityIcons
                name={props.left_icon}
                style={[
                  styles.left_icon,
                  {color: this.props.primary_color},
                  props.left_icon_primary_bg && styles.left_icon_white,
                ]}
              />
            </View>
          )}
          {props.isUserPhoto && props.user_photo?.length === 0 ? (
            <View
              style={[
                styles.user_photo,
                {backgroundColor: props.placeholderBackground},
              ]}>
              <Text type="bold" title style={[styles.user_name_char]}>
                {props?.title ? props?.title?.charAt(0) : 'U'}
              </Text>
            </View>
          ) : (
            props.isUserPhoto &&
            props.user_photo?.length !== 0 && (
              <View style={styles.group_user_image}>
                {[props.user_photo[0]].map((ph, i) => {
                  return (
                    <View
                      key={i}
                      style={[
                        styles.user_photo,
                        {backgroundColor: props.placeholderBackground},
                      ]}>
                      <Image source={{uri: ph}} style={styles.photo_image} />
                    </View>
                  );
                })}
              </View>
            )
          )}
          <View style={[styles.item_info, props.itemStyles]}>
            <View style={{flex: 1, justifyContent: 'center'}}>
              {props.title === '' ? (
                <View>
                  <View style={styles.empty_title} />
                  <View style={styles.empty_sbtitle} />
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    // flex: 1,
                    alignItems: 'center',
                  }}>
                  <Text type={!props.titleBold && 'bold'} smtitle>
                    {props.title}
                  </Text>
                  {props.category && (
                    <View
                      style={[
                        styles.category_container,
                        props.category?.toLowerCase()?.includes('health')
                          ? {
                              backgroundColor: props.accent_color,
                            }
                          : {
                              backgroundColor: props.primary_color,
                            },
                      ]}>
                      <Text type="bold" style={styles.category_text}>
                        {props.category}
                      </Text>
                    </View>
                  )}
                </View>
              )}
              {props.description !== '' && props.description && (
                <Text
                  smtitle
                  style={[styles.description, props.descriptionStyle]}>
                  {props.description}
                </Text>
              )}
            </View>
            <View style={styles.desc_left}></View>
          </View>
          {props.right_icon && (
            <View style={styles.icon_container}>
              <Feather name={props.right_icon} style={styles.right_icon} />
            </View>
          )}
          {props.checkbox && (
            <Checkbox checked={props.checked} onCheck={props.onCheck} />
          )}
          {props.menu && (
            <TouchableOpacity onPress={props.openMenuModal}>
              <View style={styles.menu}>
                <Feather name="more-vertical" style={styles.right_icon} />
              </View>
            </TouchableOpacity>
          )}
          {props.rightButton && (
            <View style={styles.right_btns}>
              <Button
                type={props.rightButtonType}
                text={props.rightButtonText}
                primaryText={props.primaryText}
                onPress={props.onPressRightBtn}
              />
            </View>
          )}
          {props.rightText && (
            <View style={styles.rightText}>
              <Text type="bold" primary smtitle>
                {props.rightText}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }
}

const mapPropsToState = state => {
  const {theme, accent_color, primary_color} = state.Theme;
  return {
    theme,
    primary_color,
    accent_color,
  };
};

export default connect(mapPropsToState)(ListItem);
