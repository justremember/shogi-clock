import Head from 'next/head';
import Image from 'next/image';
import styles from '@/styles/Home.module.css';
import ClockBody from '@/components/ClockBody';

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <ClockBody />
    </div>
  );
}
