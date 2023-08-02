<template>
  <el-form :model="form" label-width="120px" label-position="top">
    <h1>登录</h1>
    <el-form-item label="Account">
      <el-input v-model="form.identifier" />
    </el-form-item>
    <el-form-item label="Password">
      <el-input v-model="form.password" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSubmit">Create</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive } from "vue";
import { useTokenStore } from "@/store/UserToken";
import { login } from "@/api/users";
import { useRouter } from "vue-router";

const router = useRouter();

const form = reactive({
  identifier: "test",
  password: "123456",
});

const onSubmit = async () => {
  const store = useTokenStore();
  const res = await login(form);
  if (res.status === 200) {
    store.saveToken(res.data.jwt);
    router.push("/posts");
  } else {
    console.log("Login failed:", res.data.message);
  }
};
</script>

<style lang="scss" scoped>
.el-form {
  border: 1px solid gray;
  padding: 30px;
}
</style>
