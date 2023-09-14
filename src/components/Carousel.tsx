import React from 'react'
import Spinner from './Spinner'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

interface Images {
  url: string
  path: string
}

export default function Carousel({ images }: any) {
  if (!images) {
    return <Spinner />
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
    <Slider
      {...settings}
      className="bg-red-400 md:h-[200px] lg:h-[300px] overflow-hidden"
    >
      {images.map((image: any, i: number) => {
        return (
          <div key={i}>
            <img
              src={image.url}
              className="w-full h-[400px] object-cover"
            ></img>
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
