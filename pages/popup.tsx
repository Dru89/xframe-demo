import { useState, useEffect } from 'react';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export default function Popup() {
  const [messages, setMessages] = useState<string[]>([]);
  const [hostname, setHostname] = useState('');

  const addMessage = (msg: string) => {
    setMessages((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${msg}`
    ]);
  };

  useEffect(() => {
    setHostname(window.location.hostname);
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'ping') {
        const data = event.data.data;
        if (data) {
          mergeData(data);
          addMessage(`Received ping with data: ${JSON.stringify(data)}`);
        } else {
          addMessage('Received ping from parent');
        }
        const localData = JSON.parse(
          localStorage.getItem('popupData') || 'null'
        );
        window.opener?.postMessage(
          { type: 'pong', data: localData },
          publicRuntimeConfig.DOMAIN_CLIENT
        );
      } else if (event.data.type === 'pong') {
        const data = event.data.data;
        if (data) {
          mergeData(data);
          addMessage(`Received pong with data: ${JSON.stringify(data)}`);
        } else {
          addMessage('Received pong from parent');
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const pingParent = () => {
    const data = JSON.parse(localStorage.getItem('popupData') || 'null');
    window.opener?.postMessage(
      { type: 'ping', data },
      publicRuntimeConfig.DOMAIN_CLIENT
    );
    const dataText = data ? ` with data: ${JSON.stringify(data)}` : '';
    addMessage(`Sent ping${dataText} to parent`);
  };

  const mergeData = (existing: Record<string, unknown>) => {
    const data = localStorage.getItem('popupData');
    let merged = {};
    if (data) {
      try {
        const parsed = JSON.parse(data);
        merged = { ...existing, ...parsed };
      } catch {
        merged = existing;
      }
    }
    localStorage.setItem('popupData', JSON.stringify(merged));
  };

  const storeData = () => {
    const popup = {
      id: `popup-${Math.random().toString(36).substring(2, 11)}`,
      timestamp: Date.now(),
      source: 'popup'
    };
    localStorage.setItem('popupData', JSON.stringify({ popup }));
    addMessage(`Stored data: ${JSON.stringify({ popup })}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Popup Page ({hostname})</h1>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={pingParent} style={{ marginRight: '10px' }}>
          Ping Parent
        </button>
        <button onClick={storeData}>Store Data</button>
      </div>

      <div>
        <h3>Console:</h3>
        <div
          style={{
            border: '1px solid #ccc',
            padding: '10px',
            height: '150px',
            overflow: 'auto',
            backgroundColor: '#f5f5f5'
          }}
        >
          {messages.map((msg, i) => (
            <div key={msg}>{msg}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
