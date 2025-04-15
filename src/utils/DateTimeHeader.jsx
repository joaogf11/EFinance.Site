import React, { useEffect, useState } from 'react';
import './css/datetimeheader.css';

const DateTimeHeader = () => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('pt-BR', { month: 'long' });
    const year = date.getFullYear();
    const time = date.toLocaleTimeString('pt-BR');

    return `${day} de ${month} de ${year} - ${time}`;
  };

  return (
    <div className="datetime-header">
      {formatDate(dateTime)}
    </div>
  );
};

export default DateTimeHeader;
