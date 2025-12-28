import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState<string>("");


  interface PingResponse {
    message: string;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data from /api/ping");
        const res = await fetch("/api/ping");
        const data: PingResponse = await res.json();
        setMessage(data.message);

      } catch (error) {
        console.error('Error fetching data:', error)
      }
    };

    fetchData();
  }, []); // end of useEffect

  return <div>API says: {message}</div>
}

export default App
