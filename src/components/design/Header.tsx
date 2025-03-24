import React from 'react'
import Button from '../Button'
import Link from 'next/link'

const Header = () => {
  return (
      <div className="w-full bg-blue-500 text-white p-4 flex justify-between items-center">
        <Link href={"/dashboard"} className="text-sm">
          Home
        </Link>
        <h1 className="text-lg">Mini Canva</h1>
        <div className="flex gap-2">
          <Button>Save</Button>
          <Button>Download</Button>
        </div>
      </div>
  )
}

export default Header
