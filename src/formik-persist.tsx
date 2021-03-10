import * as React from 'react';
import { FormikProps, connect } from 'formik';
import debounce from 'lodash.debounce';
import isEqual from 'react-fast-compare';
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface PersistProps {
  name: string;
  debounce?: number;
  isSessionStorage?: boolean;
}

class PersistImpl extends React.Component<
  PersistProps & { formik: FormikProps<any> },
  {}
> {
  static defaultProps = {
    debounce: 300,
  };

  saveForm = async debounce((data: FormikProps<{}>) => {
      await AsyncStorage.setItem(this.props.name, JSON.stringify(data));
  }, this.props.debounce);

  componentDidUpdate(prevProps: PersistProps & { formik: FormikProps<any> }) {
    if (!isEqual(prevProps.formik, this.props.formik)) {
      this.saveForm(this.props.formik);
    }
  }

  async componentDidMount() {
    const maybeState = await AsyncStorage.getItem(this.props.name)  
    if (maybeState && maybeState !== null) {
      this.props.formik.setFormikState(JSON.parse(maybeState));
    }
  }

  render() {
    return null;
  }
}

export const Persist = connect<PersistProps, any>(PersistImpl);
