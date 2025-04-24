import React from 'react'
import { BsHandIndexThumbFill } from 'react-icons/bs'
import { FaArrowDown } from 'react-icons/fa'
import { PiRectangleFill } from 'react-icons/pi'

const Features = () => {
  return (
    <section className="bg-white py-16 px-6 md:px-20" id='features'>
      <h2 className="text-2xl font-bold text-center mb-8">Why Choose Miva?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
        {/* <!-- Feature 1 --> */}
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-[#3DB2FF] p-4 rounded-full text-3xl">
            <BsHandIndexThumbFill color="white" style={{ filter: 'drop-shadow(1px 1px 0 black)' }} />
          </div>
          <h3 className="text-3xl font-bold">Easy to Use</h3>
          <p className="text-lg text-gray-600">Our intuitive editor lets you design with simple drag-and-drop tools.</p>
        </div>

        {/* <!-- Feature 2 --> */}
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-[#FFB830] p-4 rounded-full text-3xl">
            <PiRectangleFill color="white" style={{ filter: 'drop-shadow(1px 1px 0 black)' }} />
          </div>
          <h3 className="text-3xl font-bold">One Page Design</h3>
          <p className="text-lg text-gray-600">Focus on creating beautiful, single-page projects without any hassle.</p>
        </div>

        {/* <!-- Feature 3 --> */}
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-[#6BCB77] p-4 rounded-full text-3xl">
            <FaArrowDown color="white" style={{ filter: 'drop-shadow(1px 1px 0 black)' }} />
          </div>
          <h3 className="text-3xl font-bold">Export to PNG</h3>
          <p className="text-lg text-gray-600">Download your designs as high-quality PNG files in just one click.</p>
        </div>
      </div>
    </section>
  )
}

export default Features