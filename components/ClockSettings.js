import { useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import {
  initialFormValues,
  computeTotalByoPeriods,
  formValuesToConfig
} from '@/hooks/clockConfig';

function HMSField({ name, hms }) {
  return (
    <div className='col'>
      <div className='form-floating'>
        <Field
          id={`${name}.${hms[0]}-id`} // hms[0] is either 'h', 'm', or 's'
          type='number'
          name={`${name}.${hms[0]}`}
          className='form-control'
          placeholder='0'
        />
        <label htmlFor={`${name}.${hms[0]}-id`}>
          {hms}
        </label>
        <ErrorMessage name={`${name}.${hms[0]}`} />
      </div>
    </div>
  )
}

function DurationField({ name, labelName }) {
  return (
    <>
      <div className='row my-2 gx-2'>
        <label>
          {labelName}
        </label>
        <HMSField name={name} hms='hours' />
        <HMSField name={name} hms='minutes' />
        <HMSField name={name} hms='seconds' />
      </div>
    </>
  )
}

export default function ClockSettings({ setClockConfig, clockDispatch }) {
  // console.log('clocksettings', configToFormValues(initialConfig));
  return (
    <div>
      <Formik
        initialValues={initialFormValues}
        onSubmit={(values) => {
          if (confirm('Are you sure? Clock will be reset.')) {
            console.log(values);
            const config = formValuesToConfig(values);
            setClockConfig(config);
            clockDispatch({ type: 'reset', config });
          }
        }}
      >
        {({ values }) => (
          <Form>
            <div className='form-check'>
              <label className='form-check-label'>
                <Field
                  className='form-check-input'
                  type='radio'
                  name='clockMode'
                  value='normalMode'
                />
                Normal Mode
              </label>
            </div>
            <div className='form-check'>
              <label className='form-check-label'>
                <Field
                  className='form-check-input'
                  type='radio'
                  name='clockMode'
                  value='tournamentMode'
                />
                Tournament Mode
              </label>
            </div>
            { values.clockMode === 'normalMode' && (
              <>
                <DurationField
                  name='initialTime'
                  labelName='Initial Time'
                />
                <DurationField
                  name='byo'
                  labelName='Byoyomi'
                />

                <label htmlFor='byoPeriods-id'>
                  Byoyomi Periods
                </label>
                <Field id='byoPeriods-id' type='number' name='byoPeriods' className='form-control' />
                <ErrorMessage name='byoPeriods' />
              </>
            )}
            { values.clockMode === 'tournamentMode' && (
              <>
                <DurationField
                  name='totalTime'
                  labelName='Total Time'
                />
                <DurationField
                  name='timePerByoPeriod'
                  labelName='Time Per Byoyomi Period'
                />
                <div>
                  {`Total Byoyomi Periods: ${computeTotalByoPeriods(values)}`}
                </div>
              </>
            )}

            <button type='submit' className='btn btn-secondary'>Update Settings</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
