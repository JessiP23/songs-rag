import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white py-4">
      <div className="h-px bg-gray-200 mb-4" />
      <div className="max-w-md mx-auto px-4">
        <p className="text-gray-600">&copy; 2023 My App</p>
        <ul className="flex justify-between mb-0 list-none">
          <li>
            <a href="mailto:jessi316866@gmail.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
              Contact Us
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;