import React, { useState, useEffect } from "react";
import backgroundImage from "../Images/wlc-bg.jpg";
import aboutbg from "../Images/abt-svg1.png";
import aboutbgTwo from "../Images/abt-svg2.png";
import flowerTwo from "../Images/abt-flower2.png";
import flowerOne from "../Images/abt-flower1.png";
import flowerThree from "../Images/abt-flower3.png";
import businesssvgOne from "../Images/business-svg1.png";
import businesssvgthree from "../Images/business-svg3.png";
import truck from "../Images/map-truck-img.png";
import { Link } from "react-router-dom";

const WelcomePage = () => {
  const [activeFlower, setActiveFlower] = useState(1);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveFlower((prev) => (prev % 3) + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const getFlowerStyle = (flowerNumber) => ({
    opacity: activeFlower === flowerNumber ? 1 : 0,
    transition: "opacity 1s ease-in-out",
    position: "absolute",
  });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Banner Section */}
      <div
        className="relative w-full h-[100vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative h-full flex flex-col justify-center items-center text-center text-white">
          <h1 className="text-5xl font-bold">Welcome to Loom Diary</h1>
          <p className="text-2xl mt-4">Power-Loom Management Made Simple</p>
          <Link to="/login">
            <button className="bg-gradient-to-r from-green-400 to-green-600 text-white font-bold py-3 px-6 rounded-full shadow-md transform hover:scale-105 transition-transform duration-300 mt-8">
              Login
            </button>
          </Link>
        </div>
      </div>

      {/* About Section */}
      <div className="relative bg-white py-12 px-6 lg:px-20 text-center space-y-6 mt-24">
        <h2 className="text-4xl font-bold text-lime-700">About Our Platform</h2>
        <p className="text-md text-gray-700 max-w-3xl mx-auto">
          Effortlessly manage your power-loom operations with our intuitive
          platform designed to simplify inventory tracking and streamline
          payroll management.
        </p>
        <p className="text-md text-gray-700 max-w-3xl mx-auto">
          From monitoring stock levels to calculating laborers' wages based on
          cloth production, our solution ensures that you stay efficient and
          organized.
        </p>
        <p className="text-md text-gray-700 max-w-3xl mx-auto">
          Whether you're a small business or a large-scale operation, our tools
          provide you with real-time insights, helping you optimize production,
          reduce errors, and boost profitability.
        </p>
        {/* Sequentially animated flower images */}
        <img
          src={flowerOne}
          alt="flower one"
          className="absolute top-24 left-20 hidden md:block"
          style={getFlowerStyle(1)}
        />
        <img
          src={flowerTwo}
          alt="flower two"
          className="absolute -top-16 left-96 hidden md:block"
          style={getFlowerStyle(2)}
        />
        <img
          src={flowerThree}
          alt="flower three"
          className="absolute top-6 right-96 hidden md:block"
          style={getFlowerStyle(3)}
        />
        <img
          src={aboutbg}
          alt="About Background"
          className="absolute top-10 right-28 w-[95%] h-auto hidden md:block"
          style={{ zIndex: "1" }}
        />
        <img
          src={aboutbgTwo}
          alt="About Background"
          className="absolute -bottom-64 -right-10 w-[40%] h-auto hidden md:block "
          style={{ zIndex: "1" }}
        />
      </div>

      {/* Vision and Mission Section */}
      <div className="relative bg-[#F9F5EA] py-52 px-6 lg:px-20 space-y-6 mt-80 mb-2 ">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:space-x-8 space-y-8 lg:space-y-0">
            {/* Vision Card */}
            <div className="lg:w-1/2 bg-white bg-opacity-20 rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-3xl font-bold text-lime-700 mb-4">
                  Vision Statement
                </h2>
                <p className="text-lg text-gray-700">
                  "Our vision is to become the leading solution for power-loom
                  businesses globally, driving innovation in textile
                  manufacturing management. We aspire to create a future where
                  every power-loom operation is optimized with intelligent
                  tools, ensuring streamlined workflows, increased
                  profitability, and a more sustainable industry."
                </p>
              </div>
            </div>

            {/* Mission Card */}
            <div className="lg:w-1/2 bg-white bg-opacity-20 rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-3xl font-bold text-lime-700 mb-4">
                  Mission Statement
                </h2>
                <p className="text-lg text-gray-700">
                  "Our mission is to empower power-loom businesses by providing
                  a seamless and intuitive platform that simplifies inventory
                  management and tracks laborers' payroll with precision. We
                  strive to enhance operational efficiency, reduce manual
                  errors, and drive growth for our clients in the textile
                  industry."
                </p>
              </div>
            </div>
          </div>
        </div>
        <img
          src={businesssvgOne}
          alt="Business svg one"
          className="absolute top-2 left-64 w-[40%] h-auto hidden md:block"
          style={{ zIndex: "1" }}
        />
        <img
          src={businesssvgthree}
          alt="Business svg one"
          className="absolute -bottom-2 left-0 w-[90%] h-auto hidden md:block"
          style={{ zIndex: "1" }}
        />
        <img
          src={truck}
          alt="Business svg one"
          className="absolute bottom-0 left-80 w-[15%] h-auto hidden md:block"
          style={{
            zIndex: "1",
            animation: "slideRight 5s infinite ease-in-out",
          }}
        />
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          {/* Left side: App name */}
          <div className="text-left md:text-left mb-4 md:mb-0">
            <h2 className="text-lg font-bold">Loom Diary</h2>
          </div>

          {/* Center: Copyright */}
          <div className="text-center md:text-center mb-4 md:mb-0">
            <p className="text-sm">
              &copy; 2024 Loom Diary | Powered By Shoaib Ansari
            </p>
          </div>

          {/* Right side: Contact info */}
          <div className="text-right md:text-right">
            <p>Contact Us: info@loomdiary.com</p>
            <p>Phone: +91-123-456-7890</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;
