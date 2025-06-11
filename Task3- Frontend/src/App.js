import React from 'react';
import { Layout} from 'antd';
import TaskManager from './components/TaskManager';

const {  Content } = Layout;


const App = () => (
  <Layout style={{ minHeight: '100vh' }}>
    
    <Content style={{ padding: '20px' }}>
      <TaskManager />
    </Content>
  </Layout>
);

export default App;
