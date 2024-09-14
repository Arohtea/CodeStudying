<template>
    <div>
        <TopHeader></TopHeader>
        <div class="movie-info">
            <div class="movie-video-player">
                <div class="movie-details">
                    <h2>{{ this.movie.title }}</h2>
                    <p>导演: {{ this.movie.director }}</p>
                    <p>主演: {{ this.movie.actors }}</p>
                </div>
                <video controls poster="path/to/poster.jpg" class="movie-video">
                    <source src="#" type="video/mp4">
                    您的浏览器不支持 video 标签。
                </video>
            </div>

            <div class="comments-section">
                <h3 class="section-title">评论区</h3>
                <form @submit.prevent="submitComment" class="comment-form">
                    <textarea v-model="newComment.text" :maxlength="200" placeholder="写下你的评论..." class="comment-input"
                        @input="updateCharCount"></textarea>
                    <span class="char-count">{{ charCount }}/200</span>
                    <button type="submit" class="comment-submit-btn">提交评论</button>
                </form>
                <div v-if="totalComments> 0" class="comments-list">
                    <div v-for="comment in comments" :key="comment.id" class="comment-item">
                        <div class="comment-header">
                            <span class="comment-author">{{ comment.author }}</span>
                            <span class="comment-date">{{ comment.date.substring(0, 10) }}</span>
                        </div>
                        <p class="comment-body">{{ comment.text }}</p>
                    </div>
                </div>
                <div v-else class="no-comments-message">暂无评论，快来成为第一个评论的人吧！</div>
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="currentPage" :page-size="commentsPerPage"
                    layout="total,prev, pager, next, jumper" :total="totalComments">
                </el-pagination>
            </div>
        </div>
        <FrontFooter></FrontFooter>
    </div>
</template>

<script>
import instance from '@/instance/instance';
import TopHeader from '@/components/TopHeader.vue';
import FrontFooter from '@/components/FrontFooter.vue';
import { mapState } from 'vuex';

export default {
    name: 'MoviePlay',
    components: {
        TopHeader,
        FrontFooter
    },
    data() {
        return {
            movie: null,
            newComment: {
                text: '',
                author: '',
                date: ''
            },
            charCount: 0,
            comments: [],
            currentPage: 1,
            commentsPerPage: 10,
            totalComments: 0
        };
    },
    methods: {
        updateCharCount(event) {
            this.charCount = event.target.value.length;
        },
        async submitComment() {
            if (this.newComment.text.trim() === '' || this.charCount > 200) return;
            try {
                const response = await instance.post('/comment', {
                    text: this.newComment.text,
                    author: this.newComment.author,
                    date: new Date(),
                    movieId: this.movie.id
                });
                if (response.data.code === 0) {
                    this.fetchComments();
                    this.newComment.text = '';
                    this.charCount=0;
                }
            } catch (error) {
                this.$message.error('评论失败');
                console.error('Error submitting comment:', error);
            }
        },
        async handleCurrentChange(val) {
            this.currentPage = val;
            await this.fetchComments();
        },
        async handleSizeChange(val) {
            this.commentsPerPage = val;
            await this.fetchComments();
        },
        async fetchComments() {
            try {
                const response = await instance.get(`/comment?pageNum=${this.currentPage}&pageSize=${this.commentsPerPage}&movieId=${this.$route.params.id}`);
                this.comments = response.data.data.items;
                this.totalComments = response.data.data.total;
            } catch (error) {
                console.error(error);
            }
        }
    },
    computed: {
        ...mapState(['userId', 'logincode', 'avatar', 'username'])
    },
    async created() {
        this.newComment.author = this.username;
        await this.fetchComments();
        try {
            const response = await instance.get(`/movie/search?id=${this.$route.params.id}`);
            this.movie = response.data.data;
        } catch (error) {
            this.$message.error('加载电影信息失败');
            console.error(error);
        }
    }
};
</script>

<style scoped>
.movie-info {
    margin: 0 auto;
    width: 80%;
}

.movie-detail {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 20px;
    gap: 20px;
}

.movie-image {
    flex-basis: 300px;
    max-width: 300px;
    margin-bottom: 20px;
}

.movie-image img {
    width: 300px;
    height: 350px;
    object-fit: cover;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.movie-content {
    flex: 1;
    margin-left: 0;
    font-family: Arial, sans-serif;
    color: #333;
    line-height: 1.8;
    font-size: 1.6em;
}

.movie-content h2 {
    margin-top: 0;
    margin-bottom: 10px;
    color: #222;
}

.movie-content p {
    margin: 5px 0;
    line-height: 1.5;
}

.movie-buttons {
    display: flex;
    justify-content: flex-start;
    margin-top: 20px;
}

.movie-buttons button {
    padding: 15px 30px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.movie-buttons button:hover {
    background-color: #0056b3;
    transform: scale(1.05);
}


@media (max-width: 768px) {
    .movie-detail {
        flex-direction: column;
        gap: 30px;
    }

    .movie-image {
        margin-bottom: 10px;
    }

    .movie-content {
        font-size: 1em;
    }
}

.comments-section {
    margin: 20px 0;
    padding: 20px;
    border: 1px solid #eaeaea;
    border-radius: 10px;
    background-color: #f9f9f9;
}

.section-title {
    font-size: 1.5em;
    color: #333;
    margin-bottom: 15px;
}

.comment-form {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    position: relative;
}

.comment-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    resize: none;
    min-height: 100px;
    margin-bottom: 10px;
}

.comment-submit-btn {
    width: 8%;
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.comment-submit-btn:hover {
    background-color: #0056b3;
}

.comments-list {
    list-style-type: none;
    padding: 0;
}

.comment-item {
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #fff;
}

.comment-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.comment-author {
    font-weight: bold;
    color: #333;
}

.comment-date {
    color: #666;
    font-size: 0.9em;
}

.comment-body {
    margin: 0;
}

.no-comments-message {
    text-align: center;
    color: #999;
    font-style: italic;
}

.comment-form .char-count {
    position: absolute;
    /* 将 charCount 定位方式改为绝对定位 */
    bottom: 10px;
    /* 从底部偏移 10px */
    right: 10px;
    /* 从右边偏移 10px */
    color: #666;
    font-size: 0.9em;
}

.movie-video-player {
    width: 100%;
    margin-bottom: 20px;
}

.movie-details {
    background-color: #f9f9f9;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
}

.movie-details h2 {
    font-size: 1.9em;
    margin-bottom: 5px;
}

.movie-details p {
    margin: 0;
    font-size: 0.9em;
    color: #666;
}

.movie-video {
    width: 100%;
    height: auto;
    max-width: 100%;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>