const jwt = require('../../utils/auth')

module.exports = {
  async post(ctx) {
    let { body } = ctx.request
    body.birthday = new Date(1980, 6, 20)
    const sq = ctx.orm();
    const User = ctx.orm().user;
    try {
      await User.create(body)
      ctx.status = 200;
      ctx.body = { msg: 'Nuevo registro disponible' }
    } catch (error) {
      ctx.status = 500;
      ctx.body = { msg: 'There is a problem to get info' }
    }
  },
  async get(ctx) {
    const User = ctx.orm().user;
    try {
      let data = await User.findAll()
      ctx.body = { data: data }
    } catch (error) {
      ctx.status = 500;
      ctx.body = { msg: 'There is a problem to get info' }
    }
  },
  async put(ctx) {
    let { body } = ctx.request
    let { id } = ctx.params
    const User = ctx.orm().user;
    try {
      await User.update(body, { 'where': { 'id': id } })
      ctx.status = 200;
      ctx.body = { msg: 'Data updated' }
    } catch (error) {
      ctx.status = 500;
      ctx.body = { msg: 'There is a problem to get info' }
    }
  },
  async delete(ctx) {
    let { id } = ctx.params
    const User = ctx.orm().user;
    try {
      await User.destroy({ 'where': { 'id': id } })
      ctx.status = 200;
      ctx.body = { msg: 'Registro eliminado' }
    } catch (error) {
      ctx.status = 500;
      ctx.body = { msg: 'There is a problem to get info' }
    }
  },
  async login(ctx) {
    let { body } = ctx.request
    const User = ctx.orm().user;
    try {
      let data = await User.findAll({ 'where': { 'name': body.name, 'email': body.email } })
      console.log(typeof data[0])
      if (data.length > 0 && typeof data[0] === 'object' && Object.keys(data[0])) {
        let token = await jwt.generateToken({name: data[0].name, email: data[0].email})
        ctx.status = 200;
        ctx.body = { msg: 'Bienvenido', token: token }
      } else {
        ctx.status = 200;
        ctx.body = { msg: 'Access denain' }
      }
    } catch (error) {
      ctx.status = 500;
      ctx.body = { msg: 'There is a problem to get info' }
    }
  }

}