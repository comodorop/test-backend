import Router from 'koa-router';
import ctrUsers from '../controllers/users'

const router = new Router();

// User router
router.
get('/users', ctrUsers.get).
post('/users', ctrUsers.post).
put('/users/:id', ctrUsers.put).
delete('/users/:id', ctrUsers.delete).
post('/login', ctrUsers.login)
const routes = router.routes((ctx, next) => {
  next()
});


export default () => routes;
