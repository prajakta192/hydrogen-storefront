export function wishlistData(){
const iWishUrl = 'https://api.myshopapps.com/iwish/V1';

const c_code = 'IN';

//let iWishlist = localStorage.iWishlist ? new Map(JSON.parse(localStorage.iWishlist)) : new Map();
 let iWishCust = '3789951533090';
  function addToWishlist(pid,vid,qty = 1, catId = 0){
    console.log(pid,vid)
 };
 return addToWishlist()
/*return async function requestToSever(page, body, method = 'POST') {
 //debugger;
  const url = iWishUrl + '/' + page;
  const options = {
    method: method,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      domain: 'testnewshopify.myshopify.com',
      Authorization: ''
    },
    body: new URLSearchParams(body),
  };
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

function getWishlist() {
  return JSON.parse(iWishlist);
}
function setWishlist() {
  localStorage.iWishlist = JSON.stringify(Array.from(iWishlist));
}
function getCounter() {
  return iWishlist.size;
}

function isInWishlist(vId) {
  return iWishlist.has(vId) ? true : false;
}

function addToWishlist(pId, vId, qty = 1, catId = 0) {
  const pId = (pid.split("/").slice(-1))[0];
   const vId = (vid.split("/").slice(-1))[0];
   console.log(pId ,vId);

  let data =
        'customer_id=' +
        iWishCust +
        '&product_id=' +
        pId +
        '&variant_id=' +
        vId +
        '&product_qty=' +
        qty +
        '&category_id=' +
        catId;
       console.log(data)
      return requestToSever('addToWishlist', data, 'POST');
}
*/
}



