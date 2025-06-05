import React from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import ProfileIcon from './ProfileIcon';
import "../styles/Dashboard.css";

const Header = () => (
  <header className="header">
    <h1>Task Board</h1>
    <div className="header-right">
      <ProfileIcon />
      <button onClick={() => signOut(auth)}>Sign Out</button>
    </div>
  </header>
);

export default Header;
