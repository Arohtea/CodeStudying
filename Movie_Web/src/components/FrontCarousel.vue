<template>
    <div class="carousel">
        <button @click="prev" class="carousel-control-prev">
            <span>&lt;</span>
        </button>
        <div class="carousel-inner">
            <div v-for="(item, index) in movies" :key="index" class="carousel-item" v-show="currentIndex === index">
                <img :src="item.imgcsrc" :alt="item.alt" style="width: 100%; height: 100%;"
                    @click="navigateToMovieInfo(item.id)">
            </div>
            <button @click="next" class="carousel-control-next">
                <span>&gt;</span>
            </button>
        </div>
        <div class="carousel-caption">
            <h2>最新电影</h2>
            <p>探索我们的精选影片</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import router from '@/router';
import { mapState } from 'vuex'
export default {
    router,
    data() {
        return {
            currentIndex: 0,
            movies: [],
        };
    },
    computed: {
        ...mapState(['userId', 'logincode']),
    },
    methods: {
        async fetchMovies() {
            try {
                const response = await axios.get('http://localhost:8080/user/imgcsrc');
                this.movies = response.data.data;
            } catch (error) {
                this.$message.error('轮播图加载失败');
                console.error('Error fetching movies:', error);
            }
        },
        next() {
            clearInterval(this.timer);
            this.currentIndex = (this.currentIndex + 1) % this.movies.length;
            setTimeout(() => {
                this.timer = setInterval(() => {
                    this.next();
                }, 3000); 
            }, 500); 
        },
        prev() {
            clearInterval(this.timer);
            this.currentIndex = (this.currentIndex - 1 + this.movies.length) % this.movies.length;
            setTimeout(() => {
                this.timer = setInterval(() => {
                    this.next();
                }, 3000); 
            }, 500); 
        },
        navigateToMovieInfo(id) {
            if (this.logincode === 1) {
                router.push({ name: 'MovieInfo', params: { id } });
            } else {
                router.push('/login');
            }
        },
    },
    mounted() {
        this.fetchMovies();
        this.timer = setInterval(() => {
            this.next();
        }, 3000); 
    },
    beforeDestroy() {
        clearInterval(this.timer);
    },
};
</script>

<style scoped>
.carousel {
    position: relative;
    height: 650px;
    overflow: hidden;
    width: 80%;
    margin: 0 auto;
    animation: fadeInImage 3s ease-in-out;
}
@keyframes fadeInImage {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.carousel-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 10px;
    text-align: center;
}

.carousel-item {
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
}
.carousel-item img:hover {
    cursor: pointer;
}
.carousel-item img {
    width: 100%;
    height: 500;
    object-fit: cover;
}


.carousel-control-prev,
.carousel-control-next {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
    cursor: pointer;
    background-color: transparent;
    border: none;
    color: white;
    font-size: 3rem;

}

.carousel-control-prev {
    left: 10px;
}

.carousel-control-next {
    right: 10px;
}
</style>