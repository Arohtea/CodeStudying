<template>
    <header class="header">
        <a href="/" class="logo">超绝电影网站</a>
        <div class="search-container">
            <input type="text" id="searchInput" v-model="searchQuery" @input="handleSearchInput"
                @focus="isFocused = true" @blur="isFocused = false" placeholder="搜索电影...">
            <!-- <button id="searchButton" @click="handleSearchClick">搜索</button> -->
            <el-button type="primary" icon="el-icon-search" @click="handleSearchClick" style="background:white ;color: black;border:white;margin:white">搜索</el-button>
            <ul v-if="isFocused && searchResults.length > 0" class="search-suggestions">
                <li v-for="(result, index) in searchResults" :key="index" @mousedown="navigateToMovieInfo(result.id)">
                    {{ result.title }}
                </li>
            </ul>
        </div>
    </header>
</template>

<script>
import router from '@/router';
import { mapState } from 'vuex';
import instance from '@/instance/instance';
import { debounce } from 'lodash';

export default {
    data() {
        return {
            searchQuery: '',
            searchResults: [],
            isFocused: false,
        };
    },
    methods: {
        handleSearchInput() {
            this.debounceFetchSearchResults(this.searchQuery);
        },
        handleSearchClick() {
            if (this.searchQuery.length > 0) {
                if (this.logincode === 1) {
                    router.push({ name: 'SearchPage', params: { query: this.searchQuery } });
                } else {
                    router.push('/login');
                }
            }
        },
        async fetchSearchResults(query) {
            if (this.logincode == 1) {
                if (typeof query === 'string' && query.trim().length > 0) {
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
            }
        },
        navigateToMovieInfo(id) {
            if (this.logincode === 1) {
                router.push({ name: 'MovieInfo', params: { id } });
            } else {
                router.push('/login');
            }
        }
    },
    computed: {
        ...mapState(['userId', 'logincode']),
    },
    mounted() {
    },
    created() {
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
</style>