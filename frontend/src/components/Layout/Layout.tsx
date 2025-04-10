import React, { PropsWithChildren } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import Footer from '../Footer/Footer';
import styles from './Layout.module.css';

const Layout: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <div className={styles.wrapper}>
      <Header />
      <Container fluid className={styles.pageContent}>
        <Row>
          <Col md={3}>
            <Sidebar />
          </Col>
          <Col md={9}>
            {children}
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default Layout;