import { createContext, useState } from 'react';

export const initialConfig = {
  initialTime: 5*1000,
  byo: 10*1000,
  byoRounds: 3
}

export function useClockConfig() {
  return useState(initialConfig);
}
