import { createContext, useState } from 'react';

export const initialFormValues = {
  clockMode: 'normalMode', // normalMode or tournamentMode
  // normalMode form values
  initialTime: { h: 0, m: 5, s: 0 },
  byo: { h: 0, m: 0, s: 30 },
  byoPeriods: 1,
  // tournamentMode form values
  totalTime: { h: 3, m: 0, s: 0 },
  timePerByoPeriod: { h: 0, m: 1, s: 0 },

  layout: 'settingsOnSide', // settingsOnTop or settingsOnSide
}

const durationKeys = [/*'initialTime', 'byo', */'totalTime', 'timePerByoPeriod'];

export const computeMs = (hms) =>
  ((hms.h * 60 + hms.m) * 60 + hms.s) * 1000

export const computeTotalByoPeriods = (formValues) => {
  return computeMs(formValues.totalTime) / computeMs(formValues.timePerByoPeriod);
}

export const formValuesToConfig = (formValues) => {
  switch (formValues.clockMode) {
    case 'normalMode':
      return {
        ...formValues,
        initialTime: computeMs(formValues.initialTime),
        byo: computeMs(formValues.byo),
        byoPeriods: formValues.byoPeriods
      };
    case 'tournamentMode':
      return {
        ...formValues,
        initialTime: 0,
        byo: computeMs(formValues.timePerByoPeriod),
        byoPeriods: computeTotalByoPeriods(formValues)
      };
  }
}

export function useClockConfig() {
  return useState(formValuesToConfig(initialFormValues));
}

export function validateFormValues(values) {
  const validateHms = (hms) => {
    const errors = {};
    if (!Number.isInteger(hms.h) || hms.h < 0 || hms.h > 99) errors.h = 'Hours must be between 0 and 99';
    if (!Number.isInteger(hms.m) || hms.m < 0 || hms.m > 59) errors.m = 'Minutes must be between 0 and 59';
    if (!Number.isInteger(hms.s) || hms.s < 0 || hms.s > 59) errors.s = 'Seconds must be between 0 and 59';
    if (Object.keys(errors).length) return errors;
    else return undefined;
  }
  const errors = {};
  let v;
  switch (values.clockMode) {
    case 'normalMode':
      // basic validation of HMS values
      if (v = validateHms(values.initialTime)) errors.initialTime = v;
      if (v = validateHms(values.byo)) errors.byo = v;
      // basic integer validation of byo periods
      if (!Number.isInteger(values.byoPeriods) || values.byoPeriods < 0 || values.byoPeriods > 10000) {
        errors.byoPeriods = 'Byoyomi Periods must be between 0 and 10000';
      }
      // if either one but not both fields are zero
      if ((computeMs(values.byo) === 0) !== (values.byoPeriods === 0)) {
        errors.byoPeriods = 'Byoyomi & Byoyomi Periods must either be both non-zero, or be both zero';
      }
      // if all fields are zero
      if (computeMs(values.initialTime) === 0 && computeMs(values.byo) === 0 && values.byoPeriods === 0) {
        errors.byoPeriods = 'At least one field must be non-zero';
      }
      break;
    case 'tournamentMode':
      // basic validation of HMS values
      if (v = validateHms(values.totalTime)) errors.totalTime = v;
      if (v = validateHms(values.timePerByoPeriod)) errors.timePerByoPeriod = v;
      // if the time per byoyomi period does not evenly divide the total time
      if (computeMs(values.totalTime) % computeMs(values.timePerByoPeriod) !== 0) {
        errors.totalByoPeriods = 'Total Time must be evenly divisible by the time per byoyomi period';
      }
      // if either value is zero
      if (computeMs(values.totalTime) === 0 || computeMs(values.timePerByoPeriod) === 0) {
        errors.totalByoPeriods = 'Both values must be non-zero';
      }
      break;
    default:
      errors.clockMode = 'Invalid clock mode';
  }
  console.log(errors);
  return errors;
}
