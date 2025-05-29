import React, { useRef, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const ProductImageSwiper = ({ images }) => {
  const swiperRef = useRef(null);

  useEffect(() => {
    // Start autoplay manually after mount (if not auto-starting)
    if (swiperRef.current?.autoplay) {
      swiperRef.current.autoplay.start();
    }
  }, []);

  return (

 <Box sx={{ position: 'relative', width: '80%', maxWidth: 1000, mx: 'auto' }} 
 onMouseEnter={() => swiperRef.current?.autoplay?.stop()}
      onMouseLeave={() => swiperRef.current?.autoplay?.start()}
      >
      {/* Custom Navigation Buttons */}
      <IconButton className="swiper-button-prev" sx={{ position: 'absolute', top: '50%', left: 0,transform: 'translateY(-10%)',  zIndex: 10 }}>
        <ArrowBackIos  sx={{ color: '#8e8e8e', fontSize: { xs: 10, sm: 40 } }} />
      </IconButton>
      <IconButton className="swiper-button-next" sx={{ position: 'absolute', top: '50%', transform: 'translateY(-10%)', right: 0, zIndex: 10 }}>
        <ArrowForwardIos  sx={{ color: '#8e8e8e', fontSize: { xs: 10, sm: 40 } }} />
      </IconButton>

      <Swiper
        modules={[Navigation, Autoplay]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        loop={true}
        spaceBetween={10}
        slidesPerView={1}
        style={{ borderRadius: 8, overflow: 'hidden' }}
      >
        {images.map((src, idx) => (
          <SwiperSlide key={idx}>
            <Box
              component="img"
              src={src}
              alt={`Product ${idx + 1}`}
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default ProductImageSwiper;
