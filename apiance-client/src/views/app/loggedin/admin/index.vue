<template>
  <div>
    <TopBarAdmin />
    <DrawerAdmin />
    <v-content>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-content>
    <Footer />
  </div>
</template>
<script>
// import Sidebar from "@/containers/Sidebar";
import TopBarAdmin from '@/components/admin/layout/TopBarAdmin'
import DrawerAdmin from '@/components/admin/layout/DrawerAdmin'
import Footer from '@/components/layout/Footer'

export default {
  data() {
    return { show: false }
  },
  components: {
    TopBarAdmin,
    DrawerAdmin,
    Footer
  },
  computed: {}
}
</script>

<style scoped>
.app-wrapper {
  min-height: 100vh;
}
</style>
