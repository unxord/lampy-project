import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import styles from './Header.module.css';

const Header: React.FC = () => {
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
            <Nav.Link href="#home" className={styles.navLink}>Главная</Nav.Link>
            <Nav.Link href="#about" className={styles.navLink}>О проекте</Nav.Link>
            <Nav.Link href="#help" className={styles.navLink}>Помощь</Nav.Link>
            <Nav.Link href="#contact" className={styles.navLink}>Контакты</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;