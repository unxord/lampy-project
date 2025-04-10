import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      Copyright &copy; {currentYear} Lampy
    </footer>
  );
};

export default Footer;