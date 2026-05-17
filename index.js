export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const fileUrl = url.searchParams.get('url');
    let customName = url.searchParams.get('name') || 'File';

    if (!fileUrl) {
      return new Response("Error: URL parameter paoya jay ni!", { status: 400 });
    }

    try {
      let response = await fetch(fileUrl, {
        method: request.method,
        headers: request.headers,
        redirect: 'follow'
      });

      let extension = "";
      try {
        const cleanUrl = fileUrl.split('?')[0];
        const matches = cleanUrl.match(/\.([a-zA-Z0-9]+)$/);
        if (matches) {
          extension = "." + matches[1];
        }
      } catch (e) {
        extension = ""; 
      }

      if (extension && customName.endsWith(extension)) {
        customName = customName.slice(0, -extension.length);
      }

      const finalFileName = `${customName} [rnexflix.top]${extension}`;
      let newHeaders = new Headers(response.headers);
      newHeaders.set("Content-Disposition", `attachment; filename="${encodeURIComponent(finalFileName)}"`);
      newHeaders.set("Access-Control-Allow-Origin", "*"); 

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
      });

    } catch (err) {
      return new Response("Error: " + err.message, { status: 500 });
    }
  },
};
            
