'use client'

import React, {useRef, useState} from 'react';
import {Box} from '@chakra-ui/react'

import {CarouselArrow, CarouselNavIndicators} from './carousel-utils';
import {containerDefaultStyles, itemsWrapperDefaultStyles, innerDefaulStylest} from './styles';



const Carousel = (props) => {
    const {
        children,
        isInfinite = true,
        transitionTime = 1,
        containerStyles = {},
        itemsWrapperStyles = {},
        innerStyles = {},
        onSlideTransitionEnd,
        carouseItemStyles = {},
        carouselArrowNextLabel = '',
        carouselArrowPrevLabel = '',
        carouselArrowNextStyles = {},
        carouselArrowPrevStyles = {},
        carouselOnNextButtonClick,
        carouselOnPrevButtonClick,
        carouselOnNavIndicatorClick,
        renderCarouselNavIndicatorLabel,
        renderCarouselNavIndicatorStyles,
        carouselNavIndicatorContainerStyles = {}
    } = props;

    const [activeIndex, setActiveIndex] = useState(isInfinite ? 1 : 0);
    const [duration, setDuration] = useState(transitionTime);
    const innerRef = useRef(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const childrenArray = React.Children.toArray(children);
    const childrenCount = React.Children.count(children);

    const handleTransitionEnd = () => {
        setIsTransitioning(false);

        if (isInfinite) {
            if (activeIndex === childrenCount + 1) {
                handleLoop(1)
            } else if (activeIndex === 0) {
                handleLoop(childrenCount)
            }
        }

        if (onSlideTransitionEnd && typeof onSlideTransitionEnd === 'function') {
            onSlideTransitionEnd();
        }
    }

    const handleNavIndicatorClick = (navIndex) => {
        if (navIndex === activeIndex) return

        if (duration !== transitionTime) {
            setDuration(transitionTime);
        }

        setActiveIndex(navIndex);

        if (carouselOnNavIndicatorClick && typeof carouselOnNavIndicatorClick === 'function') {
            carouselOnNavIndicatorClick();
        }
    }

    const handleLoop = (newIndex) => {
        setDuration(0);
        setActiveIndex(newIndex);
    }

    const handleIndexUpdate = (index = 1) => {
        if (isTransitioning) return;

        if (duration !== transitionTime) {
            setDuration(transitionTime);
        }

        const isNext = index > activeIndex;

        if (index < 0 || index >= childrenCount) {
            if (isInfinite && index > childrenCount + 1) {
                index = isNext ? 1 : childrenCount + 1;
            } else if (!isInfinite){
                index = !isNext ? 0 : childrenCount - 1;
                setActiveIndex(index);

                return;
            }
        }

        setIsTransitioning(true);
        setActiveIndex(index);
    }

    // Styles
    const containerStylesObj = {
        ...containerDefaultStyles,
        ...containerStyles
    }

    const itemsWrapperStylesObj = {
        ...itemsWrapperDefaultStyles,
        ...itemsWrapperStyles
    }

    const innerStylesObj = {
        ...innerDefaulStylest,
        transition: `transform ${duration}s`,
        transform: `translateX(-${activeIndex * 100}%)`,
        ...innerStyles
    }

    return (
        <Box sx={containerStylesObj}>
            <Box sx={itemsWrapperStylesObj}>
                <Box sx={innerStylesObj} ref={innerRef} onTransitionEnd={handleTransitionEnd}>
                    {/* Clone last element for smooth transition */}
                    {isInfinite && childrenCount > 2 ? React.cloneElement(childrenArray[childrenCount - 1], {carouseItemStyles}) : ''}

                    {/* Render Carousel Items */}
                    {React.Children.map(children, (child, index) => {
                        return React.cloneElement(child, {carouseItemStyles})
                    })}

                    {/*/!* Clone first element for smooth transition *!/*/}
                    {isInfinite && childrenCount > 2 ? React.cloneElement(childrenArray[0], {carouseItemStyles}) : ''}
                </Box>
            </Box>

            <CarouselArrow
                isNext={false}
                label={carouselArrowPrevLabel}
                styles={carouselArrowNextStyles}
                activeIndex={activeIndex}
                updateIndex={handleIndexUpdate}
                onPrevClick={carouselOnPrevButtonClick}
            />

            <CarouselArrow
                isNext={true}
                label={carouselArrowNextLabel}
                styles={carouselArrowPrevStyles}
                activeIndex={activeIndex}
                updateIndex={handleIndexUpdate}
                onNextClick={carouselOnNextButtonClick}
            />

            <CarouselNavIndicators
                activeIndex={activeIndex}
                onNavIndicatorClick={handleNavIndicatorClick}
                renderNavLabel={renderCarouselNavIndicatorLabel} // (navIndex) => navIndex
                containerStyles={carouselNavIndicatorContainerStyles}
                renderIndicatorStyles={renderCarouselNavIndicatorStyles}
                isInfinite={isInfinite}
            >
                {children}
            </CarouselNavIndicators>
        </Box>
    )
}

export default Carousel;
