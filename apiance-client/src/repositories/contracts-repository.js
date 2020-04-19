import repository from './repository'

const resource = '/contracts'

export default {
  get() {
    return repository.get(`${resource}`)
  },

  getNames() {
    return repository.get(`${resource}/names`)
  },

  getOne(postId) {
    return repository.get(`${resource}/${postId}`)
  },

  createOne(payload) {
    return repository.post(`${resource}`, payload)
  },

  deleteOne(id) {
    return repository.delete(`${resource}/${id}`)
  },

  clearAll() {
    return repository.delete(`${resource}/clear`)
  }
}
