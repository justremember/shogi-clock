import Timer from '@/components/Timer';
import { useState, useEffect } from 'react';

export default function ClockBody() {
  return (
    <div>
      <Timer />
      <Timer />
    </div>
  );
}
