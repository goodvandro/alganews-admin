import { WarningFilled } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Popconfirm,
  Progress,
  Row,
  Skeleton,
  Space,
  Switch,
  Table,
  Tooltip,
  Typography,
} from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import confirm from 'antd/lib/modal/confirm';
import { Post } from 'goodvandro-alganews-sdk';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import useBreadcrumb from '../../core/hooks/useBreadcrumb';
import usePageTitle from '../../core/hooks/usePageTitle';
import usePosts from '../../core/hooks/usePosts';
import useUser from '../../core/hooks/useUser';
import formatPhone from '../../core/utils/formatPhone';
import NotFoundError from '../components/NotFoundError';

export default function UserDetailsView() {
  usePageTitle('Detalhes do utilizador');

  const params = useParams<{ id: string }>();
  const [page, setPage] = useState(0);
  const { lg } = useBreakpoint();

  const { user, fetchUser, notFound, toggleUserStatus } = useUser();

  useBreadcrumb(`Usuários/${user?.name || 'Detalhes'}`);

  const {
    fetchUserPosts,
    posts,
    togglePostStatus,
    loadingFetch,
    loadingToggle,
  } = usePosts();

  useEffect(() => {
    if (!isNaN(Number(params.id))) fetchUser(Number(params.id));
  }, [fetchUser, params.id]);

  useEffect(() => {
    if (user?.role === 'EDITOR') fetchUserPosts(user.id, page);
  }, [fetchUserPosts, user, page]);

  if (isNaN(Number(params.id))) return <Navigate to='/users' replace={true} />;

  if (notFound)
    return (
      <Card>
        <NotFoundError
          title={'Usuário não encontrado'}
          actionDestination={'/usuarios'}
          actionTitle={'Voltar para lista de usuários'}
        />
      </Card>
    );

  if (!user) return <Skeleton />;

  return (
    <Row gutter={24}>
      <Col xs={24} lg={4}>
        <Row justify={'center'}>
          <Avatar size={120} src={user.avatarUrls.small} />
        </Row>
      </Col>
      <Col xs={24} lg={20}>
        <Space
          style={{ width: '100%' }}
          direction={'vertical'}
          align={lg ? 'start' : 'center'}
        >
          <Typography.Title level={2}>{user.name}</Typography.Title>
          <Typography.Paragraph
            style={{
              textAlign: lg ? 'left' : 'center',
            }}
            ellipsis={{
              rows: 2,
            }}
          >
            {user.bio}
          </Typography.Paragraph>
          <Space>
            <Link to={`/users/edit/${user.id}`}>
              <Button type={'primary'}>Editar perfil</Button>
            </Link>
            <Popconfirm
              disabled={
                (user.active && !user.canBeDeactivated) ||
                (!user.active && !user.canBeActivated)
              }
              title={
                user.active
                  ? `Desabilitar ${user.name}`
                  : `Habilitar ${user.name}`
              }
              onConfirm={() => {
                confirm({
                  icon: <WarningFilled style={{ color: '#09f' }} />,
                  title: `Tem certeza que deseja ${
                    user.active
                      ? `desabilitar ${user.name}?`
                      : `habilitar ${user.name}?`
                  }`,
                  onOk() {
                    toggleUserStatus(user).then(() => {
                      fetchUser(Number(params.id));
                    });
                  },
                  content: user.active
                    ? 'Desabilitar um usuário fará com que ele seja automaticamente desligado da plataforma, podendo causar prejuízos em seus ganhos.'
                    : 'Habilitar um usuário fará com que ele ganhe acesso a plataforma novamente, possibilitando criação e publicação de posts.',
                });
              }}
            >
              <Button
                type={'primary'}
                disabled={
                  (user.active && !user.canBeDeactivated) ||
                  (!user.active && !user.canBeActivated)
                }
              >
                {user.active ? 'Desabilitar' : 'Habilitar'}
              </Button>
            </Popconfirm>
          </Space>
        </Space>
      </Col>
      <Divider />
      {!!user.skills?.length && (
        <Col xs={24} lg={12}>
          <Space direction='vertical' style={{ width: '100%' }}>
            {user.skills?.map((skill) => (
              <div key={skill.name}>
                <Typography.Text>{skill.name}</Typography.Text>
                <Progress percent={skill.percentage} success={{ percent: 0 }} />
              </div>
            ))}
          </Space>
        </Col>
      )}
      <Col xs={24} lg={12}>
        <Descriptions column={1} bordered size={'small'}>
          <Descriptions.Item label={'País'}>
            {user.location.country}
          </Descriptions.Item>
          <Descriptions.Item label={'Estado'}>
            {user.location.state}
          </Descriptions.Item>
          <Descriptions.Item label={'Cidade'}>
            {user.location.city}
          </Descriptions.Item>
          <Descriptions.Item label={'Telefone'}>
            {formatPhone(user.phone)}
          </Descriptions.Item>
        </Descriptions>
      </Col>
      {user.role === 'EDITOR' && (
        <>
          <Divider />
          <Col xs={24}>
            <Table<Post.Summary>
              dataSource={posts?.content}
              rowKey={'id'}
              loading={loadingFetch}
              pagination={{
                onChange: (page) => setPage(page - 1),
                total: posts?.totalElements,
                pageSize: 10,
              }}
              columns={[
                {
                  responsive: ['xs'],
                  title: 'Posts',
                  render(element) {
                    return (
                      <Descriptions column={1}>
                        <Descriptions.Item label={'Título'}>
                          {element.title}
                        </Descriptions.Item>
                        <Descriptions.Item label={'Criação'}>
                          {moment(element.createdAt).format('DD/MM/YYYY')}
                        </Descriptions.Item>
                        <Descriptions.Item label={'Atualização'}>
                          {moment(element.updatedAt).format('DD/MM/YYYY')}
                        </Descriptions.Item>
                        <Descriptions.Item label={'Publicado'}>
                          <Switch checked={element.published} />
                        </Descriptions.Item>
                      </Descriptions>
                    );
                  },
                },
                {
                  dataIndex: 'title',
                  title: 'Título',
                  ellipsis: true,
                  width: 300,
                  responsive: ['sm'],
                  render(title: string) {
                    return <Tooltip title={title}>{title}</Tooltip>;
                  },
                },
                {
                  dataIndex: 'createdAt',
                  title: 'Criação',
                  width: 180,
                  align: 'center',
                  responsive: ['sm'],
                  render: (item) => moment(item).format('DD/MM/YYYY'),
                },
                {
                  dataIndex: 'updatedAt',
                  title: 'Última atualização',
                  width: 200,
                  align: 'center',
                  responsive: ['sm'],
                  render: (item) =>
                    moment(item).format('DD/MM/YYYY \\à\\s hh:mm'),
                },
                {
                  dataIndex: 'published',
                  title: 'Publicado',
                  align: 'center',
                  width: 120,
                  responsive: ['sm'],
                  render(published: boolean, post) {
                    return (
                      <Switch
                        checked={published}
                        loading={loadingToggle}
                        onChange={() => {
                          togglePostStatus(post).then(() => {
                            fetchUserPosts(user.id);
                          });
                        }}
                      />
                    );
                  },
                },
              ]}
            />
          </Col>
        </>
      )}
    </Row>
  );
}
