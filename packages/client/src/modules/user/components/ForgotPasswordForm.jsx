import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { FontAwesome } from '@expo/vector-icons';
import { View, StyleSheet, Text, Keyboard } from 'react-native';
import Field from '../../../utils/FieldAdapter';
import { RenderField } from '../../common/components/native';
import { Button } from '../../common/components';
import { required, email, validateForm } from '../../../../../common/validation';

const forgotPasswordFormSchema = {
  email: [required, email]
};

const validate = values => validateForm(values, forgotPasswordFormSchema);

const ForgotPasswordForm = ({ handleSubmit, values, sent }) => {
  return (
    <View style={styles.formContainer}>
      <View style={styles.alertContainer}>
        {sent && (
          <View style={styles.alertWrapper}>
            <View style={styles.alertIconWrapper}>
              <FontAwesome name="check-circle" size={30} style={{ color: '#155724' }} />
            </View>
            <View style={styles.alertTextWrapper}>
              <Text style={styles.alertText}>Reset password instructions have been emailed to you.</Text>
            </View>
          </View>
        )}
      </View>
      <View style={styles.form}>
        <View>
          <Field
            name="email"
            component={RenderField}
            type="email"
            placeholder="Email"
            value={values.email}
            keyboardType="email-address"
            placeholderTextColor="#8e908c"
          />
        </View>
        <View style={styles.submit}>
          <Button onPress={handleSubmit}>Send Reset Instructions</Button>
        </View>
      </View>
    </View>
  );
};

ForgotPasswordForm.propTypes = {
  handleSubmit: PropTypes.func,
  values: PropTypes.object,
  sent: PropTypes.bool
};

const ForgotPasswordFormWithFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: () => ({ email: '' }),
  async handleSubmit(values, { setErrors, resetForm, props: { onSubmit } }) {
    Keyboard.dismiss();
    await onSubmit(values)
      .then(() => {
        resetForm();
      })
      .catch(e => setErrors(e));
  },
  validate: values => validate(values),
  displayName: 'ForgotPasswordForm' // helps with React DevTools
});

const styles = StyleSheet.create({
  submit: {
    paddingTop: 30,
    paddingBottom: 15
  },
  formContainer: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  form: {
    flex: 2
  },
  alertWrapper: {
    backgroundColor: '#d4edda',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 5,
    paddingVertical: 10
  },
  alertContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  alertTextWrapper: {
    padding: 5,
    flex: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  alertIconWrapper: {
    padding: 5,
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  alertText: {
    color: '#155724',
    fontSize: 20,
    fontWeight: '400'
  }
});

export default ForgotPasswordFormWithFormik(ForgotPasswordForm);