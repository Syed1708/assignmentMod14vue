import { reactive } from 'vue'
import { authStore } from './store'
const wishlist = reactive({
    items: [],
    isWishListed(product){
        return this.items.includes(product.id)
    },


    async fetchWishlistItems() {
        const apiUrl = 'http://localhost:8000/api/wishlist'
        const token = authStore.getUserToken()
        try {

            // if(token){
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
    
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
    
                const wishlistData = await response.json();
                this.items = wishlistData.wishlist


            // }else{
            //     // console.log('no token but not error');
            //     return
            // }

        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    },


    async toggleWishList(product) {

        let apiUrl = 'http://localhost:8000/api/wishlist'
        let method = 'POST'
        let payload = {
            product_id: product.id
        }
        const token = authStore.getUserToken()

        if (!this.isWishListed(product)) {
            this.items.push(product.id)
            

        } else {
            this.items = this.items.filter(item => item !== product.id)
            apiUrl = `http://localhost:8000/api/wishlist/${product.id}`
            method = 'DELETE'
            payload = {}
        }

        try {
            const response = await fetch(apiUrl, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Product ID saved to wishlist:', data);
        } catch (error) {
            console.error('Error saving product ID to wishlist:', error);
        }
    },

  
    getIcon(product){

        if(this.isWishListed(product)){
            return '//img.icons8.com/?size=60&id=59805&format=png'
        }else{
            return '//img.icons8.com/?size=96&id=85038&format=png'
        }
       
    }
})

export { wishlist }