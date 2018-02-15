import React from 'react';

const HttpStatusPresenter = ({statusCode, statusText}) => (
  <div className='http-status-box'
    style={{width: '400px', color: 'rgb(200,0,0)', fontSize: '1.2em'}}
    >
      { statusCode && <img src={`https://http.cat/${statusCode}`} alt={statusText} style={{maxWidth: '100%', marginBottom: '5px'}}/>}
      { statusText && <p>{statusText}</p> }
  </div>

);

export default HttpStatusPresenter;
