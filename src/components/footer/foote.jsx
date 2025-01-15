// import React from 'react';
// import { Link } from 'react-router-dom';

// const Footer = () => {
//   const currentYear = new Date().getFullYear();

//   const footerSections = {
//     company: {
//       title: 'Company',
//       links: [
//         { name: 'About Us', path: '/about' },
//         { name: 'Careers', path: '/careers' },
//         { name: 'Press', path: '/press' },
//         { name: 'Contact Us', path: '/contact' }
//       ]
//     },
//     resources: {
//       title: 'Resources',
//       links: [
//         { name: 'Help & Support', path: '/support' },
//         { name: 'Trust & Safety', path: '/trust' },
//         { name: 'Privacy Policy', path: '/privacy' },
//         { name: 'Terms of Service', path: '/terms' }
//       ]
//     },
//     browse: {
//       title: 'Browse',
//       links: [
//         { name: 'Freelancers', path: '/freelancercard' },
//         { name: 'Projects', path: '/matchingjobs' },
//         { name: 'Consultants', path: '/consultants' },
//         { name: 'Featured Jobs', path: '/alljobs' }
//       ]
//     }
//   };

//   const socialLinks = [
//     { name: 'LinkedIn', icon: '🔗', url: '#' },
//     { name: 'Twitter', icon: '🐦', url: '#' },
//     { name: 'Facebook', icon: '📘', url: '#' },
//     { name: 'Instagram', icon: '📸', url: '#' }
//   ];

//   return (
//     <footer className="bg-gray-100 pt-12 pb-8">
//       <div className="max-w-6xl mx-auto px-4">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//           {/* Main sections */}
//           {Object.values(footerSections).map((section) => (
//             <div key={section.title}>
//               <h3 className="font-semibold text-gray-900 mb-4">{section.title}</h3>
//               <ul className="space-y-2">
//                 {section.links.map((link) => (
//                   <li key={link.name}>
//                     <Link 
//                       to={link.path}
//                       className="text-gray-600 hover:text-blue-500 transition-colors"
//                     >
//                       {link.name}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}

//           {/* Social Media Section */}
//           <div>
//             <h3 className="font-semibold text-gray-900 mb-4">Connect With Us</h3>
//             <div className="flex space-x-4">
//               {socialLinks.map((social) => (
//                 <a
//                   key={social.name}
//                   href={social.url}
//                   className="text-gray-600 hover:text-blue-500 transition-colors"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   aria-label={social.name}
//                 >
//                   <span className="text-xl">{social.icon}</span>
//                 </a>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Bottom Section */}
//         <div className="mt-12 pt-8 border-t border-gray-200">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <p className="text-gray-600 text-sm">
//               © {currentYear} Embrace-Freelance Market Place. All rights reserved.
//             </p>
//             <div className="mt-4 md:mt-0">
//               <select 
//                 className="bg-transparent text-gray-600 text-sm border rounded px-2 py-1"
//                 defaultValue="en"
//               >
//                 <option value="en">English</option>
//                 <option value="es">Español</option>
//                 <option value="fr">Français</option>
//               </select>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../.././svg/index'; // Assuming the Logo component is in the same directory as in the header
import './footer.scss'; // Create a CSS file for styling

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = {
    company: {
      title: 'Company',
      links: [
        // { name: 'About Us', path: '/about' },
        // { name: 'Careers', path: '/careers' },
        // { name: 'Press', path: '/press' },
        { name: 'Contact Us', path: '/QueryForm' }
      ]
    },
    resources: {
      title: 'Resources',
      links: [
        // { name: 'Help & Support', path: '/support' },
        // { name: 'Trust & Safety', path: '/trust' },
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms of Service', path: '/terms' }
      ]
    },
    // browse: {
    //   title: 'Browse',
    //   links: [
    //     // { name: 'Freelancers', path: '/freelancercard' },
    //     // { name: 'Projects', path: '/matchingjobs' },
    //     // { name: 'Consultants', path: '/consultants' },
    //     // { name: 'Featured Jobs', path: '/alljobs' }
    //   ]
    // }
  };

  const socialLinks = [
    { name: 'LinkedIn', icon: '🔗', url: '#' },
    { name: 'Twitter', icon: '🐦', url: '#' },
    { name: 'Facebook', icon: '📘', url: '#' },
    { name: 'Instagram', icon: '📸', url: '#' }
  ];

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <Logo width="150" height="60" />
        </div>
        <div className="footer-sections">
          {Object.values(footerSections).map((section) => (
            <div key={section.title} className="footer-section">
              <h3>{section.title}</h3>
              <ul>
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.path}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* <div className="footer-social">
          <h3>Connect With Us</h3>
          <div className="social-icons">
            {socialLinks.map((social) => (
              <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer">
                {social.icon}
              </a>
            ))}
          </div>
        </div> */}
      </div>
      <div className="footer-bottom">
        <p>&copy; {currentYear} Embrace-Freelance Market Place. All rights reserved.</p>
        <div className="language-selector">
          {/* <span>English</span> */}
          {/* <span>Español</span>
          <span>Français</span> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
