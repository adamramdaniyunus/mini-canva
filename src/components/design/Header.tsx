import React, { useEffect, useState } from 'react'
import Button from '../Button'
import Link from 'next/link'
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { loadProject, saveProjects } from '@/lib/indexDB';
import { FaDownload, FaSave } from 'react-icons/fa';

const Header = ({
  handleExport,
  handleManualSave,
  isSaving,
} : {
  handleExport: () => void;
  handleManualSave: () => void;
  isSaving: boolean
}) => {
  const params = useParams();
  const [title, setTitle] = useState('');
  const designId = params?.id;
  const [isEditing, setIsEditing] = useState(false);
  const [prevTitle, setPrevTitle] = useState('')

  useEffect(() => {
    if (!designId || title) return
    const getDataProject = async () => {
      try {
        const title = await loadProject(designId as string);
        if (!title) {
          await saveProjects(designId as string, "Untitled Project");
        }
        setTitle(title);
      } catch (error) {
        console.log(error);
        toast.error("Failed to get data project");
      }
    }

    getDataProject()
  }, [designId, title])

  const handleEditTitle = async () => {
    if(!title) {
      setTitle(prevTitle)
      return
    }
    try {
      await fetch('/api/project/detail', {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, id: designId })
      });
      await saveProjects(designId as string, title);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update title");
    }
  }

  return (
    <div className="w-full bg-blue-500 text-white p-4 flex justify-between items-center">
      <Link href={"/dashboard"} className="text-sm">
        Home
      </Link>
      {isEditing ? (
        <input
          type="text"
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={async () => {
            setIsEditing(false)
            await handleEditTitle()
          }}
          onKeyDown={async (e) => {
            if (e.key === 'Enter') {
              await handleEditTitle()
              setIsEditing(false);
            }
          }}
          className="focus:outline-none text-center text-md"
        />
      ) : (
        <h1 className="text-md" onDoubleClick={() => {
          setPrevTitle(title)
          setIsEditing(true)
        }}>
          {title}
        </h1>
      )}
      <div className="flex gap-2">
        <Button disabled={isSaving} onClick={() => handleManualSave()}>
          <FaSave/>
        </Button>
        <Button disabled={isSaving} onClick={() => handleExport()}>
          <FaDownload/>
        </Button>
      </div>
    </div>
  )
}

export default Header
