const getCartItemsCookie = () => {
  let cartItems = null;
  document.cookie.split(';')
    .forEach((prop) => {
      const [key, value] = prop.split('=');
      if (key.trim() === 'cartItems') {
        cartItems = decodeURIComponent(value.trim())
      }
    });
  return cartItems
}

class Cookie {
  constructor(cookie) {
    cookie.split(';')
      .forEach(prop => {
        const [key, value] = prop.split('=');
        const decodeURI = decodeURIComponent(value.trim()).replace('j:', '');
        // const decodeURI = decodeURIComponent(value.trim())
        // 去你的 express => j: 看這個 https://reurl.cc/e8ngYK
        console.log('Cookie.Construcor print decodeURI:', decodeURI);
        const obj = JSON.parse(decodeURI);
        console.log('Cookie.Construcor print JSON.parse(decodeURI):', obj);
        this[decodeURIComponent(key)] = obj;
      })
      console.log('Cookie.Construcor print Cookie.this:', this);
      this.syncCookie()
  }
  syncCookie () {
    // cookieString = JSON.stringify(this);
    let cookie = Object.entries(this)
    .map(([key, value]) => {
      console.log('Cookie.syncCookie Value:', value);
      let json = JSON.stringify(value)
      console.log('Cookie.syncCookie json:', json);
      let encode = encodeURIComponent(json);
      console.log('Cookie.syncCookie encode:', encode);
      return `${key}=j:${encode}`    
      // '' 
      // return `${key}=j:%7B%22productId%22%3A%22123%22%2C%22qty%22%3A%2223%22%7D`  
      // 'j:[]'   
      return `${key}=j:%5B%5D`     
      // '[]'
      // return `${key}=%5B%5D`     
    })
    .join(';');
    document.cookie = cookie;
    console.log('Cookie.syncCookie cookie:', document.cookie);

  }
  setCookie (key, value) {
    this[key] = value;
    this.syncCookie()
  }
}



module.exports = {
  getCartItemsCookie,
  Cookie
}


