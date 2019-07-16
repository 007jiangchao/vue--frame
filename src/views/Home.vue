<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <Button type="primary">1111</Button>
    <div class="abs"></div>
    <img src="./1.jpg" alt="图片" />
  </div>
</template>

<script>
import { Button } from "vant";
export default {
  name: "home",
  components: {
    Button
  },
  mounted() {
    this.$axios.get();
  }
};
</script>
<style scoped lang="less">
.abs {
  width: 20px;
  height: 20px;
  background-color: red;
}
</style>
