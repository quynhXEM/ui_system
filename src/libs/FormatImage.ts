// import heicConvert from 'heic-convert'

const FormatImage = async (e: any) => {
  const file = e

  console.log(e)

  const validImageTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/webp',
    'image/heic',
    'image/heif'
  ]

  const regexHIEC = /\.heic$|\.heif$/i

  // Kiểm tra loại file
  if (!validImageTypes.includes(file?.type) && !regexHIEC.test(file?.name)) {
    return { data: null, err: 'input_image' }
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  if (regexHIEC.test(file?.name)) {
    // try {
    //   const outputBuffer = await heicConvert({
    //     quality: 0.8,
    //     buffer: buffer,
    //     format: 'JPEG'
    //   })

    //   const blob = new Blob([outputBuffer], { type: 'image/jpeg' })
    //   const fileName = file.name.replace(/\.heic$/i, '.jpg') // Thay đổi tên file
    //   const fileResult = new File([blob], fileName, { type: 'image/jpeg' })

    //   return { data: fileResult, err: null }
    // } catch (error) {
    return { data: null, err: 'convert_heic_err' }

    // }
  }

  return { data: file, err: null }
}

export async function ReadImage(e: any, setImage: any) {
  if (e) {
    const reader = new FileReader()

    reader.onloadend = () => {
      setImage(reader.result)
    }

    reader.readAsDataURL(e)
  }
}

export function StyleHtmlImage(content: string) {
  return content.replace(/<img([^>]*)>/g, '<img$1 style="width: 100%; height: auto; object-fit: contain;">')
}

export { FormatImage }
