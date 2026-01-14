import React, { useRef, useState, useEffect } from 'react';
import Images1 from '../assets/images4.PNG';
import Images2 from '../assets/Images_side_views.PNG';
import Images3 from '../assets/images_side.jpg';
import { Swiper, SwiperSlide } from 'swiper/react';
import { MapPin, Award, Users, BookOpen, Cpu, GraduationCap } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Import modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import '../index.css';

// Chatbot
import SupportBot from "../components/SupportBot";

const Hero = () => {
  const progressCircle = useRef(null);
  const progressContent = useRef(null);
  const [showBot, setShowBot] = useState(true);

  // ⭐ Improved Chatbot Behavior
  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (isMobile) return; // mobile = no scroll hide

      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 120) {
        setShowBot(false);
      } else {
        setShowBot(true);
      }

      lastScrollY = currentScrollY;
    };

    const handleKeyboard = () => {
      if (isMobile) {
        const heightRatio = window.innerHeight / window.outerHeight;
        if (heightRatio < 0.75) {
          setShowBot(false);
        } else {
          setShowBot(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleKeyboard);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleKeyboard);
    };
  }, []);

  const onAutoplayTimeLeft = (s, time, progress) => {
    if (progressCircle.current) {
      progressCircle.current.style.setProperty('--progress', 1 - progress);
    }
    if (progressContent.current) {
      progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
    }
  };

  const imageList = [Images1, Images2, Images3];

  return (
    <>
      {/* Swiper Section */}
      <div className="bg-gray-500">
        <div className="mx-auto w-full relative">
          <Swiper
            spaceBetween={30}
            centeredSlides={true}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
            onAutoplayTimeLeft={onAutoplayTimeLeft}
            className="mySwiper"
          >
            {imageList.map((img, index) => (
              <SwiperSlide key={index}>
                <img src={img} alt={`Slide ${index + 1}`} width="100%" />
              </SwiperSlide>
            ))}

            <div className="autoplay-progress" slot="container-end">
              <svg viewBox="0 0 48 48" ref={progressCircle}>
                <circle cx="24" cy="24" r="20" />
              </svg>
              <span ref={progressContent}></span>
            </div>
          </Swiper>
        </div>
        <div className="wrapper w-full h-8 bg-gray-400/20 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 absolute -bottom-12" />
      </div>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Malayalam Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-800">
          <div className="absolute inset-0 bg-black/20"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                Government Technical High School
              </h1>
              <p className="text-xl md:text-2xl text-indigo-200 font-semibold">Pala, Kottayam</p>
              <div className="mt-4 flex justify-center gap-2">
                <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm">Est. 1961</span>
                <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm">Kerala, India</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
              <p
                className="text-sm md:text-lg text-white/90 text-justify font-noto"
                style={{ lineHeight: "2.0", letterSpacing: "0.2px", wordSpacing: "2px" }}
              >
                കോട്ടയം ജില്ലയ്ക്കാകെ അഭിമാനം പകരുന്ന സാങ്കേതിക വിദ്യാഭ്യാസ സ്ഥാപനമായ ഗവൺമെൻറ് ടെക്നിക്കൽ ഹൈസ്കൂൾ പാലാ 1961-ലാണ് സ്ഥാപിതമായത്. മീനച്ചിലാറിന്റെ തീരത്ത് മുത്തോലി ഗ്രാമപഞ്ചായത്ത് അഞ്ചാം വാർഡിൽ ആരെയും ആകർഷിക്കുന്ന രീതിയിൽ പൂഞ്ഞാർ ഏറ്റുമാനൂർ സ്റ്റേറ്റ് ഹൈവേയ്ക്ക് സമീപം തലയുയർത്തി നിൽക്കുന്ന വിദ്യാലയമാണ് Govt. THS, Pala. പ്രകൃതിരമണീയത തുളുമ്പി നിൽക്കുന്ന വിശാലമായ ക്യാമ്പസ് ആണ് ഈ സ്കൂളിൽ ഉള്ളത്.
              </p>
            </div>
          </div>
        </div>

        {/* Video Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
          <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <video
              className="w-full h-[400px] md:h-[500px] lg:h-[600px] object-cover"
              src="/videos/intro.mp4"
              autoPlay muted loop controls
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* About */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              About Us
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto rounded-full"></div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
            <p className="text-lg text-gray-700 leading-relaxed text-justify">
              Government Technical High School Pala, a technical educational institution that brings pride to the entire Kottayam district, was established in 1961. Govt. THS, Pala is a school that stands tall and attractively on the banks of Meenachilar, near the Poonjar-Ettumanoor State Highway in the 5th ward of Mutholi Grama Panchayat. The school has a spacious campus surrounded by natural beauty.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl">
                <Users className="w-12 h-12 mx-auto text-indigo-600 mb-4" />
                <h3 className="text-3xl font-bold text-gray-800 mb-2">213</h3>
                <p className="text-gray-600">Students</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
                <Award className="w-12 h-12 mx-auto text-purple-600 mb-4" />
                <h3 className="text-3xl font-bold text-gray-800 mb-2">7</h3>
                <p className="text-gray-600">Branches</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
                <GraduationCap className="w-12 h-12 mx-auto text-blue-600 mb-4" />
                <h3 className="text-3xl font-bold text-gray-800 mb-2">105</h3>
                <p className="text-gray-600">Max Intake</p>
              </div>
            </div>
          </div>
        </div>

        {/* Extracurricular */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-8">
              <Cpu className="w-10 h-10 text-white" />
              <h2 className="text-2xl md:text-4xl font-bold text-white">Extracurricular Activities</h2>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20">
              <p className="text-lg text-white leading-relaxed text-justify">
                Pala Govt. THS organizes a very attractive exhibition, which is part of the application of technology, at regular intervals. This exhibition, which introduces the students' creations and various machine operations to the common people, other students and teachers, will lead the students into the vast world of technology by holding their hands. More than a thousand students from various schools in Kottayam district came to watch the TECHNICAL EXPO named "Mikav". The exhibition became a proclamation of the enviable progress achieved by the students of Pala THS in technology. Boys and girls who have passed the 7th standard can apply for admission to the 8th standard. A maximum of 105 students will be admitted to the 8th standard. If applications are received above 105, admission will be given on the basis of the 7th standard entrance examination. The children here participate in the state sports festival and art festival.
              </p>
            </div>
          </div>
        </div>

        {/* Facilities */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-center gap-4 mb-8">
            <BookOpen className="w-10 h-10 text-indigo-600" />
            <h2 className="text-2xl md:text-4xl font-bold text-gray-800">Physical Facilities</h2>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
            <p className="text-lg text-gray-700 leading-relaxed text-justify mb-8">
              Currently, 213 students are studying in this school in seven branches. The workshop equipped with modern machinery ensures excellent job training for the students. The school has a large, fully air-conditioned computer lab. A spacious library with thousands of books will further instill the reading habit of the students. The list of school facilities is long, such as an open library, an auditorium, a spacious playground, etc., which are completely managed by the students to make the most of even the short time during the study breaks.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {['Modern Workshop', 'AC Computer Lab', 'Spacious Library', 'Auditorium', 'Open Library', 'Playground', 'Advanced Equipment', 'Student Managed'].map((facility, idx) => (
                <div key={idx} className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
                  <p className="text-center font-semibold text-gray-700">{facility}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Management</h3>
            <p className="text-lg text-gray-700">
              It is operated under the Department of Technology, Government of Kerala.
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="bg-gradient-to-br from-gray-50 to-slate-100 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-8">
              <MapPin className="w-10 h-10 text-indigo-600" />
              <h2 className="text-2xl md:text-4xl font-bold text-gray-800">Visit Us</h2>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <p className="text-lg text-gray-700 mb-6">
                <strong>Address:</strong> Mutholi, Puliyannur P.O., 686573, Kottayam District, Kerala, India
              </p>

              <div className="rounded-2xl overflow-hidden shadow-lg h-96 border-4 border-indigo-200">
                <iframe
                  title="Govt. THS Pala Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3930.8382611411756!2d76.69699917550943!3d9.71121897732775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0623a2b1fd1f09%3A0x7b3a4a94bdfb46f4!2sGovernment%20Technical%20High%20School%2C%20Pala!5e0!3m2!1sen!2sin!4v1692973192297!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Chatbot */}
        {showBot && (
          <div className="fixed bottom-6 right-6 z-50 transition-all duration-300 ease-in-out transform hover:scale-110">
            <SupportBot />
          </div>
        )}
      </div>
    </>
  );
};

export default Hero;
