<template>
  <div>
    <TopHeader></TopHeader>
    <FrontHeader></FrontHeader>
    <div class="movie-tags">
      <h3>电影分类:</h3>
      <span v-for="category in categories" :key="category" class="category"
        :class="{ selected: isSelected(category.name) }" @click="toggleSelectedTag('category', category.name)">
        {{ category.name }}
      </span>

      <h3>国家:</h3>
      <span v-for="country in countries" :key="country" class="country" :class="{ selected: isSelected(country) }"
        @click="toggleSelectedTag('country', country)">
        {{ country }}
      </span>

      <h3>上映时间:</h3>
      <span v-for="year in years" :key="year" class="year" :class="{ selected: isSelected(year) }"
        @click="toggleSelectedTag('year', year)">
        {{ year }}
      </span>
    </div>

    <div v-if="selectedTags.length > 0" class="selected-tag">
      当前选择: {{ this.selectedcategory }} &nbsp; {{ this.selectedcountry }} &nbsp; {{ this.selectedyear }}
    </div>

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
    <div v-if="movies.length === 0" class="no-movies-found">
      没有找到符合当前筛选条件的电影。
    </div>
    <div class="pagination-container">
      <el-pagination background layout="total, prev, pager, next, jumper" :total="totalItems" v-model="currentPage"
        :page-size="pageSize" @current-change="handlePageChange" />
    </div>
    <FrontFooter />
  </div>
</template>

<script>
import TopHeader from '../components/TopHeader.vue';
import FrontFooter from '../components/FrontFooter.vue';
import FrontHeader from '@/components/FrontHeader.vue';
import router from '@/router';
import { mapState } from 'vuex';
import instance from '@/instance/instance';
export default {
  name: 'MoviePage',
  components: {
    TopHeader,
    FrontFooter,
    FrontHeader,
  },
  data() {
    return {
      categories: [],
      countries: ['美国', '中国', '日本', '韩国', '英国', '俄罗斯', '法国'],
      years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      movies: [],
      selectedTags: [],
      currentPage: 1,
      pageSize: 20,
      totalItems: 0,
      selectedcategory: '',
      selectedcountry: '',
      selectedyear: null,
      firstTag: ''
    };
  },
  methods: {
    async fetchMovies(page, size) {
      instance.get(`/movie?pageNum=${page}&pageSize=${size}`)
        .then(response => {
          this.movies = response.data.data.items;
          this.totalItems = response.data.data.total;
        })
        .catch(error => {
          this.$message.error('加载电影失败');
          console.error('Error fetching movies:', error);
        });
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
    handlePageChange(page) {
      this.currentPage = page;
      if (this.selectedTags.length == 0) { this.fetchMovies(page, this.pageSize); }
      else {
        this.fetchCateMovies();
      }
    },
    async toggleSelectedTag(tagType, tag) {
      const index = this.selectedTags.indexOf(tag);
      if (index > -1) {
        if (tagType === 'category') { this.selectedcategory = ''; }
        if (tagType === 'country') { this.selectedcountry = ''; }
        if (tagType === 'year') { this.selectedyear = null; }
        if (this.selectedcategory == '' && this.selectedcountry == '' && this.selectedyear == null) {
          this.selectedTags = [];
        } else { this.selectedTags = [this.selectedcategory, this.selectedcountry, this.selectedyear] }
      } else {
        if (tagType === 'category') { this.selectedcategory = tag; }
        if (tagType === 'country') { this.selectedcountry = tag; }
        if (tagType === 'year') { this.selectedyear = tag; }
        this.selectedTags = [this.selectedcategory, this.selectedcountry, this.selectedyear]
      }
      this.currentPage = 1;
      await this.fetchCateMovies();
    },
    async fetchCateMovies() {
      let url = `/user/movie?pageNum=${this.currentPage}&pageSize=${this.pageSize}`
      let categoryid = null;
      console.log(this.categories.length)
      for (let i = 0; i < this.categories.length; i++) {
        if (this.selectedcategory == this.categories[i].name) {
          categoryid = this.categories[i].id;
          console.log(categoryid);
        }
      }
      if (this.selectedcategory != '' && this.selectedcountry == '' && this.selectedyear == null) {
        url += '&categoryId=' + categoryid;
      } else {
        if (this.selectedcategory != '' && this.selectedcountry != '' && this.selectedyear == null) {
          url += '&categoryId=' + categoryid + '&country=' + this.selectedcountry;
        } else {
          if (this.selectedcategory != '' && this.selectedcountry != '' && this.selectedyear != null) {
            url += '&categoryId=' + categoryid + '&country=' + this.selectedcountry + '&year=' + this.selectedyear;
          } else {
            if (this.selectedcategory == '' && this.selectedcountry != '' && this.selectedyear == null) {
              url += '&country=' + this.selectedcountry;
            } else {
              if (this.selectedcategory == '' && this.selectedcountry != '' && this.selectedyear != null) {
                url += '&country=' + this.selectedcountry + '&year=' + this.selectedyear;
              } else {
                if (this.selectedcategory == '' && this.selectedcountry == '' && this.selectedyear != null) {
                  url += '&year=' + this.selectedyear;
                }else{
                  if(this.selectedcategory != '' && this.selectedcountry == '' && this.selectedyear != null){
                    url += '&categoryId=' + categoryid + '&year=' + this.selectedyear;
                  }
                }
              }
            }
          }
        }
      }
      console.log(url);
      const response = await instance.get(url);
      if (response.data.code == 1) {
        this.movies = [];
        this.totalItems = 0;
      } else {
        this.movies = response.data.data.items;
        this.totalItems = response.data.data.total;
      }
    },
    isSelected(tag) {
      return this.selectedTags.includes(tag);
    },
    navigateToMovieInfo(id) {
      if (this.logincode === 1) {
        router.push({ name: 'MovieInfo', params: { id } });
      } else {
        router.push('/login');
      }
    },
    firstmovies(){
      console.log(this.firstTag);
      this.toggleSelectedTag('category', this.firstTag);
    }
  },
  computed: {
    ...mapState(['userId', 'logincode']),
  },
  created() {
   
  },
  mounted(){
    this.firstTag = this.$route.params.tag;
    this.fetchCategories().then(() => {
    if (this.firstTag != null) {
      this.firstmovies();
    } else {
      this.fetchMovies(this.currentPage, this.pageSize);
    }
  });
  }

};
</script>

<style>
.movie-tags {
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  background-color: #f5f5f5;
  width: 78%;
  margin: 0 auto;
  animation: fadeInCategories 2s ease-in-out;
}

.category,
.country,
.year {
  width: 50px;
  text-align: center;
  background-color: #fffafa;
  color: #333;
  margin: 23px;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;

  transition: background-color 0.3s ease;
}

.category:hover,
.country:hover,
.year:hover {
  background-color: #aaa;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  border-color: #aaa;
}

@keyframes fadeInCategories {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

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
  width: 250px;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.movie-card:hover {
  transform: scale(1.1);
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

.selected-tag {
  width: 79%;
  margin: 0 auto;
  padding: 10px;
  background-color: #f5f5f5;
  text-align: center;
  font-weight: bold;
  margin-bottom: 10px;
}

.category.selected,
.country.selected,
.year.selected {
  background-color: #007bff;
  color: white;
}

.no-movies-found {
  text-align: center;
  font-size: 18px;
  color: #999;
  margin-top: 20px;
}

.pagination-container {
  text-align: center;
}
</style>