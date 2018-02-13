import React from 'react';

const HttpStatusPresenter = ({statusCode, statusText}) => (
  <div className='http-status-box'>
      { statusCode && <img src={`https://http.cat/${statusCode}`} alt={statusText} style={{maxWidth: '100%', marginBottom: '5px'}}/>}
      { statusText && <p>{statusText}</p> }
  </div>

);

export default HttpStatusPresenter;
