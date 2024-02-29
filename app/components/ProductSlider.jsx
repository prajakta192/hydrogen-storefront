import{useState, useEffect, useRef} from 'react'
import {IconCaret} from '~/components'
import Slider from "react-slick"

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export function ProductSlider({media, className}) {
   const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  let sliderRef1 = useRef(null);
  let sliderRef2 = useRef(null);
useEffect(() => {
    setNav1(sliderRef1);
    setNav2(sliderRef2);
  }, []);
return(
  <div className="slider-container">
     
      <Slider asNavFor={nav2} ref={slider => (sliderRef1 = slider)}>
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
            <div key={med.id || image?.id}>
           
            {image && (
             <img src={image.url} className='md:aspect-[4/5]'/>
            )}
         </div>
        );
      })}
        
      </Slider>
      
      <Slider
        asNavFor={nav1}
        ref={slider => (sliderRef2 = slider)}
        slidesToShow={3}
        swipeToSlide={true}
        focusOnSelect={true}
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
            <div key={med.id || image?.id}>
           
            {image && (
             <img src={image.url} height="70" width="90" className='md:aspect-[4/5]' />
            )}
         </div>
        );
      })}
      </Slider>
    </div>
  )
}

