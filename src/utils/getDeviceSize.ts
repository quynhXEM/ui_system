import { useEffect, useState } from 'react'

interface WindowSize {
  width: number
  height: number
}

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0, // Khởi tạo với giá trị mặc định
    height: 0
  })

  useEffect(() => {
    // Kiểm tra nếu đang ở môi trường client
    if (typeof window !== 'undefined') {
      // Đặt kích thước cửa sổ hiện tại
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })

      function handleResize() {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight
        })
      }

      window.addEventListener('resize', handleResize)

      // Cleanup listener on component unmount
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  return windowSize
}
