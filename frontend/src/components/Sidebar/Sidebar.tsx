import React from 'react';
import styles from './Sidebar.module.css';

const Sidebar: React.FC = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.col1}>
        <h1>Главное меню</h1>
        <div className={styles.box}>
          <ul>
            <li><a href="#">Пункт меню 1</a></li>
            <li><a href="#">Пункт меню 2</a></li>
            <li><a href="#">Пункт меню 3</a></li>
            <li><a href="#">Пункт меню 4</a></li>
            <li><a href="#">Пункт меню 5</a></li>
            <li><a href="#">Пункт меню 6</a></li>
            <li><a href="#">Пункт меню 7</a></li>
            <li><a href="#">Пункт меню 8</a></li>
            <li><a href="#">Пункт меню 9</a></li>
          </ul>
        </div>
      </div>

      <div className={styles.col1}>
        <h1>Блок</h1>
        <div className={styles.box}>
          <p>Здесь будет размещен какой-то контент</p>
          <p>Дополнительная информация появится позже</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;