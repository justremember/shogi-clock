import { Formik, Form, Field, ErrorMessage } from 'formik';

export default function ClockSettings({ onSettingsChange }) {
  return (
    <div>
      <Formik
        initialValues={{
          initialTime: 5000,
        }}
        onSubmit={onSettingsChange}
      >
        {({ /* isSubmitting */ }) => (
          <Form>
            <div className='form-group'>
              <label htmlFor='initialTime-id'>
                Initial Time
              </label>
              <Field id='initialTime-id' type='number' name='initialTime' className='form-control' />
              <ErrorMessage name='initialTime' />
            </div>
            <button type='submit' className='btn btn-secondary'>Update Settings</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
