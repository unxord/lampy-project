import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const getNavLinkClass = ({ isActive }: { isActive: boolean }): string => {
    return `${styles.navLink} ${isActive ? styles.active : ''}`;
  };
  return (
    <header className={styles.header}>
      <div className={styles.topBanner}>
        <h1>
          <a href="/">Lampy</a>
        </h1>
        <p>Без сложностей. Только вы и ваши мысли.</p>
      </div>

      <Navbar className={styles.navigationBar} variant="dark">
        <Container fluid className="justify-content-center">
          <Nav>
              <NavLink to="/" className={getNavLinkClass} end>
                Главная
              </NavLink>
              <NavLink to="/about" className={getNavLinkClass}>
                О проекте
              </NavLink>
              <NavLink to="/help" className={getNavLinkClass}>
                Помощь
              </NavLink>
              <NavLink to="/contact" className={getNavLinkClass}>
                Контакты
              </NavLink>
            </Nav>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;