export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (url.hostname === 'augmented-signals.pages.dev') {
    url.hostname = 'augmentedsignals.com';
    return Response.redirect(url.toString(), 301);
  }
  return next();
}
