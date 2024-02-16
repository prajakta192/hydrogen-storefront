import {Image} from '@shopify/hydrogen';
import{useState, useEffect, useRef} from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export function ProductSlider({media, className}) {
const [nav1, setNav1] = useState(null);
const [currentSlide, setCurrentSlide] = useState(0)
const [slider1, setSlider1] = useState(null);

useEffect(() => {
  setNav1(slider1);
}, [slider1]);

 const settings = {
    onReInit: () => setCurrentSlide(slider1?.innerSlider.state.currentSlide),
    lazyLoad: true,
    asNavFor: ".slick-active",
    focusOnSelect: true,
  };
console.log(currentSlide, slider1)
console.log('nav',nav1)
 
  return (
    <>
     <div
      className={` hiddenScroll md:p-0 md:overflow-x-auto ${className}`}
    >
    <Slider {...settings}
            asNavFor={nav1}
            ref={(slider) => setSlider1(slider)}
        >
        {media.map((med, i) => {
        const isFirst = i === 0;
        const isFourth = i === 3;
        const isFullWidth = i % 3 === 0;

        const image =
          med.__typename === 'MediaImage'
            ? {...med.image, altText: med.alt || 'Product image'}
            : null;

        const style = [
          isFullWidth ? 'md:col-span-2' : 'md:col-span-1',
          isFirst || isFourth ? '' : 'md:aspect-[4/5]',
          'aspect-square snap-center card-image bg-white dark:bg-contrast/10 w-mobileGallery md:w-full',
        ].join(' ');

        return (
          <div 
              key={med.id || image?.id}>
            
            {image && (
             <img src={image.url}  className='md:aspect-[4/5]' />
             
            )}
      </div>
        );
      })}
        </Slider>
    <div className='flex gap-6 justify-center py-6'>
      {media.map((med, i) => {
        const isFirst = i === 0;
        const isFourth = i === 3;
        const isFullWidth = i % 3 === 0;

        const image =
          med.__typename === 'MediaImage'
            ? {...med.image, altText: med.alt || 'Product image'}
            : null;

        const style = [
          isFullWidth ? 'md:col-span-2' : 'md:col-span-1',
          isFirst || isFourth ? '' : 'md:aspect-[4/5]',
          'aspect-square snap-center card-image bg-white dark:bg-contrast/10 w-mobileGallery md:w-full',
        ].join(' ');

        return (
          <div 
              key={med.id || image?.id} 
              className={currentSlide === i ? "active": null} 
              onClick={() => {
                slider1?.slickGoTo(i)
              }}>
            
            {image && (
             <img src={image.url} height="70" width="90" className='md:aspect-[4/5]' />
             
            )}
         {currentSlide}
      </div>
        );
      })}
     </div> 
</div>
   </>
  );
}

