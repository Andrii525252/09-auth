import { getServerMe } from '@/lib/api/serverApi';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import css from './ProfilePage.module.css';

export const metadata: Metadata = {
  title: 'Profile | NoteHub',
  description: 'View and manage your NoteHub profile and account details.',
  openGraph: {
    title: 'Profile | NoteHub',
    description: 'View and manage your NoteHub profile and account details.',
    url: 'http://localhost:3000/notes/action/create',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'Profile | NoteHub',
      },
    ],
  },
};

export default async function Profile() {
  const user = await getServerMe();
  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          {user?.avatar && (
            <Image
              src={user?.avatar}
              alt="User Avatar"
              width={120}
              height={120}
              className={css.avatar}
            />
          )}
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user?.username}</p>
          <p>Email: {user?.email}</p>
        </div>
      </div>
    </main>
  );
}
