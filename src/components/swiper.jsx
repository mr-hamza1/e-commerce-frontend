import React from 'react';
import { Box, IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const ProductImageSwiper = ({ images }) => {
  return (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: 1000, mx: 'auto' }}>
      {/* Custom Navigation Buttons */}
      <IconButton className="swiper-button-prev" sx={{ position: 'absolute', top: '50%', left: 0, zIndex: 10 }}>
        <ArrowBackIos  />
      </IconButton>
      <IconButton className="swiper-button-next" sx={{ position: 'absolute', top: '50%', right: 0, zIndex: 10 }}>
        <ArrowForwardIos />
      </IconButton>

      {/* Swiper Carousel */}
      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        spaceBetween={10}
        slidesPerView={1}
        loop={true}
        style={{ borderRadius: 8, overflow: 'hidden' }}
      >
        {images.map((src, idx) => (
          <SwiperSlide key={idx}>
            <Box
              component="img"
              src={src}
              alt={`Product ${idx + 1}`}
              sx={{ width: '100%', height: 'auto', objectFit: 'cover' }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default ProductImageSwiper;
