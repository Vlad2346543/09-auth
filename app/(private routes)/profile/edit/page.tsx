'use client';

import Image from 'next/image';
import css from './EditProfile.module.css';
import { useEffect, useState } from 'react';
import { getMe, updateMe } from '@/lib/api/clientApi';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { User } from '@/types/user';

const EditProfile = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const setUser = useAuthStore(state => state.setUser);
  const router = useRouter();

  useEffect(() => {
    getMe().then(setUserData);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Запобігаємо перезавантаженню сторінки
    
    if (!userData?.username) return;

    try {
      // Використовуємо значення безпосередньо зі стейту, оскільки компонент контрольований
      const updatedUser = await updateMe({ username: userData.username });

      setUser(updatedUser);
      router.push('/profile');
    } catch (error) {
      console.error('Oops, some error:', error);
    }
  };

  const handleReturn = () => {
    router.back();
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        {userData?.avatar && (
          <Image
            src={userData.avatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        )}

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              name="username"
              type="text"
              className={css.input}           
              value={userData?.username || ''} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUserData(prev =>
                  prev ? { ...prev, username: e.target.value } : null
                )
              }
            />
          </div>

          <div className={css.usernameWrapper}>
            <label htmlFor="email">Email:</label>
            {/* ВІЗУАЛЬНО ОЧЕВИДНО, ЩО ПОЛЕ ТІЛЬКИ ДЛЯ ЧИТАННЯ */}
            <input
              id="email"
              type="email"
              value={userData?.email || ''}
              disabled // Робить поле сірим та неактивним
              readOnly // Додатковий захист від введення
              className={`${css.input} ${css.disabledInput}`} 
            />
          </div>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>

            <button
              type="button"
              className={css.cancelButton}
              onClick={handleReturn}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default EditProfile;