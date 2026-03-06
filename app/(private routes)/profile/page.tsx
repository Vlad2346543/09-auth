import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getMeServer } from "@/lib/api/serverApi";
import { redirect } from 'next/navigation';
import css from './Profile.module.css';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Profile | NoteHub',
  description: 'View your personal profile information',
};

export default async function ProfilePage() {
  const user = await getMeServer();

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar || '/default-avatar.png'}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
            priority
          />
        </div>

        <div className={css.profileInfo}>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      </div>
    </main>
  );
}
