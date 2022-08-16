import { Avatar, Card, Col, Row } from 'antd';
import { useEffect } from 'react';
import useLatestPosts from '../../core/hooks/useLatestPosts';

export default function LatestPosts() {
  const { posts, fetchPosts } = useLatestPosts();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <Row gutter={16}>
      {posts?.map((post) => {
        return (
          <Col key={post.id} span={8}>
            <Card
              cover={
                <img
                  alt={post.title}
                  src={post.imageUrls.small}
                  style={{
                    height: 168,
                    objectFit: 'cover',
                  }}
                />
              }
            >
              <Card.Meta
                avatar={
                  <Avatar
                    src={post.editor.avatarUrls.small}
                  />
                }
                title={post.title}
              />
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}
