<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <Button type="primary">1111</Button>
    <div class="abs"></div>
  </div>
</template>

<script>
import { Button } from "vant";
export default {
  name: "home",
  components: {
    Button
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
