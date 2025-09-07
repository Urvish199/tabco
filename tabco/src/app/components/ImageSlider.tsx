import React from "react";
import Slider, { Settings } from "react-slick";
import Image from "next/image";

type ImageSliderProps = {
  images: string[];
  styleCss?: string;
  onClickHandler?: (imgURL: string) => void;
};

export default function ImageSlider({ images, styleCss, onClickHandler }: ImageSliderProps) {
  const settings: Settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <Slider {...settings}>
      {images.map((img, index) => (
        <div onClick={() => onClickHandler?.(img)} key={index} className={`border-0flex justify-center items-center ${styleCss}`}>
          <Image
            src={img}
            alt={`Slide ${index}`}
            width={400}
            height={300}
            className="rounded-lg object-top object-cover w-full h-full"
          />
        </div>
      ))}
    </Slider>
  );
}
