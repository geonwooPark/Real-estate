import React from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

export default function Carousel({ images }: any) {
  if (!images) {
    return (
      <div className="bg-gray-300 h-[300px] md:h-[200px] lg:h-[300px] overflow-hidden"></div>
    )
  }
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  }

  return (
    <Slider {...settings}>
      {images.map((image: any, i: number) => {
        return (
          <div
            key={i}
            className="bg-gray-300 h-[300px] md:h-[200px] lg:h-[300px] overflow-hidden"
          >
            <img src={image.url} className="w-full h-full object-cover"></img>
          </div>
        )
      })}
    </Slider>
  )
}

const SampleNextArrow = (props: any) => {
  const { className, style, onClick } = props
  return (
    <div
      className={className}
      style={{ ...style, display: 'block', right: 10 }}
      onClick={onClick}
    />
  )
}

const SamplePrevArrow = (props: any) => {
  const { className, style, onClick } = props
  return (
    <div
      className={className}
      style={{
        ...style,
        display: 'block',
        left: 10,
        zIndex: 10,
      }}
      onClick={onClick}
    />
  )
}
