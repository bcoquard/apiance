<template>
  <div>
     <v-card class="pa-5">
      <v-card-title class="justify-space-between">
        Add or remove
        <v-dialog v-model="deleteModal" persistent max-width="290">
          <template v-slot:activator="{ on }">
            <div class="d-flex justify-end ma-5">
              <v-btn class color="red darken-1" dark v-on="on">Delete all</v-btn>
            </div>
          </template>

          <v-card>
            <v-card-title class="headline">Delete Swaggers</v-card-title>
            <v-card-text>You will delete all swagger contracts. Will you proceed ?</v-card-text>
            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn color="red darken-1" text @click="deleteOnConfirm">Confirm</v-btn>
              <v-btn color="normal" text @click="deleteOnCancel">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card-title>

      <v-file-input
        v-model="selectedFiles"
        color="deep-purple accent-4"
        counter
        label="Choose your swaggers - json/yaml"
        multiple
        placeholder="Select your files"
        prepend-icon="fa-paperclip"
        outlined
        show-size
        @change="onFileUpload"
      >
        <template v-slot:selection="{ index, text }">
          <v-chip v-if="index < 2" color="indigo darken-1" dark label small>{{ text }}</v-chip>
          <span
            v-else-if="index === 2"
            class="overline grey--text text--darken-3 mx-2"
          >+{{ files.length - 2 }} File(s)</span>
        </template>
      </v-file-input>

      <v-list two-line subheader v-if="files.length !== 0">
        <v-subheader inset>Scanning results</v-subheader>

        <v-list-item v-for="file in this.files" :key="file.name">
          <v-list-item-avatar>
            <v-icon v-if="file.error !== null" style="color: red">fa-exclamation-triangle</v-icon>
            <v-icon v-if="file.error === null" style="color: green">fa-thumbs-up</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <span>{{ file.name }}</span>
            <span v-if="file.error !== null">{{file.error}}</span>
          </v-list-item-content>

          <v-list-item-action>
            <v-btn icon>
              <v-icon color="lighten-1" @click="removeOne(file)">fa-trash</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>

      <v-btn color="primary" v-if="files.length !== 0 && filesErrors ===0" @click="sendSwaggers">Load</v-btn>
    </v-card>

    <v-card class="pa-5 mt-5">
      <v-icon @click="reloadSwaggers">fa-sync</v-icon>
      <v-card-title>All Swaggers <v-spacer></v-spacer>
      <v-text-field
          v-model="tableSearch"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>

      <v-data-table
        :headers="tableHeaders"
        :items="swaggers"
        :search="tableSearch"
      >

      <template v-slot:item.actions="{ item }">
        <v-dialog v-model="deleteContratModal" persistent max-width="290">
          <template v-slot:activator="{ on }">
              <v-icon dark v-on="on" color="red darken-1" small>fa-dumpster</v-icon>
          </template>
          <v-card>
            <v-card-title class="headline">Confirm delete ?</v-card-title>
            <v-card-text>Choose to continue delete or cancel</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" text @click="deleteContratOnConfirm(item)">Confirm</v-btn>
              <v-btn color="normal" text @click="deleteContratOnCancel(item)">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>

      </v-data-table>
    </v-card>
  </div>
</template>
<script>

// import Sidebar from "@/containers/Sidebar";

import yaml from 'js-yaml'
import { RepositoryFactory } from '@/repositories/repository-factory'
const ContractsRepository = RepositoryFactory.get('contracts')
export default {
  data() {
    return {
      deleteModal: false,
      deleteContratModal: false,
      filesHasError: false,
      selectedFiles: null,
      files: [],
      swaggers: [],
      tableSearch: '',
      tableHeaders: [
        { text: 'Client', value: 'swagger.client' },
        { text: 'Environnement', value: 'swagger.env' },
        { text: 'Version', value: 'swagger.version' },
        { text: 'Apiname', value: 'swagger.title' },
        { text: 'Visibility', value: 'swagger.visible' },
        { text: 'Actions', value: 'actions', sortable: false }
      ]
    }
  },
  created() {
    this.loadAllContracts()
  },
  methods: {
    deleteOnConfirm() {
      ContractsRepository.clearAll()
        .then(function(response) {})
        .catch(function(error) {
          this.$snotify.error('Error occured: ' + JSON.stringify(error))
        })
        .finally(() => {
          this.deleteModal = false
        })
    },
    deleteOnCancel() {
      this.deleteModal = false
    },
    sendSwaggers() {
      this.swaggerFiles = this.files
      this.selectedFiles = null
      this.files = []

      this.swaggerFiles.forEach(iter => {
        ContractsRepository.createOne(iter.content).then(
          response => {
            this.$snotify.success(
              'Saved swagger ' + iter.name + ': ' + response.data
            )
          },
          error => {
            this.$snotify.error('Error occured: ' + JSON.stringify(error))
          }
        )
      })
    },
    callbackLoadedFile(name, content, error) {
      if (error != null) {
        this.filesErrors++
      }

      this.files.push({
        name: name,
        content: content,
        error: error
      })
    },
    onFileUpload(fileList) {
      this.files = []
      this.filesErrors = 0

      function readFile(index) {
        var reader = new FileReader()
        if (index >= fileList.length) {
          return
        }

        var file = fileList[index]
        reader.onload = function(event) {
          let content = {}
          let error = null
          try {
            content = yaml.safeLoad(event.target.result)
          } catch (err) {
            content = null
            error = err
          } finally {
            vm.callbackLoadedFile(event.target.filename, content, error)
          }
          readFile(index + 1, vm)
        }
        reader.filename = file.name
        reader.readAsText(file)
      }
      let vm = this
      readFile(0, vm)
    },
    removeOne(file) {
      for (let i = 0; i < this.files.length; i++) {
        if (this.files[i].name === file.name) {
          if (this.files[i].error != null) {
            this.filesErrors--
          }
          this.files.splice(i, 1)
          break
        }
      }
    },
    async loadAllContracts() {
      let result = await ContractsRepository.get().then(function(response) {
        return response.data
      })

      this.swaggers = result
      console.log(this.swaggers)
    },
    async reloadSwaggers() {
      this.loadAllContracts()
    },
    deleteContratOnConfirm(item) {
      ContractsRepository.deleteOne(item._id)
        .then(function(response) {
          console.log(response)
        })
        .catch(function(error) {
          this.$snotify.error('Error occured: ' + JSON.stringify(error))
        })
        .finally(() => {
          this.deleteContratModal = false
          this.reloadSwaggers()
        })
    },
    deleteContratOnCancel(item) {
      this.deleteContratModal = false
    }
  }
}
</script>
