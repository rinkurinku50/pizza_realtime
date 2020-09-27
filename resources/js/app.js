 import axios from 'axios';
 import Noty from 'noty';
 import moment from 'moment';
 import { initAdmin } from './admin';


 let addToCart = document.querySelectorAll('.add-to-cart');
 let cartCounter = document.querySelector('#cardCounter');

 addToCart.forEach((btn) => {
     btn.addEventListener('click', (e) => {
         // console.log(e);
         let pizza = JSON.parse(btn.dataset.pizza);
         // console.log(pizza);


         updateCart(pizza)
     })
 })

 function updateCart(pizza) {
     axios.post('/update-cart', pizza).then(
         res => {
             cartCounter.innerText = res.data.totalQty;
             console.log(res);
             new Noty({
                 type: 'success',
                 text: 'Item added to cart..',
                 timeout: 1000,
                 progressBar: false
             }).show();
         }
     ).catch(err => {
         new Noty({
             type: 'error',
             text: 'Something went wrong..',
             timeout: 1000,
             progressBar: false
         }).show();
     });
 }


 //remove alert mas after x second

 const alertMsg = document.querySelector('#success-alert');
 if (alertMsg) {
     setTimeout(() => {
         alertMsg.remove()
     }, 2000);
 }



 ///admin js method
 initAdmin();


 ///Change order status 
 let statuses = document.querySelectorAll('.status_line');
 let hiddenInput = document.querySelector('#hiddenInput');
 let order = hiddenInput ? hiddenInput.value : null;
 order = JSON.parse(order);
 let time = document.createElement('small');
 // console.log(order);

 function updateStatus(order) {
     let stepCompleted = true;
     statuses.forEach((status) => {
         let dataProp = status.dataset.status;
         console.log(dataProp);
         if (stepCompleted) {
             status.classList.add('step-completed');
         }
         if (dataProp === order.status) {
             stepCompleted = false;
             time.innerHTML = moment(order.updatedAt).format('hh:mm A');
             status.appendChild(time);
             if (status.nextElementSibling) {
                 status.nextElementSibling.classList.add('current');
             }
         }
     });
 }


 updateStatus(order)