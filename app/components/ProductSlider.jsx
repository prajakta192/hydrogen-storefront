import {Image} from '@shopify/hydrogen';
import{useState, useEffect, useRef} from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export function ProductSlider({media, className}) {
const [sliderData, setSliderData]  = useState(media[0])
//console.log(sliderData)
const handleClick = (index) => {
  console.log(index)
   const slider = media[index];
   setSliderData(slider)
 }
 
  return (
    <>
     <div
      className={` hiddenScroll md:p-0 md:overflow-x-auto ${className}`}
    >
    <div>
        <img src={sliderData.image.url} className='md:aspect-[4/5]' height='500'/>
    </div>
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
            <span key={med.id || image?.id}>
            {image && (
             <img src={image.url} height="70" width="90" className='md:aspect-[4/5]' onClick={()=> handleClick(i)} />
            )}
         </span>
        );
      })}
     </div> 
</div>
   </>
  );
}

