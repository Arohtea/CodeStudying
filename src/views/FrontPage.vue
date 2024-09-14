<template>
    <div>
        <TopHeader></TopHeader>
        <FrontHeader></FrontHeader>
        <FrontCarousel></FrontCarousel>
        <FrontNewMovie></FrontNewMovie>
        <FrontCategories></FrontCategories>
        <MovieList></MovieList>
        <FrontFooter></FrontFooter>
    </div>
</template>

<script>
import FrontHeader from '../components/FrontHeader.vue'
import FrontCarousel from '../components/FrontCarousel.vue'
import FrontFooter from '../components/FrontFooter.vue';
import MovieList from '../components/FrontMovieList.vue';
import FrontCategories from '../components/FrontCategories.vue';
import TopHeader from '../components/TopHeader.vue';
import FrontNewMovie from '../components/FrontNewMovie.vue';
export default {
    name: 'FrontPage',
    components: {
        FrontHeader,
        FrontCarousel,
        FrontFooter,
        MovieList,
        FrontCategories,
        TopHeader,
        FrontNewMovie
    },
}

</script>

<style></style>