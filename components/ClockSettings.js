import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { PersistFormikValues } from 'formik-persist-values';
import {
  initialFormValues,
  computeTotalByoPeriods,
  validateTotalByoPeriods,
  formValuesToConfig,
  computeMs,
  validateFormValues
} from '@/hooks/clockConfig';
import ClockTutorial from '@/components/ClockTutorial';
import ClockShowButton from '@/components/ClockShowButton';

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
        <HMSField name={name} hms='hours' errors={errors} />
        <HMSField name={name} hms='minutes' errors={errors} />
        <HMSField name={name} hms='seconds' errors={errors} />
      </div>
    </>
  )
}

export default function ClockSettings({ clockConfig, setClockConfig, clockState, clockDispatch }) {
  // console.log('clocksettings', configToFormValues(initialConfig));
  //
  const [showSettings, setShowSettings] = useState(false);
  return (
    <div id='clock-settings-with-show-button-parent'>
      <div id='clock-settings-with-show-button'>
        { showSettings &&
          <div id='clock-settings' className='border p-3 bg-light'>
            <h1>Shogi Clock</h1>
            <div className='py-1'>
              {/* Pause button */}
              <button className='btn btn-secondary me-1' onClick={() => {
                clockDispatch({type: 'togglePause', config: clockConfig})
              }}>
                {clockState.paused ? 'Resume' : 'Pause'}
              </button>
              {/* Reset button */}
              <button className='btn btn-warning' onClick={() => {
                if (confirm('Are you sure?')) {
                  clockDispatch({type: 'reset', config: clockConfig})
                  setShowSettings(false);
                }
              }}>
                Reset
              </button>
            </div>
            <h2>Settings</h2>
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
            <ClockTutorial />
          </div>
        }
        <ClockShowButton {...{ showSettings, setShowSettings}} />
      </div>
    </div>
  );
}
