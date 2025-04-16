import React, { useState, useEffect, useCallback } from 'react';
import { Button, Spinner, Alert, Card } from 'react-bootstrap';
import DOMPurify from 'dompurify';

import styles from "./HelpPage.module.css";
import { fetchContentForPage } from '../services/api';
import { CommonContentItem, PaginatedResponse } from '../types/api';

const HelpPage: React.FC = () => {
  const [contentData, setContentData] = useState<PaginatedResponse<CommonContentItem> | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadContent = useCallback(async (page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchContentForPage('help', page);
      setContentData(data);
      setCurrentPage(page);
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при загрузке контента.');
      setContentData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContent(currentPage);
  }, [loadContent, currentPage]);

  const handlePreviousPage = () => {
    if (contentData?.previous) {
      loadContent(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (contentData?.next) {
      loadContent(currentPage + 1);
    }
  };

  const createMarkup = (htmlContent: string) => {
    return { __html: DOMPurify.sanitize(htmlContent) };
  };

  return (
    <div className={styles.rightSection}>
      <div className={styles.commonContent}>
        <h3>Поддержка</h3>
        <hr />

        {isLoading && (
          <div className="text-center my-3">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </Spinner>
          </div>
        )}

        {error && !isLoading && (
          <Alert variant="danger">
            <Alert.Heading>Ошибка загрузки</Alert.Heading>
            <p>{error}</p>
            <Button onClick={() => loadContent(currentPage)} variant="outline-danger" size="sm">
              Попробовать снова
            </Button>
          </Alert>
        )}

        {!isLoading && !error && contentData && contentData.results.length > 0 && (
          <>
            {contentData.results.map((item) => (
              <Card key={item.id} className="mb-3 shadow-sm">
                <Card.Body>
                  <Card.Title dangerouslySetInnerHTML={createMarkup(item.title)} />
                  <Card.Text dangerouslySetInnerHTML={createMarkup(item.content)} />
                  <Card.Subtitle className="mb-2">
                    {item.display_author ? `Автор: ${item.display_author}` : ''}
                    {item.display_author && ' | '}
                    Дата: {new Date(item.created_at).toLocaleDateString('ru-RU')}
                  </Card.Subtitle>
                  {item.read_more_link && (
                    <Button href={item.read_more_link} target="_blank" rel="noopener noreferrer" variant="primary" size="sm">
                      Читать далее
                    </Button>
                  )}
                </Card.Body>
              </Card>
            ))}

            <div className="d-flex justify-content-between align-items-center mt-4">
              <Button
                variant={contentData?.previous ? "secondary" : "outline-secondary"}
                onClick={handlePreviousPage}
                disabled={!contentData?.previous || isLoading}
                aria-label="Перейти на предыдущую страницу"
              >
                &laquo; Предыдущая
              </Button>

              {contentData && contentData.count > 0 && (
                 <span className="text-muted">
                   Страница {currentPage} из {Math.ceil(contentData.count / 3)}
                 </span>
              )}
               {contentData && contentData.count === 0 && (
                 <span className="text-muted">Нет данных</span>
              )}

              <Button
                variant={contentData?.next ? "secondary" : "outline-secondary"}
                onClick={handleNextPage}
                disabled={!contentData?.next || isLoading}
                aria-label="Перейти на следующую страницу"
              >
                Следующая &raquo;
              </Button>
            </div>
          </>
        )}

        {!isLoading && !error && contentData && contentData.results.length === 0 && (
          <Alert variant="info">На данный момент новостей нет.</Alert>
        )}

      </div>
    </div>
  );
};

export default HelpPage;