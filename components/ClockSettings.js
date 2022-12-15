import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useContext } from 'react';
import { ClockContext, initialState } from '@/hooks/clockState';

export default function ClockSettings() {
  const { clockState, clockDispatch } = useContext(ClockContext);

  return (
    <div>
      <Formik
        initialValues={initialState.config}
        onSubmit={(config) => {
          if (confirm('Are you sure? Clock will be reset.')) {
            clockDispatch({ type: 'updateConfig', config });
            clockDispatch({ type: 'reset' });
          }
        }}
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

            <div className='form-group'>
              <label htmlFor='byo-id'>
                Byoyomi
              </label>
              <Field id='byo-id' type='number' name='byo' className='form-control' />
              <ErrorMessage name='byo' />
            </div>

            <div className='form-group'>
              <label htmlFor='byoRounds-id'>
                Byoyomi Rounds
              </label>
              <Field id='byoRounds-id' type='number' name='byoRounds' className='form-control' />
              <ErrorMessage name='byoRounds' />
            </div>

            <button type='submit' className='btn btn-secondary'>Update Settings</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
