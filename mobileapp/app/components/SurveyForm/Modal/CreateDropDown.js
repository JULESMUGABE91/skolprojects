import React from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import styles from '../styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Text} from '../../Text';
import {Button} from '../../Button';
import {Input} from '../../Input';
import uuid4 from '../../../utils/uuid4';

class CreateDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAll: true,
      options: [
        {
          _id: uuid4(),
        },
      ],
      error: {},
      isFromCopy: false,
    };
  }

  componentDidMount() {
    if (this.props.selected_item && this.props.selected_item.dropdown_options) {
      this.setState({
        options: this.props.selected_item.dropdown_options,
      });

      for (let [
        i,
        option,
      ] of this.props.selected_item.dropdown_options.entries()) {
        this.setState({
          ['option_' + i]: option.value,
        });
      }
    }
  }

  onChangeText(i, e) {
    let {error, options} = this.state;

    delete error['option_' + i];

    options[i]['value'] = e;

    this.setState({['option_' + i]: e, options});
  }

  renderNewInput(i) {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{flex: 1, marginRight: 15}}>
          <Input
            placeholder={'Enter option ' + (i + 1)}
            value={this.state['option_' + i]}
            onChangeText={e => this.onChangeText(i, e)}
            error={this.state.error['option_' + i]}
            multiline
          />
        </View>
        {this.state.options.length - 1 === i ? (
          <TouchableOpacity onPress={() => this.handlePressNew(i)}>
            <View style={styles.add_new_dropdown}>
              <MaterialCommunityIcons
                name="plus"
                style={styles.add_new_dropdown_icon}
              />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => this.handlePressRemove(i)}>
            <View style={[styles.add_new_dropdown, styles.remove_new_dropdown]}>
              <MaterialCommunityIcons
                name="minus"
                style={styles.remove_new_dropdown_icon}
              />
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  onCloseModal() {
    this.props.handleCloseDropdownModal();
    this.props.handleCloseOptionModal();
  }

  handlePressNew(i) {
    let {options, error} = this.state;

    if (!options[i].value || (options[i].value && options[i].value === '')) {
      error['option_' + i] = 'Option ' + (i + 1) + ' is required';
    }

    if (Object.keys(error).length === 0) {
      options.push({
        _id: uuid4(),
      });
    }

    this.setState({options, error});
  }

  handlePressRemove(i) {
    let {options, error} = this.state;

    options.splice(i, 1);

    delete error['option_' + i];

    this.setState({options, error});
  }

  handleCopyOptions(menus) {
    this.setState({isCopying: true});

    let data = [];
    for (let [i, el] of menus.entries()) {
      data.push({
        ...el,
        _id: uuid4(),
      });

      this.setState({
        ['option_' + i]: el.value,
      });
    }

    this.setState({options: data, isFromCopy: true});
  }

  onSave() {
    const {options, isAll} = this.state;

    this.props.onAddRemoveDropdown({
      options,
      isAll,
    });

    this.onCloseModal();
  }

  render() {
    const props = this.props;
    console.log(props);

    const whereToCopyFrom = [];

    if (props?.selected_item && props?.selected_item?.selected_item) {
      const {question_index, option_index} =
        props?.selected_item?.selected_item;

      if (props.questions && props.questions.length > 0) {
        const {options, question} = props.questions[question_index];
        for (let [i, option] of options.entries()) {
          if (
            i !== option_index &&
            option.dropdown_options &&
            option.dropdown_options.length > 0
          ) {
            whereToCopyFrom.push({
              question,
              menus: option.dropdown_options,
            });
          }
        }
      }
    }

    return (
      <View style={[styles.menuModalContainer, {flex: 1, paddingBottom: 20}]}>
        <View style={styles.header_create_dropdown}>
          <Text type="bold" style={styles.header_create_dropdown_title}>
            {props?.selected_item?.option || 'Dropdown Option'}
          </Text>
          <TouchableOpacity onPress={this.onCloseModal.bind(this)}>
            <View style={styles.close_modal}>
              <MaterialCommunityIcons
                name="close"
                style={styles.close_modal_icon}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.content_create_dropdown}>
          <ScrollView
            contentContainerStyle={{flexGrow: 1, paddingBottom: 50}}
            keyboardShouldPersistTaps="always">
            <>
              {!this.state.isFromCopy &&
                whereToCopyFrom.length > 0 &&
                whereToCopyFrom.map((item, i) => {
                  return (
                    <TouchableOpacity
                      key={i}
                      onPress={() => this.handleCopyOptions(item.menus)}>
                      <View style={styles.copy_from}>
                        <Text
                          style={styles.copy_from_txt}
                          numberOfLines={1}
                          type={'bold'}>
                          Copy from {item.question}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              {this.state.options.map((option, o) => {
                return this.renderNewInput(o);
              })}
            </>
          </ScrollView>
        </View>
        <View style={{paddingHorizontal: 15}}>
          <TouchableOpacity
            onPress={() => this.setState({isAll: !this.state.isAll})}>
            <View style={styles.apply_container}>
              <View
                style={[
                  styles.apply_checkbox,
                  this.state.isAll && {borderColor: this.props.primary_color},
                ]}>
                <MaterialCommunityIcons
                  name="check"
                  style={[
                    styles.apply_checkbox_icon,
                    this.state.isAll && {color: this.props.primary_color},
                  ]}
                />
              </View>
              <Text style={styles.apply_checkbox_text}>
                Apply to all option choice
              </Text>
            </View>
          </TouchableOpacity>
          <Button text="Save" onPress={this.onSave.bind(this)} />
        </View>
      </View>
    );
  }
}

const mapPropsToState = state => {
  const {language} = state.Language;
  const {accent_color, primary_color} = state.Theme;
  return {
    language,
    accent_color,
    primary_color,
  };
};

export default connect(mapPropsToState)(CreateDropdown);
