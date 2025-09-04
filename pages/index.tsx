import { useState, useEffect, useRef } from 'react';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);
  const [popup, setPopup] = useState<Window | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const addMessage = (msg: string) => {
    setMessages((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${msg}`
    ]);
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const source =
        event.source === iframeRef.current?.contentWindow ? 'iframe' : 'popup';

      if (event.data.type === 'ping') {
        const data = event.data.data;
        if (data) {
          mergeData(data);
          addMessage(
            `Received ping with data from ${source}: ${JSON.stringify(data)}`
          );
        } else {
          addMessage(`Received ping from ${source}`);
        }
        const localData = JSON.parse(
          localStorage.getItem('clientData') || 'null'
        );
        event.source?.postMessage(
          { type: 'pong', data: localData },
          { targetOrigin: event.origin }
        );
      } else if (event.data.type === 'pong') {
        const data = event.data.data;
        if (data) {
          mergeData(data);
          addMessage(
            `Received pong with data from ${source}: ${JSON.stringify(data)}`
          );
        } else {
          addMessage(`Received pong from ${source}`);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const pingIframe = () => {
    if (iframeRef.current?.contentWindow) {
      const data = JSON.parse(localStorage.getItem('clientData') || 'null');
      iframeRef.current.contentWindow.postMessage(
        { type: 'ping', data },
        `http://${publicRuntimeConfig.DOMAIN_DATALAYER}`
      );
      addMessage(
        `Sent ping${
          data ? ` with data: ${JSON.stringify(data)}` : ''
        } to iframe`
      );
    }
  };

  const pingPopup = () => {
    if (popup && !popup.closed) {
      const data = JSON.parse(localStorage.getItem('clientData') || 'null');
      popup.postMessage(
        { type: 'ping', data },
        `http://${publicRuntimeConfig.DOMAIN_POPUP}`
      );
      addMessage(
        'Sent ping' +
          (data ? ' with data: ' + JSON.stringify(data) : '') +
          ' to popup'
      );
    }
  };

  const mergeData = (existing: Record<string, unknown>) => {
    const data = localStorage.getItem('clientData');
    let merged = {};
    if (data) {
      try {
        const parsed = JSON.parse(data);
        merged = { ...existing, ...parsed };
      } catch {
        merged = existing;
      }
    }
    localStorage.setItem('clientData', JSON.stringify(merged));
  };

  const storeData = () => {
    const client = {
      id: `client-${Math.random().toString(36).substring(2, 11)}`,
      timestamp: Date.now(),
      source: 'client'
    };
    localStorage.setItem('clientData', JSON.stringify({ client }));
    addMessage(`Stored data: ${JSON.stringify({ client })}`);
  };

  const showPopup = () => {
    const newPopup = window.open(
      `http://${publicRuntimeConfig.DOMAIN_POPUP}/popup`,
      'popup',
      'width=400,height=300'
    );
    setPopup(newPopup);
    addMessage('Opened popup');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Index Page</h1>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={pingIframe} style={{ marginRight: '10px' }}>
          Ping Iframe
        </button>
        <button onClick={showPopup} style={{ marginRight: '10px' }}>
          Show Popup
        </button>
        <button onClick={pingPopup} style={{ marginRight: '10px' }}>
          Ping Popup
        </button>
        <button onClick={storeData}>Store Data</button>
      </div>

      <div>
        <h3>Console:</h3>
        <div
          style={{
            border: '1px solid #ccc',
            padding: '10px',
            height: '200px',
            overflow: 'auto',
            backgroundColor: '#f5f5f5'
          }}
        >
          {messages.map((msg) => (
            <div key={msg}>{msg}</div>
          ))}
        </div>
      </div>

      <iframe
        title="frame"
        ref={iframeRef}
        src={`http://${publicRuntimeConfig.DOMAIN_DATALAYER}/frame`}
        width="600"
        height="400"
        style={{ border: '1px solid #ccc', marginBottom: '20px' }}
      />
    </div>
  );
}
