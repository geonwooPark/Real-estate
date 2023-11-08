import React, { useEffect, useState } from 'react'
import Carousel from './Carousel'
import { AiOutlineClose } from 'react-icons/ai'
import { ImagesType } from '../interfaces/interfaces'

interface EnlargedImageProps {
  images: ImagesType[]
  setShowEnlargedImage: React.Dispatch<React.SetStateAction<boolean>>
}

export default function EnlargedImage({
  images,
  setShowEnlargedImage,
}: EnlargedImageProps) {
  return (
    <div
      onClick={() => setShowEnlargedImage(false)}
      className={`fixed top-0 bottom-0 left-0 right-0 z-[100] w-full h-full bg-black/50
          `}
    >
      <div className="w-full h-full flex justify-center items-center">
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full md:w-[600px] lg:w-[900px]"
        >
          <Carousel
            images={images}
            imageMode="object-contain"
            className="bg-white h-[100vh] md:h-[400px] lg:h-[600px]"
          />
          <div className="absolute top-4 right-4">
            <button onClick={() => setShowEnlargedImage(false)}>
              <AiOutlineClose size={30} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
