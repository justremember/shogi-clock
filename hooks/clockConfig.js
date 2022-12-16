import { createContext, useState } from 'react';

export const initialConfig = {
  initialTime: 60*1000,
  byo: 60*1000,
  byoRounds: 1
}

export const ClockConfigContext = createContext();

export function useClockConfig() {
  return useState(initialConfig);
}
