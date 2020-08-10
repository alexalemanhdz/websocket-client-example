import ReactDOM from 'react-dom';
import React, {
  useEffect,
  useState
} from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { Card, Avatar, Input, Typography } from 'antd';
import 'antd/dist/antd.css';
import './index.css';

const { Search } = Input;
const { Text } = Typography;
const { Meta } = Card;

const client = new W3CWebSocket('ws://127.0.0.1:8000');

const App = () => {
  const [ username, setUsername ] = useState('');
  const [ isLogged, setIsLogged ] = useState(false);
  const [ messages, setMessages ] = useState([]);
  const [ searchVal, setSearchVal ] = useState('');

  useEffect(() => {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      console.log('got reply! ', dataFromServer);
      if (dataFromServer.type === 'message') {
        setMessages([
          ...messages,
          {
            msg: dataFromServer.msg,
            user: dataFromServer.user
          }
        ]);
      }
    };
  }, [messages]);

  const onButtonClicked = (value) => {
    client.send(JSON.stringify({
      type: 'message',
      msg: value,
      user: username,
    }));
  };

  return(
    <div className="main">
      { isLogged 
        ? <div>
          <div className="title">
            <Text type="secondary" style={{ fontSize: '36px' }}>Websocket Chat</Text>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 50 }}>
            { messages.map(message =>
              <Card key={message.msg} style={{ width: 300, margin: '16px 4px 0 4px', alignSelf: username === message.user ? 'flex-end' :'flex-start' }} loading={false}>
                <Meta
                  avatar={
                    <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>{message.user[0].toUpperCase()}</Avatar>
                  }
                  title={message.user}
                  description={message.msg}
                />
              </Card>
            ) }
          </div>
          <div className="bottom">
            <Search
              placeholder="input message and send"
              enterButton="Send"
              value={searchVal}
              size="large"
              onChange={e => setSearchVal(e.target.value)}
              onSearch={value => onButtonClicked(value)}
            />
          </div>
        </div>
        : <div style={{ padding: '200px 40px' }}>
          <Search
            placeholder="Enter Username"
            enterButton="Login"
            size="Large"
            onSearch={value => {
              setIsLogged(true);
              setUsername(value);
            }}
          />
        </div>
      }
    </div>
  );
};

export default App;

ReactDOM.render(<App />, document.getElementById('root'));