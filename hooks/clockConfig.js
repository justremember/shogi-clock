import { createContext, useState } from 'react';

export const initialConfig = {
  clockMode: 'tournamentMode',
  initialTime: 5*1000,
  byo: 10*1000,
  byoPeriods: 3,
  totalTime: 1000*60*60*3,
  timePerByoPeriod: 1000*60,
}

export const initialFormValues = {
}

const durationKeys = [/*'initialTime', 'byo', */'totalTime', 'timePerByoPeriod'];

export const configToFormValues = (config) => {
  const arrOfHMSObjects = durationKeys.map((k) => {
    return {
      [k + 'H']: config[k] / (1000 * 60 * 60) | 0,
      [k + 'M']: (config[k] / (1000 * 60) | 0) % 60,
      [k + 'S']: (config[k] / (1000) | 0) % 60,
    }
  })
  return {
    ...config,
    ...Object.assign({}, ...arrOfHMSObjects)
  };
}

const computeMs = (object, key) =>
  ((object[key + 'H'] * 60 + object[key + 'M']) * 60 + object[key + 'S']) * 1000

export const computeTotalByoPeriods = (formValues) => {
  return computeMs(formValues, 'totalTime') / computeMs(formValues, 'timePerByoPeriod');
}

export const formValuesToConfig = (formValues) => {
  switch (formValues.clockMode) {
    case 'normalMode':
      return formValues;
    case 'tournamentMode':
      return {
        ...formValues,
        initialTime: 0,
        byo: computeMs(formValues, 'timePerByoPeriod'),
        byoPeriods: computeTotalByoPeriods(formValues)
      };
  }
}

export function useClockConfig() {
  return useState(initialConfig);
}
