import Carousel from "@/app/components/Carousel";
import {CarouselItem} from "@/app/components/Carousel/carousel-utils";
import {Container} from "@chakra-ui/react";

export default function Home() {
    return (
        <Container maxW='1440px' w='100%' boxSizing='border-box' my={5}>
            <Carousel>
                <CarouselItem>Item 1</CarouselItem>
                <CarouselItem>Item 2</CarouselItem>
                <CarouselItem>Item 3</CarouselItem>
            </Carousel>
        </Container>
    )
}
