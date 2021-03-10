import * as React from "react";
import { connect } from "formik";
import debounce from "debounce-async";
import isEqual from "react-fast-compare";
import AsyncStorage from "@react-native-async-storage/async-storage";

class PersistImpl extends React.Component {
  static defaultProps = {
    debounce: 300,
  };
  constructor(props) {
    super(props);

    this.state = {};
    this.saveForm = this.saveForm.bind(this);
  }

  async saveForm(data) {
    await AsyncStorage.setItem(this.props.name, JSON.stringify(data));
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.formik, this.props.formik)) {
      debounce(this.saveForm(this.props.formik), this.props.debounce);
    }
  }

  async componentDidMount() {
    const maybeState = await AsyncStorage.getItem(this.props.name);
    if (maybeState && maybeState !== null) {
      this.props.formik.setFormikState(JSON.parse(maybeState));
    }
  }

  render() {
    return null;
  }
}

export const Persist = connect(PersistImpl);
