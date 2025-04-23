import React from 'react'

const CTA = () => {
    return (
        <section className="bg-blue-50 py-16 px-4 text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Ready to Design?</h2>
            <p className="text-lg text-gray-600 mb-6">
                Jump into Miva and start creating your masterpiece today — it’s fast, fun, and free!
            </p>
            <button
                className="inline-block cursor-pointer bg-[#3DB2FF] hover:bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-medium transition duration-300"
            >
                Try Designing Now
            </button>
        </section>
    )
}

export default CTA