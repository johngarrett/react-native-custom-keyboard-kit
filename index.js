import React, { Component } from 'react';

import PropTypes from 'prop-types';

import {
  NativeModules,
  TextInput,
  findNodeHandle,
  AppRegistry,
  View,
  Text,
} from 'react-native';

const { CustomKeyboardKit } = NativeModules;

const {
  install, uninstall,
  insertText, backSpace, doDelete,
  moveLeft, moveRight,
  switchSystemKeyboard,
  hideKeyboard,
  setText,
  getText,
  hideStandardKeyboard
} = CustomKeyboardKit;

export {
  install, uninstall,
  insertText, backSpace, doDelete,
  moveLeft, moveRight,
  switchSystemKeyboard,
  hideKeyboard,
};

const keyboardTypeRegistry = {};

export function register(type, factory) {
  keyboardTypeRegistry[type] = factory;
}

class CustomKeyboardKitContainer extends Component {
  render() {
    const {tag, type} = this.props;
    const factory = keyboardTypeRegistry[type];
    if (!factory) {
      console.warn(`Custom keyboard type ${type} not registered.`);
      return null;
    }
    const Comp = factory();
    return <Comp tag={tag} />;
  }
}

AppRegistry.registerComponent("CustomKeyboardKit", () => CustomKeyboardKitContainer);

export class CustomTextInput extends Component {
  static propTypes = {
    ...TextInput.propTypes,
    customKeyboardType: PropTypes.string,
  }

  componentDidMount() {
      // allegedly, android doesn't like these
      //install(findNodeHandle(this.input), this.props.customKeyboardType);
  }

  componentWillUnmount() {
      //uninstall(findNodeHandle(this.input));
  }

        /*
  componentDidUpdate(prevProps) {
    if (this.props.customKeyboardType !== prevProps.customKeyboardType) {
      install(findNodeHandle(this.input), this.props.customKeyboardType);
    }
  }
  */

  onRef = ref => {
    this.input = ref;
  }

  focus = () => {
    if (this.input.__isMounted && !this.input.isFocused()) {
      this.input.focus()
    }
  }

  blur = () => {
    if (this.input.__isMounted && this.input.isFocused()) {
      this.input.blur()
    }
  }

  hideStandardKeyboard = () => {
    hideStandardKeyboard(findNodeHandle(this.input))
  }

  render() {
    const { customKeyboardType, ...others } = this.props;
    return (
        <TextInput {...others} ref={this.onRef} />
    );
  }
}
