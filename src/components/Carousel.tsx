import React from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
// import 'slick-carousel/slick/slick-theme.css'
import { IconType } from 'react-icons'
import { ImagesType } from '../interfaces/interfaces'
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from 'react-icons/md'

interface CarouselProps {
  images: ImagesType[]
  imageMode: 'object-cover' | 'object-contain' | 'object-fill'
  className: string
  onClick?: () => void
}

interface ArrowProps {
  customStyle?: string
  icon?: IconType
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

export default function Carousel({
  images,
  imageMode,
  className,
  onClick,
}: CarouselProps) {
  if (!images) {
    return <div>이미지 불러오는 중...</div>
  }
  const settings = {
    fade: true,
    dots: true,
    dotsClass: 'dots_custom',
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: (
      <NextArrow
        icon={MdOutlineKeyboardArrowRight}
        customStyle="absolute top-[50%] -translate-y-[50%] right-2 cursor-pointer hover:opacity-50"
      />
    ),
    prevArrow: (
      <PrevArrow
        icon={MdOutlineKeyboardArrowLeft}
        customStyle="absolute top-[50%] -translate-y-[50%] left-2 cursor-pointer hover:opacity-50 z-10"
      />
    ),
  }

  return (
    <Slider {...settings}>
      {images.map((image: ImagesType, i: number) => {
        return (
          <div key={i} className={`${className} overflow-hidden`}>
            <img
              src={image.url}
              alt={`매물이미지${i}`}
              className={`w-full h-full cursor-pointer ${imageMode}`}
              onClick={onClick}
            ></img>
          </div>
        )
      })}
    </Slider>
  )
}

const NextArrow = ({ customStyle, onClick, icon: Icon }: ArrowProps) => {
  return (
    <div className={customStyle} onClick={onClick}>
      {Icon && <Icon size={30} />}
    </div>
  )
}

const PrevArrow = ({ customStyle, onClick, icon: Icon }: ArrowProps) => {
  return (
    <div className={customStyle} onClick={onClick}>
      {Icon && <Icon size={30} />}
    </div>
  )
}
