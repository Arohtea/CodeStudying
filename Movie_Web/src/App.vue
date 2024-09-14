<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  
}

</script>

<style>
#app {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #fff;
}
@keyframes slideInFromTop {
  from {
    transform: translateY(-100%);
  }

  to {
    transform: translateY(0);
  }
}
@keyframes slideUp {
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0);
  }
}
@media (max-width: 768px) {
  .nav {
    flex-direction: column;
    align-items: flex-start;
  }

  .nav a {
    margin-top: 10px;
  }
}
</style>
