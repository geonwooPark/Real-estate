import React, { CSSProperties } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
// import 'slick-carousel/slick/slick-theme.css'
import { IconType } from 'react-icons'
import { HiOutlineArrowSmRight, HiOutlineArrowSmLeft } from 'react-icons/hi'

interface Images {
  path: string
  url: string
}

interface CarouselProps {
  images: Images[]
  className: string
}

interface ArrowProps {
  customStyle?: string
  icon?: IconType
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

export default function Carousel({ images, className }: CarouselProps) {
  if (!images) {
    return (
      <div className="bg-gray-300 h-[300px] md:h-[200px] lg:h-[300px] overflow-hidden"></div>
    )
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
        icon={HiOutlineArrowSmRight}
        customStyle="bg-white/70 rounded-full absolute top-[50%] -translate-y-[50%] right-2 cursor-pointer hover:opacity-50"
      />
    ),
    prevArrow: (
      <PrevArrow
        icon={HiOutlineArrowSmLeft}
        customStyle="bg-white/70 rounded-full absolute top-[50%] -translate-y-[50%] left-2 cursor-pointer hover:opacity-50 z-10"
      />
    ),
  }

  return (
    <Slider {...settings}>
      {images.map((image: Images, i: number) => {
        return (
          <div key={i} className={`${className} overflow-hidden`}>
            <img
              src={image.url}
              alt={`매물이미지${i}`}
              className="w-full h-full object-cover"
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
      {Icon && <Icon size={20} />}
    </div>
  )
}

const PrevArrow = ({ customStyle, onClick, icon: Icon }: ArrowProps) => {
  return (
    <div className={customStyle} onClick={onClick}>
      {Icon && <Icon size={20} />}
    </div>
  )
}
