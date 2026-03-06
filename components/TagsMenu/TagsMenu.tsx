'use client';

import { NoteTag } from '@/types/note';
import css from './TagsMenu.module.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const TagsMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const tags: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

  const pathname = usePathname();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className={css.menuContainer}>
      <button className={css.menuButton} onClick={() => setIsOpen(!isOpen)}>
        Notes ▾
      </button>
      {isOpen && (
        <ul className={css.menuList}>
          <li className={css.menuItem} onClick={() => setIsOpen(false)}>
            <Link href={`/notes/filter/All`} className={css.menuLink}>
              All
            </Link>
          </li>
          {tags.map(tag => (
            <li className={css.menuItem} key={tag} onClick={() => setIsOpen(false)}>
              <Link href={`/notes/filter/${tag}`} className={css.menuLink}>
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TagsMenu;
