import { Formik, Form, Field, ErrorMessage } from 'formik';
import { PersistFormikValues } from 'formik-persist-values';
import {
  initialFormValues,
  computeTotalByoPeriods,
  validateTotalByoPeriods,
  formValuesToConfig,
  validateFormValues
} from '@/hooks/clockConfig';

function HMSField({ name, hms, errors }) {
  return (
    <div className='col'>
      <div className='form-floating'>
        <Field
          id={`${name}.${hms[0]}-id`} // hms[0] is either 'h', 'm', or 's'
          type='number'
          name={`${name}.${hms[0]}`}
          className={
            `form-control ${
              errors[name]
              && errors[name][hms[0]]
              && 'is-invalid'
            }`
          }
          placeholder='0'
        />
        <label htmlFor={`${name}.${hms[0]}-id`}>
          {hms}
        </label>
        <div className='invalid-feedback'>
          <ErrorMessage name={`${name}.${hms[0]}`} />
        </div>
      </div>
    </div>
  )
}

function DurationField({ name, labelName, errors }) {
  return (
    <>
      <div className='row my-2 gx-2'>
        <label>
          {labelName}
        </label>
        <HMSField hms='hours'   {...{ name, errors }} />
        <HMSField hms='minutes' {...{ name, errors }} />
        <HMSField hms='seconds' {...{ name, errors }} />
      </div>
    </>
  )
}

export default function ClockSettingsForm({ setClockConfig, clockDispatch, setShowSettings }) {
  return (
    <Formik
      initialValues={initialFormValues}
      validate={validateFormValues}
      onSubmit={(values) => {
        if (confirm('Are you sure? Clock will be reset.')) {
          console.log(values);
          const config = formValuesToConfig(values);
          setClockConfig(config);
          clockDispatch({ type: 'reset', config });
          setShowSettings(false);
        }
      }}
    >
      {({ values, errors }) => (
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
                errors={errors}
              />
              <DurationField
                name='byo'
                labelName='Byoyomi'
                errors={errors}
              />

              <label htmlFor='byoPeriods-id'>
                Byoyomi Periods
              </label>
              <Field
                id='byoPeriods-id'
                type='number'
                name='byoPeriods'
                className={
                  `form-control ${
                    errors.byoPeriods
                    && 'is-invalid'
                  }`
                }
              />
              <div className='invalid-feedback'>
                <ErrorMessage name='byoPeriods' />
              </div>
            </>
          )}
          { values.clockMode === 'tournamentMode' && (
            <>
              <DurationField
                name='totalTime'
                labelName='Total Time'
                errors={errors}
              />
              <DurationField
                name='timePerByoPeriod'
                labelName='Time Per Byoyomi Period'
                errors={errors}
              />
              { errors.totalByoPeriods ?
                <div className='error-feedback'>
                  {`Error: ${errors.totalByoPeriods}`}
                </div>
                :
                <div>
                  {`Total Byoyomi Periods: ${computeTotalByoPeriods(values)}`}
                </div>
              }
            </>
          )}
          <div className='mt-2'>
            <button type='submit' className='btn btn-secondary'>Update Settings</button>
          </div>
          <PersistFormikValues name='clock-settings' />
        </Form>
      )}
    </Formik>
  )
}
