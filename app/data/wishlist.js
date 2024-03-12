
export class Wishlist {
    constructor(){
      this.iWishUrl = 'https://api.myshopapps.com/iwish/V1';
      this.custId = '3789951533090';
    }

    iwishAdd(vId, pId, qty=1, catId=0) {
      //console.log('iwishAdd :', vId);
        let data = "customer_id="+this.custId+"&product_id="+pId+"&variant_id="+vId+"&product_qty="+qty+"&category_id="+catId;
        this.requestToSever("addToWishlist", data); 
  }


 async  requestToSever(page, body, method = 'POST') {
 
  const url = this.iWishUrl + '/' + page;
  const options = {
    method: method,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      domain: 'testnewshopify.myshopify.com',
     
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

}



