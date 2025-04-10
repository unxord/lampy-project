import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import styles from './MainContent.module.css';

const MainContent: React.FC = () => {
  return (
    <div className={styles.rightSection}>
      <div className={styles.commonContent}>
        <h2>Новости</h2>
        <hr />
        <p>
          В ближайшее время здесь появятся актуальные новости
          <br />
          Следите за обновлениями нашего сайта
          <br />
          Мы работаем над наполнением контентом
        </p>
      </div>

      <div className={styles.topContent}>
        <Row>
          <Col md={6} className={styles.column}>
            <h2>Информация</h2>
            <p>
              Этот раздел находится в разработке
              <br />
              Скоро здесь будет полезная информация
              <br />
              Благодарим за понимание
            </p>
            <br />
            <Button
              href="#"
              variant="secondary"
              size="sm"
            >
              Читать далее
            </Button>
          </Col>

          <Col md={6} className={`${styles.column} ${styles.borderLeft}`}>
            <h2>Объявления</h2>
            <p>
              Временный текст для заполнения пространства
              <br />
              Основной контент появится в ближайшее время
              <br />
              Пожалуйста, зайдите позже
            </p>
            <br />
            <Button href="#" variant="secondary" size="sm">
              Читать далее
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default MainContent;