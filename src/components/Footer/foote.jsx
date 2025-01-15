import React from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedinIn, FaTwitter, FaFacebookF, FaInstagram } from 'react-icons/fa';
import { HiMail } from 'react-icons/hi';
import {
  Logo
} from "../../svg/index";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = {
    platform: {
      title: 'Platform',
      links: [
        { name: 'How it Works', path: '#' },
        { name: 'Browse Jobs', path: '#' },
        { name: 'Find Talent', path: '#' },
        { name: 'Enterprise Solutions', path: '#' },
        { name: 'Success Stories', path: '#' }
      ]
    },
    solutions: {
      title: 'Solutions',
      links: [
        { name: 'Web Development', path: '#' },
        { name: 'Mobile Development', path: '#' },
        { name: 'Design & Creative', path: '#' },
        { name: 'Writing & Translation', path: '#' },
        { name: 'AI Services', path: '#' }
      ]
    },
    resources: {
      title: 'Resources',
      links: [
        { name: 'Help Center', path: '#' },
        { name: 'Community Forums', path: '#' },
        { name: 'Blog', path: '#' },
        { name: 'Guides & Tutorials', path: '#' },
        { name: 'Development API', path: '#' }
      ]
    },
    company: {
      title: 'Company',
      links: [
        { name: 'About Us', path: '#' },
        { name: 'Careers', path: '#' },
        { name: 'Press & Media', path: '#' },
        { name: 'Contact Us', path: '#' },
        { name: 'Investor Relations', path: '#' }
      ]
    }
  };

  const legalLinks = [
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Cookie Policy', path: '/cookies' },
    { name: 'Accessibility', path: '/accessibility' },
    { name: 'Security', path: '/security' }
  ];

  const socialLinks = [
    { name: 'LinkedIn', icon: <FaLinkedinIn />, url: '#' },
    { name: 'Twitter', icon: <FaTwitter />, url: '#' },
    { name: 'Facebook', icon: <FaFacebookF />, url: '#' },
    { name: 'Instagram', icon: <FaInstagram />, url: '#' }
  ];

  return (
    <footer className="bg-[#4BCBEB] bg-opacity-10 mt-16">
      {/* Newsletter Section */}
      {/* <div className="bg-[#4BCBEB] bg-opacity-10 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-gray-800 text-2xl font-bold mb-2">
                Join Our Newsletter
              </h3>
              <p className="text-gray-600">
                Get the latest news and updates from the world of freelancing
              </p>
            </div>
            <div className="flex w-full md:w-auto">
              <div className="relative w-full md:w-96">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-l-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4BCBEB] focus:border-transparent"
                />
                <button className="absolute right-0 h-full px-6 text-white bg-[#4BCBEB] rounded-r-lg hover:bg-[#3ba8c4] transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 py-16 ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <Link to="/" >
            <Logo width={60} height={60} />
            </Link>
            <p className="text-gray-600 mb-6">
              Connecting talented freelancers with amazing clients worldwide. Build your future with us.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="w-10 h-10 rounded-full bg-[#4BCBEB] bg-opacity-10 text-[#4BCBEB] flex items-center justify-center hover:bg-[#4BCBEB] hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Sections */}
          {Object.values(footerSections).map((section) => (
            <div key={section.title}>
              <h3 className="text-gray-800 font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path}
                      className="text-gray-600 hover:text-[#4BCBEB] transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Copyright */}
            <div className="text-gray-600 text-sm">
              © {currentYear} Embrace-Freelance. All rights reserved.
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap gap-4 text-sm">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-gray-600 hover:text-[#4BCBEB] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Language Selector */}
            <div className="flex items-center justify-start md:justify-end gap-4">
              <select 
                className="bg-white text-gray-600 text-sm rounded px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4BCBEB] focus:border-transparent"
                defaultValue="en"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="it">Italiano</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;