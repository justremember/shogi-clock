import Head from 'next/head';
import Image from 'next/image';
import styles from '@/styles/Home.module.css';
import Clock from '@/components/Clock';

export default function Home() {
  return (
    <div>
      <h1>Shogi Clock</h1>
      <Clock />
    </div>
  );
}
