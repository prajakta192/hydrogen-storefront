import{useState, useEffect, useRef} from 'react'
import {IconCaret} from '~/components'
import Slider from "react-slick"

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export function ProductSlider({media, className}) {
   const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const [slider1, setSlider1] = useState(null);
  const [slider2, setSlider2] = useState(null);

  useEffect(() => {

    setNav1(slider1);
    setNav2(slider2);

  });
   const settingsMain = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    asNavFor: '.slider-nav'

  };

  const settingsThumbs = {
    slidesToShow: 3,
    slidesToScroll: 1,
    asNavFor: '.slider-for',
    dots: true,
    centerMode: true,
    swipeToSlide: true,
    focusOnSelect: true,
    nextArrow: (
      <div>
       <IconCaret direction='left'/>
      </div>
    ),
    prevArrow: (
      <div>
        <IconCaret direction='right'/>
      </div>
    )
  };
return(
  <div className="slider-container">
     
      <Slider {...settingsMain}
          asNavFor={nav2}
          ref={slider => (setSlider1(slider))}>
        {media.map((med, i) => {
        const image =
          med.__typename === 'MediaImage'
            ? {...med.image, altText: med.alt || 'Product image'}
            : null;

        return (
          
            <div key={med.id || image?.id}>
           
            {image && (
             <img src={image.url} className='md:aspect-[4/5]'/>
            )}
         </div>
        );
      })}
        
      </Slider>
      <div className="thumbnail-slider-wrap">
      <Slider
         {...settingsThumbs}  asNavFor={nav1}
            ref={slider => (setSlider2(slider))}
      >
       {media.map((med, i) => {
        const image =
          med.__typename === 'MediaImage'
            ? {...med.image, altText: med.alt || 'Product image'}
            : null;

        return (
            <div key={med.id || image?.id}>
           
            {image && (
             <img src={image.url} className='md:aspect-[4/5]' />
            )}
         </div>
        );
      })}
      </Slider>
     </div> 
    </div>
  )
}

