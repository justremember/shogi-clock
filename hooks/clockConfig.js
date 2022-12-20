import { createContext, useState } from 'react';

export const initialFormValues = {
  clockMode: 'tournamentMode', // normalMode or TournamentMode
  // normalMode form values
  initialTime: { h: 0, m: 5, s: 0 },
  byo: { h: 0, m: 0, s: 10 },
  byoPeriods: 6,
  // tournamentMode form values
  totalTime: { h: 3, m: 0, s: 0 },
  timePerByoPeriod: { h: 0, m: 1, s: 0 }
}

const durationKeys = [/*'initialTime', 'byo', */'totalTime', 'timePerByoPeriod'];

const computeMs = (object, key) =>
  ((object[key].h * 60 + object[key].m) * 60 + object[key].s) * 1000

export const computeTotalByoPeriods = (formValues) => {
  return computeMs(formValues, 'totalTime') / computeMs(formValues, 'timePerByoPeriod');
}

export const formValuesToConfig = (formValues) => {
  switch (formValues.clockMode) {
    case 'normalMode':
      return {
        ...formValues,
        initialTime: computeMs(formValues, 'initialTime'),
        byo: computeMs(formValues, 'byo'),
        byoPeriods: formValues.byoPeriods
      };
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
  return useState(formValuesToConfig(initialFormValues));
}
