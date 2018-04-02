import React from 'react';

function MainLayout({ children }) {
  return (
    <div>
      <div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
