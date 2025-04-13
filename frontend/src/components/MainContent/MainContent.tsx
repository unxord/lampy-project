import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import styles from './MainContent.module.css';
import { fetchMainContent } from '../../services/api';
import { MainContentItem } from '../../types/api';

type ContentType = MainContentItem['content_type'];
const CONTENT_TYPES_ORDER: ContentType[] = ['INFO', 'ANNOUNCE', 'NEWS'];

const MainContent: React.FC = () => {
  const [contentItems, setContentItems] = useState<MainContentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMainContent();
        const sortedData = data.sort((a, b) => {
            if (a.content_type < b.content_type) return -1;
            if (a.content_type > b.content_type) return 1;
            return a.order - b.order;
        });
        setContentItems(sortedData);
      } catch (err) {
        console.error("Error fetching main content:", err);
        setError(err instanceof Error ? err.message : 'Произошла неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  const typePriorities = useMemo(() => {
    const priorities: Partial<Record<ContentType, number>> = {};
    if (!Array.isArray(contentItems)) {
        return priorities;
    }
    contentItems.forEach(item => {
      if (priorities[item.content_type] === undefined || item.order < priorities[item.content_type]!) {
        priorities[item.content_type] = item.order;
      }
    });
    return priorities;
  }, [contentItems]);

  const orderedContentTypes = useMemo(() => {
    const presentTypes = CONTENT_TYPES_ORDER.filter(type => typePriorities[type] !== undefined);
    return presentTypes.sort((typeA, typeB) => {
      const priorityA = typePriorities[typeA] ?? Infinity;
      const priorityB = typePriorities[typeB] ?? Infinity;
      return priorityA - priorityB;
    });
  }, [typePriorities]);

  const renderContentBlock = (type: ContentType) => {
    if (!Array.isArray(contentItems)) {
        console.error('renderContentBlock received non-array items:', contentItems);
        return null;
    }

    const filteredItems = contentItems.filter(item => item.content_type === type);

    if (filteredItems.length === 0) {
      return null;
    }

    const blockTitle = type === 'INFO' ? 'Информация' : type === 'ANNOUNCE' ? 'Объявления' : 'Новости';

    return (
       <div className={styles.column}>
          <h2>{blockTitle}</h2>
          {filteredItems.map((item, index) => (
            <React.Fragment key={item.id}>
                {item.title !== blockTitle && <h3>{item.title}</h3>}
                <p>{item.content}</p>
                {item.read_more_link && (
                    <Button href={item.read_more_link} variant="secondary" size="sm" className="mt-2">
                    Читать далее
                    </Button>
                )}
                {index < filteredItems.length - 1 && <hr className={styles.commonContent} /> }
            </React.Fragment>
          ))}
       </div>
    );
  };

  return (
    <div className={styles.commonContent}>
      {loading && (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </Spinner>
        </div>
      )}

      {error && (
        <Alert variant="danger">
          Ошибка загрузки контента: {error}
        </Alert>
      )}

      {!loading && !error && orderedContentTypes.length > 0 && (
        <>
          <Row className={styles.topContent}>
            <Col md={12}>
              {renderContentBlock(orderedContentTypes[0])}
              {<hr className={styles.commonContent} />}
            </Col>
          </Row>

          {orderedContentTypes.length > 1 && (
             Array.from({ length: Math.ceil((orderedContentTypes.length - 1) / 2) }).map((_, rowIndex) => {
               const typeIndex1 = rowIndex * 2 + 1;
               const typeIndex2 = rowIndex * 2 + 2;
               const type1 = orderedContentTypes[typeIndex1];
               const type2 = orderedContentTypes[typeIndex2];

               return (
                 <Row key={rowIndex} className="mt-3">
                   {type1 && (
                     <Col md={6} key={type1}>
                       {renderContentBlock(type1)}
                     </Col>
                   )}

                   {type2 ? (
                     <Col md={6} key={type2} className={styles.borderLeft}>
                       {renderContentBlock(type2)}
                     </Col>
                   ) : (
                     type1 && <Col md={6}></Col>
                   )}
                 </Row>
               );
             })
          )}
        </>
      )}
    </div>
  );
};

export default MainContent;