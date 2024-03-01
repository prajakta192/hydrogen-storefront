import {Text, Button} from '~/components';

export function AddToWishlist ({productId,variantId}){
	console
 	const iWishUrl = 'https://api.myshopapps.com/iwish/V1';
	let iWishCust = 0;

 async function requestToSever(page, body, method = 'POST') {
 debugger;
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

function getWishlistData(pid,vid,qty = 1, catId = 0) {
	 debugger;
	 const pId = (pid.split("/").slice(-1))[0];
	 const vId = (vid.split("/").slice(-1))[0];
	 console.log(pId ,vId)
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

	return(
		<>
			
			 <Button variant="secondary" className="mt-2" onClick={()=> getWishlistData(productId,variantId)}>
	          <Text as="span" className="flex items-center justify-center gap-2">
	            wishlist
	          </Text>
	        </Button>
		</>

	)
}