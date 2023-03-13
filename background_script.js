// Put all the javascript code here, that you want to execute in background.
browser.webRequest.onBeforeRequest.addListener(
  requestListener,
  { urls: ["https://www.bungie.net/Platform/*"] },
  ["blocking"]
);

const GET_PROFILE_RE = /Destiny2\/\d+\/Profile/;

function requestListener(req) {
  const ogUrl = new URL(req.url);
  const url = new URL(req.url);

  const roughlyMatchesGetProfile = GET_PROFILE_RE.test(url.pathname);
  const componentsParam = url.searchParams.get("components");
  const alreadyBusted = url.searchParams.has("bungo-busted");

  if (alreadyBusted) {
    console.log("Already busted", req.method, url.pathname, url.searchParams);
    return {};
  }

  if (roughlyMatchesGetProfile && componentsParam) {
    const componentsArr = shuffle(componentsParam.split(","));
    url.searchParams.set("components", componentsArr.join(","));
    url.searchParams.set("bungo-busted", Date.now());

    const redirectUrl = url.toString();
    const redirectUrlP = new URL(redirectUrl);

    console.log(
      "%cRedirecting from",
      "background-color: green",
      req.method,
      ogUrl.pathname,
      ogUrl.searchParams,
      "to",
      redirectUrlP.pathname,
      redirectUrlP.searchParams
    );
    return { redirectUrl };
  }

  return {};
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
