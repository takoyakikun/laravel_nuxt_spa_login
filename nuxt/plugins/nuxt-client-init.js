export default async context => {
  return await context.store.dispatch("auth/nuxtClientInit", context)
}
