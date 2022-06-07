export default {
  data () {
    return {
      permission_list: '',
      module_name: '',
    }
  },
  methods: {
    async fetchUserAccess (initializer) {
      return new Promise((resolve, reject) => {
        initializer()
          .then(pem => pem && pem.length ? Promise.resolve(pem) : Promise.reject(null))
          .then(JSON.parse)
          .then(pem => {
            const filtered = pem.filter(item => item.module.toLowerCase() == this.module_name.toLowerCase()).pop()
            this.permission_list = (filtered && filtered.feature) || ''
            resolve(true)
          })
          .catch(reject)
      })
    },
    checkUserAccess (permission) {
      return this.permission_list && permission && this.permission_list.toLowerCase().indexOf(permission.toLowerCase()) !== -1
    },
  },
}