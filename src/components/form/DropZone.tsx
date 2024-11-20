import { useState } from 'react'

import { useDropzone } from 'react-dropzone'
import { toast } from 'react-toastify'

import { useDictionary } from '@/contexts/dictionaryContext'
import { FormatImage } from '@/libs/FormatImage'

type DropZoneProps = {
    onSelected: Function
    size: number
}

const ImageDropZone = ({ onSelected, size }: DropZoneProps) => {
    const { dictionary } = useDictionary()
    const [file, setFile] = useState<Array<any>>([])

    const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
        accept: {
            'image/*': [],
            'application/pdf': []
        },
        onDrop: async acceptedFiles => {
            if (acceptedFiles.length > size) {
                toast.warn(dictionary.over_image + ' ' + dictionary.valid_quantity + size.toString())

                return
            }

            acceptedFiles.map(async (fileimage) => { await FormatImage(fileimage).then(resault => setFile([resault.data])) })

            onSelected(acceptedFiles)
        }
    })

    const files = file?.map((file: any) => {
        return (
            <div key={file.lastModified}>
                <img src={URL.createObjectURL(file as any)} style={{ borderRadius: 20, width: '100%', height: '100%', resize: 'block' }} />
            </div>
        )
    })

    return (
        <div className='flex w-full h-full'>
            <div {...getRootProps({ className: 'dropzone' })} className='flex-col w-full h-full'>
                <input {...getInputProps()} />
                {!file.length && <div className='p-10 items-center flex justify-center row flex-col'>
                    <img src='https://cdn.pixabay.com/photo/2016/01/03/00/43/upload-1118929_1280.png' style={{ width: 40, height: 40, }} />
                    <p>{dictionary.select_drop_image}</p>
                </div>}
                <aside className='center'>
                    <>{files}</>
                </aside>
            </div>

        </div>
    )
}

export default ImageDropZone
