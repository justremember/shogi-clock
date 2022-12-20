import { useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import {
  initialConfig,
  configToFormValues,
  computeTotalByoPeriods,
  formValuesToConfig
} from '@/hooks/clockConfig';

function HMSField({ name, hms }) {
  return (
    <div className='col'>
      <div className='form-floating'>
        <Field
          id={`${name}${hms[0]}-id`} // hms[0] is either 'H', 'M', or 'S'
          type='number'
          name={`${name}${hms[0]}`}
          className='form-control'
          placeholder='0'
        />
        <label htmlFor={`${name}${hms[0]}-id`}>
          {hms}
        </label>
        <ErrorMessage name={`${name}`} />
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
        <HMSField name={name} hms='Hours' />
        <HMSField name={name} hms='Minutes' />
        <HMSField name={name} hms='Seconds' />
      </div>
    </>
  )
}

export default function ClockSettings({ clockConfig, setClockConfig, clockDispatch }) {
  console.log('clocksettings', configToFormValues(initialConfig));
  return (
    <div>
      <Formik
        initialValues={configToFormValues(initialConfig)}
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
                <label htmlFor='initialTime-id'>
                  Initial Time
                </label>
                <Field id='initialTime-id' type='number' name='initialTime' className='form-control' />
                <ErrorMessage name='initialTime' />

                <label htmlFor='byo-id'>
                  Byoyomi
                </label>
                <Field id='byo-id' type='number' name='byo' className='form-control' />
                <ErrorMessage name='byo' />

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
