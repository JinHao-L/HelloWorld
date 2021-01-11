import React from 'react';
import './styles.css';

const NumberOfUsers = ({ numOnline }) => {

  return <div className="top-right">{`${numOnline} users online`}</div>;
};

export default NumberOfUsers;
