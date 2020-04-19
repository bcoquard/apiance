<template>
  <v-navigation-drawer app clipped permanent>
    <v-list shaped dense>
        <v-list-item :to="{ name: 'admin-home' }" link>
        <v-list-item-icon>
          <v-icon>fa-home</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{$t('admin.drawer.home')}}</v-list-item-title>
      </v-list-item>

      <v-list-item :to="{ name: 'admin-swaggers' }" link>
        <v-list-item-icon>
          <v-icon>fa-home</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{$t('admin.drawer.swaggers')}}</v-list-item-title>
      </v-list-item>

      <v-list-item :to="{ name: 'admin-swaggerutils' }" link>
        <v-list-item-icon>
          <v-icon>fa-home</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{$t('admin.drawer.swaggerutils')}}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'DrawerAdmin',
  components: {},
  data() {
    return {
    }
  },
  computed: {},
  created() {
  },
  methods: {
    ...mapActions(['toggleMenu'])
  }
}
</script>
