import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Layout, message, Modal, Space, Table, Typography } from 'antd';
import dayjs from 'dayjs';
import { createTask, deleteTask, executeTask, getTasks, searchTasksByName } from '../api/tasks';

const { Header, Content } = Layout;
const { Title } = Typography;

// ------------------------- Task Form -------------------------
const TaskForm = ({ onSubmit }) => {
  const [form] = Form.useForm();

  return (
    <Form form={form} layout="vertical" onFinish={onSubmit}>
      <Form.Item name="id" label="Task ID" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="name" label="Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="owner" label="Owner" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="command" label="Shell Command" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Button type="primary" htmlType="submit">Create Task</Button>
    </Form>
  );
};

// -------------------- Execution History Modal --------------------
const ExecutionModal = ({ visible, executions, onClose }) => {
  const columns = [
    { title: 'Start Time', dataIndex: 'startTime', render: (v) => dayjs(v).format('YYYY-MM-DD HH:mm:ss') },
    { title: 'End Time', dataIndex: 'endTime', render: (v) => dayjs(v).format('YYYY-MM-DD HH:mm:ss') },
    { title: 'Output', dataIndex: 'output' },
  ];

  return (
    <Modal title="Task Execution History" open={visible} onCancel={onClose} footer={null}>
      <Table columns={columns} dataSource={executions} rowKey={(r) => r.startTime} pagination={false} />
    </Modal>
  );
};

// ------------------------- Task Manager -------------------------
const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [execModalOpen, setExecModalOpen] = useState(false);
  const [executions, setExecutions] = useState([]);

  const fetchTasks = async () => {
    const res = await getTasks();
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreate = async (task) => {
    await createTask(task);
    message.success('Task created!');
    fetchTasks();
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    message.success('Task deleted!');
    fetchTasks();
  };

  const handleSearch = async (query) => {
    if (!query) return fetchTasks();
    try {
      const res = await searchTasksByName(query);
      setTasks(res.data);
    } catch {
      message.error('No task found');
    }
  };

  const handleExecute = async (task) => {
    const res = await executeTask(task.id);
    message.success('Command executed!');
    setExecutions([...task.taskExecutions, res.data]);
    setExecModalOpen(true);
  };

  const columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Owner', dataIndex: 'owner' },
    { title: 'Command', dataIndex: 'command' },
    {
      title: 'Actions',
      render: (_, task) => (
        <Space>
          <Button type="link" onClick={() => handleExecute(task)}>Run</Button>
          <Button type="link" danger onClick={() => handleDelete(task.id)}>Delete</Button>
        </Space>
      )
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ color: 'white' }}>
        <Title level={2} style={{ color: 'white' }}>Task Manager</Title>
      </Header>
      <Content style={{ padding: '20px' }}>
        <Input.Search placeholder="Search by name" enterButton onSearch={handleSearch} style={{ marginBottom: '20px' }} />
        <TaskForm onSubmit={handleCreate} />
        <Table dataSource={tasks} columns={columns} rowKey="id" style={{ marginTop: '20px' }} />
        <ExecutionModal visible={execModalOpen} executions={executions} onClose={() => setExecModalOpen(false)} />
      </Content>
    </Layout>
  );
};

export default TaskManager;
