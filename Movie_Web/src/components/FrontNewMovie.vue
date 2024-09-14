<template>
    <div class="movie-list">
        <div v-for="(movie, index) in movies" :key="index" class="movie-card">
                <img :src="movie.imgsrc" :alt="movie.alt" @click="navigateToMovieInfo(movie.id)">
                <h3 @click="navigateToMovieInfo(movie.id)">{{ movie.title }}</h3>
                <p>导演：{{ movie.director }}</p>
                <p>主演：
                    <span v-if="movie.actors.length <= 10">{{ movie.actors }}</span>
                    <span v-else>{{ movie.actors.substring(0, 10) }}...</span>
                </p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import router from '@/router';
import { mapState } from 'vuex';
export default {
    router,
    data() {
        return {
            currentIndex: 0,
            movies: [],
        };
    },
    methods: {
        navigateToMovieInfo(id) {
            if (this.logincode === 1) {
                router.push({ name: 'MovieInfo', params: { id } });
            } else {
                router.push('/login');
            }
        },
    },
    computed: {
        ...mapState(['userId', 'logincode']),
    },
    async created() {
        try {
            const response = await axios.get('http://localhost:8080/user/new');
            this.movies = response.data.data;
        } catch (error) {
            this.$message.error('获取新片出错');
            console.error('Error fetching movies:', error);
        }
    },

}
</script>

<style scoped>
.movie-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    padding: 20px;
    width: 80%;
    margin: 0 auto;
    place-items: center;
    animation: fadeInList 2s ease-in-out;
}
@keyframes fadeInList {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
.movie-list a {
    text-decoration: none;
    color: black
}

.movie-card {
    width:250px;
    border: 1px solid #ccc;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.movie-card:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.movie-card img {
    width: 100%;
    height: 350px;
    transition: transform 0.3s ease;
    object-fit: cover
}
.movie-card img:hover {
    cursor: pointer;
}
.movie-card h3:hover {
    cursor: pointer;
}
.movie-card:hover img {
    transform: scale(1.1);
}

.movie-card h3,
.movie-card p {
    margin: 10px;
}
</style>