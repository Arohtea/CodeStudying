<template>
    <footer class="footer">
        <div class="footer-links">
            <a href="#">客服</a>
            <a href="#">建议</a>
            <a href="#">关于我们</a>
        </div>
        <div class="footer-info">
            版权所有 © 2023 超绝电影网站. All Rights Reserved.
            <br>
            公安备案号：114514
        </div>
    </footer>
</template>

<script>
export default {

}
</script>

<style scoped>
.footer {
    background-color: #333;
    color: white;
    padding: 20px;
    text-align: center;  
}
.footer a {
    color: white;
    text-decoration: none;
    margin: 0 10px;
    transition: color 0.3s ease;
}

.footer a:hover {
    color: #ddd;
}

.footer-links {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 10px;
}

.footer-info {
    font-size: 0.8em;
    color: #aaa;
}
</style>