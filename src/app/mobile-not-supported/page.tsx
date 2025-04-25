import React from 'react'

const page = () => {
    return (
        <div style={{
            padding: '2rem',
            textAlign: 'center',
            maxWidth: '500px',
            margin: '5rem auto',
            fontFamily: 'Arial, sans-serif',
        }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Mobile Not Supported</h1>
            <p style={{ fontSize: '1.1rem', color: '#555' }}>
                We are currently working on bringing mobile support to our app. For now, please use a desktop or laptop for the best experience.
            </p>
        </div>
    )
}

export default page