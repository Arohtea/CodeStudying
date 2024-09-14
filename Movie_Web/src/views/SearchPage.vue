<template>
    <div>
        <TopHeader></TopHeader>
        <header class="header">
            <a href="/" class="logo">超绝电影网站</a>
            <div class="search-container">
                <input type="text" id="searchInput" v-model.trim="searchQuery" @input="handleSearchInput"
                    @focus="isFocused = true" @blur="isFocused = false" :placeholder="query">
                <button id="searchButton" @click="handleSearchClick">搜索</button>
                <ul v-if="isFocused && searchResults.length > 0" class="search-suggestions">
                    <li v-for="(result, index) in searchResults" :key="index"
                        @mousedown="navigateToMovieInfo(result.id)">
                        {{ result.title }}
                    </li>
                </ul>
            </div>
        </header>
        <p></p>
        <strong v-if="displayedMovies.length > 0"
            style="margin-top: 40px;width:80%;margin:0 auto;font-size :30px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;为您找到以下搜索结果：</strong>
        <strong v-else
            style="margin-top: 40px;width:80%;margin:0 auto;font-size :30px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;没有找到搜索结果：</strong>
        <div class="movie-list">
            <div v-for="(movie, index) in displayedMovies" :key="index" class="movie-card">
                <img :src="movie.imgsrc" :alt="movie.alt" @click="navigateToMovie(movie.id)">
                <h3 @click="navigateToMovieInfo(movie.id)">{{ movie.title }}</h3>
                <p>主演：{{ movie.actors }}</p>
            </div>
        </div>
        <el-pagination background layout="total, prev, pager, next, jumper" :total="totalMovies" v-model="currentPage"
            :page-size="pageSize" @current-change="handlePageChange" />
        <FrontFooter></FrontFooter>
    </div>
</template>

<script>
import router from '@/router';
import { mapState } from 'vuex';
import TopHeader from '@/components/TopHeader.vue';
import FrontFooter from '@/components/FrontFooter.vue';
import { debounce } from 'lodash';
import instance from '@/instance/instance';


export default {
    components: {
        TopHeader,
        FrontFooter,
    },
    data() {
        return {
            searchQuery: '',
            searchResults: [],
            isFocused: false,
            displayedMovies: [],
            currentPage: 1,
            pageSize: 20,
            totalMovies: 0,
            query: '',
        };
    },
    methods: {
        handleSearchInput() {
            this.debounceFetchSearchResults(this.searchQuery);
        },
        //搜索用
        async handleSearchClick() {
            if (this.searchQuery.trim().length > 0) {
                try {
                    const response = await instance.get(`/movie/detail?pageNum=${this.currentPage}&pageSize=${this.pageSize}&name=${this.searchQuery}`);
                    this.displayedMovies = response.data.data.items;
                    this.totalMovies = response.data.data.total;
                    this.currentPage = 1;
                    if (response.data.code === 1) {
                        this.movies = [];
                        this.$message.error('没有找到电影');
                        throw new Error('无效的凭据');
                    }
                } catch (error) {
                    console.error('Error fetching movies:', error);
                }
            } else {
                this.$message.error('请输入搜索内容');
            }
        },
        handlePageChange(page) {
            this.currentPage = page;
            this.fetchMovies(page, this.pageSize);
        },
        //分页用
        async fetchMovies(page, size) {
            if (this.searchQuery.trim().length === 0) return;
            const response = instance.get(`/movie/detail?pageNum=${page}&pageSize=${size}&name=${this.searchQuery}`)
            if (response.data.code === 1) {
                this.$message.error('没有找到电影');
            } else {
                this.displayedMovies = response.data.data.items;
                this.totalMovies = response.data.data.total;
            }
        }
        ,
        //搜索栏用到
        async fetchSearchResults(query) {
            if (query.trim().length > 0) {
                try {
                    const response = await instance.get(`/movie/detail?pageNum=1&pageSize=10&name=${query}`);
                    this.searchResults = response.data.data.items;
                    if (response.data.code === 1) {
                        this.searchResults = [];
                        this.$message.error('没有找到电影');
                        throw new Error('无效的凭据');
                    }
                } catch (error) {
                    this.$message.error('搜索出错');
                    console.error('搜索出错:', error);
                }
            }
        },
        navigateToMovieInfo(id) {
            if (this.logincode === 1) {
                router.push({ name: 'MovieInfo', params: { id } });
            } else {
                router.push('/login');
            }
        },
        navigateToMovie(id) {
            if (this.logincode === 1) {
                router.push({ name: 'MovieInfo', params: { id } });
            } else {
                router.push('/login');
            }
        },

        //初始化用到
        async searchres(query) {
            try {
                const response = await instance.get(`/movie/detail?pageNum=${this.currentPage}&pageSize=${this.pageSize}&name=${query}`);
                if (response.data.code === 1) {
                    this.displayedMovies = [];
                    this.$message.error('没有找到电影');
                    throw new Error('无效的凭据');
                }
                this.displayedMovies = response.data.data.items;
                this.totalMovies = response.data.data.total;
                this.currentPage = 1;
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        },
    },
    computed: {
        ...mapState(['userId', 'logincode']),
    },
    mounted() {
    },
    created() {
        this.query = this.$route.params.query;
        if (this.query.trim().length > 0) {
            this.searchres(this.query);
        }

        this.debounceFetchSearchResults = debounce(this.fetchSearchResults.bind(this), 300);
    },
}
</script>

<style scoped>
.header {
    width: 77.95%;
    margin: 0 auto;
    background-color: #333;
    color: white;
    padding: 20px;
    text-align: center;
    animation: fadeIn 2s ease-in-out;
}

@keyframes fadeIn {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

.logo {
    text-decoration: none;
    color: inherit;
    font-size: 24px;
    font-weight: bold;
}

.search-container {
    position: relative;
    margin-top: 20px;
    display: flex;
    align-items: center;
}

#searchInput {
    flex-grow: 1;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px 0 0 5px;
}

#searchButton {
    padding: 10px 15px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-left: none;
    border-radius: 0 5px 5px 0;
    cursor: pointer;
}

.search-suggestions {
    color: black;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #fff;
    border: 1px solid #ccc;
    border-top: none;
    list-style-type: none;
    padding: 0;
    margin: 0;
    z-index: 1;
}

.search-suggestions li {
    text-align: left;
    padding: 10px;
    cursor: pointer;
}

.search-suggestions li:hover {
    background-color: #eee;
}

.movie-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    padding: 20px;
    animation: fadeInList 2s ease-in-out;
}

.movie-list a {
    text-decoration: none;
    color: black
}

.movie-card {
    width: 250px;
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
    width: 300px;
    height: 350px;
    transition: transform 0.3s ease;
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