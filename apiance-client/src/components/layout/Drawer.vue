<template>
  <v-navigation-drawer app clipped permanent>
    <v-list shaped dense>
      <v-list-item :to="{ name: 'home' }" link>
        <v-list-item-icon>
          <v-icon>fa-home</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{$t('drawer.home')}}</v-list-item-title>
      </v-list-item>

      <v-list-item :to="{ name: 'performances' }" link>
        <v-list-item-icon>
          <v-icon>fa-home</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{$t('drawer.performances')}}</v-list-item-title>
      </v-list-item>

      <v-list-group prepend-icon="fa-file-contract" value="true">
        <template v-slot:activator>
          <v-list-item-title>{{$t('drawer.apis')}}</v-list-item-title>
        </template>

        <v-list-group
          no-action
          sub-group
          v-for="(client, it) in this.contracts"
          :key="it"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>{{client.client}}</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-group
            no-action
            sub-group
            v-for="(env, it) in client.env"
            :key="it"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>{{env.env}}</v-list-item-title>
              </v-list-item-content>
            </template>

             <v-list-group
              no-action
              sub-group
              v-for="(title, it) in env.titles"
              :key="it"
            >

            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>{{title.title}}</v-list-item-title>
              </v-list-item-content>
            </template>

              <v-list-item
                v-for="(api, it) in title.version"
                :key="it"
                :to="{ name: 'apis', params: {id: api._id} }"
              >
                <v-list-item-title v-text="api.swagger.version"></v-list-item-title>
              </v-list-item>
             </v-list-group>

          </v-list-group>
        </v-list-group>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapActions } from 'vuex'
import { RepositoryFactory } from '@/repositories/repository-factory'
const ContractsRepository = RepositoryFactory.get('contracts')

export default {
  name: 'Drawer',
  components: {},
  data() {
    return {
      contracts: []
    }
  },
  computed: {},
  created() {
    this.fetch()
  },
  methods: {
    ...mapActions(['toggleMenu']),
    async fetch() {
      const { data } = await ContractsRepository.getNames()

      // Group by client
      let grouped = this.lodash.groupBy(data, iter => {
        return iter.swagger.client
      })

      // Group by env
      for (let client in grouped) {
        if (grouped.hasOwnProperty(client)) {
          grouped[client] = this.lodash.groupBy(grouped[client], iter => {
            return iter.swagger.env
          })
        }
      }

      // Group by title
      for (let client in grouped) {
        let clientObject = grouped[client]
        for (let env in clientObject) {
          if (clientObject.hasOwnProperty(env)) {
            clientObject[env] = this.lodash.groupBy(clientObject[env], iter => {
              return iter.swagger.title
            })
          }
        }
      }

      // Transform to usable array
      let result = []
      for (let client of Object.keys(grouped)) {
        let envLevel = []
        result.push({ client, env: envLevel })

        let envObject = grouped[client]
        for (let env of Object.keys(envObject)) {
          let titleLevel = []
          envLevel.push({ env, titles: titleLevel })

          let titleObject = envObject[env]
          for (let title of Object.keys(titleObject)) {
            titleLevel.push({ title, version: titleObject[title] })
          }
        }
      }

      this.contracts = result
    }
  }
}
</script>
