<template>
    <div class="movie-categories">
        <span v-for="(tag, index) in categories" :key="index" class="category" @click="navigateToMovieInfo(tag.name)">
            {{ tag.name }}
        </span>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import router from '@/router';
import instance from '@/instance/instance';
export default {
    data() {
        return {
            categories: []
        }
    },
    methods: {
        navigateToMovieInfo(tag) {
            if (this.logincode === 1) {
                router.push({ name: 'MoviePage', params: { tag } });
            } else {
                router.push('/login');
            }
        },
        async fetchCategories() {
      try {
        const response = await instance.get('/category');
        this.categories = response.data.data;
      } catch (error) {
        this.$message.error('加载电影分类失败');
        console.error('Error fetching categories:', error);
      }
    },
    },
    computed: {
        ...mapState(['userId', 'logincode']),
    },
    created() {
        this.fetchCategories();
    }
}
</script>

<style scoped>
.movie-categories {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    gap: 10px;
    padding: 20px;
    background-color: #f5f5f5;
    width: 80%;
    margin: 0 auto;
    animation: fadeInCategories 2s ease-in-out;
}

@keyframes fadeInCategories {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.category {
    width: 45px;
    text-align: center;
    background-color: #fffafa;
    color: #333;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;

    transition: background-color 0.3s ease;
}

.category:hover {
    background-color: #aaa;
}
</style>