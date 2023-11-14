<template>
  <UserDetails :user-id="$route.params.userId"></UserDetails>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import UserDetails from '@/components/user/UserDetails.component.vue';

export default defineComponent({
  name: 'UserDetails.view',
  components: { UserDetails },
});
</script>


<style scoped>

</style>