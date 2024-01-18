'use client'

import {Box, HStack} from "@chakra-ui/react";
import {ChevronRightIcon, ChevronLeftIcon} from '@chakra-ui/icons'
import PropTypes from 'prop-types';
import React from "react";

import {carouselItemDefaultStyles, carouselArrowDefaultStyles, carouselNavIndicatorsDefaultStyles} from './styles';

export const CarouselItem = ({children, carouseItemStyles}) => {
    const itemStyles = {
        ...carouselItemDefaultStyles,
        ...carouseItemStyles
    }

    return (
        <Box sx={itemStyles}>
            {children}
        </Box>
    )
}

const CarouselArrow = props => {
    const {
        isNext,
        label,
        styles,
        activeIndex,
        updateIndex,
        onPrevClick,
        onNextClick
    } = props;

    const clickHandler = () => {
        const newIndex = isNext ? activeIndex + 1 : activeIndex - 1;

        updateIndex(newIndex);

        if (onPrevClick && typeof onPrevClick === 'function' && isNext) {
            onPrevClick();
        }

        if (onNextClick && typeof onNextClick === 'function' && !isNext) {
            onNextClick();
        }
    }

    const stylesObj = {
        left: isNext ? 'auto' : '0',
        right: isNext ? '0' : 'auto',
        ...carouselArrowDefaultStyles,
        ...styles
    };

    const renderLabel = () => {
        const defaultLabel = isNext ? <ChevronRightIcon boxSize='30px'/> : <ChevronLeftIcon boxSize='30px'/>;
        return label ? label : defaultLabel
    }

    return (
        <Box sx={stylesObj} onClick={() => clickHandler()}>
            {renderLabel()}
        </Box>
    )
}

CarouselArrow.propTypes = {
    isNext: PropTypes.bool,
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element
    ]),
    styles: PropTypes.object,
    activeIndex: PropTypes.number,
    updateIndex: PropTypes.func,
    onPrevClick: PropTypes.func,
    onNextClick: PropTypes.func
}

const CarouselNavIndicators = props => {
    const {
        children,
        activeIndex,
        onNavIndicatorClick,
        renderNavLabel,
        containerStyles,
        renderIndicatorStyles,
        isInfinite
    } = props;

    const clickHandler = navIndex => {
        const index = isInfinite ? navIndex + 1 : navIndex;
        onNavIndicatorClick(index);
    }

    const renderLabel = index => {
        const _index = isInfinite ? index + 1 : index;

        if (renderNavLabel) {
            return renderNavLabel(_index);
        }

        return index + 1;
    }

    const renderNavStyles = index => {
        const _index = isInfinite ? index + 1 : index;
        const customStyles = renderIndicatorStyles && typeof renderIndicatorStyles === 'function' ? renderIndicatorStyles(_index, activeIndex) : {};
        const dynamicDefaultStyles = {
            bg: activeIndex === _index ? 'gray.400' : '',
            color: activeIndex === _index ? 'white' : '',
        }

        return {
            ...carouselNavIndicatorsDefaultStyles,
            ...dynamicDefaultStyles,
            ...customStyles
        }
    }

    const navContainerStyles = {
        justifyContent: 'center',
        spacing: '24px',
        mt: '10px',
        ...containerStyles
    }

    return (
        <HStack sx={navContainerStyles}>
            {React.Children.map(children, (child, index) => {
                return (
                    <Box
                        sx={renderNavStyles(index)}
                        onClick={() => {
                            clickHandler(index)
                        }}
                    >
                        {renderLabel(index)}
                    </Box>
                )
            })}
        </HStack>
    )
}

CarouselNavIndicators.propTypes = {
    activeIndex: PropTypes.number,
    onNavIndicatorClick: PropTypes.func,
    renderNavLabel: PropTypes.func,
    containerStyles: PropTypes.object,
    renderIndicatorStyles: PropTypes.func,
    isInfinite: PropTypes.bool
}

export {CarouselArrow, CarouselNavIndicators};