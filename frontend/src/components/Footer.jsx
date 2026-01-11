import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube, FaGithub, FaPhone } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-white py-8">
      <div className="mx-auto px-6 md:px-12 lg:px-24">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-2xl font-bold mb-2 font-lobster">GOVT.THS PALA</h3>
            <p className="text-gray-400 text-sm">
              Government Technical High School, Pala, established in 1961, is a center of excellence in technical education, proudly shaping futures on a vibrant, scenic campus beside the Pala in Kottayam.
            </p>
          </div>

          {/* Contact */}
          <div className='md:px-6'>
            <h4 className="text-xl font-semibold mb-2">Contact Us</h4>
            <div className="flex items-center space-x-2 mb-2 text-gray-400">
              <FaPhone />
              <span>0482 2205285</span>
            </div>
            <p className="text-gray-400">
              <span className="font-semibold">Email:</span> thspala@gmail.com
            </p>
          </div>

          {/* Address */}
          <div>
            <h4 className="text-xl font-semibold mb-2">Address</h4>
            <p className="text-gray-400 text-sm">
              Mutholi, Puliyannur P.O., 686573, Kottayam District
            </p>
            <p className="text-gray-400 text-sm">School Code: 31501</p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-600 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} GOVT.THS PALA</p>

          {/* Social Icons */}
          <div className="flex space-x-4 py-4 md:py-0">
            <a href="https://www.facebook.com/Govt.THS.205285/" className="text-gray-400 hover:text-blue-500"><FaFacebook /></a>
            <a href="#" className="text-gray-400 hover:text-pink-500"><FaInstagram /></a>
            <a href="#" className="text-gray-400 hover:text-blue-700"><FaLinkedin /></a>
            <a href="https://youtube.com/@govt.technicalhighschoolpa2892?si=2qP9ZTfy4J4UdvjV" className="text-gray-400 hover:text-red-500"><FaYoutube /></a>
            <a href="https://github.com/youtubejd56?tab=repositories" className="text-gray-400 hover:text-white"><FaGithub /></a>
          </div>
        </div>

        {/* Legal Links + Credit */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-4 text-gray-400 text-sm">
          <div className="flex space-x-6">
            <Link to="/privacy-policy" className="hover:text-white">Privacy</Link>
            <Link to="/terms-of-service" className="hover:text-white">Terms of Service</Link>
          </div>
          <div className="mt-4 md:mt-0">
            <a href="https://youtubejd56.github.io/vinayak-portfolio/" className="text-gray-100 hover:text-green-500">Developed by Vinayak NV</a>
          </div>
        </div>

        {/* Website Link */}
        <div className="flex justify-center md:justify-start mt-6 text-gray-400 text-sm">
          <a href="https://polyadmission.org/ths/index.php?r=site%2Fhome" className="hover:text-white">
            www.polyadmission.org/ths
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
