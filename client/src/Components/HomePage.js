import React from 'react';
import withAuth from '../Auth/Authentication'; // Adjust the import path as needed

function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Home Page</h1>
      <p className="text-lg">You are now logged in and can access protected content.</p>
    </div>
  );  
}

export default withAuth(HomePage);