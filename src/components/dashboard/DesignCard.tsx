import { ProjectType } from '@/types/ProjectType';
import Link from 'next/link';
import React from 'react'

const DesignCard = ({project} : {project:ProjectType}) => {
  return (
    <Link 
      href={`/design/${project.id}/edit`}
      className="w-[250px] bg-white rounded-lg flex-shrink-0 p-4 shadow-md cursor-pointer"
    >
      <img
        loading='lazy'
        src={project.preview_url}
        alt={project.title}
        className="w-full h-auto max-h-[200px] rounded-md"
      />
      <p className="mt-2 font-semibold">{project.title}</p>
    </Link>
  );
}

export default DesignCard
